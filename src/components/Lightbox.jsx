import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'

// Full-photo preview. `index` is null when closed. Rendered through a portal
// because gallery tiles sit inside transformed (Reveal/motion) wrappers,
// which would otherwise become the containing block for a fixed overlay.
export default function Lightbox({ items, index, onClose, onNavigate }) {
  const current = index === null ? null : items[index]
  const count = items.length

  useEffect(() => {
    if (!current) return
    const go = (step) => onNavigate((index + step + count) % count)
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [current, index, count, onClose, onNavigate])

  const step = (e, delta) => {
    e.stopPropagation()
    onNavigate((index + delta + count) % count)
  }

  const round =
    'absolute w-12 h-12 border-2 border-ink bg-lemon text-ink text-xl font-bold shadow-[3px_3px_0_var(--color-ink)] hover:bg-flame transition-colors'

  return createPortal(
    <AnimatePresence>
      {current && (
        <motion.div
          key="lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${current.category} tattoo preview`}
          onClick={onClose}
          className="fixed inset-0 z-[300] flex items-center justify-center bg-ink/92 p-4 md:p-10"
        >
          <motion.img
            key={current.id}
            src={current.src}
            alt={`${current.category} tattoo`}
            initial={{ opacity: 0, scale: 0.97, rotate: -1 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[84vh] max-w-full object-contain border-4 border-paper shadow-[8px_8px_0_var(--color-cobalt)]"
          />

          <p className="sticker absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
            {current.category}{current.artist ? ` · ${current.artist}` : ''} · {index + 1} / {count}{current.demo ? ' · demo photo' : ''}
          </p>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className={`${round} top-4 right-4 md:top-6 md:right-6`}
          >
            ✕
          </button>

          {count > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => step(e, -1)}
                aria-label="Previous photo"
                className={`${round} left-3 md:left-6 top-1/2 -translate-y-1/2`}
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => step(e, 1)}
                aria-label="Next photo"
                className={`${round} right-3 md:right-6 top-1/2 -translate-y-1/2`}
              >
                ›
              </button>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
