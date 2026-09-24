import portfolioData from './portfolio.json'

// Portfolio categories the owner picks from when uploading. Matched to what
// the studio's own Instagram/Google listing says it does: fine line to
// realism, custom pieces, cover-ups, piercing, and nail art. Coffee is a
// service but not a photo category.
export const CATEGORIES = ['Fine Line', 'Realism', 'Custom', 'Cover Up', 'Piercing', 'Nail Art']

export const categoryToSlug = (category) => category.toLowerCase().replace(/\s+/g, '-')

// Lives in portfolio.json (not inline here) so the /admin serverless
// function (and the bulk-import script) can read + rewrite it as plain
// JSON via the GitHub API / filesystem, without needing to safely
// parse/regenerate JS source.
export const PORTFOLIO = portfolioData.items
