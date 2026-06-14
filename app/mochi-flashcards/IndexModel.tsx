'use client'

import { Center, OrbitControls, useGLTF } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense, useMemo } from 'react'

function Model() {
  const { scene } = useGLTF('/index-01.gltf')
  const model = useMemo(() => {
    const clone = scene.clone()

    clone.traverse((object) => {
      object.frustumCulled = false
    })

    return clone
  }, [scene])

  return (
    <group scale={0.075}>
      <Center>
        <primitive object={model} />
      </Center>
    </group>
  )
}

export default function IndexModel({
  isVisible,
  prefersReducedMotion,
}: {
  isVisible: boolean
  prefersReducedMotion: boolean
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 38 }}
      dpr={[1, 1.5]}
      frameloop={isVisible && !prefersReducedMotion ? 'always' : 'demand'}
      gl={{ alpha: true, antialias: true }}
      performance={{ min: 0.5 }}>
      <ambientLight intensity={1.4} />
      <directionalLight position={[4, 6, 5]} intensity={2.5} />
      <Suspense fallback={null}>
        <Model />
      </Suspense>
      <OrbitControls
        autoRotate={!prefersReducedMotion}
        autoRotateSpeed={1.4}
        enableDamping
        enablePan={false}
        enableZoom={false}
      />
    </Canvas>
  )
}

useGLTF.preload('/index-01.gltf')
