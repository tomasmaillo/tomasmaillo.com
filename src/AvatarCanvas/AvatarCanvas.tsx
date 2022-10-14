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
import Gap from "../common/Gap";
import Diagonal from "../Diagonal";
import { Projects } from "../Projects";

const tempVector = new THREE.Vector3(0, 0, 0);
const Composition: FC = () => {
  const { progress } = useProgress();
  const [isSmallScreen] = useScreenSize();
  const [showModel, setShowModel] = useState(false);
  const [showHtml, setShowHtml] = useState(false);
  const modelOffsetRef = useRef<any>();
  const scroll = useScroll();

  const avatarPosition = isSmallScreen
    ? new THREE.Vector3(0.2, 1.2, 0)
    : new THREE.Vector3(0.8, 1.2, 0.2);

  useEffect(() => {
    if (!modelOffsetRef.current) return;
    modelOffsetRef.current.position.set(1, -5, 1);
  }, []);

  useFrame((state) => {
    state.camera.position.set(0, (1 - scroll.offset) * 2, 1);

    if (!showModel) return;
    modelOffsetRef.current.position.lerp(avatarPosition, 0.01);
  });

  useEffect(() => {
    setTimeout(() => {
      setShowModel(true);
    }, 2900);
    setTimeout(() => {
      setShowHtml(true);
    }, 4000);
  }, [progress]);

  return (
    <>
      {showHtml && (
        <Scroll html>
          <div style={{ width: "100vw" }}>
            <Gap height={isSmallScreen ? "70vh" : "40vh"} />
            <Projects />
            <Diagonal />
          </div>
        </Scroll>
      )}

      <gridHelper
        position={[0, -0.5, 0]}
        args={[100, 100, "hotpink", "hotpink"]}
      />

      <Title3D />
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
  height: 100vh;
`;

const AvatarCanvas: FC = () => {
  const [isSmallScreen] = useScreenSize();
  return (
    <CanvasWrapper>
      <Canvas camera={{ position: [0, 1.5, 2], fov: 60 }}>
        <ambientLight intensity={0.1} />
        <ScrollControls pages={isSmallScreen ? 2.75 : 2}>
          <Composition />
        </ScrollControls>
      </Canvas>
    </CanvasWrapper>
  );
};

export default AvatarCanvas;
