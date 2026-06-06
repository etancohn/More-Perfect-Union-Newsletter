export default function Footer({ data = {} }) {
  return (
    <footer>
      <div className="wrap">
        <div className="lock">
          <b>{data.org || 'A MORE PERFECT UNION'}</b>
        </div>
        <p>{data.tagline}</p>
        <div className="socials">
          <a href="#" aria-label="Email">
            @
          </a>
          <a href="#" aria-label="Web">
            ↗
          </a>
          <a href="#" aria-label="Share">
            ↗
          </a>
        </div>
        <p>
          Questions? Email <a href={`mailto:${data.email}`}>{data.email}</a>
        </p>
        <p className="fine">{data.fine}</p>
      </div>
    </footer>
  )
}
