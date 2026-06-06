// Turn the constrained rich-text HTML we store (p / a / b / strong / i / em /
// ul / ol / li) into email-safe HTML with inline styles, and absolutize
// in-page links (#anchor) against the post's public URL.
//
// Trusted input (authored in the dashboard) — not a general sanitizer.

const COLORS = {
  body: '#54545f',
  link: '#b72e3f',
  ink: '#23232b',
  indigo: '#36357f',
}

// Resolve an href: "#anchor" → linkBase + "#anchor"; everything else unchanged.
function resolveHref(href, linkBase) {
  if (!href) return href
  if (href.startsWith('#')) return (linkBase || '') + href
  return href
}

export function inlineRich(html, opts = {}) {
  const {
    linkBase = '',
    strong = COLORS.ink,
    pStyle = `font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:${COLORS.body};margin:0 0 12px;`,
  } = opts

  let out = String(html || '')

  // links → crimson bold, absolutized
  out = out.replace(/<a\b[^>]*?href=["']([^"']*)["'][^>]*>/gi, (_m, href) => {
    const h = resolveHref(href, linkBase)
    return `<a class="lnk c-link" href="${h}" style="color:${COLORS.link};font-weight:bold;text-decoration:none;">`
  })

  // bold (strong → b)
  out = out
    .replace(/<(strong|b)\b[^>]*>/gi, `<b class="c-strong" style="color:${strong};font-weight:bold;">`)
    .replace(/<\/(strong|b)>/gi, '</b>')

  // italic (em → i)
  out = out.replace(/<(em|i)\b[^>]*>/gi, '<i>').replace(/<\/(em|i)>/gi, '</i>')

  // lists
  out = out
    .replace(/<ul\b[^>]*>/gi, `<ul style="margin:8px 0 12px;padding-left:22px;color:${COLORS.body};font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;">`)
    .replace(/<ol\b[^>]*>/gi, `<ol style="margin:8px 0 12px;padding-left:22px;color:${COLORS.body};font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;">`)
    .replace(/<li\b[^>]*>/gi, '<li style="margin:0 0 4px;">')

  // paragraphs
  out = out.replace(/<p\b[^>]*>/gi, `<p class="c-body" style="${pStyle}">`)

  return out
}

// Convenience: strip down to the inner HTML of a single first paragraph (used
// where the email design wants one inline paragraph, no block margins).
export function inlineRichTight(html, opts = {}) {
  return inlineRich(html, {
    ...opts,
    pStyle: `font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:${COLORS.body};margin:0;`,
  })
}
