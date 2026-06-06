import Reveal from '../components/Reveal'

export default function Resources() {
  return (
    <section className="resources" id="resources">
      <div className="wrap">
        <Reveal className="sec-head">
          <span className="sec-num">02</span>
          <h2 className="sec-title">Resources &amp; Opportunities for Partners</h2>
          <span className="rule" />
        </Reveal>
        <Reveal as="p" className="lead" delay={1} style={{ marginBottom: '30px' }}>
          Five ways to take action right now — from ready-to-use toolkits to grant funding and
          shared infrastructure.
        </Reveal>
        <div className="take">
          <Reveal className="card">
            <div className="badge">A</div>
            <div>
              <h4>Access our toolkits</h4>
              <p>
                The <a href="#resources">Communications &amp; Action Toolkit</a> and{' '}
                <a href="#resources">Election Official Outreach Toolkit</a> are designed to help you
                take action — messaging, graphics, templates, and outreach resources to engage your
                community and build trusted relationships.
              </p>
            </div>
          </Reveal>
          <Reveal className="card">
            <div className="badge">B</div>
            <div>
              <h4>Apply for Ignition Grants</h4>
              <p>
                We're awarding up to <strong>$125,000</strong> (up to $3K per organization) in
                Ignition Grants to organizations in the Jewish Partnership for Democracy to support
                efforts to protect elections.
                <span className="grant-tag">Up to $3,000 per organization</span>
              </p>
            </div>
          </Reveal>
          <Reveal className="card">
            <div className="badge">C</div>
            <div>
              <h4>Use the JPD Election Connection Google Group</h4>
              <p>
                Stay connected with partners and our team through our central hub for election
                updates, resources, events, and discussion. Email{' '}
                <a href="#resources">moreply@groups.google.com</a> to join.
              </p>
            </div>
          </Reveal>
          <Reveal className="card">
            <div className="badge">D</div>
            <div>
              <h4>Opt in to our shared Google Calendar</h4>
              <p>
                Partners can access a shared Faith in Fair Elections calendar featuring upcoming
                events and election-related programming, tied right into your workflow.
              </p>
            </div>
          </Reveal>
          <Reveal className="card">
            <div className="badge">E</div>
            <div>
              <h4>Use our Election Intern</h4>
              <p>
                Our elections intern will build a detailed tracker of local election information and
                ways to get involved in election protection efforts locally for partners to access.
                Email <a href="#resources">info@jewishdemocracy.org</a> to learn more.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
