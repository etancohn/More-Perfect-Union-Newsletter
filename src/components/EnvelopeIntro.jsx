import { useEffect, useRef, useState } from 'react'

// CSS owns the choreography (src/styles.css). React only mounts the overlay,
// locks scroll, kicks the animations off on the next frame, and listens for the
// final dissolve to finish — with a safety-net timeout so teardown always runs.
const FINAL_ANIM = 'envIntroDissolve' // the last keyframe of the natural sequence
const SKIP_ANIM = 'envIntroSkip' // the fast fade used on click/Esc
const MAX_MS = 2600 // safety net: must exceed the full CSS timeline (~2.15s)

// A few drifting motes behind the envelope — position + delay set inline so each
// is unique. Kept subtle (count <= 5) per the design.
const MOTES = [
  { top: '26%', left: '22%', delay: '0s', dur: '8.5s' },
  { top: '64%', left: '30%', delay: '1.4s', dur: '10s' },
  { top: '34%', left: '74%', delay: '0.7s', dur: '9.2s' },
  { top: '70%', left: '68%', delay: '2.1s', dur: '11s' },
  { top: '18%', left: '54%', delay: '1.1s', dur: '9.8s' },
]

export default function EnvelopeIntro({ onDone }) {
  const [phase, setPhase] = useState('idle') // 'idle' -> 'run'; 'closing' on skip
  const rootRef = useRef(null)
  const doneRef = useRef(false) // fire onDone exactly once
  const finish = useRef(onDone)
  finish.current = onDone // always call the latest callback

  const end = () => {
    if (doneRef.current) return
    doneRef.current = true
    finish.current?.()
  }

  const skip = () => {
    if (doneRef.current) return
    setPhase((p) => (p === 'closing' ? p : 'closing')) // .is-closing → fast fade
  }

  // Lock body scroll for the lifetime of the overlay; restore on unmount.
  useEffect(() => {
    const body = document.body
    const prev = body.style.overflow
    body.style.overflow = 'hidden'
    return () => {
      body.style.overflow = prev
    }
  }, [])

  // Kick the CSS timeline off on the next frame so the start state paints first.
  useEffect(() => {
    const raf = requestAnimationFrame(() => setPhase('run'))
    return () => cancelAnimationFrame(raf)
  }, [])

  // Safety-net timeout + Esc-to-skip. Cleaned up on unmount (StrictMode-safe).
  useEffect(() => {
    const timer = setTimeout(end, MAX_MS)
    const onKey = (e) => {
      if (e.key === 'Escape') skip()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onAnimEnd = (e) => {
    if (phase === 'closing') {
      if (e.animationName === SKIP_ANIM) end() // skip fade finished
      return
    }
    if (e.animationName === FINAL_ANIM) end() // natural sequence finished
  }

  return (
    <div
      ref={rootRef}
      className={`env-intro${phase === 'closing' ? ' is-closing' : ''}`}
      data-phase={phase === 'idle' ? undefined : 'run'}
      role="presentation"
      aria-hidden="true"
      onClick={skip}
      onAnimationEnd={onAnimEnd}
    >
      <div className="intro-backdrop">
        <div className="intro-glow" />
        {MOTES.map((m, i) => (
          <i
            key={i}
            className="mote"
            style={{
              top: m.top,
              left: m.left,
              animationDelay: m.delay,
              animationDuration: m.dur,
            }}
          />
        ))}
      </div>

      <div className="intro-stage">
        <div className="env">
          <div className="env-shadow" />
          <div className="env-back" />

          <div className="letter-card">
            <span className="lc-eyebrow">The Jewish Partnership for Democracy</span>
            <span className="lc-title">A More Perfect Union</span>
            <span className="lc-sub">Special Election Edition</span>
            <span className="lc-rule" />
          </div>

          <div className="env-pocket" />

          <div className="env-flap">
            <div className="env-flap-inner" />
          </div>

          <div className="seal">
            <svg className="seal-emblem" viewBox="0 0 88 88" aria-hidden="true">
              <defs>
                <radialGradient id="introWaxFace" cx="38%" cy="32%" r="75%">
                  <stop offset="0%" stopColor="#c9404f" />
                  <stop offset="55%" stopColor="#b72e3f" />
                  <stop offset="100%" stopColor="#86182a" />
                </radialGradient>
              </defs>

              {/* molten wax disc + faint rim highlight */}
              <circle cx="44" cy="44" r="42" fill="url(#introWaxFace)" />
              <circle
                cx="44"
                cy="44"
                r="42"
                fill="none"
                stroke="rgba(255,255,255,.14)"
                strokeWidth="1.5"
              />

              {/* emboss SHADOW pass: emblem offset down, dark */}
              <g
                transform="translate(0,0.6)"
                fill="none"
                stroke="#7c172a"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.55"
              >
                <path d="M44 22 l5.4 11 12 1.7 -8.7 8.5 2 12 -10.7-5.6 -10.7 5.6 2-12 -8.7-8.5 12-1.7Z" />
                <path d="M22 56 q8 8 22 9" />
                <path d="M66 56 q-8 8 -22 9" />
              </g>
              {/* emboss HIGHLIGHT pass: same shapes offset up, light */}
              <g
                transform="translate(0,-0.6)"
                fill="none"
                stroke="#e98e98"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.8"
              >
                <path d="M44 22 l5.4 11 12 1.7 -8.7 8.5 2 12 -10.7-5.6 -10.7 5.6 2-12 -8.7-8.5 12-1.7Z" />
                <path d="M22 56 q8 8 22 9" />
                <path d="M66 56 q-8 8 -22 9" />
              </g>
            </svg>
          </div>
        </div>
      </div>

      <span className="env-intro__skip" aria-hidden="true">
        Click anywhere to skip
      </span>
    </div>
  )
}
