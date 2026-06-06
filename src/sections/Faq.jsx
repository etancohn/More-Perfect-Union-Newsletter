import { useState } from 'react'
import Reveal from '../components/Reveal'
import Rich from '../post/Rich'
import SecHead from '../post/SecHead'

export default function Faq({ data, num = '06', anchor = 'faq' }) {
  const [open, setOpen] = useState(-1)
  const items = data.items || []

  return (
    <section className="faq" id={anchor}>
      <div className="wrap">
        <SecHead num={num} title={data.title} />
        {data.lead && (
          <Reveal as="p" className="lead" delay={1} style={{ marginBottom: '14px' }}>
            {data.lead}
          </Reveal>
        )}
        <Reveal className="acc" delay={1}>
          {items.map((it, i) => {
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
                  <Rich className="acc-a-in" html={it.a} />
                </div>
              </div>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}
