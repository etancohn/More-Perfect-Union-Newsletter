import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { firebaseReady } from '../lib/firebase'
import { listPosts, seedCurrentNewsletter, deletePost } from '../lib/posts'

export default function Dashboard() {
  const [posts, setPosts] = useState(null)
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const load = () => {
    setError('')
    listPosts()
      .then(setPosts)
      .catch((e) => setError(String(e?.message || e)))
  }
  useEffect(() => {
    if (firebaseReady) load()
  }, [])

  const seed = async () => {
    try {
      setBusy('Seeding current newsletter…')
      const id = await seedCurrentNewsletter()
      setBusy('')
      navigate(`/dashboard/${id}`)
    } catch (e) {
      setError(String(e?.message || e))
      setBusy('')
    }
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return
    await deletePost(id)
    load()
  }

  if (!firebaseReady)
    return (
      <Shell>
        <p>
          Firebase isn’t configured yet. Copy <code>.env.example</code> → <code>.env</code>, fill in
          your Firebase web config, and restart the dev server.
        </p>
      </Shell>
    )

  return (
    <Shell>
      <div className="dash-actions">
        <Link to="/dashboard/new" className="btn primary">+ New post</Link>
        <button className="btn" disabled={!!busy} onClick={seed}>Seed current newsletter</button>
        {busy && <span className="busy">{busy}</span>}
        {error && <span className="err">{error}</span>}
      </div>

      {posts == null ? (
        <p className="muted">Loading…</p>
      ) : posts.length === 0 ? (
        <p className="muted">No posts yet. Create one, or seed the current newsletter to get started.</p>
      ) : (
        <ul className="post-list">
          {posts.map((p) => {
            const count = p.sections?.length || 0
            const meta = [
              p.edition?.issueDate,
              count ? `${count} section${count === 1 ? '' : 's'}` : null,
            ].filter(Boolean)
            return (
              <li key={p.id}>
                <Link to={`/dashboard/${p.id}`} className="post-link">
                  <span className={`badge ${p.status}`}>{p.status}</span>
                  <span className="post-main">
                    <span className="post-title">{p.title}</span>
                    <span className="post-sub">
                      <span className="post-slug">/p/{p.slug}</span>
                      {meta.map((m) => (
                        <span key={m} className="post-meta">{m}</span>
                      ))}
                    </span>
                  </span>
                </Link>
                <a className="mini" href={`/p/${p.slug}`} target="_blank" rel="noreferrer">view ↗</a>
                <button className="mini danger" onClick={() => remove(p.id)}>delete</button>
              </li>
            )
          })}
        </ul>
      )}
    </Shell>
  )
}

function Shell({ children }) {
  return (
    <div className="dash">
      <header className="dash-head">
        <h1>Newsletter Dashboard</h1>
        <Link to="/" className="muted">View site →</Link>
      </header>
      <p className="warn">
        ⚠ This dashboard is currently open to anyone. Add authentication before sharing it publicly.
      </p>
      {children}
    </div>
  )
}
