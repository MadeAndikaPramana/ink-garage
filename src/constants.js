import { BRANCHES } from './data/branches'

const primary = BRANCHES[0]

// Google Maps listing read Sept 2026: 5.0 from 113 reviews.
export const STUDIO = {
  name: 'Ink Garage Tattoo Studio',
  shortName: 'Ink Garage',
  location: 'Canggu, Bali',
  googleRating: 5.0,
  googleReviewCount: 113,
  address: primary.address,
  hours: primary.hours,
  phoneDisplay: primary.phoneDisplay,
  whatsapp: primary.whatsapp,
  instagram: primary.instagram,
  instagramHandle: primary.instagramHandle,
  mapsLink: primary.mapsLink,
  mapsEmbed: primary.mapsEmbed,
}

export const NAV_LINKS = [
  { label: 'The Garage', href: '/#about' },
  { label: 'Services', href: '/#services' },
  { label: 'Team', href: '/team' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Visit', href: '/#location' },
]
