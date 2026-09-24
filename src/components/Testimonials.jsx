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

function ReviewCard({ review, tilt }) {
  return (
    <figure
      className={`card relative flex w-[300px] sm:w-[370px] shrink-0 flex-col p-6 text-ink ${tilt ? 'rotate-[1.2deg]' : '-rotate-[1.2deg]'}`}
    >
      <span aria-hidden="true" className="display absolute -top-4 right-4 text-6xl text-flame leading-none">
        &ldquo;
      </span>
      <div className="mb-3 text-sm tracking-widest text-flame" aria-label="5 stars">
        ★★★★★
      </div>
      <blockquote className="mb-5 line-clamp-9 text-[15px] leading-relaxed text-ink/85">
        {review.text}
      </blockquote>
      <figcaption className="mt-auto text-xs font-bold uppercase tracking-widest">
        {review.name} <span className="text-ink/50">· {review.meta}</span>
      </figcaption>
    </figure>
  )
}

// One endlessly scrolling row. The list is rendered twice (the copy is hidden
// from assistive tech) so translating by -50% loops without a jump. Pauses on
// hover/focus so a card can actually be read; users who prefer reduced motion
// get a plain horizontally scrollable strip instead (see index.css).
function Row({ reviews, duration, reverse = false, label }) {
  const track = [...reviews, ...reviews]
  return (
    <div
      className="review-row group relative overflow-hidden"
      role="region"
      aria-label={label}
      tabIndex={0}
    >
      {/* Edge fades are two static gradient strips (the section is solid cobalt)
          instead of a CSS mask: a mask on a continuously animating row makes the
          GPU re-mask the whole row every frame, which is what janks on phones. */}
      <span aria-hidden="true" className="fade-edge pointer-events-none absolute inset-y-0 left-0 z-10 w-[5%] bg-gradient-to-r from-cobalt to-transparent" />
      <span aria-hidden="true" className="fade-edge pointer-events-none absolute inset-y-0 right-0 z-10 w-[5%] bg-gradient-to-l from-cobalt to-transparent" />
      <div
        className="flex w-max gap-6 py-4 group-hover:[animation-play-state:paused] group-focus-visible:[animation-play-state:paused]"
        style={{ animation: `marquee-x ${duration}s linear infinite ${reverse ? 'reverse' : ''}` }}
      >
        {track.map((review, i) => (
          <div key={`${review.name}-${i}`} className="flex" aria-hidden={i >= reviews.length ? 'true' : undefined}>
            <ReviewCard review={review} tilt={i % 2 === 0} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Testimonials() {
  const hasReviews = TESTIMONIALS.length > 0
  const half = Math.ceil(TESTIMONIALS.length / 2)
  const rowA = TESTIMONIALS.slice(0, half)
  const rowB = TESTIMONIALS.slice(half)

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
            <a href={STUDIO.mapsLink} target="_blank" rel="noreferrer" className="btn btn-ghost !border-ink">
              Read the reviews →
            </a>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-lemon mb-5">
              Most mentioned on Google
            </p>
            <div className="flex flex-wrap gap-4 mb-2">
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
              <p className="mt-8 text-paper/70 max-w-md">
                Customer quotes will appear here once they&apos;re added — for now, the full
                review history is on Google Maps.
              </p>
            )}
          </Reveal>
        </div>
      </div>

      {hasReviews && (
        <div className="mt-14 space-y-2">
          <Row reviews={rowA} duration={Math.max(40, rowA.length * 7)} label="Customer reviews, row one" />
          {rowB.length > 0 && (
            <Row
              reviews={rowB}
              duration={Math.max(44, rowB.length * 8)}
              reverse
              label="Customer reviews, row two"
            />
          )}
        </div>
      )}
    </section>
  )
}
