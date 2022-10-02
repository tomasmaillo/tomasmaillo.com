import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  OrbitControls,
  Float,
  useScroll,
  ScrollControls,
  Scroll,
  Text3D,
  useProgress,
  Cloud,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";

import styled from "styled-components";

import { useScreenSize } from "../helpers";

import TomasSmol from "./TomasSmol";
import { Projects } from "../Projects";
import SpeechBubble from "./SpeechBubble";
import Navbar from "../Navbar/Navbar";
import Gap from "../common/Gap";
import DraggableIndicator from "../common/DraggableIndicator";
import Title3D from "./Title3D";
import Diagonal from "../Diagonal";

const Composition = () => {
  const { progress } = useProgress();
  const scroll = useScroll();
  const [isSmallScreen] = useScreenSize();
  const [showHtml, setShowHtml] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const modelOffsetRef = useRef<any>();
  // const navbarOffsetRef = useRef<any>();

  const avatarPosition = isSmallScreen
    ? new THREE.Vector3(0.2, 1.2, 0)
    : new THREE.Vector3(0.8, 1.2, 0.2);

  useEffect(() => {
    if (!modelOffsetRef.current) return;
    modelOffsetRef.current.position.set(1, -5, 1);
  }, []);

  useFrame((state) => {
    state.camera.position.set(0, (1 - scroll.offset) * 2, 1);

    // navbarOffsetRef.current.style.transform = `translateY(${
    //   scroll.offset * document.documentElement.clientHeight
    // }px)`;

    if (!showModel) return;
    modelOffsetRef.current.position.lerp(avatarPosition, 0.01);
  });

  useEffect(() => {
    // TODO: there must be a better way
    setTimeout(() => {
      setShowModel(true);
    }, 3000);
    setTimeout(() => {
      setShowHtml(true);
    }, 5000);
  }, [progress]);

  return (
    <>
      {showHtml && (
        <Scroll html>
          {/* <div
            ref={navbarOffsetRef}
            style={{
              position: "absolute",
              left: 0,
              width: "100%",
              height: "100%",
            }}
          > */}
          <Navbar />
          {/* </div> */}

          <div style={{ width: "100vw" }}>
            <Gap height={isSmallScreen ? "70vh" : "40vh"} />
            <Projects />
          </div>

          <Diagonal />
        </Scroll>
      )}

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

const AvatarCanvas = () => {
  // TODO: make page number a calculation of all content
  const [isSmallScreen] = useScreenSize();
  return (
    <CanvasWrapper>
      <Canvas camera={{ position: [0, 1.5, 2], fov: 60 }}>
        <ambientLight intensity={0.1} />
        <ScrollControls pages={isSmallScreen ? 2.5 : 2}>
          <Composition />
        </ScrollControls>
      </Canvas>
    </CanvasWrapper>
  );
};

export default AvatarCanvas;
