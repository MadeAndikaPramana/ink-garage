// One-off: builds public/og-image.jpg (1200x630), the picture shown when the
// site is shared on WhatsApp / Instagram / Facebook. Uses the studio's own
// interior photo and logo (both supplied by the owner-side research files).
// Re-run with `npm run og:image` if either source changes.
import sharp from 'sharp'
import { resolve, join } from 'node:path'

const pub = join(resolve(import.meta.dirname, '..'), 'public', 'images')
const W = 1200
const H = 630

const logoWidth = 760
const logo = await sharp(join(pub, 'inkgarage-logo-white.png')).resize({ width: logoWidth }).toBuffer()
const logoMeta = await sharp(logo).metadata()

const bg = await sharp(join(pub, 'studio-interior.jpg'))
  .resize(W, H, { fit: 'cover', position: 'centre' })
  .modulate({ brightness: 0.55 })
  .toBuffer()

// cobalt wash + bottom strip with the tagline
const overlay = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="#2f3192" opacity="0.55"/>
  <rect x="0" y="${H - 96}" width="${W}" height="96" fill="#141414"/>
  <rect x="0" y="${H - 96}" width="${W}" height="6" fill="#ffd83a"/>
  <text x="${W / 2}" y="${H - 34}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif"
        font-size="34" font-weight="700" letter-spacing="5" fill="#f4efe6">TATTOO · PIERCING · COFFEE — CANGGU, BALI</text>
</svg>`)

await sharp(bg)
  .composite([
    { input: overlay },
    { input: logo, left: Math.round((W - logoWidth) / 2), top: Math.round((H - 96 - logoMeta.height) / 2) },
  ])
  .jpeg({ quality: 84, mozjpeg: true })
  .toFile(join(pub, '..', 'og-image.jpg'))

console.log('wrote public/og-image.jpg')
