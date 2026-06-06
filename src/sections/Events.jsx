import Reveal from '../components/Reveal'
import SecHead from '../post/SecHead'

export default function Events({ data, num = '03', anchor = 'events' }) {
  const events = data.events || []
  return (
    <section className="events" id={anchor}>
      <div className="wrap">
        <SecHead num={num} title={data.title} />
        {events.map((e, i) => (
          <Reveal className="ev" key={i}>
            <div className="date">
              <span className="mo">{e.mo}</span>
              <span className="day">{e.day}</span>
              <span className="time">
                {e.timeET}
                <br />
                {e.timePT}
              </span>
            </div>
            <div className="body">
              <span className="tag">{e.tag}</span>
              <h4>{e.title}</h4>
              <p>{e.body}</p>
              <a className="reg" href={'#' + anchor}>
                Register Now <span className="arr">→</span>
              </a>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
