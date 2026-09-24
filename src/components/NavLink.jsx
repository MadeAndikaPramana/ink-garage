import { Link } from 'react-router-dom'

export default function NavLink({ href, className, onClick, children }) {
  if (href.startsWith('/#')) {
    return (
      <a href={href} className={className} onClick={onClick}>
        {children}
      </a>
    )
  }
  return (
    <Link to={href} className={className} onClick={onClick}>
      {children}
    </Link>
  )
}
