import { useState } from 'react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '../lib/firebase'

// Upload an image to posts/{postId}/images/ and return its public URL.
// Requires the post to be saved first (needs a stable post id).
export default function ImageUpload({ postId, value, onChange, label = 'Image' }) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const pick = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!postId) {
      setErr('Save the post first, then upload images.')
      return
    }
    setBusy(true)
    setErr('')
    try {
      const safe = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')
      const r = ref(storage, `posts/${postId}/images/${Date.now()}-${safe}`)
      await uploadBytes(r, file, { contentType: file.type })
      onChange(await getDownloadURL(r))
    } catch (e2) {
      setErr(String(e2?.message || e2))
    } finally {
      setBusy(false)
    }
  }

  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {value && <img src={value} alt="" style={{ maxWidth: '100%', borderRadius: 8, marginBottom: 8 }} />}
      <input className="field-input" value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder="Image URL" />
      <div style={{ marginTop: 6 }}>
        <input type="file" accept="image/*" onChange={pick} disabled={busy} />
        {busy && <span className="muted"> uploading…</span>}
        {err && <span className="err"> {err}</span>}
      </div>
    </label>
  )
}
