// Tiny CSS-only schematic of each section type's layout. Used both as the large
// tile in the "add section" picker and as a small icon in section card headers.
// Purely presentational — no real section component, no newsletter styles, no
// animations. Greys stand in for text; the brand gradient (`.is-grad`) marks the
// branded/visual blocks so each type reads at a glance.

const THUMBS = {
  feature: (
    <>
      <div className="thumb-bar w60" />
      <div className="thumb-video is-grad" />
      <div className="thumb-num-row"><span className="thumb-num">1</span><div className="thumb-line w80" /></div>
      <div className="thumb-num-row"><span className="thumb-num">2</span><div className="thumb-line w60" /></div>
    </>
  ),
  cards: (
    <>
      <div className="thumb-line w80" />
      <div className="thumb-cards">
        <div className="thumb-card"><span className="thumb-badge is-grad">A</span><div className="thumb-line w70" /></div>
        <div className="thumb-card"><span className="thumb-badge is-grad">B</span><div className="thumb-line w70" /></div>
      </div>
    </>
  ),
  events: (
    <>
      <div className="thumb-bar w50" />
      <div className="thumb-event"><span className="thumb-chip is-grad">17</span><div className="thumb-lines"><div className="thumb-line w80" /><div className="thumb-line w50" /></div></div>
      <div className="thumb-event"><span className="thumb-chip is-grad">24</span><div className="thumb-lines"><div className="thumb-line w70" /><div className="thumb-line w40" /></div></div>
    </>
  ),
  spotlight: (
    <div className="thumb-spot is-grad">
      <div className="thumb-line light w50" />
      <div className="thumb-line light w80" />
      <div className="thumb-stats"><span className="thumb-stat">100+</span><span className="thumb-stat">5k</span></div>
    </div>
  ),
  happenings: (
    <>
      <div className="thumb-bar w50" />
      <div className="thumb-grid">
        <div className="thumb-cell"><span className="thumb-dot is-grad" /><div className="thumb-line w80" /></div>
        <div className="thumb-cell"><span className="thumb-dot is-grad" /><div className="thumb-line w80" /></div>
        <div className="thumb-cell"><span className="thumb-dot is-grad" /><div className="thumb-line w80" /></div>
      </div>
    </>
  ),
  accordion: (
    <>
      <div className="thumb-bar w50" />
      <div className="thumb-q"><div className="thumb-line w70" /><span className="thumb-chev">›</span></div>
      <div className="thumb-q"><div className="thumb-line w60" /><span className="thumb-chev">›</span></div>
      <div className="thumb-q"><div className="thumb-line w70" /><span className="thumb-chev">›</span></div>
    </>
  ),
  qotd: (
    <div className="thumb-quiz is-grad">
      <div className="thumb-line light w50" />
      <div className="thumb-line light w80" />
      <span className="thumb-pill">▶ Play</span>
    </div>
  ),
  prose: (
    <>
      <div className="thumb-bar w60" />
      <div className="thumb-line w90" />
      <div className="thumb-line w80" />
      <div className="thumb-line w70" />
    </>
  ),
}

export default function SectionThumb({ type, size = 'tile' }) {
  return (
    <div className={`thumb ${size === 'icon' ? 'icon' : ''}`} aria-hidden="true">
      {THUMBS[type] || <div className="thumb-line w70" />}
    </div>
  )
}
