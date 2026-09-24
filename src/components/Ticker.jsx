// Endless text strip. The list is rendered twice so translating the track by
// -50% loops seamlessly.
export default function Ticker({ items, className = '', duration = 32 }) {
  const row = [...items, ...items]
  return (
    <div className={`overflow-hidden ${className}`} aria-hidden="true">
      <div
        className="flex w-max items-center hover:[animation-play-state:paused]"
        style={{ animation: `ticker-x ${duration}s linear infinite` }}
      >
        {row.map((text, i) => (
          <span key={i} className="display flex items-center gap-6 pr-6 text-lg md:text-2xl">
            {text}
            <span className="text-flame">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
