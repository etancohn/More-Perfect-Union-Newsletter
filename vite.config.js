import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Dev/preview-server endpoint that actually sends the test email. The dashboard
// is a client-side app, so the Gmail SMTP send (which needs the app password and
// can't run in a browser) happens here in Vite's Node process. The client POSTs
// the already-built newsletter HTML; we just relay it via nodemailer — same
// transport as send-test.mjs. Reads GMAIL_USER / GMAIL_APP_PASSWORD from .env.
function sendTestEmailPlugin(env) {
  const handler = async (req, res, next) => {
    if (req.method !== 'POST') return next()
    const json = (code, body) => {
      res.statusCode = code
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(body))
    }
    try {
      const chunks = []
      for await (const c of req) chunks.push(c)
      const { to, subject, html, text } = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')
      if (!to || !html) return json(400, { ok: false, error: 'Missing "to" or "html".' })

      const { GMAIL_USER, GMAIL_APP_PASSWORD } = env
      if (!GMAIL_USER || !GMAIL_APP_PASSWORD)
        return json(500, {
          ok: false,
          error: 'GMAIL_USER / GMAIL_APP_PASSWORD not set in .env (see .env.example).',
        })

      const nodemailer = (await import('nodemailer')).default
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
      })
      const info = await transporter.sendMail({
        from: GMAIL_USER,
        to,
        subject: subject || 'A More Perfect Union — test',
        html,
        text: text || 'Open in an HTML-capable client to view.',
      })
      json(200, { ok: true, messageId: info.messageId })
    } catch (e) {
      json(500, { ok: false, error: String(e?.message || e) })
    }
  }
  return {
    name: 'send-test-email',
    configureServer(server) {
      server.middlewares.use('/api/send-test', handler)
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/send-test', handler)
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load ALL env vars (prefix ''), not just VITE_*, so the server-side send
  // endpoint can read the Gmail credentials without exposing them to the client.
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), sendTestEmailPlugin(env)],
    server: { open: true },
  }
})
