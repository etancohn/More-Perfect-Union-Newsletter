import Reveal from '../components/Reveal'

const CARDS = [
  {
    mark: 'N',
    org: 'NCJW',
    title: 'Vote Your Values | 2026',
    body: 'A campaign focused on helping people prepare to vote, protecting voter rights, and mobilizing nonpartisan voter engagement across the country — toolkits, voter IDs, letter-writing templates, and more.',
    cta: 'Read more',
  },
  {
    mark: 'R',
    org: 'RAC',
    title: 'Every Voice, Every Vote | 2026',
    body: "The Reform Movement's 2026 Every Voice, Every Vote campaign and the many ways you can take action — sending postcards to voters, educational trainings, and related conversations.",
    cta: 'Watch the launch',
  },
  {
    mark: 'R',
    org: 'Repair the World',
    title: 'America250 Grants | Jun 10 – Jul 10',
    body: '$250 micro grants, powered by Repair the World, are available for Jewish Service Corps Alliance (JSA) organizations running Jewish service projects in honor of America turning 250.',
    cta: 'Apply by July 10',
  },
]

export default function Happenings() {
  return (
    <section className="happenings" id="happenings">
      <div className="wrap">
        <Reveal className="sec-head">
          <span className="sec-num">05</span>
          <h2 className="sec-title">Partner Happenings</h2>
          <span className="rule" />
        </Reveal>
        <Reveal as="p" className="lead" delay={1} style={{ marginBottom: '30px' }}>
          Amplifying the democracy-related work and impact of our partners across the network.
        </Reveal>
        <div className="happ-grid">
          {CARDS.map((c, i) => (
            <Reveal className="happ" key={i}>
              <div className="org">
                <span className="mark">{c.mark}</span>
                {c.org}
              </div>
              <h4>{c.title}</h4>
              <p>{c.body}</p>
              <a className="more" href="#happenings">
                {c.cta} <span className="arr">→</span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
