import { useCallback, useEffect, useMemo, useState } from 'react'
import ScrollProgress from '../components/ScrollProgress'
import QuizDialog from '../components/QuizDialog'
import EnvelopeIntro from '../components/EnvelopeIntro'
import { shouldPlayIntro, markIntroSeen } from '../lib/intro'
import Hero from '../sections/Hero'
import Letter from '../sections/Letter'
import Toc from '../sections/Toc'
import Feature from '../sections/Feature'
import Resources from '../sections/Resources'
import Events from '../sections/Events'
import Spotlight from '../sections/Spotlight'
import Happenings from '../sections/Happenings'
import Faq from '../sections/Faq'
import Game from '../sections/Game'
import Prose from '../sections/Prose'
import Footer from '../sections/Footer'
import { loadStats } from '../lib/quiz'
import { numberedSections, tocItems, toQuizQuestions } from '../lib/postSchema'

const COMPONENTS = {
  feature: Feature,
  cards: Resources,
  events: Events,
  spotlight: Spotlight,
  happenings: Happenings,
  accordion: Faq,
  qotd: Game,
  prose: Prose,
}

// Renders a complete post: page chrome, all sections (in order), the quiz
// dialog, and (unless `preview`) the one-time envelope intro.
//   preview=true → static render for the dashboard (no intro, no scroll lock).
export default function PostView({ post, preview = false }) {
  const [quizOpen, setQuizOpen] = useState(false)
  const [stats, setStats] = useState(loadStats)
  const [introActive, setIntroActive] = useState(preview ? false : shouldPlayIntro)
  const [heroEntered, setHeroEntered] = useState(false)

  const openQuiz = useCallback(() => setQuizOpen(true), [])

  const sections = useMemo(() => numberedSections(post), [post])
  const toc = useMemo(() => tocItems(post), [post])
  const qotd = useMemo(() => sections.find((s) => s.type === 'qotd'), [sections])
  const quizQuestions = useMemo(
    () => (qotd ? toQuizQuestions(qotd.web.questions) : []),
    [qotd]
  )

  // Auto-open the quiz when arriving from the email's game card (…/#play).
  useEffect(() => {
    if (preview) return
    if (window.location.hash === '#play' && !introActive) {
      const t = setTimeout(() => setQuizOpen(true), 400)
      return () => clearTimeout(t)
    }
  }, [introActive, preview])

  const handleIntroDone = useCallback(() => {
    markIntroSeen()
    setIntroActive(false)
    setHeroEntered(true)
  }, [])

  return (
    <>
      {!preview && <ScrollProgress />}
      <div className="page">
        <Hero data={post.hero} edition={post.edition} armed={introActive} entered={heroEntered} />
        <Letter data={post.letter} />
        {toc.length > 0 && <Toc items={toc} />}
        {sections.map((s) => {
          const Cmp = COMPONENTS[s.type]
          if (!Cmp) return null
          return (
            <Cmp
              key={s.id}
              data={s.web}
              num={s.num}
              anchor={s.anchor}
              {...(s.type === 'qotd' ? { openQuiz, stats } : {})}
            />
          )
        })}
        <Footer data={post.footer} />
      </div>
      <QuizDialog
        open={quizOpen}
        onClose={() => setQuizOpen(false)}
        onStatsChange={setStats}
        questions={quizQuestions}
      />
      {introActive && <EnvelopeIntro onDone={handleIntroDone} />}
    </>
  )
}
