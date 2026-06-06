// Renders stored rich-text HTML (from the TipTap editor / seed) into the page.
// Wrapped in `.rt` so existing descendant selectors (.take p, .spot-card p,
// .acc-a p, .lead, .letter p …) still style the inner <p>/<a>/<b> exactly as
// the original hand-written JSX did. See the `.rt` rules in styles.css.
export default function Rich({ html, className = '', as: Tag = 'div', ...rest }) {
  const cls = ['rt', className].filter(Boolean).join(' ')
  return <Tag className={cls} dangerouslySetInnerHTML={{ __html: html || '' }} {...rest} />
}
