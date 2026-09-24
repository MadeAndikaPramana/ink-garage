import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import App from './App.jsx'
import { ssrHead } from './hooks/useDocumentHead'
import { CATEGORIES, categoryToSlug } from './data/portfolio'

// Every public page that gets prerendered to static HTML at build time.
// (/team/:branch and /admin stay client-only.)
export const ROUTES = [
  '/',
  '/team',
  '/portfolio',
  ...CATEGORIES.map((c) => `/portfolio/${categoryToSlug(c)}`),
  '/pricing',
  '/book',
]

export function render(url) {
  ssrHead.current = null
  const html = renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  )
  return { html, head: ssrHead.current }
}
