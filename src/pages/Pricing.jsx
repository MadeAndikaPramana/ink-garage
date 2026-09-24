import Reveal from '../components/Reveal'
import Accordion from '../components/Accordion'
import { useDocumentHead } from '../hooks/useDocumentHead'
import { STUDIO } from '../constants'

const FACTORS = [
  { title: 'Size', desc: 'Bigger pieces take more time and materials, and cost more overall.' },
  { title: 'Detail', desc: 'Fine linework, shading and intricate detail add time in the chair.' },
  { title: 'Placement', desc: 'Some areas are slower and trickier to work — ribs, hands, feet.' },
  { title: 'Sessions', desc: 'Large pieces can take more than one sitting.' },
]

// Only statements we can stand behind. Policies like walk-ins, deposits or
// hygiene specifics were NOT confirmed with the studio, so they are pointed
// to WhatsApp instead of stated as fact.
const FAQ = [
  {
    q: 'How much will my tattoo cost?',
    a: 'It depends on size, detail and placement. Send your idea and any reference photos on WhatsApp and we\'ll get back to you with a quote.',
  },
  {
    q: 'Are there any promos?',
    a: 'The studio runs promos from time to time and announces them on Instagram — check @inkgaragetattoostudio for what\'s on right now.',
  },
  {
    q: 'Can you cover up an old tattoo?',
    a: 'Cover-ups and touch-ups are part of what the studio offers. Send a photo of the existing piece on WhatsApp and we\'ll talk through what\'s possible.',
  },
  {
    q: 'Do you do piercing and nail art too?',
    a: 'Yes — piercing and nail art are done in the same studio. There\'s a coffee bar too.',
  },
  {
    q: 'Do walk-ins, deposits and age rules apply?',
    a: 'Message us on WhatsApp and we\'ll tell you how booking works for your piece, including any deposit or age requirements.',
  },
  {
    q: 'Does getting a tattoo hurt?',
    a: 'Some discomfort is normal and depends on placement and your own pain tolerance. Tell your artist how you\'re doing at any point.',
  },
]

const AFTERCARE = [
  'Follow the aftercare instructions your artist gives you — they know your piece best.',
  'Wash gently with fragrance-free soap and lukewarm water, then pat dry. Don\'t rub.',
  'Keep it clean and moisturized as directed while it heals.',
  'Stay out of direct sun, pools and the sea until it\'s fully healed.',
  'Don\'t pick or scratch peeling skin — let it flake off on its own.',
  'Wear loose, breathable clothing over the area.',
]

export default function Pricing() {
  useDocumentHead({
    title: 'Pricing & FAQ',
    description: 'What affects tattoo pricing at Ink Garage Tattoo Studio in Canggu, plus answers to common questions.',
  })

  return (
    <section className="pt-14 md:pt-20 pb-24 md:pb-32">
      <div className="max-w-4xl mx-auto px-5 md:px-6">
        <Reveal className="max-w-2xl mb-16">
          <p className="eyebrow mb-3">pricing & faq</p>
          <h1 className="display text-5xl md:text-7xl mb-5">What to expect</h1>
          <p className="text-lg text-ink/75">
            Every piece is different, so tell us your idea and we&apos;ll quote it. Here&apos;s what
            goes into the price, and answers to the questions people ask most.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mb-20">
          <h2 className="display text-2xl md:text-3xl mb-8">How pricing works</h2>
          <div className="grid sm:grid-cols-2 gap-6 mb-10">
            {FACTORS.map((f, i) => (
              <div key={f.title} className={`card p-6 ${i % 2 ? 'rotate-1' : '-rotate-1'}`}>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-ink/75 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
          <a href={STUDIO.whatsapp} target="_blank" rel="noreferrer" className="btn btn-flame">
            Get a quote
          </a>
        </Reveal>

        <Reveal delay={0.15} className="mb-20">
          <h2 className="display text-2xl md:text-3xl mb-6">Frequently asked</h2>
          <Accordion items={FAQ} />
        </Reveal>

        <Reveal delay={0.2}>
          <h2 className="display text-2xl md:text-3xl mb-6">Aftercare</h2>
          <ul className="space-y-4">
            {AFTERCARE.map((tip) => (
              <li key={tip} className="flex gap-4 leading-relaxed text-ink/80">
                <span className="text-flame font-black shrink-0">✦</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
