import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { STUDIO } from '../constants'
import { PORTFOLIO } from '../data/portfolio'
import PlaceholderImage from './PlaceholderImage'
import Ticker from './Ticker'

const COLLAGE_LABELS = ['Fine Line', 'Realism', 'Custom']
const collage = COLLAGE_LABELS.map(
  (label) => [...PORTFOLIO].reverse().find((p) => p.category === label) ?? { category: label, src: null },
)

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}
const rise = {
  hidden: { y: 28, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
}
const pop = {
  hidden: { opacity: 0, scale: 0.85, rotate: 0 },
  visible: (r) => ({ opacity: 1, scale: 1, rotate: r, transition: { type: 'spring', stiffness: 160, damping: 14 } }),
}

function SpinBadge() {
  return (
    <div className="relative w-28 h-28 md:w-36 md:h-36">
      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 w-full h-full"
        style={{ animation: 'spin-slow 22s linear infinite' }}
        aria-hidden="true"
      >
        <defs>
          <path id="badge-circle" d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0" />
        </defs>
        <circle cx="100" cy="100" r="97" fill="#ff5a1f" stroke="#141414" strokeWidth="4" />
        <text
          fontSize="17"
          fontWeight="900"
          fill="#141414"
          style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}
        >
          <textPath href="#badge-circle" textLength="470" lengthAdjust="spacing">
            INK · COFFEE · PIERCING · NAILS ·
          </textPath>
        </text>
      </svg>
      <span className="absolute inset-0 grid place-items-center display text-3xl">★</span>
    </div>
  )
}

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-6 pt-12 md:pt-16 pb-16 md:pb-24 grid lg:grid-cols-[1.15fr_0.85fr] gap-14 items-center">
        <motion.div variants={container} initial="hidden" animate="visible">
          <motion.div variants={rise} className="flex flex-wrap gap-3 mb-8">
            <span className="sticker -rotate-2">
              ★ {STUDIO.googleRating.toFixed(1)} on Google · {STUDIO.googleReviewCount} reviews
            </span>
            <span className="sticker !bg-card rotate-1">{STUDIO.location}</span>
          </motion.div>

          <motion.h1 variants={rise} className="display text-[12vw] sm:text-[5.5rem] lg:text-[5.4rem] xl:text-[6.2rem]">
            <span className="block">Ink.</span>
            <span className="block text-cobalt">Coffee.</span>
            <span
              className="block text-transparent"
              style={{ WebkitTextStroke: '3px var(--color-ink)' }}
            >
              Piercing.
            </span>
          </motion.h1>

          <motion.p variants={rise} className="mt-8 max-w-lg text-lg leading-relaxed text-ink/75">
            A tattoo studio in Canggu that&apos;s also a coffee bar. Fine line, realism, custom
            pieces and cover-ups — grab a coffee, watch the work happen, hang out.
          </motion.p>

          <motion.div variants={rise} className="mt-10 flex flex-col sm:flex-row gap-4">
            <a href={STUDIO.whatsapp} target="_blank" rel="noreferrer" className="btn">
              Book on WhatsApp
            </a>
            <Link to="/portfolio" className="btn btn-ghost">
              See the work
            </Link>
          </motion.div>
        </motion.div>

        {/* Taped photo cards */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="relative hidden lg:block h-[540px]"
        >
          {[
            { i: 0, rot: 5, cls: 'top-0 right-2 w-60 h-72' },
            { i: 1, rot: -6, cls: 'bottom-2 left-0 w-52 h-64' },
            { i: 2, rot: 2, cls: 'top-[34%] left-[26%] z-10 w-48 h-56' },
          ].map(({ i, rot, cls }) => (
            <motion.div key={i} custom={rot} variants={pop} className={`absolute card ${cls}`}>
              <span className="tape -top-3 left-1/2 -translate-x-1/2 rotate-3" />
              <PlaceholderImage
                label={collage[i].category}
                src={collage[i].src}
                position="center"
                className="absolute inset-2"
              />
            </motion.div>
          ))}
          <div className="absolute -bottom-2 right-6 z-20 rotate-6">
            <SpinBadge />
          </div>
        </motion.div>
      </div>

      <Ticker
        items={['Fine line', 'Realism', 'Custom', 'Cover-ups', 'Piercing', 'Nail art', 'Coffee']}
        className="bg-ink text-lemon border-y-2 border-ink py-3 -rotate-1 scale-[1.02]"
      />
    </section>
  )
}
