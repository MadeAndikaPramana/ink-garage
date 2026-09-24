import { Link } from 'react-router-dom'
import { STUDIO, NAV_LINKS } from '../constants'
import NavLink from './NavLink'
import Ticker from './Ticker'

const linkClass = 'hover:text-lemon transition-colors'

export default function Footer() {
  return (
    <footer className="bg-ink text-paper border-t-2 border-ink overflow-hidden">
      <Ticker
        items={['Ink', 'Coffee', 'Piercing', 'Nail art', 'Community']}
        className="bg-lemon text-ink border-b-2 border-ink py-2"
        duration={26}
      />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="grid md:grid-cols-[1.4fr_1fr_1fr] gap-12 mb-14">
          <div>
            <p className="font-marker text-lemon text-xl mb-3">Got an idea?</p>
            <p className="text-paper/75 max-w-sm leading-relaxed mb-6">
              Send us a reference photo on WhatsApp and we&apos;ll get back to you about your piece.
            </p>
            <a href={STUDIO.whatsapp} target="_blank" rel="noreferrer" className="btn btn-flame !border-paper !shadow-[4px_4px_0_var(--color-paper)]">
              WhatsApp us
            </a>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-lemon mb-5">Explore</p>
            <ul className="space-y-3 text-sm text-paper/80">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <NavLink href={link.href} className={linkClass}>
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-lemon mb-5">Visit</p>
            <ul className="space-y-3 text-sm text-paper/80">
              <li>{STUDIO.address}</li>
              <li>{STUDIO.hours}</li>
              <li>
                <a href={STUDIO.whatsapp} target="_blank" rel="noreferrer" className={linkClass}>
                  {STUDIO.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={STUDIO.instagram} target="_blank" rel="noreferrer" className={linkClass}>
                  {STUDIO.instagramHandle}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Link
          to="/"
          aria-label="Ink Garage home"
          className="display block text-[18vw] md:text-[11rem] leading-[0.85] text-paper/[0.07] select-none whitespace-nowrap"
        >
          INK GARAGE
        </Link>

        <p className="mt-8 pt-6 border-t border-paper/15 text-xs text-paper/50">
          © {new Date().getFullYear()} {STUDIO.name} · Canggu, Bali
        </p>
      </div>
    </footer>
  )
}
