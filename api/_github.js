// Shared GitHub Git Data API helper for the /admin portfolio manager.
// Vercel ignores files/folders prefixed with "_" for routing, so this
// module is never exposed as its own endpoint.

const GITHUB_API = 'https://api.github.com'

function requireEnv(name) {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

export function getGithubConfig() {
  return {
    token: requireEnv('GITHUB_TOKEN'),
    owner: requireEnv('GITHUB_USERNAME'),
    repo: requireEnv('REPO_NAME'),
    branch: process.env.GITHUB_BRANCH || 'main',
  }
}

async function githubRequest(token, method, path, body) {
  const res = await fetch(`${GITHUB_API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const message = data?.message || res.statusText
    throw new Error(`GitHub API ${method} ${path} failed (${res.status}): ${message}`)
  }
  return data
}

export async function getPortfolioJson({ token, owner, repo, branch }) {
  const data = await githubRequest(
    token,
    'GET',
    `/repos/${owner}/${repo}/contents/src/data/portfolio.json?ref=${encodeURIComponent(branch)}`,
  )
  const content = Buffer.from(data.content, 'base64').toString('utf-8')
  return { items: JSON.parse(content).items }
}

// Builds ONE atomic commit covering every added image blob, every deleted
// image path, and the rewritten portfolio.json — via the low-level Git
// Trees API rather than the one-file-per-commit Contents API. If anything
// fails partway, the ref update (the only step that actually moves the
// branch) never happens, so there's no possibility of a half-applied batch.
export async function commitPortfolioChanges({ token, owner, repo, branch }, { additions, deletions, items }) {
  const ref = await githubRequest(token, 'GET', `/repos/${owner}/${repo}/git/ref/heads/${branch}`)
  const latestCommitSha = ref.object.sha

  const baseCommit = await githubRequest(token, 'GET', `/repos/${owner}/${repo}/git/commits/${latestCommitSha}`)
  const baseTreeSha = baseCommit.tree.sha

  const treeEntries = []

  for (const addition of additions) {
    const blob = await githubRequest(token, 'POST', `/repos/${owner}/${repo}/git/blobs`, {
      content: addition.base64,
      encoding: 'base64',
    })
    treeEntries.push({ path: addition.path, mode: '100644', type: 'blob', sha: blob.sha })
  }

  for (const deletion of deletions) {
    // sha: null against a base_tree deletes that path in the new tree
    treeEntries.push({ path: deletion.path, mode: '100644', type: 'blob', sha: null })
  }

  const portfolioJsonContent = `${JSON.stringify({ items }, null, 2)}\n`
  const portfolioBlob = await githubRequest(token, 'POST', `/repos/${owner}/${repo}/git/blobs`, {
    content: portfolioJsonContent,
    encoding: 'utf-8',
  })
  treeEntries.push({
    path: 'src/data/portfolio.json',
    mode: '100644',
    type: 'blob',
    sha: portfolioBlob.sha,
  })

  const newTree = await githubRequest(token, 'POST', `/repos/${owner}/${repo}/git/trees`, {
    base_tree: baseTreeSha,
    tree: treeEntries,
  })

  const messageParts = []
  if (additions.length) messageParts.push(`+${additions.length} photo${additions.length === 1 ? '' : 's'}`)
  if (deletions.length) messageParts.push(`-${deletions.length} photo${deletions.length === 1 ? '' : 's'}`)
  const message = `Admin: update portfolio (${messageParts.join(', ') || 'no changes'})`

  const newCommit = await githubRequest(token, 'POST', `/repos/${owner}/${repo}/git/commits`, {
    message,
    tree: newTree.sha,
    parents: [latestCommitSha],
  })

  await githubRequest(token, 'PATCH', `/repos/${owner}/${repo}/git/refs/heads/${branch}`, {
    sha: newCommit.sha,
  })

  return { commitSha: newCommit.sha }
}
