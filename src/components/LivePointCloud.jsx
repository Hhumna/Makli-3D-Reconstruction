import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls, PointMaterial, Points } from '@react-three/drei'

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

export default function LivePointCloud({ positions, colors, pointSize = 0.02 }) {
  const groupRef = useRef(null)
  const [isInteracting, setIsInteracting] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const isRenderable = Boolean(positions?.length && colors?.length)

  useFrame((_, delta) => {
    if (!groupRef.current || !isRenderable || prefersReducedMotion || isInteracting) {
      return
    }

    groupRef.current.rotation.y += delta * 0.25
  })

  if (!isRenderable) {
    return null
  }

  return (
    <>
      <group ref={groupRef}>
        <Points positions={positions} colors={colors} frustumCulled={false}>
          <PointMaterial
            size={pointSize}
            vertexColors
            transparent
            opacity={0.95}
            depthWrite={false}
            sizeAttenuation
            alphaTest={0.01}
          />
        </Points>
      </group>

      <OrbitControls
        enablePan={false}
        enableZoom
        enableKeys
        autoRotate={false}
        minDistance={1.5}
        maxDistance={7.5}
        makeDefault
        onStart={() => setIsInteracting(true)}
        onEnd={() => setIsInteracting(false)}
      />
    </>
  )
}
