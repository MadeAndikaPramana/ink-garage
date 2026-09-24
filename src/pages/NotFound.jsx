import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import { useDocumentHead } from '../hooks/useDocumentHead'

export default function NotFound() {
  useDocumentHead({ title: 'Page Not Found' })

  return (
    <section className="min-h-[70vh] flex items-center justify-center px-6 py-20">
      <Reveal className="text-center max-w-md">
        <p className="display text-[9rem] leading-none text-cobalt">404</p>
        <p className="font-marker text-2xl mb-4 -rotate-2">wrong garage door</p>
        <p className="text-ink/75 mb-8">
          That page doesn&apos;t exist — but the ink is real. Head back home or browse the work.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn">Back home</Link>
          <Link to="/portfolio" className="btn btn-ghost">See the work</Link>
        </div>
      </Reveal>
    </section>
  )
}
