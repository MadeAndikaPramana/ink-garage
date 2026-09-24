import { useEffect } from 'react'

const SITE_NAME = 'Ink Garage Tattoo Studio'
const DEFAULT_DESCRIPTION =
  'Ink Garage Tattoo Studio — tattoos, piercing, nail art and coffee in Canggu, Bali. Book via WhatsApp.'

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

// Client-side only: Google runs JS so it picks this up, but link-preview
// crawlers (WhatsApp, iMessage…) read index.html's static tags instead.
// The canonical uses the current origin so it stays correct on whichever
// domain the site ends up on.
export function useDocumentHead({ title, description }) {
  useEffect(() => {
    document.title = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Canggu, Bali`
    setMeta('description', description || DEFAULT_DESCRIPTION)
    setCanonical(`${window.location.origin}${window.location.pathname}`)
  }, [title, description])
}
