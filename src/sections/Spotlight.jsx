import Reveal from '../components/Reveal'

export default function Spotlight() {
  return (
    <section className="spotlight" id="spotlight">
      <div className="wrap">
        <Reveal className="sec-head">
          <span className="sec-num">04</span>
          <h2 className="sec-title">Partner Spotlight</h2>
          <span className="rule" />
        </Reveal>
        <Reveal className="spot-card" delay={1}>
          <div>
            <div className="where">Pittsburgh, PA</div>
            <div className="org">NCJW Pittsburgh</div>
          </div>
          <p>
            This spring, NCJW Pittsburgh helped more than 100 Pittsburgh-area high school students
            cast their first ballots through its first Vote Block Party. Newly eligible voters were
            able to complete and submit mail-in ballots at an official satellite voting location
            before joining a downtown block party featuring music, food, student speakers, elected
            officials, and community organizations.
          </p>
          <div className="spot-stats">
            <div className="s">
              <div className="num">100+</div>
              <div className="lbl">first-time voters</div>
            </div>
            <div className="s">
              <div className="num">1st</div>
              <div className="lbl">Vote Block Party</div>
            </div>
          </div>
          <p>
            <a href="#spotlight">Read about this amazing initiative →</a>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
