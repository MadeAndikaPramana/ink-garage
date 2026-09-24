export default function PlaceholderImage({ label = 'Photo', src, eager = false, position, className = '' }) {
  if (src) {
    return (
      <div className={`overflow-hidden bg-paper-2 ${className}`}>
        <img
          src={src}
          alt={label}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          style={position ? { objectPosition: position } : undefined}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    )
  }

  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 bg-paper-2 overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,_rgba(20,20,20,0.07)_0px,_rgba(20,20,20,0.07)_2px,_transparent_2px,_transparent_14px)]" />
      <span className="relative font-marker text-lg text-ink/55">{label}</span>
      <span className="relative text-[10px] font-bold uppercase tracking-[0.25em] text-ink/40">
        photo coming soon
      </span>
    </div>
  )
}
