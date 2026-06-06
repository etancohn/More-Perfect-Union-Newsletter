export default function Hero({ armed = false, entered = false }) {
  // armed: held hidden beneath the envelope overlay (no flash on hand-off).
  // entered: the envelope has dissolved — play the entrance. Neither → static.
  const cls = entered ? 'hero is-entering' : armed ? 'hero is-armed' : 'hero'
  return (
    <header className={cls}>
      <img
        className="hero-banner"
        src="/assets/header-banner.png"
        alt="A More Perfect Union — The Jewish Partnership for Democracy"
      />
      <div className="hero-strip">
        <span className="edition-pill">
          <span className="dot" />
          Special Election Edition
        </span>
        <div className="hero-meta">
          <span className="eyebrow">Partner Newsletter</span>
          <span className="meta-sep" aria-hidden="true">·</span>
          <span className="issue-date">2026 Midterm Elections</span>
        </div>
      </div>
    </header>
  )
}
