import { useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import PlaceholderImage from '../components/PlaceholderImage'
import Lightbox from '../components/Lightbox'
import DemoTag from '../components/DemoTag'
import { useDocumentHead } from '../hooks/useDocumentHead'
import { BRANCHES } from '../data/branches'
import { PORTFOLIO, artistToSlug, describeWork } from '../data/portfolio'
import { STUDIO } from '../constants'

const studio = BRANCHES[0]
const COLORS = ['bg-cobalt text-paper', 'bg-lemon text-ink', 'bg-flame text-ink']
const PREVIEW_COUNT = 6

export default function Team() {
  // { artist, index } — which artist's works the lightbox is showing
  const [preview, setPreview] = useState({ artist: null, index: null })

  useDocumentHead({
    title: 'Tattoo Artists in Canggu',
    description: `Meet the tattoo artists at ${studio.name} in Canggu, Bali, and see their work.`,
  })

  const worksOf = (name) => PORTFOLIO.filter((p) => p.artist === name)
  const open = preview.artist ? worksOf(preview.artist) : []

  return (
    <section className="pt-14 md:pt-20 pb-24 md:pb-32">
      <div className="max-w-7xl mx-auto px-5 md:px-6">
        <Reveal className="max-w-2xl mb-14">
          <p className="eyebrow mb-3">our team</p>
          <h1 className="display text-5xl md:text-7xl mb-5">The artists</h1>
          <p className="text-lg text-ink/75">
            The people behind the machines at {studio.name}. Here&apos;s their work, and more on{' '}
            <a href={STUDIO.instagram} target="_blank" rel="noreferrer" className="font-bold underline decoration-flame decoration-4 underline-offset-4 hover:text-cobalt">
              Instagram
            </a>
            .
          </p>
        </Reveal>

        <div className="space-y-16">
          {studio.team.map((member, i) => {
            const works = worksOf(member.name)
            return (
              <Reveal key={member.name} delay={i * 0.08}>
                <article id={artistToSlug(member.name)} className="grid lg:grid-cols-[300px_1fr] gap-8 items-start scroll-mt-24">
                  <div className={`card p-7 min-h-[220px] flex flex-col justify-between ${COLORS[i % COLORS.length]} ${i % 2 ? 'rotate-1' : '-rotate-1'}`}>
                    <div>
                      <p className="sticker !bg-paper !text-ink mb-5">{member.role}</p>
                      <h2 className="display text-5xl">{member.name}</h2>
                    </div>
                    {member.bio && <p className="mt-5 leading-relaxed">{member.bio}</p>}
                    <Link
                      to={`/portfolio?artist=${artistToSlug(member.name)}`}
                      className="mt-6 font-bold uppercase tracking-widest text-xs underline underline-offset-4 decoration-2"
                    >
                      All work by {member.name} →
                    </Link>
                  </div>

                  {works.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {works.slice(0, PREVIEW_COUNT).map((w, k) => (
                        <button
                          key={w.id}
                          type="button"
                          onClick={() => setPreview({ artist: member.name, index: k })}
                          aria-label={`View ${w.category} tattoo by ${member.name}`}
                          className="card group relative block h-52 sm:h-60 overflow-hidden cursor-zoom-in transition-transform duration-150 hover:-translate-y-1"
                        >
                          <PlaceholderImage label={w.category} alt={describeWork(w)} src={w.src} className="absolute inset-0 transition-transform duration-500 group-hover:scale-105" />
                          <span className="sticker absolute left-2 bottom-2 !text-[10px]">{w.category}</span>
                          <DemoTag item={w} />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="card p-8 self-stretch flex flex-col justify-center rotate-1">
                      <p className="font-marker text-2xl mb-2">work coming soon</p>
                      <p className="text-ink/70">
                        {member.name}&apos;s pieces will show up here. Until then, see the latest on Instagram.
                      </p>
                    </div>
                  )}
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>

      <Lightbox
        items={open}
        index={preview.index}
        onClose={() => setPreview({ artist: null, index: null })}
        onNavigate={(index) => setPreview((p) => ({ ...p, index }))}
      />
    </section>
  )
}
