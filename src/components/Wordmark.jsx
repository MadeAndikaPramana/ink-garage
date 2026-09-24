// The studio's real logo (white wordmark, transparent PNG). On the light
// header it sits on a block in the logo's own blue; on dark backgrounds it
// can be used bare with `plain`.
export default function Wordmark({ plain = false, className = '' }) {
  const img = (
    <img
      src="/images/inkgarage-logo-white.png"
      alt="Ink Garage"
      width="640"
      height="67"
      className={plain ? `h-8 md:h-10 w-auto ${className}` : 'h-6 md:h-7 w-auto'}
    />
  )
  if (plain) return img
  return (
    <span
      className={`inline-flex items-center border-2 border-ink bg-logo px-3 py-2 shadow-[3px_3px_0_var(--color-ink)] transition-transform hover:-translate-y-0.5 ${className}`}
    >
      {img}
    </span>
  )
}
