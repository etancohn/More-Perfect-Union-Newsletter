// Renders the "light-text-on-color" sections of email.html to PNGs using the
// installed Google Chrome (headless), so Gmail's dark mode can't recolor them.
// These images bake in the ORIGINAL vibrant gradient + light text.
//
//   node render-cards.mjs
//
// Output: assets/qotd-card.png, assets/edition-strip.png, assets/chip-1..3.png
import puppeteer from 'puppeteer-core'
import { writeFile, unlink } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const SCALE = 2 // retina source

const sans = 'font-family:Helvetica,Arial,sans-serif;'

const chip = (id, mon, day, time) => `
<div id="${id}" style="width:88px;box-sizing:border-box;background:linear-gradient(135deg,#3b3a86,#5e8cb0);border-radius:10px;padding:12px 6px;text-align:center;${sans}">
  <div style="font-size:11px;font-weight:bold;letter-spacing:1px;color:#dfe4f3;">${mon}</div>
  <div style="font-family:Georgia,serif;font-size:28px;font-weight:bold;color:#ffffff;line-height:1;">${day}</div>
  <div style="font-size:10px;color:#dfe4f3;margin-top:3px;">${time}</div>
</div>`

const html = `<!doctype html><html><head><meta charset="utf-8">
<style>html,body{margin:0;padding:0;background:transparent;}#wrap>*{margin:22px;}</style>
</head><body><div id="wrap">

<div id="card" style="width:512px;background:linear-gradient(160deg,#2a2966,#45469a 55%,#5e8cb0);border-radius:16px;${sans}">
  <div style="padding:24px 26px;">
    <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;"><tr>
      <td valign="top" width="78" style="width:78px;padding-right:18px;">
        <img src="assets/qotd-scroll.png" width="68" height="68" style="display:block;width:68px;height:68px;">
      </td>
      <td valign="top">
        <div style="font-size:11px;font-weight:bold;letter-spacing:2px;color:#ffd2d8;text-transform:uppercase;">★ Question of the Day</div>
        <div style="font-family:Georgia,serif;font-size:22px;font-weight:bold;color:#ffffff;line-height:1.25;margin-top:7px;">Think you know your democracy?</div>
        <p style="font-size:14.5px;line-height:1.55;color:#dfe2f4;margin:9px 0 0;">A quick, nonpartisan civics challenge — five questions on the rights and institutions behind a more perfect union.</p>
        <table cellpadding="0" cellspacing="0" style="margin-top:18px;border-collapse:collapse;"><tr><td style="background:#ffffff;border-radius:999px;">
          <span style="display:inline-block;font-size:14.5px;font-weight:bold;color:#2a2966;padding:13px 26px;border-radius:999px;">Play today's challenge</span>
        </td></tr></table>
      </td>
    </tr></table>
  </div>
</div>

<div id="strip" style="width:600px;box-sizing:border-box;background:linear-gradient(105deg,#3b3a86,#5e8cb0);padding:16px 24px 18px;text-align:center;${sans}">
  <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 auto;"><tr>
    <td style="font-size:11px;font-weight:bold;letter-spacing:3px;color:#cfd4ec;padding-right:14px;">PARTNER&nbsp;NEWSLETTER</td>
    <td style="border-left:1px solid rgba(255,255,255,.3);padding-left:14px;font-family:Georgia,serif;font-size:14px;font-weight:bold;color:#ffffff;">Special Election Edition</td>
  </tr></table>
</div>

${chip('chip-1', 'JUN', '17', '12pm ET')}
${chip('chip-2', 'JUN', '24', '1pm ET')}
${chip('chip-3', 'JUL', '21', '1pm ET')}

</div></body></html>`

const tmp = path.join(__dirname, '_render.html')
await writeFile(tmp, html, 'utf8')

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'shell',
  args: ['--no-sandbox', '--force-color-profile=srgb'],
})
try {
  const page = await browser.newPage()
  await page.setViewport({ width: 800, height: 1400, deviceScaleFactor: SCALE })
  await page.goto('file://' + tmp, { waitUntil: 'networkidle0' })

  const targets = ['card', 'strip', 'chip-1', 'chip-2', 'chip-3']
  const fileFor = { card: 'qotd-card', strip: 'edition-strip', 'chip-1': 'chip-1', 'chip-2': 'chip-2', 'chip-3': 'chip-3' }
  for (const id of targets) {
    const el = await page.$('#' + id)
    const out = path.join(__dirname, 'assets', fileFor[id] + '.png')
    await el.screenshot({ path: out, omitBackground: true })
    const box = await el.boundingBox()
    console.log(`✓ ${fileFor[id]}.png  (${Math.round(box.width)}x${Math.round(box.height)} css → ${SCALE}x)`)
  }
} finally {
  await browser.close()
  await unlink(tmp)
}
