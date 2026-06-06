import { useState } from 'react'
import FieldRenderer from './FieldRenderer'
import { TYPE_MAP } from '../lib/postSchema'

// Edits one content section: structural meta, web content, and an optional
// email-specific override.
export default function SectionEditor({ section, index, count, onChange, onMove, onDelete }) {
  const def = TYPE_MAP[section.type]
  const [open, setOpen] = useState(true)
  if (!def) return null

  const setMeta = (k, v) => onChange({ ...section, [k]: v })
  const setWeb = (web) => onChange({ ...section, web })
  const setEmail = (email) => onChange({ ...section, email })

  const toggleEmailOverride = (on) =>
    setEmail(on ? (def.emailDefaults ? def.emailDefaults(section.web) : { ...section.web }) : null)

  return (
    <div className="section-card">
      <div className="section-bar">
        <span className="section-type">{def.label}</span>
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
