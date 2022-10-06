import React, { FC, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  Float,
  useScroll,
  ScrollControls,
  Scroll,
  useProgress,
  OrbitControls,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import styled from "styled-components";

import { useScreenSize } from "../helpers";
import TomasSmol from "./TomasSmol";
import Title3D from "./Title3D";

const Composition: FC = () => {
  const { progress } = useProgress();
  const [isSmallScreen] = useScreenSize();
  const [showModel, setShowModel] = useState(false);
  const modelOffsetRef = useRef<any>();

  const avatarPosition = isSmallScreen
    ? new THREE.Vector3(0.2, 1.2, 0)
    : new THREE.Vector3(0.8, 1.2, 0.2);

  useEffect(() => {
    if (!modelOffsetRef.current) return;
    modelOffsetRef.current.position.set(1, -5, 1);
  }, []);

  useFrame((state) => {
    state.camera.position.lerp(
      new THREE.Vector3(0, document.documentElement.scrollTop * -0.005 + 2, 1),
      0.05
    );

    if (!showModel) return;
    modelOffsetRef.current.position.lerp(avatarPosition, 0.01);
  });

  // TODO: there must be a better way
  useEffect(() => {
    setTimeout(() => {
      setShowModel(true);
    }, 3000);
  }, [progress]);

  return (
    <>
      <Title3D />
      {/* <OrbitControls /> */}
      <Float
        speed={1}
        rotationIntensity={0.2}
        floatIntensity={0.7}
        floatingRange={[-2.2, -2]}
      >
        <group ref={modelOffsetRef}>
          <TomasSmol>{/* <SpeechBubble /> */}</TomasSmol>
        </group>
      </Float>
    </>
  );
};

const CanvasWrapper = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  width: 100vw;
  height: 140vh;
`;

// TODO: Replace with context stuff? no point in passing props down constantly
const AvatarCanvas: FC = () => {
  // TODO: make page number a calculation of all content

  return (
    <CanvasWrapper>
      <Canvas camera={{ position: [0, 1.5, 2], fov: 60 }}>
        <ambientLight intensity={0.1} />
        <Composition />
      </Canvas>
    </CanvasWrapper>
  );
};

export default AvatarCanvas;
