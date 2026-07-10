import './Preservation.css'

const naturalThreats = [
  'earthquakes and ground movement',
  'salt-laden wind and humidity',
  'monsoon rain and flood damage, including the 2010 floods and 2022 monsoon',
  'uncontrolled vegetation growth',
]

const humanThreats = [
  'encroachment',
  'theft or pilferage of carved stones and tiles',
  'chronic underfunding of maintenance',
  'lack of a comprehensive management plan, flagged repeatedly by UNESCO/ICOMOS monitoring missions in 2006, 2010, 2012, and 2016',
]

function Preservation() {
  return (
    <section id="preservation" className="preservation" aria-labelledby="preservation-heading">
      <div className="preservation__inner">
        <div className="preservation__intro">
          <p className="preservation__eyebrow">Preservation</p>
          <h2 id="preservation-heading" className="preservation__heading">
            A Race Against Time
          </h2>
          <p className="preservation__intro-copy">
            The tombs endure a combination of environmental stress and human pressures that make careful stewardship essential.
          </p>
        </div>

        <div className="preservation__columns">
          <div className="preservation__panel">
            <h3 className="preservation__panel-title">Natural Threats</h3>
            <ul className="preservation__list">
              {naturalThreats.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="preservation__panel">
            <h3 className="preservation__panel-title">Human Threats</h3>
            <ul className="preservation__list">
              {humanThreats.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="preservation__callout" role="note">
          <p>
            In 2022, monsoon damage left the Shaikh Jyio Tomb and a neighboring Samma-era tomb structurally critical — prompting an emergency UNESCO restoration project with Netherlands Funds-in-Trust support.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Preservation
