import Reveal from '../components/Reveal'

const EVENTS = [
  {
    mo: 'Jun',
    day: '17',
    time: ['12:00 PM ET', '9:00 AM PT'],
    tag: 'Brewing Community',
    title: 'Virtual Partner Forum',
    body: 'A chance to connect with Jewish leaders and community members across the network to discuss current challenges, exchange ideas, and plan next steps to inform civic engagement and programming. And your coffee is on us!',
  },
  {
    mo: 'Jun',
    day: '24',
    time: ['1:00 PM ET', '10:00 AM PT'],
    tag: 'Faith in Fair Elections',
    title: 'Ignition Grants Info Session',
    body: "Learn more about the grants available as part of Faith in Fair Elections. We'll explore ideas, better understand the grant process, and discuss the types of projects we're excited to support. Plenty of time for Q&A.",
  },
  {
    mo: 'Jul',
    day: '21',
    time: ['1:00 PM ET', '10:00 AM PT'],
    tag: 'High Holy Days',
    title: 'Drashing Democracy 2026: Reflection during the High Holidays',
    body: 'As the High Holy Days approach, join leading rabbis and explore democracy and what it means for American Jews today. A 90-minute webinar to find themes for your High Holy Day sermons.',
  },
]

export default function Events() {
  return (
    <section className="events" id="events">
      <div className="wrap">
        <Reveal className="sec-head">
          <span className="sec-num">03</span>
          <h2 className="sec-title">Featured Events</h2>
          <span className="rule" />
        </Reveal>
        {EVENTS.map((e, i) => (
          <Reveal className="ev" key={i}>
            <div className="date">
              <span className="mo">{e.mo}</span>
              <span className="day">{e.day}</span>
              <span className="time">
                {e.time[0]}
                <br />
                {e.time[1]}
              </span>
            </div>
            <div className="body">
              <span className="tag">{e.tag}</span>
              <h4>{e.title}</h4>
              <p>{e.body}</p>
              <a className="reg" href="#events">
                Register Now <span className="arr">→</span>
              </a>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
