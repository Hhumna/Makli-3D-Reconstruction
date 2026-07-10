import { Suspense } from 'react'
import './Reconstruction.css'
import TombModel from './TombModel'

const pipelineSteps = [
  { icon: '📷', label: 'Drone Photography' },
  { icon: '🧭', label: 'Photogrammetry' },
  { icon: '📡', label: 'LiDAR Scanning' },
  { icon: '🧱', label: '3D Model (Blender/Unity)' },
]

function Reconstruction() {
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
          <div className="reconstruction__canvas-wrap">
            <Suspense fallback={<div className="reconstruction__loading">Loading model…</div>}>
              <TombModel />
            </Suspense>
          </div>

          <div className="reconstruction__pipeline" aria-label="Conceptual preservation pipeline">
            {pipelineSteps.map((step) => (
              <div key={step.label} className="reconstruction__step">
                <span className="reconstruction__step-icon" aria-hidden="true">{step.icon}</span>
                <span className="reconstruction__step-label">{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Reconstruction
