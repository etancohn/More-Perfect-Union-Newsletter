import Reveal from '../components/Reveal'
import Rich from '../post/Rich'
import SecHead from '../post/SecHead'

// Renders the `cards` section type (lettered badge cards). Class names kept as
// `resources`/`take` so the original styling applies.
export default function Resources({ data, num = '02', anchor = 'resources' }) {
  const cards = data.cards || []
  return (
    <section className="resources" id={anchor}>
      <div className="wrap">
        <SecHead num={num} title={data.title} />
        <Reveal delay={1} style={{ marginBottom: '30px' }}>
          <Rich className="lead" html={data.lead} />
        </Reveal>
        <div className="take">
          {cards.map((c, i) => (
            <Reveal className="card" key={i}>
              <div className="badge">{c.badge}</div>
              <div>
                <h4>{c.title}</h4>
                <Rich html={c.body} />
                {c.tag && <span className="grant-tag">{c.tag}</span>}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
