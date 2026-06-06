import { useState } from 'react'
import Reveal from '../components/Reveal'

const ITEMS = [
  {
    q: 'What does it mean that this work is “nonpartisan”?',
    a: (
      <p>
        We don't support candidates, parties, or partisan outcomes. Faith in Fair Elections protects
        the <i>process</i> — making sure every eligible voter can cast a ballot safely and have it
        counted. That commitment is what lets people across the political spectrum work side by side.
      </p>
    ),
  },
  {
    q: 'Do I need legal or election experience to take part?',
    a: (
      <p>
        Not at all. Poll workers and poll chaplains receive full training before Election Day, and
        most roles ask only for a willingness to show up and be a calm, supportive presence. Legal
        support roles are reserved for licensed attorneys — but they're just one of five ways to
        help.
      </p>
    ),
  },
  {
    q: 'Which states are the “key states” for poll chaplains?',
    a: (
      <p>
        We're concentrating chaplain capacity in nine priority states where a supportive presence at
        the polls matters most this cycle. The current list shifts as the calendar develops —{' '}
        <a href="#resources">reach out to our team</a> and we'll point you to where you're needed.
      </p>
    ),
  },
  {
    q: 'How do Ignition Grants work?',
    a: (
      <p>
        Organizations in the Jewish Partnership for Democracy can apply for up to{' '}
        <b style={{ color: 'var(--ink)' }}>$3,000</b> to support election-protection projects, drawn
        from a total pool of $125,000. The application is short and reviewed on a rolling basis —
        join the <a href="#events">June 24 info session</a> to walk through it with us.
      </p>
    ),
  },
  {
    q: 'How much time does getting involved actually take?',
    a: (
      <p>
        As little as a single Election Day shift, or as much as ongoing relationship-building with
        local officials — it's entirely up to your capacity. Tell us what you can give and we'll
        match you to a role that fits.
      </p>
    ),
  },
  {
    q: 'How do I bring this to my congregation or organization?',
    a: (
      <p>
        Start with our ready-to-use <a href="#resources">toolkits</a>, join the JPD Election
        Connection group for updates and peer ideas, and lean on our team for support. Many partners
        begin with one event or conversation and build from there.
      </p>
    ),
  },
]

export default function Faq() {
  const [open, setOpen] = useState(-1)

  return (
    <section className="faq" id="faq">
      <div className="wrap">
        <Reveal className="sec-head">
          <span className="sec-num">06</span>
          <h2 className="sec-title">Common Questions</h2>
          <span className="rule" />
        </Reveal>
        <Reveal as="p" className="lead" delay={1} style={{ marginBottom: '14px' }}>
          Everything partners ask before getting involved — answered.
        </Reveal>
        <Reveal className="acc" delay={1}>
          {ITEMS.map((it, i) => {
            const isOpen = open === i
            return (
              <div className={`acc-item${isOpen ? ' open' : ''}`} key={i}>
                <button
                  className="acc-q"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <span>{it.q}</span>
                  <span className="acc-ic" aria-hidden="true" />
                </button>
                <div className="acc-a">
                  <div className="acc-a-in">{it.a}</div>
                </div>
              </div>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}
