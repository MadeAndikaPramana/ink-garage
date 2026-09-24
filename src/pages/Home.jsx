import Hero from '../components/Hero'
import About from '../components/About'
import Services from '../components/Services'
import GalleryTeaser from '../components/GalleryTeaser'
import Testimonials from '../components/Testimonials'
import Location from '../components/Location'
import { useDocumentHead } from '../hooks/useDocumentHead'

export default function Home() {
  // explicit reset — without this, navigating Home -> Team -> back to Home
  // would leave the tab title stuck on "Our Team" since nothing else resets it
  useDocumentHead({
    description:
      'Ink Garage Tattoo Studio — tattoos, piercing, nail art and a coffee bar in Canggu, Bali. Book via WhatsApp.',
  })

  return (
    <>
      <Hero />
      <About />
      <Services />
      <GalleryTeaser />
      <Testimonials />
      <Location />
    </>
  )
}
