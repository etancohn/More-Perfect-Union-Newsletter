import { useState } from 'react'
import FieldRenderer from './FieldRenderer'
import SectionThumb from './SectionThumb'
import { TYPE_MAP } from '../lib/postSchema'

// How this section type shows up in the email — drives the header badge.
const emailStatus = (def) =>
  def.emailCard ? { label: 'card image', cls: 'card' }
    : def.emailFields ? { label: 'in email', cls: 'in' }
      : { label: 'web only', cls: 'web' }

// Edits one content section: structural meta, web content, and an optional
// email-specific override.
export default function SectionEditor({ section, index, count, defaultOpen = true, onChange, onMove, onDelete }) {
  const def = TYPE_MAP[section.type]
  const [open, setOpen] = useState(defaultOpen)
  if (!def) return null

  const summary = section.web?.title || section.web?.heading || section.tocTitle || ''
  const email = emailStatus(def)

  const setMeta = (k, v) => onChange({ ...section, [k]: v })
  const setWeb = (web) => onChange({ ...section, web })
  const setEmail = (email) => onChange({ ...section, email })

  const toggleEmailOverride = (on) =>
    setEmail(on ? (def.emailDefaults ? def.emailDefaults(section.web) : { ...section.web }) : null)

  return (
    <div className="section-card">
      <div className="section-bar">
        <button className="section-head" onClick={() => setOpen(!open)} title={open ? 'Collapse' : 'Expand'}>
          <SectionThumb type={section.type} size="icon" />
          <span className="section-type">{def.label}</span>
          {summary && <span className="section-summary">{summary}</span>}
        </button>
        <span className={`email-status ${email.cls}`}>{email.label}</span>
        <span className="spacer" />
        <button className="mini" onClick={() => onMove(-1)} disabled={index === 0} title="Move up">↑</button>
        <button className="mini" onClick={() => onMove(1)} disabled={index === count - 1} title="Move down">↓</button>
        <button className="mini" onClick={() => setOpen(!open)} title="Collapse">{open ? '▾' : '▸'}</button>
        <button className="mini danger" onClick={onDelete} title="Delete section">✕</button>
      </div>

      {open && (
        <div className="section-body">
          <div className="meta-row">
            <label className="field tight">
              <span className="field-label">Anchor (URL #)</span>
              <input className="field-input" value={section.anchor || ''} onChange={(e) => setMeta('anchor', e.target.value)} />
            </label>
            <label className="field tight">
              <span className="field-label">TOC title (optional)</span>
              <input className="field-input" value={section.tocTitle || ''} onChange={(e) => setMeta('tocTitle', e.target.value)} />
            </label>
            <label className="field tight">
              <span className="field-label">TOC subtitle</span>
              <input className="field-input" value={section.tocSub || ''} onChange={(e) => setMeta('tocSub', e.target.value)} />
            </label>
          </div>

          <FieldRenderer fields={def.fields} value={section.web} onChange={setWeb} keyPrefix={`${section.id}.web`} />

          <div className="email-panel">
            <div className="email-panel-head">✉️ Email version</div>
            {!def.emailFields && !def.emailCard && (
              <p className="muted">This section type is not included in the email.</p>
            )}
            {def.emailCard && (
              <p className="muted">
                Rendered in the email as a dark-mode-safe card image, generated from the fields above
                on save.
              </p>
            )}
            {def.emailFields && (
              <>
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={section.email != null}
                    onChange={(e) => toggleEmailOverride(e.target.checked)}
                  />
                  Customize the email version (shorter copy that links back to this section)
                </label>
                {section.email == null ? (
                  <p className="muted">
                    The email uses an auto-generated condensed version of the web content above.
                  </p>
                ) : (
                  <FieldRenderer
                    fields={def.emailFields}
                    value={section.email}
                    onChange={setEmail}
                    keyPrefix={`${section.id}.email`}
                  />
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
