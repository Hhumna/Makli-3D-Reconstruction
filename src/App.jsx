import { Suspense, lazy } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import History from './components/History'
import Architecture from './components/Architecture'
import Location from './components/Location'
import Preservation from './components/Preservation'
import Sources from './components/Sources'
import Footer from './components/Footer'

const Reconstruction = lazy(() => import('./components/Reconstruction'))

function App() {
  return (
    <div id="top" className="site-shell">
      <Header />
      <main>
        <Hero />
        <History />
        <Architecture />
        <Location />
        <Suspense
          fallback={
            <section id="reconstruction" className="reconstruction reconstruction--fallback" aria-live="polite">
              <div className="reconstruction__inner">
                <p className="reconstruction__eyebrow">Digital Reconstruction</p>
                <h2 className="reconstruction__heading">Loading reconstruction view…</h2>
              </div>
            </section>
          }
        >
          <Reconstruction />
        </Suspense>
        <Preservation />
        <Sources />
      </main>
      <Footer />
    </div>
  )
}

export default App
