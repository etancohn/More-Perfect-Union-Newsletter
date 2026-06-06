import RichText from './RichText'

// Renders a set of field descriptors (from postSchema) against a plain object
// value, calling onChange(newValue) on every edit. Supports nested `list`
// fields (repeatable groups) recursively.
export default function FieldRenderer({ fields, value, onChange, keyPrefix = '' }) {
  const set = (k, v) => onChange({ ...value, [k]: v })

  return (
    <div className="fields">
      {fields.map((f) => (
        <Field
          key={f.key}
          field={f}
          value={value?.[f.key]}
          onChange={(v) => set(f.key, v)}
          keyPrefix={`${keyPrefix}.${f.key}`}
        />
      ))}
    </div>
  )
}

function Field({ field, value, onChange, keyPrefix }) {
  const { kind, label } = field

  if (kind === 'list') return <ListField field={field} value={value || []} onChange={onChange} keyPrefix={keyPrefix} />

  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {kind === 'text' && (
        <input className="field-input" value={value || ''} onChange={(e) => onChange(e.target.value)} />
      )}
      {kind === 'textarea' && (
        <textarea className="field-input" rows={3} value={value || ''} onChange={(e) => onChange(e.target.value)} />
      )}
      {kind === 'lines' && (
        <textarea
          className="field-input"
          rows={3}
          value={Array.isArray(value) ? value.join('\n') : value || ''}
          onChange={(e) => onChange(e.target.value.split('\n'))}
        />
      )}
      {kind === 'rich' && (
        <RichText key={keyPrefix} value={value} onChange={onChange} />
      )}
    </label>
  )
}

function ListField({ field, value, onChange, keyPrefix }) {
  const items = value
  const blank = () => Object.fromEntries(field.item.map((sf) => [sf.key, sf.kind === 'lines' ? [] : '']))

  const update = (i, item) => onChange(items.map((it, j) => (j === i ? item : it)))
  const remove = (i) => onChange(items.filter((_, j) => j !== i))
  const add = () => onChange([...items, blank()])
  const move = (i, d) => {
    const j = i + d
    if (j < 0 || j >= items.length) return
    const next = items.slice()
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }

  return (
    <div className="list-field">
      <div className="field-label">{field.label}</div>
      {items.map((item, i) => (
        <div className="list-item" key={i}>
          <div className="list-item-bar">
            <span className="list-item-n">#{i + 1}</span>
            <span className="spacer" />
            <button type="button" className="mini" onClick={() => move(i, -1)} disabled={i === 0}>↑</button>
            <button type="button" className="mini" onClick={() => move(i, 1)} disabled={i === items.length - 1}>↓</button>
            <button type="button" className="mini danger" onClick={() => remove(i)}>✕</button>
          </div>
          <FieldRenderer
            fields={field.item}
            value={item}
            onChange={(v) => update(i, v)}
            keyPrefix={`${keyPrefix}.${i}`}
          />
        </div>
      ))}
      <button type="button" className="add-btn" onClick={add}>
        + {field.addLabel || 'Add item'}
      </button>
    </div>
  )
}
