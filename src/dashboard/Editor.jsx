import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import SectionEditor from './SectionEditor'
import RichText from './RichText'
import ImageUpload from './ImageUpload'
import Preview from './Preview'
import SectionThumb from './SectionThumb'
import Loading from '../pages/Loading'
import { firebaseReady } from '../lib/firebase'
import { getPost, savePost } from '../lib/posts'
import { renderCards } from '../lib/cards/renderCards'
import { buildEmailHtml, DEFAULT_BASE } from '../lib/email'
import { sendTestEmail } from '../lib/sendTest'
import {
  SECTION_TYPES,
  newSection,
  withUniqueAnchors,
  blankPost,
  slugify,
} from '../lib/postSchema'

const TEST_RECIPIENTS = ['etan.cohn@gmail.com', 'maddiesolomon@gmail.com']

export default function Editor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = !id

  const [post, setPostState] = useState(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState('')
  const [dirty, setDirty] = useState(false)
  const [error, setError] = useState('')
  const [recipient, setRecipient] = useState(TEST_RECIPIENTS[0])
  const [sent, setSent] = useState('')

  useEffect(() => {
    let live = true
    if (isNew) {
      setPostState(blankPost())
      setLoading(false)
      return
    }
    getPost(id)
      .then((p) => {
        if (!live) return
        setPostState(p || blankPost())
        setLoading(false)
      })
      .catch((e) => live && (setError(String(e?.message || e)), setLoading(false)))
    return () => {
      live = false
    }
  }, [id, isNew])

  // Every edit marks the post dirty (email card images may need re-rendering).
  const setPost = (updater) => {
    setPostState((prev) => (typeof updater === 'function' ? updater(prev) : updater))
    setDirty(true)
    setSent('')
  }

  const setField = (k, v) => setPost((p) => ({ ...p, [k]: v }))
  const setEdition = (k, v) => setPost((p) => ({ ...p, edition: { ...p.edition, [k]: v } }))
  const setHero = (k, v) => setPost((p) => ({ ...p, hero: { ...p.hero, [k]: v } }))
  const setLetter = (k, v) => setPost((p) => ({ ...p, letter: { ...p.letter, [k]: v } }))
  const setFooter = (k, v) => setPost((p) => ({ ...p, footer: { ...p.footer, [k]: v } }))

  const updateSection = (sid, sec) =>
    setPost((p) => ({ ...p, sections: p.sections.map((s) => (s.id === sid ? sec : s)) }))
  const moveSection = (sid, d) =>
    setPost((p) => {
      const i = p.sections.findIndex((s) => s.id === sid)
      const j = i + d
      if (j < 0 || j >= p.sections.length) return p
      const next = p.sections.slice()
      ;[next[i], next[j]] = [next[j], next[i]]
      return { ...p, sections: next }
    })
  const deleteSection = (sid) =>
    setPost((p) => ({ ...p, sections: p.sections.filter((s) => s.id !== sid) }))
  const [openSectionId, setOpenSectionId] = useState(null)
  const addSection = (type) => {
    const sec = newSection(type)
    setOpenSectionId(sec.id) // expand the freshly added section, collapse the rest
    setPost((p) => ({ ...p, sections: withUniqueAnchors([...p.sections, sec]) }))
  }

  const canDownload = Boolean(post?.id && post?.assets?.editionStrip)

  async function handleSave({ publish } = {}) {
    try {
      setError('')
      setBusy('Saving…')
      let p = { ...post, sections: withUniqueAnchors(post.sections) }
      if (!p.slug) p.slug = slugify(p.title) || 'untitled'
      if (publish) p.status = 'published'
      const savedId = await savePost(p)
      p = { ...p, id: savedId }
      setBusy('Rendering email images…')
      const assets = await renderCards(savedId, p, { onProgress: (l) => setBusy(`Rendering ${l}…`) })
      p = { ...p, assets }
      await savePost(p)
      setPostState(p)
      setDirty(false)
      setBusy('')
      if (isNew) navigate(`/dashboard/${savedId}`, { replace: true })
    } catch (e) {
      setError(String(e?.message || e))
      setBusy('')
    }
  }

  function downloadEmail() {
    const html = buildEmailHtml(post, { baseUrl: DEFAULT_BASE })
    const blob = new Blob([html], { type: 'text/html' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${post.slug || 'email'}-email.html`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  async function sendTest() {
    try {
      setError('')
      setSent('')
      setBusy(`Sending test to ${recipient}…`)
      const html = buildEmailHtml(post, { baseUrl: DEFAULT_BASE })
      const stamp = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
      const subject = `${post.title || 'A More Perfect Union'} (test ${stamp})`
      await sendTestEmail({ to: recipient, subject, html })
      setSent(`Sent ✓ to ${recipient}`)
    } catch (e) {
      setError(String(e?.message || e))
    } finally {
      setBusy('')
    }
  }

  if (!firebaseReady)
    return <Centered>Firebase isn’t configured. Add your config to <code>.env</code> and restart.</Centered>
  if (loading || !post) return <Loading label="Loading editor…" />

  return (
    <div className="editor">
      <header className="editor-top">
        <Link to="/dashboard" className="back">← Posts</Link>
        <span className="spacer" />
        {busy && <span className="busy">{busy}</span>}
        {error && <span className="err">{error}</span>}
        {sent && !busy && <span className="busy">{sent}</span>}
        {dirty && !busy && <span className="muted">unsaved changes</span>}
        <button className="btn" disabled={!!busy} onClick={() => handleSave()}>Save draft</button>
        <button className="btn primary" disabled={!!busy} onClick={() => handleSave({ publish: true })}>
          {post.status === 'published' ? 'Save & republish' : 'Publish'}
        </button>
        <button
          className="btn"
          disabled={!canDownload}
          title={canDownload ? (dirty ? 'Save to refresh the email images first' : 'Download email HTML') : 'Save first to enable'}
          onClick={downloadEmail}
        >
          ⬇ Email HTML{dirty && canDownload ? ' *' : ''}
        </button>
        <span className="send-test">
          <select
            className="send-select"
            value={recipient}
            disabled={!!busy}
            title="Test recipient"
            onChange={(e) => setRecipient(e.target.value)}
          >
            {TEST_RECIPIENTS.map((addr) => (
              <option key={addr} value={addr}>{addr}</option>
            ))}
          </select>
          <button
            className="btn"
            disabled={!!busy}
            title={dirty ? 'Save first to include the latest email images' : `Send a test to ${recipient}`}
            onClick={sendTest}
          >
            ✉ Send test
          </button>
        </span>
      </header>

      <div className="editor-grid">
        <div className="editor-pane">
          {/* ── Post meta ── */}
          <Panel title="Edition details" defaultOpen>
            <label className="field">
              <span className="field-label">Title</span>
              <input className="field-input" value={post.title} onChange={(e) => setField('title', e.target.value)} />
            </label>
            <div className="meta-row">
              <label className="field tight">
                <span className="field-label">Slug (URL)</span>
                <input className="field-input" value={post.slug} placeholder={slugify(post.title)} onChange={(e) => setField('slug', slugify(e.target.value))} />
              </label>
              <label className="field tight">
                <span className="field-label">Status</span>
                <input className="field-input" value={post.status} readOnly />
              </label>
            </div>
            <label className="field">
              <span className="field-label">Email preheader</span>
              <textarea className="field-input" rows={2} value={post.preheader} onChange={(e) => setField('preheader', e.target.value)} />
            </label>
            <div className="meta-row">
              <label className="field tight">
                <span className="field-label">Edition eyebrow</span>
                <input className="field-input" value={post.edition.eyebrow} onChange={(e) => setEdition('eyebrow', e.target.value)} />
              </label>
              <label className="field tight">
                <span className="field-label">Edition label</span>
                <input className="field-input" value={post.edition.label} onChange={(e) => setEdition('label', e.target.value)} />
              </label>
              <label className="field tight">
                <span className="field-label">Issue date</span>
                <input className="field-input" value={post.edition.issueDate} onChange={(e) => setEdition('issueDate', e.target.value)} />
              </label>
            </div>
            <ImageUpload postId={post.id} value={post.hero.bannerUrl} onChange={(v) => setHero('bannerUrl', v)} label="Header banner" />
            <label className="field">
              <span className="field-label">Banner alt text</span>
              <input className="field-input" value={post.hero.bannerAlt} onChange={(e) => setHero('bannerAlt', e.target.value)} />
            </label>
          </Panel>

          {/* ── Letter ── */}
          <Panel title="Opening letter">
            <label className="field">
              <span className="field-label">Kicker</span>
              <input className="field-input" value={post.letter.kicker} onChange={(e) => setLetter('kicker', e.target.value)} />
            </label>
            <label className="field">
              <span className="field-label">Body</span>
              <RichText key={`${post.id || 'new'}-letter`} value={post.letter.html} onChange={(v) => setLetter('html', v)} />
            </label>
            <div className="meta-row">
              <label className="field tight">
                <span className="field-label">Signature name</span>
                <input className="field-input" value={post.letter.signName} onChange={(e) => setLetter('signName', e.target.value)} />
              </label>
              <label className="field tight">
                <span className="field-label">Signature role</span>
                <input className="field-input" value={post.letter.signRole} onChange={(e) => setLetter('signRole', e.target.value)} />
              </label>
            </div>
            <LetterEmail post={post} setLetter={setLetter} />
          </Panel>

          {/* ── Sections ── */}
          <div className="sections">
            <h3 className="sections-h">Sections</h3>
            {post.sections.map((s, i) => (
              <SectionEditor
                key={s.id}
                section={s}
                index={i}
                count={post.sections.length}
                defaultOpen={post.sections.length <= 1 || s.id === openSectionId}
                onChange={(sec) => updateSection(s.id, sec)}
                onMove={(d) => moveSection(s.id, d)}
                onDelete={() => deleteSection(s.id)}
              />
            ))}
            <AddSection onAdd={addSection} />
          </div>

          {/* ── Footer ── */}
          <Panel title="Footer">
            <div className="meta-row">
              <label className="field tight">
                <span className="field-label">Org name</span>
                <input className="field-input" value={post.footer.org} onChange={(e) => setFooter('org', e.target.value)} />
              </label>
              <label className="field tight">
                <span className="field-label">Tagline</span>
                <input className="field-input" value={post.footer.tagline} onChange={(e) => setFooter('tagline', e.target.value)} />
              </label>
            </div>
            <label className="field">
              <span className="field-label">Contact email</span>
              <input className="field-input" value={post.footer.email} onChange={(e) => setFooter('email', e.target.value)} />
            </label>
            <label className="field">
              <span className="field-label">Fine print</span>
              <textarea className="field-input" rows={2} value={post.footer.fine} onChange={(e) => setFooter('fine', e.target.value)} />
            </label>
          </Panel>
        </div>

        <div className="preview-pane">
          <Preview post={post} />
        </div>
      </div>
    </div>
  )
}

function LetterEmail({ post, setLetter }) {
  const e = post.letter.email
  const on = e != null
  const set = (k, v) => setLetter('email', { ...e, [k]: v })
  return (
    <div className="email-panel">
      <div className="email-panel-head">✉️ Email intro</div>
      <label className="checkbox">
        <input
          type="checkbox"
          checked={on}
          onChange={(ev) =>
            setLetter(
              'email',
              ev.target.checked
                ? { eyebrow: post.letter.kicker, head: '', html: post.letter.html, ctaText: 'Read the full edition online', note: '' }
                : null
            )
          }
        />
        Use a condensed intro in the email
      </label>
      {on && (
        <>
          <label className="field"><span className="field-label">Eyebrow</span>
            <input className="field-input" value={e.eyebrow || ''} onChange={(ev) => set('eyebrow', ev.target.value)} /></label>
          <label className="field"><span className="field-label">Headline</span>
            <input className="field-input" value={e.head || ''} onChange={(ev) => set('head', ev.target.value)} /></label>
          <label className="field"><span className="field-label">Body</span>
            <RichText key={`${post.id || 'new'}-letter-email`} value={e.html} onChange={(v) => set('html', v)} /></label>
          <div className="meta-row">
            <label className="field tight"><span className="field-label">Button text</span>
              <input className="field-input" value={e.ctaText || ''} onChange={(ev) => set('ctaText', ev.target.value)} /></label>
            <label className="field tight"><span className="field-label">Note under button</span>
              <input className="field-input" value={e.note || ''} onChange={(ev) => set('note', ev.target.value)} /></label>
          </div>
        </>
      )}
    </div>
  )
}

function AddSection({ onAdd }) {
  const [open, setOpen] = useState(false)
  const choose = (type) => {
    onAdd(type)
    setOpen(false)
  }
  return (
    <div className="add-section">
      <button className="btn add-section-toggle" onClick={() => setOpen((o) => !o)}>
        {open ? '× Close' : '+ Add section'}
      </button>
      {open && (
        <div className="section-picker">
          {SECTION_TYPES.map((t) => (
            <button key={t.type} type="button" className="tpl-card" onClick={() => choose(t.type)}>
              <SectionThumb type={t.type} />
              <span className="tpl-label">{t.label}</span>
              <span className="tpl-hint">{t.hint}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function Panel({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="panel">
      <button className="panel-head" onClick={() => setOpen(!open)}>
        <span>{open ? '▾' : '▸'}</span> {title}
      </button>
      {open && <div className="panel-body">{children}</div>}
    </div>
  )
}

function Centered({ children }) {
  return <div style={{ minHeight: '70vh', display: 'grid', placeItems: 'center', padding: 40, fontFamily: 'system-ui', textAlign: 'center' }}>{children}</div>
}
