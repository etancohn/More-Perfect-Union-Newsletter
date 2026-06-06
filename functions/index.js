// Production counterpart to the Vite dev-server `/api/send-test` endpoint
// (see vite.config.js). In production the dashboard is served as static files
// by Firebase Hosting, so the Gmail SMTP send — which can't run in a browser —
// happens here in a Cloud Function. A Hosting rewrite maps /api/send-test to
// this function (see firebase.json), so the client's fetch('/api/send-test')
// is identical in dev and prod.
//
// Gmail credentials are stored as Firebase secrets, NOT in code or .env:
//   firebase functions:secrets:set GMAIL_USER
//   firebase functions:secrets:set GMAIL_APP_PASSWORD
const { onRequest } = require('firebase-functions/v2/https')
const { defineSecret } = require('firebase-functions/params')
const nodemailer = require('nodemailer')

const GMAIL_USER = defineSecret('GMAIL_USER')
const GMAIL_APP_PASSWORD = defineSecret('GMAIL_APP_PASSWORD')

exports.sendTest = onRequest(
  { secrets: [GMAIL_USER, GMAIL_APP_PASSWORD], cors: true },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).json({ ok: false, error: 'POST only' })
      return
    }
    try {
      const { to, subject, html, text } = req.body || {}
      if (!to || !html) {
        res.status(400).json({ ok: false, error: 'Missing "to" or "html".' })
        return
      }
      const user = GMAIL_USER.value()
      const pass = GMAIL_APP_PASSWORD.value()
      if (!user || !pass) {
        res.status(500).json({
          ok: false,
          error: 'Gmail secrets not configured. Run: firebase functions:secrets:set GMAIL_USER (and GMAIL_APP_PASSWORD).',
        })
        return
      }
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass },
      })
      const info = await transporter.sendMail({
        from: user,
        to,
        subject: subject || 'A More Perfect Union — test',
        html,
        text: text || 'Open in an HTML-capable client to view.',
      })
      res.json({ ok: true, messageId: info.messageId })
    } catch (e) {
      res.status(500).json({ ok: false, error: String((e && e.message) || e) })
    }
  }
)
