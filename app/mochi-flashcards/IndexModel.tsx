'use client'

import { OrbitControls, useGLTF } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'

function Model() {
  const { scene } = useGLTF('/index-01.glb')

  return (
    <>
      <mesh>
        <sphereGeometry args={[0.25]} />
        <meshStandardMaterial color="green" />
      </mesh>
      <group scale={0.075}>
        <primitive object={scene} position={[-22.0085, -13.4703, -102.2624]} />
      </group>
    </>
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

useGLTF.preload('/index-01.glb')
