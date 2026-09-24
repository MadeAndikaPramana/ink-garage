// Build step: turns the client-rendered SPA into real HTML per page.
//
// `vite build` produces dist/ (the browser bundle) and `vite build --ssr`
// produces dist-ssr/ (the same App, renderable in Node). For each public
// route this script renders the App to a string, writes it into the built
// index.html together with that page's own <title>, description and social
// tags, and saves it as dist/<route>/index.html. Crawlers and link previews
// therefore get real content and per-page meta without running any JS; the
// browser then hydrates (see src/main.jsx).
//
// Env:
//   SITE_URL  the live origin, e.g. https://inkgaragecanggu.com. Setting it
//             (a) turns on <link rel="canonical"> and og:url, and
//             (b) LIFTS the site-wide noindex. While it is unset every page is
//             built with <meta name="robots" content="noindex">, so the demo
//             (stock photos, unverified details) stays out of Google.
//             => Set SITE_URL in Vercel when the real domain goes live.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { pathToFileURL } from 'node:url'

const root = resolve(import.meta.dirname, '..')
const dist = join(root, 'dist')
const template = readFileSync(join(dist, 'index.html'), 'utf8')

const { render, ROUTES } = await import(pathToFileURL(join(root, 'dist-ssr', 'entry-server.js')))

const strip = (u) => u.replace(/\/+$/, '')
const siteUrl = process.env.SITE_URL ? strip(process.env.SITE_URL) : ''
// og:image must be absolute for WhatsApp/Facebook to fetch it. Vercel exposes
// the production hostname during builds; use it until SITE_URL is set.
const imageBase =
  siteUrl || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '')

const noindexAll = !siteUrl

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

function seoBlock(route, head) {
  const tags = [
    `<title>${esc(head.title)}</title>`,
    `<meta name="description" content="${esc(head.description)}" />`,
    head.noindex || noindexAll ? '<meta name="robots" content="noindex" />' : null,
    siteUrl ? `<link rel="canonical" href="${siteUrl}${route === '/' ? '/' : route}" />` : null,
    '<meta property="og:type" content="website" />',
    '<meta property="og:site_name" content="Ink Garage Tattoo Studio" />',
    `<meta property="og:title" content="${esc(head.title)}" />`,
    `<meta property="og:description" content="${esc(head.description)}" />`,
    siteUrl ? `<meta property="og:url" content="${siteUrl}${route === '/' ? '/' : route}" />` : null,
    imageBase ? `<meta property="og:image" content="${imageBase}/og-image.jpg" />` : null,
    imageBase ? '<meta property="og:image:width" content="1200" />' : null,
    imageBase ? '<meta property="og:image:height" content="630" />' : null,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${esc(head.title)}" />`,
    `<meta name="twitter:description" content="${esc(head.description)}" />`,
    imageBase ? `<meta name="twitter:image" content="${imageBase}/og-image.jpg" />` : null,
  ]
  return tags.filter(Boolean).join('\n    ')
}

for (const route of ROUTES) {
  const { html, head } = render(route)
  if (!head) throw new Error(`No useDocumentHead() call rendered for ${route}`)

  const out = template
    .replace(/<!-- seo:start[\s\S]*?<!-- seo:end -->/, seoBlock(route, head))
    .replace('<div id="root"></div>', `<div id="root" data-path="${route}">${html}</div>`)
  if (out === template) throw new Error(`Template markers not found for ${route}`)

  const dir = route === '/' ? dist : join(dist, route)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), out)
  console.log(`prerendered ${route}  (${(out.length / 1024).toFixed(1)} kB)`)
}
console.log(
  siteUrl
    ? `SITE_URL=${siteUrl}: canonical/og:url on, pages are indexable`
    : '!! SITE_URL not set: every page is built with noindex (demo mode). Set SITE_URL before launch.',
)
console.log(imageBase ? `og:image base: ${imageBase}` : 'no og:image base (set SITE_URL, or build on Vercel)')
