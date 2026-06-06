// Question of the Day — data, persistence, and sharing helpers.

export const QUESTIONS = [
  {
    q: 'How many U.S. states must ratify a constitutional amendment for it to be adopted?',
    opts: ['Two-thirds (34)', 'Three-quarters (38)', 'A simple majority (26)'],
    a: 1,
    ex: '<b>Three-quarters — 38 of 50 states.</b> Article V requires ratification by three-fourths of the states, either through their legislatures or special conventions.',
  },
  {
    q: 'Who has the constitutional power to declare war?',
    opts: ['The President', 'The Supreme Court', 'Congress'],
    a: 2,
    ex: '<b>Congress.</b> Article I, Section 8 gives Congress the power to declare war, though presidents have often committed forces under other authorities.',
  },
  {
    q: 'How many members serve in the U.S. House of Representatives?',
    opts: ['435', '100', '538'],
    a: 0,
    ex: '<b>435 voting members</b>, apportioned among the states by population. The Senate has 100; 538 is the total number of electors in the Electoral College.',
  },
  {
    q: 'Which amendment guarantees freedom of speech, religion, press, assembly, and petition?',
    opts: ['The Fourth Amendment', 'The First Amendment', 'The Tenth Amendment'],
    a: 1,
    ex: '<b>The First Amendment.</b> It protects five core freedoms and is the cornerstone of civic participation in a democracy.',
  },
  {
    q: 'What is the minimum age to be elected President of the United States?',
    opts: ['30', '35', '40'],
    a: 1,
    ex: '<b>35 years old.</b> The Constitution also requires the President to be a natural-born citizen and a U.S. resident for at least 14 years.',
  },
]

const STORE = 'mpu_qotd'

export function loadStats() {
  try {
    return JSON.parse(localStorage.getItem(STORE)) || {}
  } catch {
    return {}
  }
}

function saveStats(s) {
  try {
    localStorage.setItem(STORE, JSON.stringify(s))
  } catch {
    /* ignore (private mode, etc.) */
  }
}

const todayKey = () => new Date().toISOString().slice(0, 10)
const dayDiff = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000)

// Persist a finished game and return the updated record (best / streak / plays / newBest).
export function recordResult(sc) {
  const s = loadStats()
  const today = todayKey()
  const prevBest = s.best || 0
  const newBest = sc > prevBest
  s.best = Math.max(prevBest, sc)
  s.plays = (s.plays || 0) + 1
  if (s.lastDay === today) s.streak = s.streak || 1
  else if (s.lastDay && dayDiff(s.lastDay, today) === 1) s.streak = (s.streak || 0) + 1
  else s.streak = 1
  s.lastDay = today
  saveStats(s)
  return { best: s.best, streak: s.streak, plays: s.plays, newBest }
}

export const shareMsg = (sc) =>
  `I scored ${sc}/5 on today’s “A More Perfect Union” civics challenge. How well do you know your democracy?`
export const shareUrl = () => location.href.split('#')[0] + '#play'

export function shareX(sc) {
  window.open(
    'https://twitter.com/intent/tweet?text=' +
      encodeURIComponent(shareMsg(sc)) +
      '&url=' +
      encodeURIComponent(shareUrl()),
    '_blank',
    'noopener'
  )
}
export function shareFB() {
  window.open(
    'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(shareUrl()),
    '_blank',
    'noopener'
  )
}
