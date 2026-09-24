import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import { STUDIO } from '../constants'

const STYLES = ['Fine line', 'Realism', 'Custom', 'Cover-ups', 'Touch-ups']

const CARDS = [
  {
    key: 'tattoo',
    title: 'Tattoo',
    text: 'Bring the idea — big or small — and we build the design with you.',
    to: '/portfolio',
    cls: 'bg-cobalt text-paper',
    span: 'sm:col-span-2 sm:row-span-2',
    big: true,
  },
  { key: 'piercing', title: 'Piercing', text: 'Piercing in the same studio, no separate trip.', to: '/portfolio/piercing', cls: 'bg-lemon text-ink', span: '' },
  { key: 'nails', title: 'Nail art', text: 'Nail art at the studio — details on Instagram.', to: '/portfolio/nail-art', cls: 'bg-flame text-ink', span: '' },
  { key: 'coffee', title: 'Coffee', text: 'A real coffee bar inside the studio.', href: STUDIO.instagram, cls: 'bg-card text-ink', span: 'sm:col-span-2' },
]

function CardBody({ c }) {
  return (
    <div className="h-full flex flex-col justify-between p-6 md:p-7 min-h-[170px]">
      <div>
        <h3 className={`display ${c.big ? 'text-5xl md:text-7xl' : 'text-3xl md:text-4xl'} mb-3`}>{c.title}</h3>
        <p className={`leading-relaxed ${c.big ? 'text-lg max-w-sm' : ''} opacity-90`}>{c.text}</p>
        {c.big && (
          <div className="flex flex-wrap gap-2 mt-6">
            {STYLES.map((s) => (
              <span key={s} className="sticker !bg-paper !text-ink !shadow-none">
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
      <span className="display text-3xl mt-6 self-end">→</span>
    </div>
  )
}

export default function Services() {
  return (
    <section id="services" className="py-20 md:py-28 bg-paper-2 border-y-2 border-ink">
      <div className="max-w-7xl mx-auto px-5 md:px-6">
        <Reveal className="mb-12 max-w-2xl">
          <p className="eyebrow mb-3">what we do</p>
          <h2 className="display text-4xl sm:text-5xl md:text-6xl">Pick your poison</h2>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 sm:auto-rows-[minmax(190px,auto)]">
          {CARDS.map((c, i) => {
            const cls = `card block h-full transition-transform duration-150 hover:-translate-y-1 hover:-rotate-1 ${c.cls}`
            return (
              <Reveal key={c.key} delay={i * 0.07} className={c.span}>
                <motion.div className="h-full" whileTap={{ scale: 0.98 }}>
                  {c.to ? (
                    <Link to={c.to} className={cls}>
                      <CardBody c={c} />
                    </Link>
                  ) : (
                    <a href={c.href} target="_blank" rel="noreferrer" className={cls}>
                      <CardBody c={c} />
                    </a>
                  )}
                </motion.div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
