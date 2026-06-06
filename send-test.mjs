// Test-send email.html to yourself with the images embedded inline (CID),
// so you can preview the real render in an inbox before wiring up Mailchimp.
//
// Usage (recommended — keeps the password out of your shell history):
//   cp .env.example .env   # then fill in GMAIL_APP_PASSWORD; .env is gitignored
//   node --env-file=.env send-test.mjs
//
// Or pass inline:
//   GMAIL_USER=you@gmail.com GMAIL_APP_PASSWORD=xxxxxxxxxxxxxxxx node send-test.mjs
//   (optional) TO=someone@else.com to send somewhere other than GMAIL_USER
//
// GMAIL_APP_PASSWORD is a 16-char Google "App Password" (not your login
// password): https://myaccount.google.com/apppasswords  (requires 2FA on).
//
// What it does: reads email.html, finds every src="assets/<file>", attaches
// each referenced file as an inline attachment, and rewrites the src to
// cid:<file> so email clients render them. No hosting needed.

import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import nodemailer from 'nodemailer'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const { GMAIL_USER, GMAIL_APP_PASSWORD, TO } = process.env
if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
  console.error(
    'Missing creds. Run:\n' +
      '  GMAIL_USER=you@gmail.com GMAIL_APP_PASSWORD=your16charapppass node send-test.mjs\n'
  )
  process.exit(1)
}
const to = TO || GMAIL_USER

// Read the email and swap relative asset paths for inline CID references.
let html = await readFile(path.join(__dirname, 'email.html'), 'utf8')
const seen = new Map() // assetPath -> cid
const attachments = []
html = html.replace(/src="(assets\/[^"]+)"/g, (_m, rel) => {
  if (!seen.has(rel)) {
    const cid = path.basename(rel) // e.g. header-banner.png
    seen.set(rel, cid)
    attachments.push({ filename: cid, path: path.join(__dirname, rel), cid })
  }
  return `src="cid:${seen.get(rel)}"`
})

if (attachments.length === 0) {
  console.warn('No assets/ images found in email.html — sending without inline images.')
}

// Unique subject per send so Gmail doesn't thread tests together — you always
// see the latest render, and can correlate by the timestamp.
const stamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
const subject = `A More Perfect Union — Special Election Edition (test ${stamp})`

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
})

console.log(
  `Sending to ${to} with ${attachments.length} inline image(s): ` +
    attachments.map((a) => a.filename).join(', ')
)
const info = await transporter.sendMail({
  from: GMAIL_USER,
  to,
  subject,
  html,
  // Plain-text fallback for clients that don't render HTML.
  text: "A More Perfect Union — Special Election Edition. Open in an HTML-capable client to view.",
  attachments,
})
console.log('Sent ✓  messageId:', info.messageId)
