import Reveal from '../components/Reveal'
import Rich from '../post/Rich'
import SecHead from '../post/SecHead'

// General-purpose titled rich-text block. Reuses the `feature` container so the
// prose inherits the same width/typography as the rest of the page.
export default function Prose({ data, num, anchor = 'section' }) {
  return (
    <section className="feature" id={anchor}>
      <div className="wrap">
        <SecHead num={num} title={data.title} />
        <Reveal delay={1}>
          <Rich className="lead" html={data.html} />
        </Reveal>
      </div>
    </section>
  )
}
