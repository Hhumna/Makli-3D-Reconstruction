import { useMemo, useState } from 'react'
import sources from '../data/sources.json'
import './Sources.css'

function Sources() {
  const [sortKey, setSortKey] = useState('id')
  const [sortDirection, setSortDirection] = useState('asc')

  const sortedSources = useMemo(() => {
    const items = [...sources]
    items.sort((a, b) => {
      const aValue = a[sortKey]
      const bValue = b[sortKey]

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue)
      }

      return aValue > bValue ? 1 : -1
    })

    return sortDirection === 'desc' ? items.reverse() : items
  }, [sortDirection, sortKey])

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'))
      return
    }

    setSortKey(key)
    setSortDirection('asc')
  }

  return (
    <section id="sources" className="sources" aria-labelledby="sources-heading">
      <div className="sources__inner">
        <div className="sources__intro">
          <p className="sources__eyebrow">Sources</p>
          <h2 id="sources-heading" className="sources__heading">
            Research log
          </h2>
          <p className="sources__intro-copy">
            A working record of materials consulted for the site’s historical, architectural, and conservation narrative.
          </p>
        </div>

        <div className="sources__table-wrap" role="region" aria-label="Source log table">
          <table className="sources__table">
            <thead>
              <tr>
                <th scope="col">
                  <button type="button" onClick={() => toggleSort('id')}>
                    #
                  </button>
                </th>
                <th scope="col">
                  <button type="button" onClick={() => toggleSort('source')}>
                    Source
                  </button>
                </th>
                <th scope="col">
                  <button type="button" onClick={() => toggleSort('type')}>
                    Type
                  </button>
                </th>
                <th scope="col">Used For</th>
                <th scope="col">Link</th>
              </tr>
            </thead>
            <tbody>
              {sortedSources.map((item) => (
                <tr key={item.id}>
                  <td data-label="#">{item.id}</td>
                  <td data-label="Source">{item.source}</td>
                  <td data-label="Type">{item.type}</td>
                  <td data-label="Used For">{item.usedFor}</td>
                  <td data-label="Link">
                    <a href={item.url} target="_blank" rel="noreferrer">
                      Open
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default Sources
