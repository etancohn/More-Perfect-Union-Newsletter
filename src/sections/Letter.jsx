import Reveal from '../components/Reveal'

export default function Letter() {
  return (
    <section className="letter" id="letter">
      <div className="wrap">
        <Reveal as="p" className="kicker">
          From the Vice President
        </Reveal>
        <Reveal as="p" className="drop" delay={1}>
          It's go time! In this special 2026 Midterm Elections edition, we're excited to officially
          launch <a href="#fair-elections">Faith in Fair Elections</a> — a Jewish community strategy
          to ensure free, fair, safe, and accessible elections this year.
        </Reveal>
        <Reveal as="p" delay={2}>
          Below, you'll learn about five nonpartisan, proven-effective actions that Jewish
          organizations can take to preserve the integrity of our elections — including toolkits,
          programs, connections, and funding. We are so grateful for your partnership in protecting
          and strengthening democracy. We are excited to do this work together.
        </Reveal>
        <Reveal className="sig" delay={3}>
          <div className="name">Jeremy Bannett</div>
          <div className="role">Vice President, Programs &amp; Partnerships</div>
        </Reveal>
      </div>
    </section>
  )
}
