import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// Stop the browser's own scroll restoration from fighting Layout's scroll
// logic (mobile browsers restore offsets aggressively on reload/back).
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

const rootEl = document.getElementById('root')
const path = window.location.pathname.replace(/\/+$/, '') || '/'

// Prerendered pages (scripts/prerender.js) stamp their path on the root.
// Hydrate only when it matches what the browser is actually showing; on a
// host fallback (e.g. /admin served the home page's HTML) or a ?filter URL,
// drop the static markup and render fresh instead of mismatching.
if (rootEl.hasChildNodes() && rootEl.dataset.path === path && !window.location.search) {
  hydrateRoot(rootEl, app)
} else {
  rootEl.replaceChildren()
  createRoot(rootEl).render(app)
}
