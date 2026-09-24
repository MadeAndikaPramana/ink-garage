// Text wordmark echoing the studio's italic racing-style logo. The real logo
// file hasn't been supplied yet — swap this for an <img> once it is.
export default function Wordmark({ className = '' }) {
  return (
    <span className={`display inline-flex items-center gap-1.5 text-xl md:text-2xl ${className}`}>
      <span className="bg-ink text-paper px-2 py-0.5 -skew-x-6">INK</span>
      <span className="text-cobalt">GARAGE</span>
    </span>
  )
}
