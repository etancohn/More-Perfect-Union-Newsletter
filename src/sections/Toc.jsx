import Reveal from '../components/Reveal'

// `items`: [{ n, href, title, sub }] derived from the post's sections.
export default function Toc({ items = [], heading = 'In this edition' }) {
  return (
    <section className="toc">
      <Reveal className="wrap">
        <h2>{heading}</h2>
        <div className="toc-grid">
          {items.map((it) => (
            <a className="toc-item" href={it.href} key={it.n}>
              <span className="n">{it.n}</span>
              <span className="t">
                {it.title}
                {it.sub && <span>{it.sub}</span>}
              </span>
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
