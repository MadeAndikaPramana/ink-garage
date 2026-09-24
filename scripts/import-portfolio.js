#!/usr/bin/env node
// Bulk-import portfolio photos from a local folder in one shot — for the
// developer's own machine, not the client's /admin panel (that stays the
// simple one-at-a-time flow for the studio owner).
//
// Usage:
//   node scripts/import-portfolio.js "/path/to/your/photos"
//
// Expected folder layout — one subfolder per category, named to match
// (case/space/hyphen insensitive) one of the categories in
// src/data/portfolio.js:
//
//   your-photos/
//     Piercing/
//     Portrait/
//     Sleeve/
//     Leg/
//     Fine Line/
//     Back/
//     Chest/
//
// Any file directly in the root (not inside a category subfolder) is
// skipped with a warning — every photo needs a category.
//
// Each image is resized/compressed the same way the admin panel does
// (max 1600px on the long edge, JPEG quality 0.82) and copied into
// public/images/, then appended to src/data/portfolio.json. Nothing is
// committed or pushed — review with `git status` / `git diff` and commit
// normally when you're happy with it.

import { readdirSync, statSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(import.meta.dirname, '..')
const PORTFOLIO_JSON = path.join(ROOT, 'src/data/portfolio.json')
const IMAGES_DIR = path.join(ROOT, 'public/images')

const CATEGORIES = [
  'Piercing',
  'Portrait',
  'Sleeve',
  'Leg',
  'Fine Line',
  'Back',
  'Chest',
]

const normalize = (s) => s.toLowerCase().replace(/[\s-_]+/g, '')
const CATEGORY_BY_KEY = new Map(CATEGORIES.map((c) => [normalize(c), c]))

const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp'])
const MAX_DIMENSION = 1600
const QUALITY = 82

function slugifyBase(name) {
  return (
    path
      .basename(name, path.extname(name))
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'photo'
  )
}

async function main() {
  const srcArg = process.argv[2]
  if (!srcArg) {
    console.error('Usage: node scripts/import-portfolio.js "/path/to/your/photos"')
    process.exit(1)
  }
  const srcRoot = path.resolve(srcArg)
  if (!statSync(srcRoot, { throwIfNoEntry: false })?.isDirectory()) {
    console.error(`Not a folder: ${srcRoot}`)
    process.exit(1)
  }

  const entries = readdirSync(srcRoot, { withFileTypes: true })
  const subfolders = entries.filter((e) => e.isDirectory())
  const strayFiles = entries.filter((e) => e.isFile() && ALLOWED_EXT.has(path.extname(e.name).toLowerCase()))

  if (strayFiles.length > 0) {
    console.warn(
      `⚠ Skipping ${strayFiles.length} photo(s) directly in "${srcRoot}" — move them into a category subfolder first (e.g. "Fine Line/").`,
    )
  }

  const jobs = [] // { category, filePath }
  const unmatched = []

  for (const dir of subfolders) {
    const key = normalize(dir.name)
    const category = CATEGORY_BY_KEY.get(key)
    if (!category) {
      unmatched.push(dir.name)
      continue
    }
    const dirPath = path.join(srcRoot, dir.name)
    const files = readdirSync(dirPath, { withFileTypes: true })
      .filter((f) => f.isFile() && ALLOWED_EXT.has(path.extname(f.name).toLowerCase()))
      .map((f) => f.name)
      .sort()
    for (const file of files) {
      jobs.push({ category, filePath: path.join(dirPath, file), originalName: file })
    }
  }

  if (unmatched.length > 0) {
    console.warn(`⚠ Ignored folder(s) that don't match a known category: ${unmatched.join(', ')}`)
    console.warn(`  Valid category folder names: ${CATEGORIES.join(', ')}`)
  }

  if (jobs.length === 0) {
    console.error('No matching photos found. Check the folder layout in this script\'s header comment.')
    process.exit(1)
  }

  mkdirSync(IMAGES_DIR, { recursive: true })
  const portfolio = JSON.parse(readFileSync(PORTFOLIO_JSON, 'utf8'))
  let nextId = portfolio.items.reduce((max, it) => Math.max(max, it.id), 0) + 1
  const stamp = Date.now()

  const counts = {}
  let ok = 0
  let failed = 0

  for (const [index, job] of jobs.entries()) {
    const slug = slugifyBase(job.originalName)
    const outName = `${slug}-${stamp}-${index}.jpg`
    const outPath = path.join(IMAGES_DIR, outName)
    try {
      const image = sharp(job.filePath).rotate() // rotate() auto-applies EXIF orientation
      const meta = await image.metadata()
      const needsResize = (meta.width || 0) > MAX_DIMENSION || (meta.height || 0) > MAX_DIMENSION
      const pipeline = needsResize
        ? image.resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: 'inside', withoutEnlargement: true })
        : image
      await pipeline.jpeg({ quality: QUALITY }).toFile(outPath)

      portfolio.items.push({ id: nextId++, category: job.category, src: `/images/${outName}` })
      counts[job.category] = (counts[job.category] || 0) + 1
      ok++
    } catch (err) {
      console.error(`✗ Failed on ${job.originalName}: ${err.message}`)
      failed++
    }
  }

  writeFileSync(PORTFOLIO_JSON, JSON.stringify(portfolio, null, 2) + '\n')

  console.log('')
  console.log(`Imported ${ok} photo(s)${failed ? `, ${failed} failed` : ''}:`)
  for (const [category, count] of Object.entries(counts)) {
    console.log(`  ${category}: ${count}`)
  }
  console.log('')
  console.log('Review with `git status` / `git diff src/data/portfolio.json`, then commit + push as usual.')
}

main()
