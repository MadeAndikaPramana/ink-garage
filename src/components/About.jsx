import Reveal from './Reveal'

const DEPARTMENTS = [
  {
    n: '01',
    title: 'Ink',
    text: 'Fine line to realism, custom pieces, cover-ups and touch-ups.',
    cls: 'bg-cobalt text-paper -rotate-1',
  },
  {
    n: '02',
    title: 'Coffee',
    text: 'A real coffee bar inside the studio — clients and friends both hang out.',
    cls: 'bg-lemon text-ink rotate-1',
  },
  {
    n: '03',
    title: 'Piercing & nails',
    text: 'Piercing and nail art share the same space, so one visit covers it all.',
    cls: 'bg-flame text-ink -rotate-1',
  },
]

export default function About() {
  return (
    <section id="about" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-5 md:px-6 grid lg:grid-cols-[1fr_1fr] gap-14 items-center">
        <div>
          <Reveal>
            <p className="eyebrow mb-3">the garage</p>
            <h2 className="display text-4xl sm:text-5xl md:text-6xl mb-8">
              Tattoo studio. <span className="text-cobalt">Coffee bar.</span> Same room.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-lg leading-relaxed text-ink/75 mb-5 max-w-xl">
              Ink Garage is a contemporary industrial studio in Canggu where tattoo, piercing and
              nail art share one space with a coffee bar. It&apos;s built to feel like a creative
              hangout, not a waiting room.
            </p>
            <p className="text-lg leading-relaxed text-ink/75 max-w-xl">
              Bring a friend, order a coffee, watch the process. Whether it&apos;s your first tiny
              fine line piece or a big custom design, tell us the idea and we&apos;ll take the
              time to make it yours.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-5">
          {DEPARTMENTS.map((d, i) => (
            <Reveal key={d.n} delay={i * 0.1}>
              <div className={`card p-6 md:p-7 flex gap-5 items-start ${d.cls}`}>
                <span className="display text-4xl md:text-5xl opacity-90">{d.n}</span>
                <div>
                  <h3 className="display text-2xl md:text-3xl mb-2">{d.title}</h3>
                  <p className="leading-relaxed opacity-90">{d.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
