import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    const scrollToTarget = () => {
      if (!hash) {
        window.scrollTo(0, 0)
        return
      }
      const el = document.getElementById(hash.slice(1))
      if (el) el.scrollIntoView()
    }
    scrollToTarget()
    // retry after paint + after load-time layout shifts (web font swap,
    // mobile address-bar resize, image loads) so a late shift doesn't leave
    // the page scrolled past the target
    const t1 = setTimeout(scrollToTarget, 100)
    const t2 = setTimeout(scrollToTarget, 400)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [pathname, hash])

  return (
    <div className="relative">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
