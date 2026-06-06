// Render the email's "light-text-on-color" gradient pieces (edition strip,
// event date chips, QOTD card) to PNGs in the browser with html-to-image, and
// upload them to Storage. This is the client-side equivalent of render-cards.mjs
// — Gmail dark mode recolors CSS but leaves images alone, so these stay vibrant.
import { toBlob } from 'html-to-image'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '../firebase'

const sans = 'font-family:Helvetica,Arial,sans-serif;'

// Mount a node offscreen, snapshot it at 2× (retina), and clean up.
async function snapshot(html, width) {
  const holder = document.createElement('div')
  holder.style.cssText =
    'position:fixed;left:-99999px;top:0;margin:0;padding:0;background:transparent;'
  holder.innerHTML = html
  const node = holder.firstElementChild
  document.body.appendChild(holder)
  try {
    // Let any <img> inside (e.g. the QOTD scroll icon) decode first.
    await Promise.all(
      [...node.querySelectorAll('img')].map((img) =>
        img.complete ? Promise.resolve() : img.decode().catch(() => {})
      )
    )
    return await toBlob(node, { pixelRatio: 2, width, cacheBust: true })
  } finally {
    holder.remove()
  }
}

const chipHtml = (mo, day, time) => `
<div style="width:88px;box-sizing:border-box;background:linear-gradient(135deg,#3b3a86,#5e8cb0);border-radius:10px;padding:12px 6px;text-align:center;${sans}">
  <div style="font-size:11px;font-weight:bold;letter-spacing:1px;color:#dfe4f3;">${(mo || '').toUpperCase()}</div>
  <div style="font-family:Georgia,serif;font-size:28px;font-weight:bold;color:#ffffff;line-height:1;">${day || ''}</div>
  <div style="font-size:10px;color:#dfe4f3;margin-top:3px;">${time || ''}</div>
</div>`

const stripHtml = (eyebrow, label) => `
<div style="width:600px;box-sizing:border-box;background:linear-gradient(105deg,#3b3a86,#5e8cb0);padding:16px 24px 18px;text-align:center;${sans}">
  <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 auto;"><tr>
    <td style="font-size:11px;font-weight:bold;letter-spacing:3px;color:#cfd4ec;padding-right:14px;">${(eyebrow || '').toUpperCase().replace(/ /g, '&nbsp;')}</td>
    <td style="border-left:1px solid rgba(255,255,255,.3);padding-left:14px;font-family:Georgia,serif;font-size:14px;font-weight:bold;color:#ffffff;">${label || ''}</td>
  </tr></table>
</div>`

const qotdHtml = (w, iconUrl) => `
<div style="width:512px;background:linear-gradient(160deg,#2a2966,#45469a 55%,#5e8cb0);border-radius:16px;${sans}">
  <div style="padding:24px 26px;">
    <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;"><tr>
      <td valign="top" width="78" style="width:78px;padding-right:18px;">
        <img src="${iconUrl}" width="68" height="68" style="display:block;width:68px;height:68px;" crossorigin="anonymous" />
      </td>
      <td valign="top">
        <div style="font-size:11px;font-weight:bold;letter-spacing:2px;color:#ffd2d8;text-transform:uppercase;">★ ${w.kicker || 'Question of the Day'}</div>
        <div style="font-family:Georgia,serif;font-size:22px;font-weight:bold;color:#ffffff;line-height:1.25;margin-top:7px;">${w.heading || ''}</div>
        <p style="font-size:14.5px;line-height:1.55;color:#dfe2f4;margin:9px 0 0;">${w.cardBlurb || w.blurb || ''}</p>
        <table cellpadding="0" cellspacing="0" style="margin-top:18px;border-collapse:collapse;"><tr><td style="background:#ffffff;border-radius:999px;">
          <span style="display:inline-block;font-size:14.5px;font-weight:bold;color:#2a2966;padding:13px 26px;border-radius:999px;">${w.cardButton || "Play today's challenge"}</span>
        </td></tr></table>
      </td>
    </tr></table>
  </div>
</div>`

async function upload(postId, name, blob) {
  if (!blob) throw new Error('Failed to render ' + name)
  const r = ref(storage, `posts/${postId}/cards/${name}.png`)
  await uploadBytes(r, blob, { contentType: 'image/png' })
  return getDownloadURL(r)
}

// Render every gradient asset the post needs and return an updated `assets` map.
// onProgress(label) is optional for UI feedback.
export async function renderCards(postId, post, { onProgress } = {}) {
  const assets = { ...(post.assets || {}) }
  const iconUrl = new URL('/assets/qotd-scroll.png', window.location.origin).href

  // Edition strip
  onProgress?.('edition strip')
  assets.editionStrip = await upload(
    postId,
    'edition-strip',
    await snapshot(stripHtml(post.edition?.eyebrow, post.edition?.label), 600)
  )

  for (const section of post.sections || []) {
    if (section.type === 'events') {
      const events = section.web?.events || []
      for (let i = 0; i < events.length; i++) {
        const ev = events[i]
        onProgress?.(`event chip ${i + 1}`)
        assets[`chip:${section.id}:${i}`] = await upload(
          postId,
          `chip-${section.id}-${i}`,
          await snapshot(chipHtml(ev.mo, ev.day, ev.chipTime), 88)
        )
      }
    }
    if (section.type === 'qotd') {
      onProgress?.('question card')
      assets.qotdCard = await upload(
        postId,
        'qotd-card',
        await snapshot(qotdHtml(section.web || {}, iconUrl), 512)
      )
    }
  }

  return assets
}
