'use client'

import {
  Center,
  Environment,
  Lightformer,
  OrbitControls,
  useGLTF,
} from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useMemo } from 'react'
import {
  DataTexture,
  Mesh,
  MeshPhysicalMaterial,
  RedFormat,
  RepeatWrapping,
  UnsignedByteType,
} from 'three'

function Model() {
  const { scene } = useGLTF('/index-01.gltf')
  const { model, materials, texture } = useMemo(() => {
    const clone = scene.clone()
    const surfaceTexture = new DataTexture(
      Uint8Array.from({ length: 128 * 128 }, (_, index) => {
        const x = index % 128
        const y = Math.floor(index / 128)
        const grain = Math.sin(y * 0.9) * 18 + Math.sin(y * 0.17) * 10
        const noise = ((x * 17 + y * 31) % 23) - 11

        return 128 + grain + noise
      }),
      128,
      128,
      RedFormat,
      UnsignedByteType,
    )
    surfaceTexture.wrapS = RepeatWrapping
    surfaceTexture.wrapT = RepeatWrapping
    surfaceTexture.repeat.set(2, 8)
    surfaceTexture.needsUpdate = true

    const titanium = new MeshPhysicalMaterial({
      color: '#8c8f91',
      metalness: 0.82,
      roughness: 0.34,
      bumpMap: surfaceTexture,
      bumpScale: 0.018,
      clearcoat: 0.22,
      clearcoatRoughness: 0.48,
    })
    const detail = new MeshPhysicalMaterial({
      color: '#d7603f',
      metalness: 0.68,
      roughness: 0.3,
      bumpMap: surfaceTexture,
      bumpScale: 0.012,
      clearcoat: 0.3,
      clearcoatRoughness: 0.38,
    })
    let meshIndex = 0

    clone.traverse((object) => {
      object.frustumCulled = false

      if (object instanceof Mesh) {
        object.material = meshIndex === 0 ? titanium : detail
        meshIndex += 1
      }
    })

    return {
      model: clone,
      materials: [titanium, detail],
      texture: surfaceTexture,
    }
  }, [scene])

  useEffect(
    () => () => {
      materials.forEach((material) => material.dispose())
      texture.dispose()
    },
    [materials, texture],
  )

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
      <ambientLight intensity={0.45} />
      <hemisphereLight args={['#fff7ed', '#4b5563', 1.4]} />
      <spotLight
        position={[4, 5, 6]}
        angle={0.45}
        penumbra={0.8}
        intensity={45}
        color="#fff2df"
      />
      <spotLight
        position={[-5, 1, 3]}
        angle={0.55}
        penumbra={1}
        intensity={32}
        color="#dbeafe"
      />
      <pointLight position={[0, -4, -2]} intensity={18} color="#f36b47" />
      <Suspense fallback={null}>
        <Model />
        <Environment resolution={128}>
          <Lightformer
            form="ring"
            intensity={3}
            color="#fff4e6"
            scale={5}
            position={[0, 4, 2]}
            rotation-x={Math.PI / 2}
          />
          <Lightformer
            intensity={2}
            color="#dbeafe"
            scale={[4, 2, 1]}
            position={[-4, 0, 2]}
            rotation-y={Math.PI / 2}
          />
          <Lightformer
            intensity={2.5}
            color="#f36b47"
            scale={[2, 3, 1]}
            position={[4, -1, -1]}
            rotation-y={-Math.PI / 2}
          />
        </Environment>
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
