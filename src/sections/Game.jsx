import Reveal from '../components/Reveal'

const LETTERS = ['A', 'B', 'C', 'D']

function StatRow({ stats }) {
  if (stats?.plays) {
    return (
      <>
        <span className="gstat">
          <span className="st">★</span> Best <b>{stats.best || 0}/5</b>
        </span>
        <span className="gstat">
          <span className="st">★</span> <b>{stats.streak || 1}</b>-day streak
        </span>
        <span className="gstat">
          Played <b>{stats.plays}×</b>
        </span>
      </>
    )
  }
  return (
    <span className="gstat">
      <span className="st">★</span> Play to start your streak
    </span>
  )
}

export default function Game({ data, num = '07', anchor = 'game', openQuiz, stats }) {
  const preview = (data.questions || [])[0]
  return (
    <section className="game" id={anchor}>
      <div className="wrap">
        <div className="game-card">
          <Reveal className="game-copy">
            <div className="game-head">
              <svg
                className="game-emblem"
                viewBox="0 0 100 100"
                fill="none"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="22" y="74" width="56" height="13" rx="6.5" fill="#E7D9B0" />
                <circle cx="28" cy="80.5" r="3.8" fill="none" stroke="#C9B583" strokeWidth="2" />
                <circle cx="72" cy="80.5" r="3.8" fill="none" stroke="#C9B583" strokeWidth="2" />
                <rect x="28" y="20" width="44" height="60" rx="2.5" fill="#FBF4E0" />
                <path
                  d="M37 33 q2.4 -3 4.8 0 t4.8 0 t4.8 0 t4.8 0"
                  stroke="#b72e3f"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
                <path d="M37 43 h26" stroke="#CBBC92" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M37 50 h26" stroke="#CBBC92" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M37 57 h17" stroke="#CBBC92" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M57 67 l-2.5 7 4.5 -2.2 4.5 2.2 -2.5 -7Z" fill="#9a2533" />
                <circle cx="61" cy="64" r="6.2" fill="#b72e3f" />
                <path
                  d="M61 60.4 l1 2.3 2.4 .9 -2.4 .9 -1 2.3 -1 -2.3 -2.4 -.9 2.4 -.9Z"
                  fill="#ffffff"
                />
                <rect x="22" y="13" width="56" height="13" rx="6.5" fill="#EADDB8" />
                <circle cx="28" cy="19.5" r="3.8" fill="none" stroke="#C9B583" strokeWidth="2" />
                <circle cx="72" cy="19.5" r="3.8" fill="none" stroke="#C9B583" strokeWidth="2" />
              </svg>
              <div className="game-head-txt">
                <p className="kk">{num} · {data.kicker}</p>
                <h2>{data.heading}</h2>
              </div>
            </div>
            <p>{data.blurb}</p>
            <div className="game-stats">
              <StatRow stats={stats} />
            </div>
            <button className="play-game" onClick={openQuiz}>
              <span className="ic">▶</span> Play today's challenge
            </button>
          </Reveal>

          <Reveal
            as="button"
            className="game-visual"
            delay={1}
            type="button"
            onClick={openQuiz}
            aria-label="Play today's civics challenge"
          >
            <span className="gv-tag">★ Today's question</span>
            <p className="gv-q">{preview?.q}</p>
            {(preview?.opts || []).map((o, i) => (
              <div className="gv-opt" key={i}>
                <span className="k">{LETTERS[i]}</span> {o}
              </div>
            ))}
            <span className="gv-cta">Tap to play all five →</span>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
