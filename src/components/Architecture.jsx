import { useEffect, useRef, useState } from 'react'
import './Architecture.css'

const features = [
  {
    title: 'Carved sandstone relief',
    text:
      'Chaukhandi-style slabs are cut into dense geometric and floral patterns that turn each surface into a field of ornament rather than a plain wall.',
    image: '/images/tomb-jam-nizamuddin.jpg',
    alt: 'Carved sandstone relief on a tomb facade',
  },
  {
    title: 'Gujarati-style jharokas',
    text:
      'The tomb of Jam Nizamuddin II shows carved balconies and projecting openings that echo Gujarati architectural forms, giving the structure a strong vertical rhythm.',
    image: '/images/tomb-isa-khan.jpg',
    alt: 'A tomb facade with carved balconies',
  },
  {
    title: 'Glazed tilework',
    text:
      'Later Tarkhan-era domes and pavilions were enriched with glazed blue and turquoise tilework, forming a luminous contrast to the surrounding stone.',
    image: '/images/tile-detail.jpg',
    alt: 'Blue and turquoise glazed tile detail',
  },
  {
    title: 'Inscriptions and scholarship',
    text:
      'Arabic and Persian inscriptions mark the scholarly and spiritual status of those interred, and they are often woven into the same decorative field as the architectural carving.',
    image: '/images/carving-detail.jpg',
    alt: 'Decorative carving with inscriptions',
  },
  {
    title: 'Corridors and pavilions',
    text:
      'Many tombs are arranged as corridors and pavilions, with roofs carried on carved stone pillars that create a quiet procession through the funerary landscape.',
    image: '/images/tomb-jam-nizamuddin.jpg',
    alt: 'Stone pavilion tomb structure',
  },
]

function Architecture() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const featureRefs = useRef([])

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      setCurrentIndex(0)
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.index)
            setCurrentIndex(index)
          }
        })
      },
      { threshold: 0.55 },
    )

    featureRefs.current.forEach((feature) => {
      if (feature) observer.observe(feature)
    })

    return () => observer.disconnect()
  }, [])

  const activeImage = features[currentIndex]?.image
  const activeAlt = features[currentIndex]?.alt

  return (
    <section id="architecture" className="architecture" aria-labelledby="architecture-heading">
      <div className="architecture__inner">
        <div className="architecture__gallery" aria-label="Architecture imagery">
          <div className="architecture__frame">
            {activeImage ? (
              <img src={activeImage} alt={activeAlt} loading="lazy" decoding="async" />
            ) : (
              <div className="architecture__placeholder">
                <span className="architecture__placeholder-icon">📷</span>
                <span>Image placeholder</span>
              </div>
            )}
          </div>
        </div>

        <div className="architecture__content">
          <div className="architecture__quote">
            Few sites anywhere fuse Islamic, Hindu, Persian, and Gujarati craftsmanship this completely, in one continuous burial ground.
          </div>

          <p className="subtle-label">Architecture</p>
          <h2 id="architecture-heading" className="hero__headline" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', color: 'var(--color-basalt)' }}>
            Stone, geometry, and ornament
          </h2>

          {features.map((feature, index) => {
            const isInView = currentIndex === index
            return (
              <article
                key={feature.title}
                ref={(node) => {
                  featureRefs.current[index] = node
                }}
                className={`architecture__feature${isInView ? ' is-in-view' : ''}`}
                data-index={index}
              >
                <h3 className="architecture__feature-title">{feature.title}</h3>
                <p className="architecture__feature-text">{feature.text}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Architecture
