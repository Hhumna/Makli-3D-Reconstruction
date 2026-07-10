import './Footer.css'

const footerLinks = [
  { href: '#history', label: 'History' },
  { href: '#architecture', label: 'Architecture' },
  { href: '#location', label: 'Location' },
  { href: '#reconstruction', label: 'Digital Reconstruction' },
  { href: '#preservation', label: 'Preservation' },
  { href: '#sources', label: 'Sources' },
]

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__group">
          <p className="site-footer__copy">
            A quiet study of Makli Necropolis as a layered cultural landscape and site of remembrance.
          </p>
        </div>

        <div className="site-footer__group">
          <ul className="site-footer__links">
            {footerLinks.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="site-footer__group">
          <p className="site-footer__note">
            Prepared for PreserveMy.World — Future Heritage Studio
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
