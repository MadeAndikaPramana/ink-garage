import { useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import Reveal from '../components/Reveal'
import PlaceholderImage from '../components/PlaceholderImage'
import Lightbox from '../components/Lightbox'
import DemoTag from '../components/DemoTag'
import { useDocumentHead } from '../hooks/useDocumentHead'
import { PORTFOLIO, CATEGORIES, ARTISTS, categoryToSlug, artistToSlug } from '../data/portfolio'
import { STUDIO } from '../constants'

const FILTERS = ['All', ...CATEGORIES]
const TILT = ['-rotate-1', 'rotate-1', 'rotate-[0.5deg]', '-rotate-[0.5deg]']

export default function Portfolio() {
  const { category: categorySlug } = useParams()
  const navigate = useNavigate()
  // the URL is the single source of truth for the active filter
  const active = CATEGORIES.find((c) => categoryToSlug(c) === categorySlug) || 'All'
  const [preview, setPreview] = useState(null)

  const [searchParams, setSearchParams] = useSearchParams()
  const artist = ARTISTS.find((a) => artistToSlug(a) === searchParams.get('artist')) || null

  const select = (f) =>
    navigate({
      pathname: f === 'All' ? '/portfolio' : `/portfolio/${categoryToSlug(f)}`,
      search: searchParams.toString(),
    })
  const selectArtist = (a) => setSearchParams(a ? { artist: artistToSlug(a) } : {})

  useDocumentHead({
    title: active === 'All' ? 'Portfolio' : `${active} — Portfolio`,
    description:
      active === 'All'
        ? 'Browse tattoo, piercing and nail art work from Ink Garage Tattoo Studio in Canggu, Bali.'
        : `${active} work from Ink Garage Tattoo Studio in Canggu, Bali.`,
  })

  const items = PORTFOLIO.filter(
    (p) => (active === 'All' || p.category === active) && (!artist || p.artist === artist),
  )

  return (
    <section className="pt-14 md:pt-20 pb-24 md:pb-32">
      <div className="max-w-7xl mx-auto px-5 md:px-6">
        <Reveal className="max-w-2xl mb-10">
          <p className="eyebrow mb-3">portfolio</p>
          <h1 className="display text-5xl md:text-7xl mb-5">The work</h1>
          <p className="text-lg text-ink/75">
            Browse by type, or follow{' '}
            <a href={STUDIO.instagram} target="_blank" rel="noreferrer" className="font-bold underline decoration-flame decoration-4 underline-offset-4 hover:text-cobalt">
              {STUDIO.instagramHandle}
            </a>{' '}
            for the latest pieces.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="flex flex-wrap gap-3 mb-12">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => select(f)}
              aria-pressed={active === f}
              className={`sticker cursor-pointer transition-transform hover:-translate-y-0.5 ${
                active === f ? '!bg-cobalt !text-paper' : '!bg-card'
              }`}
            >
              {f}
            </button>
          ))}
        </Reveal>

        {ARTISTS.length > 0 && (
          <Reveal delay={0.12} className="flex flex-wrap items-center gap-3 -mt-6 mb-12">
            <span className="font-marker text-lg text-cobalt mr-1">by artist</span>
            {[null, ...ARTISTS].map((a) => (
              <button
                key={a ?? 'all'}
                type="button"
                onClick={() => selectArtist(a)}
                aria-pressed={artist === a}
                className={`sticker cursor-pointer transition-transform hover:-translate-y-0.5 ${
                  artist === a ? '!bg-flame' : '!bg-card'
                }`}
              >
                {a ?? 'Everyone'}
              </button>
            ))}
          </Reveal>
        )}

        {items.length === 0 ? (
          <Reveal delay={0.15} className="card p-10 text-center max-w-2xl -rotate-1">
            <p className="font-marker text-2xl mb-3">nothing here yet</p>
            <p className="text-ink/75">
              No photos in this category yet — check back soon, or see{' '}
              <a href={STUDIO.instagram} target="_blank" rel="noreferrer" className="font-bold underline decoration-flame decoration-4 underline-offset-4 hover:text-cobalt">
                {STUDIO.instagramHandle}
              </a>{' '}
              for the latest work.
            </p>
          </Reveal>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:[grid-auto-flow:dense] sm:auto-rows-[200px]"
          >
            <AnimatePresence mode="popLayout">
              {items.map((it, i) => (
                <motion.div
                  key={it.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className={i % 5 === 0 ? 'sm:col-span-2 sm:row-span-2' : ''}
                >
                  <button
                    type="button"
                    onClick={() => setPreview(i)}
                    aria-label={`View ${it.category} tattoo`}
                    className={`card group relative block w-full h-[300px] sm:h-full overflow-hidden cursor-zoom-in transition-transform duration-150 hover:rotate-0 hover:-translate-y-1 ${TILT[i % TILT.length]}`}
                  >
                    <PlaceholderImage label={it.category} src={it.src} className="absolute inset-0 transition-transform duration-500 group-hover:scale-105" />
                    <span className="sticker absolute left-3 bottom-3">{it.category}</span>
                  <DemoTag item={it} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <Lightbox items={items} index={preview} onClose={() => setPreview(null)} onNavigate={setPreview} />
    </section>
  )
}
