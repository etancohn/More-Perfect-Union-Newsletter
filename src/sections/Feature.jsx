import { useState } from 'react'
import Reveal from '../components/Reveal'
import Rich from '../post/Rich'
import SecHead from '../post/SecHead'

export default function Feature({ data, num = '01', anchor = 'fair-elections' }) {
  const [playLabel, setPlayLabel] = useState('Watch the Kick-Off')
  const ways = data.ways || []

  return (
    <section className="feature" id={anchor}>
      <div className="wrap">
        <SecHead num={num} title={data.title} />
        <Reveal as="p" className="announce" delay={1}>
          <i>{data.announceItalic}</i>
          <b>{data.announceBold}</b>
        </Reveal>
        <Reveal className="video" delay={1} role="img" aria-label={`${data.title} kickoff video`}>
          <div className="frame" />
          <span className="label">{data.videoLabel}</span>
          <button className="play" onClick={() => setPlayLabel('Kickoff video — coming soon')}>
            <span className="tri" />
            <span>{playLabel}</span>
          </button>
        </Reveal>
        <Reveal delay={2} style={{ marginTop: '26px' }}>
          <Rich className="lead" html={data.lead} />
        </Reveal>

        <div className="ways">
          {ways.map((w, i) => (
            <Reveal className="way" key={i}>
              <span className="idx">{i + 1}</span>
              <div>
                <h4>{w.title}</h4>
                <p>{w.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        {data.ctaText && (
          <Reveal className="btn-row">
            <a className="btn crimson" href={data.ctaHref || '#'}>
              {data.ctaText} <span className="arr">→</span>
            </a>
          </Reveal>
        )}
      </div>
    </section>
  )
}
