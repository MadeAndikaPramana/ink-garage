import Reveal from './Reveal'
import { STUDIO } from '../constants'

const ROWS = [
  { label: 'Address', value: STUDIO.address, href: STUDIO.mapsLink },
  { label: 'Hours', value: STUDIO.hours },
  { label: 'WhatsApp', value: STUDIO.phoneDisplay, href: STUDIO.whatsapp },
  { label: 'Instagram', value: STUDIO.instagramHandle, href: STUDIO.instagram },
]

export default function Location() {
  return (
    <section id="location" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-5 md:px-6 grid lg:grid-cols-2 gap-12 items-stretch">
        <Reveal>
          <p className="eyebrow mb-3">visit us</p>
          <h2 className="display text-4xl sm:text-5xl md:text-6xl mb-8">Come hang out</h2>

          <dl className="card divide-y-2 divide-ink">
            {ROWS.map((row) => (
              <div key={row.label} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 px-5 py-4">
                <dt className="w-28 shrink-0 text-[11px] font-bold uppercase tracking-[0.2em] text-cobalt">
                  {row.label}
                </dt>
                <dd>
                  {row.href ? (
                    <a href={row.href} target="_blank" rel="noreferrer" className="font-medium hover:text-cobalt underline decoration-2 decoration-flame underline-offset-4">
                      {row.value}
                    </a>
                  ) : (
                    <span className="font-medium">{row.value}</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <a href={STUDIO.whatsapp} target="_blank" rel="noreferrer" className="btn btn-flame mt-10">
            Book via WhatsApp
          </a>
        </Reveal>

        <Reveal delay={0.15} className="min-h-[360px]">
          <div className="card h-full min-h-[360px] p-2 rotate-1">
            <iframe
              title={`${STUDIO.name} location`}
              src={STUDIO.mapsEmbed}
              className="w-full h-full min-h-[340px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
