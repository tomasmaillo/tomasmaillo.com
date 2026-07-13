'use client'

import {
  Center,
  Environment,
  Lightformer,
  PresentationControls,
  useGLTF,
} from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useMemo } from 'react'
import {
  BufferGeometry,
  DataTexture,
  Mesh,
  MeshPhysicalMaterial,
  RedFormat,
  RepeatWrapping,
  UnsignedByteType,
} from 'three'
import { toCreasedNormals } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

function Model() {
  const { scene } = useGLTF('/index-01.gltf')
  const { model, materials, texture, geometries } = useMemo(() => {
    const clone = scene.clone()
    const smoothedGeometries: BufferGeometry[] = []
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
    let meshIndex = 0

    clone.traverse((object) => {
      object.frustumCulled = false

      if (object instanceof Mesh) {
        if (meshIndex === 0) {
          const geometry = toCreasedNormals(object.geometry, Math.PI / 3)
          object.geometry = geometry
          object.material = titanium
          smoothedGeometries.push(geometry)
        } else {
          object.visible = false
        }
        meshIndex += 1
      }
    })

    return {
      model: clone,
      materials: [titanium],
      texture: surfaceTexture,
      geometries: smoothedGeometries,
    }
  }, [scene])

  useEffect(
    () => () => {
      materials.forEach((material) => material.dispose())
      geometries.forEach((geometry) => geometry.dispose())
      texture.dispose()
    },
    [geometries, materials, texture],
  )

  return (
    <group scale={0.05} rotation-x={Math.PI / 2}>
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
      camera={{ position: [0, 0, 3.2], fov: 38 }}
      dpr={[1, 1.5]}
      frameloop={isVisible && !prefersReducedMotion ? 'always' : 'demand'}
      gl={{ alpha: true, antialias: true }}
      performance={{ min: 0.5 }}>
      <ambientLight intensity={0.45} />
      <hemisphereLight args={['#f8fafc', '#4b5563', 1.4]} />
      <spotLight
        position={[4, 5, 6]}
        angle={0.45}
        penumbra={0.8}
        intensity={45}
        color="#ffffff"
      />
      <spotLight
        position={[-5, 1, 3]}
        angle={0.55}
        penumbra={1}
        intensity={32}
        color="#dbeafe"
      />
      <Suspense fallback={null}>
        <PresentationControls
          global
          speed={0.9}
          polar={[-Math.PI / 3, Math.PI / 3]}
          azimuth={[-Infinity, Infinity]}>
          <Model />
        </PresentationControls>
        <Environment resolution={128}>
          <Lightformer
            form="ring"
            intensity={3}
            color="#f8fafc"
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
            intensity={1.5}
            color="#e2e8f0"
            scale={[2, 3, 1]}
            position={[4, -1, -1]}
            rotation-y={-Math.PI / 2}
          />
        </Environment>
      </Suspense>
    </Canvas>
  )
}

useGLTF.preload('/index-01.gltf')
