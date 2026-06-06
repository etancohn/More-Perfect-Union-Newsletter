// Show-once policy + reduced-motion guard for the envelope-opening intro.
// Frequency is isolated to the single `store` line below so it's trivial to change.

const KEY = 'mpu_intro_seen'

function reducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  )
}

// Frequency policy — CONFIRMED: once per browser session.
//   every load:  const store = null
//   per session: const store = () => window.sessionStorage   <-- chosen
//   per visitor: const store = () => window.localStorage
const store = () => window.sessionStorage

export function shouldPlayIntro() {
  if (typeof window === 'undefined') return false // SSR / pre-render guard
  if (reducedMotion()) return false // reduced motion: don't mount the overlay at all
  if (!store) return true
  try {
    return store().getItem(KEY) !== '1'
  } catch {
    return true // storage blocked (private mode) — still play
  }
}

export function markIntroSeen() {
  if (!store) return
  try {
    store().setItem(KEY, '1')
  } catch {
    /* ignore */
  }
}
