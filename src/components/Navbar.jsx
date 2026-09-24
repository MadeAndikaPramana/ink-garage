import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { NAV_LINKS } from '../constants'
import NavLink from './NavLink'
import Wordmark from './Wordmark'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur-sm border-b-2 border-ink">
      <nav className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 md:px-6 py-3">
        <Link to="/" aria-label="Ink Garage home" onClick={() => setOpen(false)}>
          <Wordmark />
        </Link>

        <ul className="hidden lg:flex items-center gap-7 text-xs font-bold uppercase tracking-[0.14em]">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <NavLink
                href={link.href}
                className="relative py-1 hover:text-cobalt transition-colors after:absolute after:left-0 after:-bottom-0.5 after:h-[3px] after:w-0 after:bg-flame hover:after:w-full after:transition-all"
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Link to="/book" className="btn btn-flame hidden sm:inline-flex !py-2.5 !px-5 !text-xs">
            Book now
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="lg:hidden w-11 h-11 border-2 border-ink bg-card shadow-[3px_3px_0_var(--color-ink)] text-xl leading-none"
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden border-t-2 border-ink bg-paper"
          >
            <div className="px-4 py-5 flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="display text-2xl"
                >
                  {link.label}
                </NavLink>
              ))}
              <Link to="/book" onClick={() => setOpen(false)} className="btn btn-flame mt-2">
                Book now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
