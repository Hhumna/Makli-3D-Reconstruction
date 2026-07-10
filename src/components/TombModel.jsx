import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setPrefersReducedMotion(mediaQuery.matches)

    update()
    mediaQuery.addEventListener('change', update)

    return () => mediaQuery.removeEventListener('change', update)
  }, [])

  return prefersReducedMotion
}

function TombGeometry({ isInteracting, prefersReducedMotion }) {
  const groupRef = useRef(null)

  const columns = useMemo(() => {
    const count = 8
    return Array.from({ length: count }, (_, index) => {
      const angle = (index / count) * Math.PI * 2
      return {
        x: Math.cos(angle) * 1.15,
        z: Math.sin(angle) * 1.15,
      }
    })
  }, [])

  useFrame((_, delta) => {
    if (!groupRef.current || prefersReducedMotion || isInteracting) return
    groupRef.current.rotation.y += delta * 0.25
  })

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[2.1, 0.18, 2.1]} />
        <meshStandardMaterial color="var(--color-sandstone)" roughness={0.82} metalness={0.04} />
      </mesh>

      {columns.map((column, index) => (
        <mesh key={index} position={[column.x, 0.95, column.z]}>
          <cylinderGeometry args={[0.05, 0.06, 1.2, 8]} />
          <meshStandardMaterial color="var(--color-basalt)" roughness={0.7} metalness={0.05} />
        </mesh>
      ))}

      <mesh position={[0, 1.45, 0]}>
        <coneGeometry args={[1.2, 0.9, 6]} />
        <meshStandardMaterial color="var(--color-sandstone)" roughness={0.8} metalness={0.04} />
      </mesh>

      <mesh position={[0, 1.72, 0]}>
        <sphereGeometry args={[0.42, 16, 16]} />
        <meshStandardMaterial color="var(--color-aged-gold)" roughness={0.55} metalness={0.08} />
      </mesh>
    </group>
  )
}

function TombScene() {
  const [isInteracting, setIsInteracting] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  return (
    <>
      <color attach="background" args={['#211D18']} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 2]} intensity={1.1} />
      <directionalLight position={[-3, 2, -2]} intensity={0.4} />
      <TombGeometry isInteracting={isInteracting} prefersReducedMotion={prefersReducedMotion} />
      <OrbitControls
        enablePan={false}
        enableZoom
        enableKeys
        autoRotate={false}
        minDistance={2.8}
        maxDistance={7.5}
        makeDefault
        onStart={() => setIsInteracting(true)}
        onEnd={() => setIsInteracting(false)}
      />
    </>
  )
}

function TombModel() {
  return (
    <div className="reconstruction__canvas-wrap" role="group" aria-label="Interactive 3D reconstruction model of a conceptual tomb pavilion" tabIndex={0}>
      <Canvas camera={{ position: [0, 1.9, 4.4], fov: 42 }}>
        <TombScene />
      </Canvas>
    </div>
  )
}

export default TombModel
