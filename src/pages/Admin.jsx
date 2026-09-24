import { useEffect, useState } from 'react'
import { PORTFOLIO as INITIAL_PORTFOLIO, CATEGORIES, ARTISTS } from '../data/portfolio'

// Resizes/compresses a File client-side before it's base64-encoded and sent
// to the API — keeps request payloads well under Vercel's body-size limit
// and keeps the deployed images consistent with the rest of the site.
function resizeImageFile(file, maxDimension = 1600, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      let { width, height } = img
      if (width > maxDimension || height > maxDimension) {
        if (width >= height) {
          height = Math.round((height / width) * maxDimension)
          width = maxDimension
        } else {
          width = Math.round((width / height) * maxDimension)
          height = maxDimension
        }
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)
      URL.revokeObjectURL(objectUrl)

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error(`Could not process image: ${file.name}`))
            return
          }
          const reader = new FileReader()
          reader.onload = () => resolve({ base64: reader.result.split(',')[1] })
          reader.onerror = () => reject(new Error(`Could not read processed image: ${file.name}`))
          reader.readAsDataURL(blob)
        },
        'image/jpeg',
        quality,
      )
    }
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error(`Could not load image: ${file.name}`))
    }
    img.src = objectUrl
  })
}

export default function Admin() {
  // keep this page out of search results without needing a separate route config
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    return () => document.head.removeChild(meta)
  }, [])

  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [loggingIn, setLoggingIn] = useState(false)
  const [loginError, setLoginError] = useState('')

  const [items, setItems] = useState(INITIAL_PORTFOLIO)
  const [deleteIds, setDeleteIds] = useState(new Set())
  const [pendingFiles, setPendingFiles] = useState([]) // { file, category, previewUrl }
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState(null) // { type: 'success' | 'error', message }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoggingIn(true)
    setLoginError('')
    try {
      const res = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed.')
      setAuthed(true)
    } catch (err) {
      setLoginError(err.message)
    } finally {
      setLoggingIn(false)
    }
  }

  const toggleDelete = (id) => {
    setDeleteIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const onFilesSelected = (e) => {
    const files = Array.from(e.target.files || [])
    setPendingFiles((prev) => [
      ...prev,
      ...files.map((file) => ({ file, category: CATEGORIES[0], artist: '', previewUrl: URL.createObjectURL(file) })),
    ])
    e.target.value = ''
  }

  const updatePendingCategory = (index, category) => {
    setPendingFiles((prev) => prev.map((p, i) => (i === index ? { ...p, category } : p)))
  }

  const updatePendingArtist = (index, artist) => {
    setPendingFiles((prev) => prev.map((p, i) => (i === index ? { ...p, artist } : p)))
  }

  const removePending = (index) => {
    setPendingFiles((prev) => {
      const item = prev[index]
      if (item) URL.revokeObjectURL(item.previewUrl)
      return prev.filter((_, i) => i !== index)
    })
  }

  const hasChanges = deleteIds.size > 0 || pendingFiles.length > 0

  const handleSave = async () => {
    setSaving(true)
    setStatus(null)
    try {
      const additions = await Promise.all(
        pendingFiles.map(async (p) => {
          const { base64 } = await resizeImageFile(p.file)
          return { category: p.category, artist: p.artist, filename: p.file.name, base64 }
        }),
      )
      const deletions = [...deleteIds].map((id) => ({ id }))

      const res = await fetch('/api/portfolio-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, additions, deletions }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save changes.')

      setItems(data.items)
      setDeleteIds(new Set())
      pendingFiles.forEach((p) => URL.revokeObjectURL(p.previewUrl))
      setPendingFiles([])
      setStatus({
        type: 'success',
        message: 'Saved in one commit. The live site will update in about a minute while it rebuilds.',
      })
    } catch (err) {
      setStatus({ type: 'error', message: err.message })
    } finally {
      setSaving(false)
    }
  }

  if (!authed) {
    return (
      <section className="min-h-screen flex items-center justify-center px-6">
        <form onSubmit={handleLogin} className="w-full max-w-sm">
          <p className="eyebrow mb-3">Admin</p>
          <h1 className="display text-4xl mb-6">Portfolio Manager</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
            className="field mb-4"
          />
          {loginError && <p className="text-sm font-bold text-[#c2260c] mb-4">{loginError}</p>}
          <button
            type="submit"
            disabled={loggingIn || !password}
            className="btn w-full disabled:opacity-50"
          >
            {loggingIn ? 'Checking…' : 'Enter'}
          </button>
        </form>
      </section>
    )
  }

  return (
    <section className="pt-14 pb-28 px-6 max-w-6xl mx-auto">
      <p className="eyebrow mb-3">Admin</p>
      <h1 className="display text-4xl md:text-6xl mb-10">Portfolio Manager</h1>

      <h2 className="font-bold text-lg mb-1">Current photos ({items.length})</h2>
      <p className="text-ink/70 text-sm mb-4">Click a photo to mark it for deletion.</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
        {items.map((it) => {
          const marked = deleteIds.has(it.id)
          return (
            <button
              type="button"
              key={it.id}
              onClick={() => toggleDelete(it.id)}
              className={`relative h-40 overflow-hidden border-2 transition-colors ${
                marked ? 'border-cobalt' : 'border-ink'
              }`}
            >
              <img src={it.src} alt={it.category} className="w-full h-full object-cover" />
              <div
                className={`absolute inset-0 flex items-center justify-center text-center text-xs font-bold uppercase tracking-widest text-paper px-2 transition-opacity ${
                  marked ? 'opacity-100 bg-cobalt/85' : 'opacity-0 hover:opacity-100 bg-ink/70'
                }`}
              >
                {marked ? 'Marked for deletion' : `Delete · ${it.category}${it.artist ? ` · ${it.artist}` : ''}`}
              </div>
            </button>
          )
        })}
      </div>

      <h2 className="font-bold text-lg mb-4">Add new photos</h2>
      <label className="btn btn-ghost cursor-pointer mb-6">
        Choose files
        <input type="file" accept="image/*" multiple onChange={onFilesSelected} className="hidden" />
      </label>

      {pendingFiles.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {pendingFiles.map((p, i) => (
            <div key={i}>
              <img src={p.previewUrl} alt="" className="w-full h-40 object-cover" />
              <select
                value={p.category}
                onChange={(e) => updatePendingCategory(i, e.target.value)}
                className="field !py-1.5 !px-2 !text-xs mt-2"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <select
                value={p.artist}
                onChange={(e) => updatePendingArtist(i, e.target.value)}
                className="field !py-1.5 !px-2 !text-xs mt-2"
              >
                <option value="">No artist</option>
                {ARTISTS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => removePending(i)}
                className="mt-2 text-xs text-ink/60 hover:text-cobalt transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {status && (
        <p className={`mb-6 text-sm ${status.type === 'success' ? 'text-ink font-bold' : 'text-[#c2260c] font-bold'}`}>
          {status.message}
        </p>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={!hasChanges || saving}
        className="btn btn-flame disabled:opacity-40"
      >
        {saving ? 'Saving…' : `Save changes${hasChanges ? ` (${deleteIds.size + pendingFiles.length})` : ''}`}
      </button>
    </section>
  )
}
