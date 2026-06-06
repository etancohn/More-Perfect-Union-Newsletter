// Client helper for the dashboard's "send test" button. POSTs a built email to
// the Vite dev/preview-server endpoint (see vite.config.js), which relays it via
// Gmail SMTP. Only works while the app is served by Vite (`npm run dev` /
// `npm run preview`) — there's no standalone backend.
export async function sendTestEmail({ to, subject, html, text }) {
  const res = await fetch('/api/send-test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, subject, html, text }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.ok) throw new Error(data.error || `Send failed (${res.status})`)
  return data
}
