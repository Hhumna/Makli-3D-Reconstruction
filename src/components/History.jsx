import { useEffect, useRef, useState } from 'react'
import './History.css'

const dynasties = [
  {
    name: 'Samma Dynasty',
    period: '14th–16th century',
    body:
      'Rajput princes took Thatta in 1335, and the necropolis expanded under their rule. Tombs from this era show strong Gujarati influence fused with Hindu and Muslim decorative vocabularies.',
    anchorMonument: 'Tomb of Jam Nizamuddin II (completed 1510)',
  },
  {
    name: 'Arghun Dynasty',
    period: 'Early–mid 16th century',
    body:
      'The Arghuns succeeded the Samma and continued to shape the necropolis as Thatta remained a regional center of power. Their building programme extended the funerary landscape and helped consolidate the city’s prestige.',
    anchorMonument: 'Continued expansion of the necropolis as a courtly funerary landscape',
  },
  {
    name: 'Tarkhan Dynasty',
    period: 'Mid-late 16th–17th century',
    body:
      'The Tarkhans oversaw some of the most architecturally elaborate tombs in the complex, especially around the late 16th and early 17th centuries. The period is marked by ambitious mausolea and richly decorated structures that bridge the late medieval and Mughal eras.',
    anchorMonument: 'Isa Khan Hussain II Tarkhan mausoleum and the blue-and-turquoise tomb of Jan Beg Tarkhan',
  },
  {
    name: 'Mughal Period',
    period: '1592–1739',
    body:
      'Thatta was governed in the name of the Delhi emperors during the Mughal period, and construction continued until Sindh was ceded to Nadir Shah of Iran in 1739. After that, Makli entered a long decline as the city’s political dominance waned.',
    anchorMonument: 'Mughal-era funerary construction at Makli and Thatta',
  },
]

function History() {
  const [visibleBands, setVisibleBands] = useState([])
  const bandRefs = useRef([])

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      setVisibleBands(dynasties.map((_, index) => index))
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.index)
            setVisibleBands((current) => (current.includes(index) ? current : [...current, index]))
          }
        })
      },
      { threshold: 0.2 },
    )

    bandRefs.current.forEach((band) => {
      if (band) observer.observe(band)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section id="history" className="history" aria-labelledby="history-heading">
      <div className="history__inner">
        <h2 id="history-heading" className="hero__headline" style={{ fontSize: 'clamp(1.9rem, 3.1vw, 2.6rem)', marginBottom: '0.6rem' }}>
          A hill of successive layers
        </h2>

        {dynasties.map((dynasty, index) => {
          const isVisible = visibleBands.includes(index)
          const isRight = index % 2 === 1

          return (
            <article
              key={dynasty.name}
              ref={(node) => {
                bandRefs.current[index] = node
              }}
              data-index={index}
              className={`history__band${isRight ? ' history__band--right' : ' history__band--left'}${isVisible ? ' is-visible' : ''}`}
            >
              <div className="history__label">{dynasty.name}</div>
              <div className="history__content">
                <p className="history__meta">{dynasty.period}</p>
                <h3 className="history__heading">{dynasty.name}</h3>
                <p className="history__body">{dynasty.body}</p>
                <p className="history__detail">
                  <span style={{ fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.16em', marginRight: '0.45rem' }}>
                    Anchor monument
                  </span>
                  {dynasty.anchorMonument}
                </p>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default History
