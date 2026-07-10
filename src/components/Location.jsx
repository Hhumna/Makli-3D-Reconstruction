import './Location.css'

const mapLinks = [
  {
    label: 'Open in Google Maps',
    href: 'https://www.google.com/maps?q=24.7433,67.8909',
  },
  {
    label: 'Get Directions',
    href: 'https://www.google.com/maps/dir/?api=1&destination=24.7433,67.8909',
  },
  {
    label: 'View on OpenStreetMap',
    href: 'https://www.openstreetmap.org/?mlat=24.7433&mlon=67.8909#map=13/24.7433/67.8909',
  },
]

function Location() {
  return (
    <section id="location" className="location" aria-labelledby="location-heading">
      <div className="location__inner">
        <div className="location__panel">
          <p className="subtle-label">Location</p>
          <h2 id="location-heading" className="hero__headline" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', color: 'var(--color-basalt)', marginBottom: '0.8rem' }}>
            The necropolis in context
          </h2>
          <p className="location__intro">
            Makli Hill sits on the western edge of the Indus Delta, about 98 km east of Karachi and roughly 6 km from Thatta, on a low limestone ridge overlooking the plain.
          </p>
          <p className="location__coords">24.7433° N, 67.8909° E</p>
          <div className="location__links">
            {mapLinks.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="location__map-wrap">
          <span className="location__sr-only">
            A satellite-style map showing Makli Necropolis near Thatta at 24.7433° north and 67.8909° east.
          </span>
          <iframe
            title="Map of Makli Necropolis near Thatta"
            className="location__map"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=24.7433,67.8909&z=13&output=embed"
          />
        </div>
      </div>
    </section>
  )
}

export default Location
