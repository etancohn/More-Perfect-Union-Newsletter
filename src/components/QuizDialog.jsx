import { useCallback, useEffect, useRef, useState } from 'react'
import {
  QUESTIONS,
  recordResult,
  loadStats,
  shareMsg,
  shareUrl,
  shareX,
  shareFB,
} from '../lib/quiz'

const LETTERS = ['A', 'B', 'C', 'D']

export default function QuizDialog({ open, onClose, onStatsChange, questions }) {
  const QS = questions && questions.length ? questions : QUESTIONS
  const dialogRef = useRef(null)
  const bodyRef = useRef(null)
  const nextRef = useRef(null)

  const [qi, setQi] = useState(0)
  const [score, setScore] = useState(0)
  const [chosen, setChosen] = useState(null) // index picked for current question
  const [done, setDone] = useState(false)
  const [rec, setRec] = useState(null) // result record once finished
  const [copied, setCopied] = useState(false)

  const reset = useCallback(() => {
    setQi(0)
    setScore(0)
    setChosen(null)
    setDone(false)
    setRec(null)
    setCopied(false)
  }, [])

  // Sync React state with the native <dialog>.
  useEffect(() => {
    const d = dialogRef.current
    if (!d) return
    if (open) {
      reset()
      if (!d.open) d.showModal()
    } else if (d.open) {
      d.close()
    }
  }, [open, reset])

  const item = QS[qi]
  const isLast = qi === QS.length - 1
  const answered = chosen !== null

  const choose = useCallback(
    (i) => {
      if (chosen !== null || done) return
      setChosen(i)
      if (i === item.a) setScore((s) => s + 1)
    },
    [chosen, done, item]
  )

  const finish = useCallback(() => {
    const r = recordResult(score)
    setRec(r)
    setDone(true)
    onStatsChange?.(loadStats())
  }, [score, onStatsChange])

  const next = useCallback(() => {
    if (!isLast) {
      setQi((q) => q + 1)
      setChosen(null)
      if (bodyRef.current) bodyRef.current.scrollTop = 0
    } else {
      finish()
    }
  }, [isLast, finish])

  // Move focus to the Next button once an answer is locked in.
  useEffect(() => {
    if (answered && !done) nextRef.current?.focus()
  }, [answered, done])

  // Keyboard: A/B/C/D or 1–4 to answer, Enter / → to advance.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (done) return
      if (!answered) {
        const k = e.key.toUpperCase()
        let idx = -1
        if ('ABCD'.includes(k)) idx = 'ABCD'.indexOf(k)
        else if ('1234'.includes(k)) idx = Number(k) - 1
        if (idx >= 0 && idx < item.opts.length) {
          e.preventDefault()
          choose(idx)
        }
      } else if (e.key === 'Enter' || e.key === 'ArrowRight') {
        e.preventDefault()
        next()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, answered, done, item, choose, next])

  const copyShare = (sc) => {
    const txt = shareMsg(sc) + ' ' + shareUrl()
    const flash = () => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    }
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(txt).then(flash).catch(flash)
    else flash()
  }
  const nativeShare = async (sc) => {
    const data = { title: 'Question of the Day', text: shareMsg(sc), url: shareUrl() }
    if (navigator.share) {
      try {
        await navigator.share(data)
      } catch {
        /* user dismissed */
      }
    } else copyShare(sc)
  }

  let resultMsg = '',
    resultSub = ''
  if (done) {
    if (score === QS.length) {
      resultMsg = 'Founding-level!'
      resultSub = 'A perfect score. You know your civics cold.'
    } else if (score >= Math.ceil(QS.length * 0.6)) {
      resultMsg = 'Well informed.'
      resultSub = 'Strong work — a few to brush up on. Come back tomorrow!'
    } else {
      resultMsg = 'Room to grow.'
      resultSub = 'Democracy is a practice. Try again and share with a friend!'
    }
  }

  return (
    <dialog className="quiz" ref={dialogRef} onClose={onClose} onCancel={onClose}>
      <div className="qz-head">
        <p className="kk">★ Question of the Day</p>
        <h3>{done ? 'Your results' : `Question ${qi + 1} of ${QS.length}`}</h3>
        <button className="qz-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <div className="qz-progress">
          {QS.map((_, i) => (
            <i key={i} className={done || i <= qi ? 'on' : ''} />
          ))}
        </div>
      </div>

      <div className="qz-body" ref={bodyRef}>
        {!done ? (
          <>
            <p className="qz-q">{item.q}</p>
            <div className="qz-opts">
              {item.opts.map((o, i) => {
                let cls = 'qz-opt'
                if (answered && i === item.a) cls += ' correct'
                else if (answered && i === chosen) cls += ' wrong'
                return (
                  <button
                    key={i}
                    className={cls}
                    disabled={answered}
                    onClick={() => choose(i)}
                  >
                    <span className="k">{LETTERS[i]}</span>
                    <span>{o}</span>
                  </button>
                )
              })}
            </div>
            <div
              className={`qz-explain${answered ? ' show' : ''}`}
              dangerouslySetInnerHTML={{ __html: item.ex }}
            />
            <div className="qz-foot">
              <span className="qz-score">
                Score <b>{score}</b> / {QS.length}
              </span>
              <button
                ref={nextRef}
                className={`qz-next${answered ? ' show' : ''}`}
                onClick={next}
              >
                {isLast ? 'See results →' : 'Next question →'}
              </button>
            </div>
          </>
        ) : (
          <div className="qz-result">
            {rec?.newBest && <div className="qz-newbest">★ New personal best!</div>}
            <div className="big">{score}/{QS.length}</div>
            <div className="lbl">questions correct</div>
            <h3>{resultMsg}</h3>
            <p>{resultSub}</p>
            <div className="qz-meta">
              <div className="m">
                <div className="n">{rec?.best}/{QS.length}</div>
                <div className="l">Best score</div>
              </div>
              <div className="m">
                <div className="n">{rec?.streak}</div>
                <div className="l">Day streak</div>
              </div>
              <div className="m">
                <div className="n">{rec?.plays}</div>
                <div className="l">Played</div>
              </div>
            </div>
            <div className="qz-share">
              <div className="lab">Challenge a friend</div>
              <div className="share-row">
                <button className="share-btn primary" onClick={() => nativeShare(score)}>
                  <span className="gl">↗</span> Share my score
                </button>
                <button className="share-btn" onClick={() => shareX(score)}>
                  <span className="gl">𝕏</span> Post
                </button>
                <button className="share-btn" onClick={shareFB}>
                  <span className="gl">f</span> Share
                </button>
                <button className="share-btn" onClick={() => copyShare(score)}>
                  <span className="gl">⧉</span> Copy link
                </button>
              </div>
              <div className={`qz-copied${copied ? ' show' : ''}`}>
                {copied ? 'Copied to clipboard!' : ''}
              </div>
            </div>
            <button className="qz-again" onClick={reset}>
              Play again
            </button>
          </div>
        )}
      </div>
    </dialog>
  )
}
