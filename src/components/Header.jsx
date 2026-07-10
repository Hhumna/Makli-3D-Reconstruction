import { useEffect, useState } from 'react'
import './Header.css'

const navItems = [
  { href: '#hero', label: 'Hero' },
  { href: '#history', label: 'History' },
  { href: '#architecture', label: 'Architecture' },
  { href: '#location', label: 'Location' },
  { href: '#reconstruction', label: 'Digital Reconstruction' },
  { href: '#preservation', label: 'Preservation' },
  { href: '#sources', label: 'Sources' },
]

function Header() {
  const [solid, setSolid] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setSolid(window.scrollY > 80)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setPrefersReducedMotion(mediaQuery.matches)

    update()
    mediaQuery.addEventListener('change', update)

    return () => mediaQuery.removeEventListener('change', update)
  }, [])

  const handleNavClick = (event, href) => {
    event.preventDefault()
    const target = document.querySelector(href)

    if (target) {
      target.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      })
    }

    setMenuOpen(false)
  }

  return (
    <header className={`site-header${solid ? ' site-header--solid' : ''}`}>
      <div className="site-header__inner">
        <a href="#top" className="site-header__wordmark" onClick={(event) => handleNavClick(event, '#top')}>
          MAKLI
        </a>

        <nav className="site-header__nav" aria-label="Section navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} onClick={(event) => handleNavClick(event, item.href)}>
              {item.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="site-header__menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          ☰
        </button>
      </div>

      {menuOpen && (
        <div id="mobile-menu" className="site-header__menu" role="dialog" aria-modal="true">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(event) => handleNavClick(event, item.href)}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </header>
  )
}

export default Header
