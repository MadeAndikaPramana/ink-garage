import { getGithubConfig, getPortfolioJson, commitPortfolioChanges } from './_github.js'

const MAX_ADDITIONS_PER_REQUEST = 10
const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp'])
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
// Same reasoning as admin-login.js — slows down brute-force password
// guessing against this endpoint too, since it also accepts a password.
const FAILED_AUTH_DELAY_MS = 900

function slugifyFilename(name) {
  return name
    .toLowerCase()
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  let config
  try {
    config = getGithubConfig()
  } catch (err) {
    res.status(500).json({ error: err.message })
    return
  }

  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) {
    res.status(500).json({ error: 'ADMIN_PASSWORD is not configured on the server.' })
    return
  }

  const { password, additions = [], deletions = [] } = req.body || {}

  if (password !== adminPassword) {
    await sleep(FAILED_AUTH_DELAY_MS)
    res.status(401).json({ error: 'Incorrect password.' })
    return
  }
  if (!Array.isArray(additions) || !Array.isArray(deletions)) {
    res.status(400).json({ error: 'Malformed request.' })
    return
  }
  if (additions.length === 0 && deletions.length === 0) {
    res.status(400).json({ error: 'No changes to save.' })
    return
  }
  if (additions.length > MAX_ADDITIONS_PER_REQUEST) {
    res.status(400).json({ error: `Upload at most ${MAX_ADDITIONS_PER_REQUEST} photos at a time.` })
    return
  }
  for (const item of additions) {
    if (!item.category || !item.filename || !item.base64) {
      res.status(400).json({ error: 'Each new photo needs a category, filename, and image data.' })
      return
    }
    const ext = (item.filename.split('.').pop() || '').toLowerCase()
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      res.status(400).json({ error: `Unsupported file type: ${item.filename}` })
      return
    }
  }

  try {
    const { items: currentItems } = await getPortfolioJson(config)

    const deleteIds = new Set(deletions.map((d) => d.id))
    const toDelete = currentItems.filter((it) => deleteIds.has(it.id))
    const remaining = currentItems.filter((it) => !deleteIds.has(it.id))
    const deletionEntries = toDelete.map((it) => ({ path: `public${it.src}` }))

    let nextId = currentItems.reduce((max, it) => Math.max(max, it.id), 0) + 1
    const stamp = Date.now()
    const additionEntries = []
    const newItems = []

    additions.forEach((item, index) => {
      const ext = (item.filename.split('.').pop() || 'jpg').toLowerCase()
      const base = slugifyFilename(item.filename) || 'photo'
      const filename = `${base}-${stamp}-${index}.${ext}`
      additionEntries.push({ path: `public/images/${filename}`, base64: item.base64 })
      newItems.push({ id: nextId++, category: item.category, src: `/images/${filename}` })
    })

    const finalItems = [...remaining, ...newItems]

    const result = await commitPortfolioChanges(config, {
      additions: additionEntries,
      deletions: deletionEntries,
      items: finalItems,
    })

    res.status(200).json({ ok: true, commitSha: result.commitSha, items: finalItems })
  } catch (err) {
    res.status(500).json({ error: err.message || 'Something went wrong committing the changes.' })
  }
}
