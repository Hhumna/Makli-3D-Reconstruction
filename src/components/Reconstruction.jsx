import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import './Reconstruction.css'
import ReconstructionUploader from './ReconstructionUploader'

const TombModel = lazy(() => import('./TombModel'))
const LivePointCloud = lazy(() => import('./LivePointCloud'))

const pipelineSteps = [
  {
    id: 'drone',
    icon: '📷',
    label: 'Drone Photography',
    description: 'Drone photography captures overlapping aerial images of a site from many angles, which provides the raw image input a real preservation pipeline would need.',
    action: '',
  },
  {
    id: 'photogrammetry',
    icon: '🧭',
    label: 'Photogrammetry',
    description: 'Photogrammetry matches shared features across overlapping photos to reconstruct 3D geometry and color. This is the same technique demonstrated live in the “Try It Yourself” tool above.',
    action: 'Try it below ↓',
  },
  {
    id: 'lidar',
    icon: '📡',
    label: 'LiDAR Scanning',
    description: 'LiDAR uses laser pulses to measure precise distances directly, producing highly accurate point clouds independent of lighting conditions. It is often combined with photogrammetry for the most accurate results.',
    action: '',
  },
  {
    id: 'model',
    icon: '🧱',
    label: '3D Model (Blender/Unity)',
    description: 'Once a point cloud exists, software such as Blender or Unity is used to clean it up, mesh it, and prepare it for virtual tours, VR/AR, or further restoration planning.',
    action: '',
  },
]

function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches)

    updatePreference()

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', updatePreference)
      return () => mediaQuery.removeEventListener('change', updatePreference)
    }

    mediaQuery.addListener(updatePreference)
    return () => mediaQuery.removeListener(updatePreference)
  }, [])

  return prefersReducedMotion
}

function Reconstruction() {
  const [liveResult, setLiveResult] = useState(null)
  const [expandedStepId, setExpandedStepId] = useState(null)
  const prefersReducedMotion = useReducedMotion()
  const tryItSectionRef = useRef(null)

  const handleToggleStep = (stepId) => {
    setExpandedStepId((currentStepId) => (currentStepId === stepId ? null : stepId))
  }

  const handleJumpToTryIt = (event) => {
    event.preventDefault()

    if (!tryItSectionRef.current) {
      return
    }

    tryItSectionRef.current.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    })
  }

  return (
    <section id="reconstruction" className="reconstruction" aria-labelledby="reconstruction-heading">
      <div className="reconstruction__inner">
        <div className="reconstruction__intro">
          <p className="reconstruction__eyebrow">Conceptual Model — Illustrative, Not a Verified Scan</p>
          <h2 id="reconstruction-heading" className="reconstruction__heading">
            What Digital Preservation Could Look Like
          </h2>
          <p className="reconstruction__body">
            Photogrammetry, drone photography, and LiDAR scanning could create a durable and accurate digital record of tombs such as Jam Nizamuddin II’s. The model below is a simplified stand-in for the kind of 3D output that such a workflow might eventually produce.
          </p>
        </div>

        <div className="reconstruction__viewer">
          <div className="reconstruction__section-block">
            <h3 className="reconstruction__section-heading">Concept Demo</h3>
            <div className="reconstruction__canvas-wrap">
              <Suspense fallback={<div className="reconstruction__loading">Loading model…</div>}>
                <TombModel />
              </Suspense>
            </div>
          </div>

          <div
            ref={tryItSectionRef}
            id="reconstruction-try-it-yourself"
            className="reconstruction__section-block reconstruction__section-block--interactive"
          >
            <h3 className="reconstruction__section-heading">Try It Yourself</h3>
            <p className="reconstruction__section-copy">
              Upload any photo of a Makli tomb and see a live point cloud generated in your browser, using the same method as our reconstruction research.
            </p>

            <div className="reconstruction__try-grid">
              <ReconstructionUploader onResult={setLiveResult} />

              <div className="reconstruction__live-canvas-wrap">
                {liveResult ? (
                  <Canvas camera={{ position: [0, 0, 3.6], fov: 42 }}>
                    <color attach="background" args={['#211D18']} />
                    <ambientLight intensity={0.7} />
                    <directionalLight position={[3, 5, 2]} intensity={1.1} />
                    <directionalLight position={[-3, 2, -2]} intensity={0.4} />
                    <Suspense fallback={null}>
                      <LivePointCloud positions={liveResult.positions} colors={liveResult.colors} pointSize={0.02} />
                    </Suspense>
                  </Canvas>
                ) : (
                  <div className="reconstruction__placeholder">Upload a photo to see it here</div>
                )}
              </div>
            </div>
          </div>

          <div className="reconstruction__pipeline" aria-label="Conceptual preservation pipeline">
            {pipelineSteps.map((step) => {
              const isExpanded = expandedStepId === step.id
              const panelId = `reconstruction-step-panel-${step.id}`

              return (
                <div key={step.id} className={`reconstruction__step-card ${isExpanded ? 'is-expanded' : ''}`}>
                  <button
                    type="button"
                    className="reconstruction__step-button"
                    aria-expanded={isExpanded}
                    aria-controls={panelId}
                    onClick={() => handleToggleStep(step.id)}
                  >
                    <span className="reconstruction__step-header">
                      <span className="reconstruction__step-icon" aria-hidden="true">{step.icon}</span>
                      <span className="reconstruction__step-label">{step.label}</span>
                      <span className="reconstruction__step-indicator" aria-hidden="true">{isExpanded ? '▾' : '▸'}</span>
                    </span>
                  </button>

                  <div
                    id={panelId}
                    className={`reconstruction__step-body ${isExpanded ? 'is-open' : ''}`}
                    role="region"
                    aria-hidden={!isExpanded}
                  >
                    <div className="reconstruction__step-body-inner">
                      <p className="reconstruction__step-description">{step.description}</p>
                      {step.action ? (
                        <a className="reconstruction__step-link" href="#reconstruction-try-it-yourself" onClick={handleJumpToTryIt}>
                          {step.action}
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Reconstruction
