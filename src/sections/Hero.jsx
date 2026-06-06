export default function Hero({ data = {}, edition = {}, armed = false, entered = false }) {
  // armed: held hidden beneath the envelope overlay (no flash on hand-off).
  // entered: the envelope has dissolved — play the entrance. Neither → static.
  const cls = entered ? 'hero is-entering' : armed ? 'hero is-armed' : 'hero'
  return (
    <header className={cls}>
      <img
        className="hero-banner"
        src={data.bannerUrl || '/assets/header-banner.png'}
        alt={data.bannerAlt || 'A More Perfect Union'}
      />
      <div className="hero-strip">
        <span className="edition-pill">
          <span className="dot" />
          {edition.label}
        </span>
        <div className="hero-meta">
          <span className="eyebrow">{edition.eyebrow}</span>
          <span className="meta-sep" aria-hidden="true">
            ·
          </span>
          <span className="issue-date">{edition.issueDate}</span>
        </div>
      </div>
    </header>
  )
}
