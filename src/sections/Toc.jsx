import Reveal from '../components/Reveal'

const ITEMS = [
  ['01', '#fair-elections', 'Faith in Fair Elections', 'Our 2026 launch & five ways to get involved'],
  ['02', '#resources', 'Resources & Opportunities', 'Toolkits, grants, and shared infrastructure'],
  ['03', '#events', 'Featured Events', 'Three gatherings this summer'],
  ['04', '#spotlight', 'Partner Spotlight', "NCJW Pittsburgh's Vote Block Party"],
  ['05', '#happenings', 'Partner Happenings', 'Campaigns & grants across the network'],
  ['06', '#faq', 'Common Questions', 'Everything partners ask, answered'],
  ['07', '#game', 'Question of the Day', 'Test your civics — daily challenge'],
]

export default function Toc() {
  return (
    <section className="toc">
      <Reveal className="wrap">
        <h2>In this edition</h2>
        <div className="toc-grid">
          {ITEMS.map(([n, href, title, sub]) => (
            <a className="toc-item" href={href} key={n}>
              <span className="n">{n}</span>
              <span className="t">
                {title}
                <span>{sub}</span>
              </span>
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
