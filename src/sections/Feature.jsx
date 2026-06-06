import { useState } from 'react'
import Reveal from '../components/Reveal'

const WAYS = [
  ['Serving as a Poll Worker', 'Trained community members help elections run smoothly and safely by serving as poll workers on Election Day.'],
  ['Serving as a Poll Chaplain in key states', 'Poll chaplains provide a calming, supportive presence and help de-escalate tensions at polling locations in nine key states.'],
  ['Providing legal support to election officials', 'Pro bono attorneys support election officials who are experiencing threats, doxxing, or harassment.'],
  ['Building trusted relationships with election officials', 'Community members show support for good-faith public servants, learn more, and share how elections are run.'],
  ['Being a trusted messenger', 'Community members and leaders strengthen public confidence and trust in elections through intentional messaging.'],
]

export default function Feature() {
  const [playLabel, setPlayLabel] = useState('Watch the Kick-Off')

  return (
    <section className="feature" id="fair-elections">
      <div className="wrap">
        <Reveal className="sec-head">
          <span className="sec-num">01</span>
          <h2 className="sec-title">Faith in Fair Elections</h2>
          <span className="rule" />
        </Reveal>
        <Reveal as="p" className="announce" delay={1}>
          <i>Announcing:</i>
          <b>Our 2026 community strategy</b>
        </Reveal>
        <Reveal
          className="video"
          delay={1}
          role="img"
          aria-label="Faith in Fair Elections kickoff video"
        >
          <div className="frame" />
          <span className="label">FAIR · ELECTIONS</span>
          <button className="play" onClick={() => setPlayLabel('Kickoff video — coming soon')}>
            <span className="tri" />
            <span>{playLabel}</span>
          </button>
        </Reveal>
        <Reveal as="p" className="lead" delay={2} style={{ marginTop: '26px' }}>
          Our <a href="#fair-elections">Faith in Fair Elections</a> campaign is a Jewish community
          strategy to protect democracy at the midterms, through free, fair, safe, and accessible
          elections. It centers on five key ways the Jewish community can get involved:
        </Reveal>

        <div className="ways">
          {WAYS.map(([title, body], i) => (
            <Reveal className="way" key={i}>
              <span className="idx">{i + 1}</span>
              <div>
                <h4>{title}</h4>
                <p>{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="btn-row">
          <a className="btn crimson" href="#resources">
            Learn More &amp; Get Involved <span className="arr">→</span>
          </a>
        </Reveal>
      </div>
    </section>
  )
}
