import { useEffect } from 'react'

export const SITE_NAME = 'Ink Garage Tattoo Studio'
export const DEFAULT_TITLE = 'Tattoo Studio in Canggu, Bali — Ink Garage'
export const DEFAULT_DESCRIPTION =
  'Ink Garage Tattoo Studio — tattoos, piercing, nail art and a coffee bar in Canggu, Bali. Book via WhatsApp.'

export const formatTitle = (title) => (title ? `${title} — ${SITE_NAME}` : DEFAULT_TITLE)

// During the prerender build (no `document`), the page's head values are
// captured here while it renders so scripts/prerender.js can write them into
// the static HTML. Never touched in the browser.
export const ssrHead = { current: null }

function setMeta(name, content) {
  let el = document.querySelector(`meta[name="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(href) {
  let el = document.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

// Keeps the tab title / description / canonical in sync while navigating
// client-side. The first-load values come from the prerendered HTML (see
// scripts/prerender.js), so crawlers and link previews don't depend on this.
// The canonical uses the current origin so it stays correct on whichever
// domain the site ends up on.
export function useDocumentHead({ title, description, noindex = false }) {
  if (typeof document === 'undefined') {
    // oxlint-disable-next-line react/immutability -- build-time only: hands the head values to the prerender script
    ssrHead.current = {
      title: formatTitle(title),
      description: description || DEFAULT_DESCRIPTION,
      noindex,
    }
  }

  useEffect(() => {
    document.title = formatTitle(title)
    setMeta('description', description || DEFAULT_DESCRIPTION)
    setCanonical(`${window.location.origin}${window.location.pathname}`)
    // Only manage the robots tag this hook created itself: the site-wide
    // noindex that prerender.js writes into the static HTML must survive.
    let robots = document.querySelector('meta[name="robots"][data-page-noindex]')
    if (noindex && !robots) {
      robots = document.createElement('meta')
      robots.setAttribute('name', 'robots')
      robots.setAttribute('content', 'noindex')
      robots.setAttribute('data-page-noindex', '')
      document.head.appendChild(robots)
    } else if (!noindex && robots) {
      robots.remove()
    }
  }, [title, description, noindex])
}
