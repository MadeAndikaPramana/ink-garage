import Reveal from './Reveal'
import { STUDIO } from '../constants'
import { TESTIMONIALS } from '../data/testimonials'

// Topics Google Maps itself surfaces for this listing (review-topic chips,
// read Sept 2026, with their mention counts).
const TOPICS = [
  { label: 'Coffee', count: 17, cls: 'bg-lemon -rotate-2' },
  { label: 'The team', count: 6, cls: 'bg-card rotate-1' },
  { label: 'Nail art', count: 4, cls: 'bg-flame -rotate-1' },
]

const rotate = (arr, n) => [...arr.slice(n), ...arr.slice(0, n)]

function ReviewCard({ review }) {
  return (
    <figure className="card p-6">
      <div className="text-flame text-sm mb-3 tracking-widest" aria-label="5 stars">
        ★★★★★
      </div>
      <blockquote className="text-sm text-ink/80 leading-relaxed mb-4 line-clamp-12">
        &quot;{review.text}&quot;
      </blockquote>
      <figcaption className="text-xs font-bold uppercase tracking-widest">
        {review.name} <span className="text-ink/50">· {review.meta}</span>
      </figcaption>
    </figure>
  )
}

function Column({ reviews, duration, className = '' }) {
  return (
    <div className={`group relative h-[560px] overflow-hidden ${className}`}>
      <div
        style={{ animation: `marquee-y ${duration}s linear infinite` }}
        className="flex flex-col gap-5 pb-5 group-hover:[animation-play-state:paused]"
      >
        {[...reviews, ...reviews].map((review, i) => (
          <ReviewCard key={`${review.name}-${i}`} review={review} />
        ))}
      </div>
    </div>
  )
}

export default function Testimonials() {
  const hasReviews = TESTIMONIALS.length > 0

  return (
    <section id="reviews" className="py-20 md:py-28 bg-cobalt text-paper border-y-2 border-ink overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-6">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 items-center">
          <Reveal>
            <p className="font-marker text-xl text-lemon mb-3">what google says</p>
            <div className="flex items-end gap-4 mb-5">
              <span className="display text-[6.5rem] md:text-[9rem] leading-none">
                {STUDIO.googleRating.toFixed(1)}
              </span>
              <span className="pb-4 md:pb-6 text-lemon text-2xl tracking-widest" aria-label="5 stars">
                ★★★★★
              </span>
            </div>
            <p className="text-paper/85 text-lg mb-8 max-w-md">
              {STUDIO.googleReviewCount} reviews on Google Maps — read what people say about the
              work, the team and the coffee.
            </p>
            <a
              href={STUDIO.mapsLink}
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost !border-ink"
            >
              Read the reviews →
            </a>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-lemon mb-5">
              Most mentioned on Google
            </p>
            <div className="flex flex-wrap gap-4 mb-10">
              {TOPICS.map((t) => (
                <span
                  key={t.label}
                  className={`card !shadow-[4px_4px_0_var(--color-ink)] inline-flex items-baseline gap-3 px-5 py-3 text-ink ${t.cls}`}
                >
                  <span className="display text-2xl md:text-3xl">{t.label}</span>
                  <span className="font-marker text-lg">×{t.count}</span>
                </span>
              ))}
            </div>
            {!hasReviews && (
              <p className="text-paper/70 max-w-md">
                Customer quotes will appear here once they&apos;re added — for now, the full
                review history is on Google Maps.
              </p>
            )}
          </Reveal>
        </div>

        {hasReviews && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-16">
            <Column reviews={rotate(TESTIMONIALS, 0)} duration={34} />
            <Column reviews={rotate(TESTIMONIALS, 1)} duration={42} className="hidden sm:block" />
            <Column reviews={rotate(TESTIMONIALS, 2)} duration={38} className="hidden lg:block" />
          </div>
        )}
      </div>
    </section>
  )
}
