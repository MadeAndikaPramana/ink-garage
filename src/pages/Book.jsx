import { useState } from 'react'
import Reveal from '../components/Reveal'
import { useDocumentHead } from '../hooks/useDocumentHead'
import { BRANCHES } from '../data/branches'
import { CATEGORIES } from '../data/portfolio'
import { STUDIO } from '../constants'

const ARTISTS = ['No preference', ...BRANCHES[0].team.map((t) => t.name)]

const labelClass = 'block text-xs font-bold uppercase tracking-[0.18em] mb-2'

export default function Book() {
  useDocumentHead({
    title: 'Book a Session',
    description: 'Book your session at Ink Garage Tattoo Studio in Canggu — fill in a few details and continue straight to WhatsApp.',
  })

  const [form, setForm] = useState({
    name: '',
    contact: '',
    artist: ARTISTS[0],
    category: CATEGORIES[0],
    date: '',
    message: '',
  })

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const lines = [
      `Hi Ink Garage, I'd like to book a session.`,
      `Name: ${form.name}`,
      `Contact: ${form.contact}`,
      `Preferred artist: ${form.artist}`,
      `Type: ${form.category}`,
      form.date ? `Preferred date: ${form.date}` : null,
      form.message ? `Details: ${form.message}` : null,
    ].filter(Boolean)

    const url = `${STUDIO.whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <section className="pt-14 md:pt-20 pb-24 md:pb-32">
      <div className="max-w-2xl mx-auto px-5 md:px-6">
        <Reveal className="mb-12">
          <p className="eyebrow mb-3">book</p>
          <h1 className="display text-5xl md:text-7xl mb-5">Book a session</h1>
          <p className="text-lg text-ink/75">
            Fill this out and we&apos;ll open WhatsApp with your details ready to send — no
            account, no backend, just a direct message to the studio.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <form onSubmit={handleSubmit} className="card p-6 md:p-8 space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className={labelClass}>Name</label>
                <input id="name" required value={form.name} onChange={update('name')} className="field" placeholder="Your name" />
              </div>
              <div>
                <label htmlFor="contact" className={labelClass}>Phone / WhatsApp</label>
                <input id="contact" required value={form.contact} onChange={update('contact')} className="field" placeholder="+62..." />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="artist" className={labelClass}>Preferred artist</label>
                <select id="artist" value={form.artist} onChange={update('artist')} className="field">
                  {ARTISTS.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="category" className={labelClass}>Type</label>
                <select id="category" value={form.category} onChange={update('category')} className="field">
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="date" className={labelClass}>Preferred date (optional)</label>
              <input id="date" type="date" value={form.date} onChange={update('date')} className="field" />
            </div>

            <div>
              <label htmlFor="message" className={labelClass}>Tell us about the piece</label>
              <textarea id="message" value={form.message} onChange={update('message')} rows={4} className="field" placeholder="Size, placement, reference ideas..." />
            </div>

            <button type="submit" className="btn btn-flame w-full sm:w-auto">
              Continue on WhatsApp
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  )
}
