import { useEffect, useState } from 'react'

// Thin gradient bar that tracks reading progress down the page.
export default function ScrollProgress() {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const max = h.scrollHeight - h.clientHeight
      setWidth(max > 0 ? (h.scrollTop / max) * 100 : 0)
    }
    document.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    onScroll()
    return () => {
      document.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return <div className="scroll-progress" style={{ width: `${width}%` }} aria-hidden="true" />
}
