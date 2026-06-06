// buildEmailHtml(post, { baseUrl }) → a complete, Mailchimp-ready email HTML
// string that mirrors email.html. The dark-mode-safe gradient pieces (edition
// strip, event date chips, QOTD card) use the PNG URLs rendered at save time
// (post.assets.*); when those are missing (e.g. live preview before a save) we
// fall back to inline HTML so the preview still reads correctly.
import { inlineRich } from './richtext'
import { emailData } from '../postSchema'

export const DEFAULT_BASE = 'https://more-perfect-union-newsletter.web.app'

const sans = 'font-family:Helvetica,Arial,sans-serif;'

const abs = (url, baseUrl) =>
  !url ? url : url.startsWith('/') ? baseUrl + url : url

const postUrl = (post, baseUrl) => `${baseUrl}/p/${post.slug || ''}`

const divider = () =>
  `<tr><td class="px" style="padding:24px 44px 0;"><div class="c-rule" style="border-top:1px solid #ebe9e1;"></div></td></tr>`

// ── HEAD + container (verbatim from email.html) ─────────────────────────
function head(post) {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="color-scheme" content="light dark" />
<meta name="supported-color-schemes" content="light dark" />
<title>${post.title || ''}</title>
<style>
  :root{color-scheme:light dark;}
  body{margin:0;padding:0;background:#e9eaf0;}
  img{border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;display:block;}
  a{text-decoration:none;}
  table{border-collapse:collapse;}
  .btn:hover{opacity:.92;}
  .lnk:hover{text-decoration:underline !important;}
  @media screen and (max-width:600px){
    .container{width:100% !important;}
    .px{padding-left:22px !important;padding-right:22px !important;}
    .stack{display:block !important;width:100% !important;}
    .ev-date{width:74px !important;}
    .hpad{height:18px !important;}
  }
  @media (prefers-color-scheme: dark){
    body,.page-bg{background:#15151c !important;}
    .surface{background:#1f1e27 !important;}
    .c-head{color:#f1f1f6 !important;}
    .c-strong{color:#c3c5ff !important;}
    .c-body{color:#c3c3ce !important;}
    .c-body2{color:#a6a6b3 !important;}
    .c-muted{color:#9a9aa6 !important;}
    .c-faint{color:#8a8a95 !important;}
    .c-eyebrow{color:#8fb6da !important;}
    .c-link{color:#f2727f !important;}
    .c-rule{border-top-color:rgba(255,255,255,.14) !important;}
  }
</style>
</head>
<body style="margin:0;padding:0;background:#e9eaf0;${sans}-webkit-font-smoothing:antialiased;">

<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#e9eaf0;font-size:1px;line-height:1px;">${post.preheader || ''}</div>

<center class="page-bg" style="width:100%;background:#e9eaf0;">
<table role="presentation" class="page-bg" width="100%" cellpadding="0" cellspacing="0" style="background:#e9eaf0;">
<tr><td align="center" style="padding:26px 12px;">

  <table role="presentation" class="container surface" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 40px rgba(40,40,80,.12);">
`
}

// ── HEADER + EDITION STRIP ──────────────────────────────────────────────
function header(post, baseUrl) {
  const banner = abs(post.hero?.bannerUrl, baseUrl)
  const strip = post.assets?.editionStrip
  const stripHtml = strip
    ? `<tr><td style="font-size:0;line-height:0;"><img src="${strip}" width="600" alt="${post.edition?.eyebrow || ''} — ${post.edition?.label || ''}" style="display:block;width:100%;height:auto;border:0;" /></td></tr>`
    : `<tr><td style="font-size:0;line-height:0;">
        <div style="width:100%;box-sizing:border-box;background:linear-gradient(105deg,#3b3a86,#5e8cb0);padding:16px 24px 18px;text-align:center;${sans}">
          <span style="font-size:11px;font-weight:bold;letter-spacing:3px;color:#cfd4ec;">${(post.edition?.eyebrow || '').toUpperCase()}</span>
          <span style="border-left:1px solid rgba(255,255,255,.3);margin-left:14px;padding-left:14px;font-family:Georgia,serif;font-size:14px;font-weight:bold;color:#ffffff;">${post.edition?.label || ''}</span>
        </div></td></tr>`
  return `
    <tr><td bgcolor="#36357f" style="background:#36357f;background:linear-gradient(105deg,#34337c,#6699bb);">
      <img src="${banner}" width="600" alt="${post.hero?.bannerAlt || ''}" style="width:100%;height:auto;display:block;" />
    </td></tr>
    ${stripHtml}
`
}

// ── INTRO (letter, condensed for email) ─────────────────────────────────
function intro(post, baseUrl) {
  const e = post.letter?.email
  const linkBase = postUrl(post, baseUrl)
  const eyebrow = e?.eyebrow || post.letter?.kicker || ''
  const head = e?.head || ''
  const html = inlineRich(e?.html || post.letter?.html || '', {
    linkBase,
    pStyle: `${sans}font-size:15.5px;line-height:1.65;color:#54545f;margin:12px 0 0;`,
  })
  const ctaText = e?.ctaText || 'Read the full edition online'
  const note = e?.note || ''
  return `
    <tr><td class="px" style="padding:34px 44px 8px;">
      <div class="c-eyebrow" style="${sans}font-size:11px;font-weight:bold;letter-spacing:2px;color:#5e8cb0;text-transform:uppercase;">${eyebrow}</div>
      ${head ? `<div class="c-head" style="font-family:Georgia,serif;font-size:23px;line-height:1.35;color:#23232b;font-weight:bold;margin-top:10px;">${head}</div>` : ''}
      ${html}
    </td></tr>

    <tr><td class="px" align="center" style="padding:24px 44px 6px;">
      <table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="border-radius:999px;background:#b72e3f;" class="btn">
        <a href="${linkBase}" style="display:inline-block;${sans}font-size:15px;font-weight:bold;color:#ffffff;padding:14px 30px;border-radius:999px;">${ctaText} &nbsp;›</a>
      </td></tr></table>
      ${note ? `<div class="c-muted" style="${sans}font-size:12px;color:#9a9aa3;margin-top:9px;">${note}</div>` : ''}
    </td></tr>
`
}

// ── Numbered text block (feature / cards / happenings / prose) ──────────
function numberedBlock(num, title, bodyHtml, linkText, anchor, post, baseUrl, first) {
  const linkBase = postUrl(post, baseUrl)
  const body = inlineRich(bodyHtml, {
    linkBase,
    strong: '#36357f',
    pStyle: `${sans}font-size:15px;line-height:1.65;color:#54545f;margin:10px 0 0;`,
  })
  const link = linkText
    ? `<a class="lnk c-link" href="${linkBase}#${anchor}" style="display:inline-block;margin-top:12px;${sans}font-size:14px;font-weight:bold;color:#b72e3f;">${linkText} &nbsp;→</a>`
    : ''
  return `
    <tr><td class="px" style="padding:${first ? 26 : 24}px 44px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td class="c-link" style="font-family:Georgia,serif;font-style:italic;font-size:16px;color:#b72e3f;width:34px;vertical-align:top;">${num}</td>
        <td>
          <div class="c-head" style="font-family:Georgia,serif;font-size:22px;font-weight:bold;color:#23232b;line-height:1.2;">${title}</div>
          ${body}
          ${link}
        </td>
      </tr></table>
    </td></tr>
`
}

// ── Events block ────────────────────────────────────────────────────────
function eventsBlock(num, section, data, post, baseUrl, first) {
  const linkBase = postUrl(post, baseUrl)
  const web = section.web
  const rows = (data.events || [])
    .map((ev, i) => {
      const wEv = (web.events || [])[i] || {}
      const chip = post.assets?.[`chip:${section.id}:${i}`]
      const chipCell = chip
        ? `<img src="${chip}" width="88" alt="${wEv.mo || ''} ${wEv.day || ''} · ${wEv.chipTime || ''}" style="display:block;width:100%;max-width:88px;height:auto;border:0;" />`
        : `<div style="width:88px;box-sizing:border-box;background:linear-gradient(135deg,#3b3a86,#5e8cb0);border-radius:10px;padding:12px 6px;text-align:center;${sans}">
             <div style="font-size:11px;font-weight:bold;letter-spacing:1px;color:#dfe4f3;">${(wEv.mo || '').toUpperCase()}</div>
             <div style="font-family:Georgia,serif;font-size:28px;font-weight:bold;color:#ffffff;line-height:1;">${wEv.day || ''}</div>
             <div style="font-size:10px;color:#dfe4f3;margin-top:3px;">${wEv.chipTime || ''}</div>
           </div>`
      const spacer = i > 0 ? `<tr><td colspan="2" style="height:14px;line-height:14px;">&nbsp;</td></tr>` : ''
      return `${spacer}
        <tr>
          <td class="ev-date" valign="top" style="width:88px;">${chipCell}</td>
          <td valign="top" style="padding:2px 0 0 16px;">
            <div class="c-eyebrow" style="${sans}font-size:10.5px;font-weight:bold;letter-spacing:1.5px;color:#5e8cb0;text-transform:uppercase;">${ev.tag || ''}</div>
            <div class="c-head" style="font-family:Georgia,serif;font-size:17px;font-weight:bold;color:#23232b;margin-top:3px;">${ev.title || ''}</div>
            <p class="c-body2" style="${sans}font-size:13.5px;line-height:1.55;color:#6b6b75;margin:5px 0 0;">${ev.body || ''}</p>
          </td>
        </tr>`
    })
    .join('')
  return `
    <tr><td class="px" style="padding:${first ? 26 : 24}px 44px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td class="c-link" style="font-family:Georgia,serif;font-style:italic;font-size:16px;color:#b72e3f;width:34px;vertical-align:top;">${num}</td>
        <td><div class="c-head" style="font-family:Georgia,serif;font-size:22px;font-weight:bold;color:#23232b;line-height:1.2;">${data.title || ''}</div></td>
      </tr></table>
    </td></tr>
    <tr><td class="px" style="padding:16px 44px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
      ${data.linkText ? `<a class="lnk c-link" href="${linkBase}#${section.anchor}" style="display:inline-block;margin-top:16px;${sans}font-size:14px;font-weight:bold;color:#b72e3f;">${data.linkText} &nbsp;→</a>` : ''}
    </td></tr>
`
}

// ── Spotlight block ─────────────────────────────────────────────────────
function spotlightBlock(num, section, data, post, baseUrl, first) {
  const linkBase = postUrl(post, baseUrl)
  const body = inlineRich(data.bodyHtml, {
    linkBase,
    strong: '#23232b',
    pStyle: `${sans}font-size:15px;line-height:1.6;color:#54545f;margin:10px 0 0;`,
  })
  return `
    <tr><td class="px" style="padding:${first ? 26 : 24}px 44px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td class="c-link" style="font-family:Georgia,serif;font-style:italic;font-size:16px;color:#b72e3f;width:34px;vertical-align:top;">${num}</td>
        <td>
          <div class="c-eyebrow" style="${sans}font-size:10.5px;font-weight:bold;letter-spacing:1.5px;color:#5e8cb0;text-transform:uppercase;">${data.eyebrow || ''}</div>
          <div class="c-head" style="font-family:Georgia,serif;font-size:22px;font-weight:bold;color:#23232b;line-height:1.2;margin-top:4px;">${data.org || ''}</div>
          ${body}
          ${data.linkText ? `<a class="lnk c-link" href="${linkBase}#${section.anchor}" style="display:inline-block;margin-top:12px;${sans}font-size:14px;font-weight:bold;color:#b72e3f;">${data.linkText} &nbsp;→</a>` : ''}
        </td>
      </tr></table>
    </td></tr>
`
}

// ── QOTD card (image, dark-mode-safe) ───────────────────────────────────
function qotdCard(section, post, baseUrl) {
  const linkBase = postUrl(post, baseUrl)
  const card = post.assets?.qotdCard
  const w = section.web
  const inner = card
    ? `<img src="${card}" width="512" alt="${w.heading || 'Question of the Day'}" style="display:block;width:100%;max-width:512px;height:auto;border:0;" />`
    : `<div style="width:100%;max-width:512px;background:linear-gradient(160deg,#2a2966,#45469a 55%,#5e8cb0);border-radius:16px;${sans}padding:24px 26px;box-sizing:border-box;">
         <div style="font-size:11px;font-weight:bold;letter-spacing:2px;color:#ffd2d8;text-transform:uppercase;">★ ${w.kicker || 'Question of the Day'}</div>
         <div style="font-family:Georgia,serif;font-size:22px;font-weight:bold;color:#ffffff;line-height:1.25;margin-top:7px;">${w.heading || ''}</div>
         <p style="font-size:14.5px;line-height:1.55;color:#dfe2f4;margin:9px 0 14px;">${w.cardBlurb || w.blurb || ''}</p>
         <span style="display:inline-block;background:#ffffff;border-radius:999px;font-size:14.5px;font-weight:bold;color:#2a2966;padding:13px 26px;">${w.cardButton || "Play today's challenge"}</span>
       </div>`
  return `
    <tr><td class="px" style="padding:30px 44px 6px;">
      <a href="${linkBase}#play" style="text-decoration:none;display:block;font-size:0;line-height:0;">
        ${inner}
      </a>
    </td></tr>
`
}

// ── FOOTER ──────────────────────────────────────────────────────────────
function footer(post) {
  const f = post.footer || {}
  return `
    <tr><td class="surface" bgcolor="#ffffff" style="padding:34px 44px 36px;background:#ffffff;">
      <div class="c-rule" style="border-top:1px solid #ebe9e1;padding-top:26px;text-align:center;">
        <div class="c-strong" style="${sans}font-size:17px;font-weight:bold;letter-spacing:1px;color:#36357f;">${f.org || ''}</div>
        <div class="c-muted" style="font-family:Georgia,serif;font-size:14px;color:#86868f;margin-top:3px;">${f.tagline || ''}</div>
        <p class="c-muted" style="${sans}font-size:12.5px;line-height:1.6;color:#9a9aa3;margin:18px 0 0;">
          You're receiving this as a valued partner.<br />
          Questions? <a class="lnk c-link" href="mailto:${f.email || ''}" style="color:#b72e3f;font-weight:bold;">${f.email || ''}</a><br />
          <span class="c-faint" style="font-size:11.5px;color:#b6b6bd;">${f.fine || ''}</span>
        </p>
      </div>
    </td></tr>
`
}

const tail = () => `
  </table>
</td></tr>
</table>
</center>
</body>
</html>`

export function buildEmailHtml(post, { baseUrl = DEFAULT_BASE } = {}) {
  let body = head(post) + header(post, baseUrl) + intro(post, baseUrl)

  let emailNum = 0
  let firstDone = false
  for (const section of post.sections || []) {
    const def = emailData(section)
    const meta = section
    if (section.type === 'accordion') continue // web-only

    if (section.type === 'qotd') {
      body += qotdCard(section, post, baseUrl)
      continue
    }
    if (!def) continue

    emailNum += 1
    const num = String(emailNum).padStart(2, '0')
    const first = !firstDone
    firstDone = true

    body += divider()
    if (section.type === 'events') {
      body += eventsBlock(num, section, def, post, baseUrl, first)
    } else if (section.type === 'spotlight') {
      body += spotlightBlock(num, section, def, post, baseUrl, first)
    } else {
      body += numberedBlock(num, def.title, def.bodyHtml, def.linkText, meta.anchor, post, baseUrl, first)
    }
  }

  body += footer(post) + tail()
  return body
}
