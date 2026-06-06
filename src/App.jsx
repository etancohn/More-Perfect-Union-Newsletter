import { useCallback, useEffect, useState } from 'react'
import ScrollProgress from './components/ScrollProgress'
import QuizDialog from './components/QuizDialog'
import EnvelopeIntro from './components/EnvelopeIntro'
import { shouldPlayIntro, markIntroSeen } from './lib/intro'
import Hero from './sections/Hero'
import Letter from './sections/Letter'
import Toc from './sections/Toc'
import Feature from './sections/Feature'
import Resources from './sections/Resources'
import Events from './sections/Events'
import Spotlight from './sections/Spotlight'
import Happenings from './sections/Happenings'
import Faq from './sections/Faq'
import Game from './sections/Game'
import Footer from './sections/Footer'
import { loadStats } from './lib/quiz'

export default function App() {
  const [quizOpen, setQuizOpen] = useState(false)
  const [stats, setStats] = useState(loadStats)
  // Decide once, before first paint, whether the envelope intro should play.
  const [introActive, setIntroActive] = useState(shouldPlayIntro)

  const openQuiz = useCallback(() => setQuizOpen(true), [])

  // Auto-open the quiz when arriving from the email's game card (…/#play), but
  // wait until the intro is done — the quiz uses showModal() (top layer) and
  // would otherwise render above the overlay.
  useEffect(() => {
    if (window.location.hash === '#play' && !introActive) {
      const t = setTimeout(() => setQuizOpen(true), 400)
      return () => clearTimeout(t)
    }
  }, [introActive])

  const handleIntroDone = useCallback(() => {
    markIntroSeen()
    setIntroActive(false)
  }, [])

  return (
    <>
      <ScrollProgress />
      <div className="page">
        <Hero />
        <Letter />
        <Toc />
        <Feature />
        <Resources />
        <Events />
        <Spotlight />
        <Happenings />
        <Faq />
        <Game openQuiz={openQuiz} stats={stats} />
        <Footer />
      </div>
      <QuizDialog
        open={quizOpen}
        onClose={() => setQuizOpen(false)}
        onStatsChange={setStats}
      />
      {introActive && <EnvelopeIntro onDone={handleIntroDone} />}
    </>
  )
}
