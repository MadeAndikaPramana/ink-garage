import portfolioData from './portfolio.json'
import { BRANCHES } from './branches'

// Portfolio categories the owner picks from when uploading. Matched to what
// the studio's own Instagram/Google listing says it does: fine line to
// realism, custom pieces, cover-ups, piercing, and nail art. Coffee is a
// service but not a photo category.
export const CATEGORIES = ['Fine Line', 'Realism', 'Custom', 'Cover Up', 'Piercing', 'Nail Art']

// Artist names as configured in branches.js — portfolio items point at them
// by name via an optional `artist` field.
export const ARTISTS = BRANCHES[0].team.map((t) => t.name)

// Alt text for a portfolio photo. Demo stock photos say so, so nothing
// claims stand-in images are the studio's own work.
export const describeWork = (item) => {
  const by = item.artist ? ` by ${item.artist}` : ''
  if (item.demo) return `Sample ${item.category.toLowerCase()} photo (demo)`
  if (item.category === 'Piercing') return `Piercing at Ink Garage, Canggu${by}`
  if (item.category === 'Nail Art') return `Nail art at Ink Garage, Canggu${by}`
  return `${item.category} tattoo${by} at Ink Garage, Canggu`
}

export const artistToSlug = (name) => name.toLowerCase().replace(/\s+/g, '-')

export const categoryToSlug = (category) => category.toLowerCase().replace(/\s+/g, '-')

// Items are { id, category, src, artist?, demo? }. `demo: true` marks stand-in
// stock photos that must be replaced with the studio's real work. The current
// items are free-license Unsplash stock (Sept 2026), split between the two
// artists purely to demo the per-artist galleries — they are NOT Zoro's or
// Jung's work. Delete them (via /admin) once real files are supplied.
// Lives in portfolio.json (not inline here) so the /admin serverless
// function (and the bulk-import script) can read + rewrite it as plain
// JSON via the GitHub API / filesystem, without needing to safely
// parse/regenerate JS source.
export const PORTFOLIO = portfolioData.items
