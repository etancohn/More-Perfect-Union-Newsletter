import Reveal from '../components/Reveal'
import Rich from '../post/Rich'
import SecHead from '../post/SecHead'

export default function Spotlight({ data, num = '04', anchor = 'spotlight' }) {
  const stats = data.stats || []
  return (
    <section className="spotlight" id={anchor}>
      <div className="wrap">
        <SecHead num={num} title={data.title} />
        <Reveal className="spot-card" delay={1}>
          <div>
            {data.where && <div className="where">{data.where}</div>}
            <div className="org">{data.org}</div>
          </div>
          <Rich html={data.body} />
          {stats.length > 0 && (
            <div className="spot-stats">
              {stats.map((s, i) => (
                <div className="s" key={i}>
                  <div className="num">{s.num}</div>
                  <div className="lbl">{s.label}</div>
                </div>
              ))}
            </div>
          )}
          {data.ctaText && (
            <p>
              <a href={'#' + anchor}>{data.ctaText} →</a>
            </p>
          )}
        </Reveal>
      </div>
    </section>
  )
}
