import Reveal from '../components/Reveal'
import Rich from '../post/Rich'
import SecHead from '../post/SecHead'

export default function Happenings({ data, num = '05', anchor = 'happenings' }) {
  const cards = data.cards || []
  return (
    <section className="happenings" id={anchor}>
      <div className="wrap">
        <SecHead num={num} title={data.title} />
        <Reveal delay={1} style={{ marginBottom: '30px' }}>
          <Rich className="lead" html={data.lead} />
        </Reveal>
        <div className="happ-grid">
          {cards.map((c, i) => (
            <Reveal className="happ" key={i}>
              <div className="org">
                <span className="mark">{c.mark}</span>
                {c.org}
              </div>
              <h4>{c.title}</h4>
              <p>{c.body}</p>
              <a className="more" href={c.href || '#' + anchor}>
                {c.cta} <span className="arr">→</span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
