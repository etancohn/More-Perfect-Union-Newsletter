import Reveal from '../components/Reveal'
import Rich from '../post/Rich'

export default function Letter({ data }) {
  return (
    <section className="letter" id="letter">
      <div className="wrap">
        <Reveal as="p" className="kicker">
          {data.kicker}
        </Reveal>
        <Reveal delay={1}>
          <Rich className="letter-body" html={data.html} />
        </Reveal>
        {(data.signName || data.signRole) && (
          <Reveal className="sig" delay={2}>
            <div className="name">{data.signName}</div>
            <div className="role">{data.signRole}</div>
          </Reveal>
        )}
      </div>
    </section>
  )
}
