import { useEffect, useRef } from 'react'
import './Hero.css'

const stats = [
  { label: '~500,000–1,000,000 tombs' },
  { label: '10 km²' },
  { label: '14th–18th century' },
  { label: 'UNESCO World Heritage Site, 1981' },
]

function Hero() {
  const silhouettesRef = useRef(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mediaQuery.matches) return undefined

    const handleScroll = () => {
      const scrollY = window.scrollY
      const offset = Math.max(-20, Math.min(24, scrollY * -0.015))
      if (silhouettesRef.current) {
        silhouettesRef.current.style.transform = `translate3d(0, ${offset}px, 0)`
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section id="hero" className="hero" aria-labelledby="hero-heading">
      <div className="hero__media" aria-hidden="true" />
      <div className="hero__strata" aria-hidden="true" />

      <div className="hero__silhouettes" ref={silhouettesRef} aria-hidden="true">
        <div className="hero__silhouette">
          <svg viewBox="0 0 800 280" role="presentation">
            <path d="M60 260 L120 180 L180 260 L240 180 L300 260 L360 140 L430 260 L500 180 L560 260 L620 140 L690 260 L740 220 L780 260 L780 280 L20 280 Z" fill="rgba(33,29,24,0.78)" />
            <path d="M260 260 L320 120 L380 260 Z" fill="rgba(33,29,24,0.66)" />
            <path d="M440 260 L500 90 L560 260 Z" fill="rgba(33,29,24,0.7)" />
          </svg>
        </div>
      </div>

      <div className="hero__content">
        <p className="hero__eyebrow">Thatta, Sindh • Pakistan</p>
        <h1 id="hero-heading" className="hero__headline">
          Four Centuries, Carved Into One Hill
        </h1>
        <p className="hero__subhead">
          Makli Necropolis, Thatta — one of the largest funerary sites on Earth, and one of Pakistan's most urgent preservation cases.
        </p>

        <div className="hero__stats" aria-label="Site highlights">
          {stats.map((stat) => (
            <span key={stat.label} className="hero__stat">
              {stat.label}
            </span>
          ))}
        </div>
      </div>

      <div className="hero__scroll" aria-hidden="true">
        <div className="hero__scroll-line" />
        <span className="hero__scroll-label">Scroll</span>
      </div>
    </section>
  )
}

export default Hero
