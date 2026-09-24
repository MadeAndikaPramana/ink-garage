import { useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import PlaceholderImage from './PlaceholderImage'
import Lightbox from './Lightbox'
import DemoTag from './DemoTag'
import { PORTFOLIO, describeWork } from '../data/portfolio'
import { STUDIO } from '../constants'

// Newest first — ids are assigned sequentially by the admin uploader, so the
// highest ids are the most recently added photos.
const teaser = [...PORTFOLIO].sort((a, b) => b.id - a.id).slice(0, 6)

const TILT = ['-rotate-1', 'rotate-1', 'rotate-[0.5deg]', '-rotate-[0.5deg]']

export default function GalleryTeaser() {
  const [preview, setPreview] = useState(null)

  return (
    <section id="gallery" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-5 md:px-6">
        <Reveal className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <div>
            <p className="eyebrow mb-3">portfolio</p>
            <h2 className="display text-4xl sm:text-5xl md:text-6xl">Fresh ink</h2>
          </div>
          <Link to="/portfolio" className="btn btn-ghost self-start sm:self-auto">
            Full portfolio →
          </Link>
        </Reveal>

        {teaser.length === 0 ? (
          <Reveal delay={0.1} className="card p-10 text-center max-w-2xl mx-auto -rotate-1">
            <p className="font-marker text-2xl mb-3">photos coming soon</p>
            <p className="text-ink/75">
              The portfolio is being put together. In the meantime, see the latest work on{' '}
              <a href={STUDIO.instagram} target="_blank" rel="noreferrer" className="font-bold underline decoration-flame decoration-4 underline-offset-4 hover:text-cobalt">
                {STUDIO.instagramHandle}
              </a>
              .
            </p>
          </Reveal>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:[grid-auto-flow:dense] sm:auto-rows-[190px]">
            {teaser.map((it, i) => (
              <Reveal
                key={it.id}
                delay={i * 0.07}
                className={i % 4 === 0 ? 'sm:col-span-2 sm:row-span-2' : ''}
              >
                <button
                  type="button"
                  onClick={() => setPreview(i)}
                  aria-label={`View ${it.category} tattoo`}
                  className={`card group relative block w-full h-[280px] sm:h-full overflow-hidden text-left cursor-zoom-in transition-transform duration-150 hover:rotate-0 hover:-translate-y-1 ${TILT[i % TILT.length]}`}
                >
                  <PlaceholderImage label={it.category} alt={describeWork(it)} src={it.src} className="absolute inset-0 transition-transform duration-500 group-hover:scale-105" />
                  <span className="sticker absolute left-3 bottom-3">{it.category}</span>
                  <DemoTag item={it} />
                </button>
              </Reveal>
            ))}
          </div>
        )}
      </div>

      <Lightbox items={teaser} index={preview} onClose={() => setPreview(null)} onNavigate={setPreview} />
    </section>
  )
}
