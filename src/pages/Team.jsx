import Reveal from '../components/Reveal'
import { useDocumentHead } from '../hooks/useDocumentHead'
import { BRANCHES } from '../data/branches'
import { STUDIO } from '../constants'

const studio = BRANCHES[0]
const COLORS = ['bg-cobalt text-paper -rotate-1', 'bg-lemon text-ink rotate-1', 'bg-flame text-ink -rotate-1']

export default function Team() {
  useDocumentHead({
    title: 'The Artists',
    description: `Meet the artists at ${studio.name} in Canggu, Bali.`,
  })

  return (
    <section className="pt-14 md:pt-20 pb-24 md:pb-32">
      <div className="max-w-7xl mx-auto px-5 md:px-6">
        <Reveal className="max-w-2xl mb-14">
          <p className="eyebrow mb-3">our team</p>
          <h1 className="display text-5xl md:text-7xl mb-5">The artists</h1>
          <p className="text-lg text-ink/75">
            The people behind the machines at {studio.name}. See each artist&apos;s work on{' '}
            <a href={STUDIO.instagram} target="_blank" rel="noreferrer" className="font-bold underline decoration-flame decoration-4 underline-offset-4 hover:text-cobalt">
              Instagram
            </a>
            .
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {studio.team.map((member, i) => (
            <Reveal key={member.name} delay={i * 0.1}>
              <div className={`card p-8 min-h-[260px] flex flex-col justify-between ${COLORS[i % COLORS.length]}`}>
                <div>
                  <p className="sticker !bg-paper !text-ink mb-6">{member.role}</p>
                  <h2 className="display text-5xl md:text-6xl">{member.name}</h2>
                </div>
                {member.bio && <p className="mt-6 leading-relaxed">{member.bio}</p>}
                <a
                  href={STUDIO.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 font-bold uppercase tracking-widest text-xs underline underline-offset-4 decoration-2"
                >
                  See the work →
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
