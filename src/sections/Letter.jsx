import Reveal from '../components/Reveal'

export default function Letter() {
  return (
    <section className="letter" id="letter">
      <Reveal className="wrap">
        <p className="kicker">From the Vice President</p>
        <p className="drop">
          It's go time! In this special 2026 Midterm Elections edition, we're excited to officially
          launch <a href="#fair-elections">Faith in Fair Elections</a> — a Jewish community strategy
          to ensure free, fair, safe, and accessible elections this year.
        </p>
        <p>
          Below, you'll learn about five nonpartisan, proven-effective actions that Jewish
          organizations can take to preserve the integrity of our elections — including toolkits,
          programs, connections, and funding. We are so grateful for your partnership in protecting
          and strengthening democracy. We are excited to do this work together.
        </p>
        <div className="sig">
          <div className="name">Jeremy Bannett</div>
          <div className="role">Vice President, Programs &amp; Partnerships</div>
        </div>
      </Reveal>
    </section>
  )
}
