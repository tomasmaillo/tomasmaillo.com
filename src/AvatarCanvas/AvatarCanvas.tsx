import React, { FC, useEffect, useLayoutEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  Float,
  useScroll,
  ScrollControls,
  Scroll,
  useProgress,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import styled from "styled-components";

import { useScreenSize } from "../helpers";
import TomasSmol from "./TomasSmol";
import Title3D from "./Title3D";
import Gap from "../common/Gap";
import Diagonal from "../Diagonal";
import { Projects } from "../Projects";

const Composition: FC<{
  setShowLogo: (state: boolean) => void;
  setScrollHeight: (height: number) => void;
}> = ({ setShowLogo, setScrollHeight }) => {
  const { progress } = useProgress();
  const [isSmallScreen] = useScreenSize();
  const [showModel, setShowModel] = useState(false);
  const [showHtml, setShowHtml] = useState(false);
  const modelOffsetRef = useRef<any>();
  const scroll = useScroll();
  const divRef = useRef<HTMLDivElement>(null);

  const avatarPosition = isSmallScreen
    ? new THREE.Vector3(0.2, 1.2, 0)
    : new THREE.Vector3(0.8, 1.2, 0.2);

  useLayoutEffect(() => {
    function adjustScrollHeight() {
      if (!divRef.current) return;
      setScrollHeight(divRef.current.clientHeight / window.innerHeight - 0.1);
    }
    window.addEventListener("resize", adjustScrollHeight);
    adjustScrollHeight();

    // Re-run slightly later as some html elements take time to create
    setTimeout(() => adjustScrollHeight(), 100);

    return () => window.removeEventListener("resize", adjustScrollHeight);
  }, [progress, showHtml]);

  useEffect(() => {
    if (!modelOffsetRef.current) return;
    modelOffsetRef.current.position.set(1, -10, 1);
  }, []);

  useFrame((state) => {
    state.camera.position.set(0, (1 - scroll.offset) * 2, 1);

    setShowLogo(scroll.offset > 0.1);

    if (!showModel) return;
    modelOffsetRef.current.position.lerp(avatarPosition, 0.01);
  });

  useEffect(() => {
    setTimeout(() => setShowModel(true), 2900);
    setTimeout(() => setShowHtml(true), 4000);
  }, [progress]);

  return (
    <>
      <Scroll html>
        {showHtml && (
          <div
            ref={divRef}
            style={{
              width: "100vw",
              pointerEvents: showHtml ? "all" : "none",
            }}
          >
            <Gap height={isSmallScreen ? "70vh" : "40vh"} />
            <Projects />
            <Diagonal />
          </div>
        )}
      </Scroll>

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
          <TomasSmol />
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

const AvatarCanvas: FC<{ setShowLogo: (state: boolean) => void }> = ({
  setShowLogo,
}) => {
  const [scrollHeight, setScrollHeight] = useState(0);

  return (
    <CanvasWrapper>
      <Canvas camera={{ position: [0, 1.5, 2], fov: 60 }}>
        <ambientLight intensity={0.1} />
        <ScrollControls pages={scrollHeight}>
          <Composition
            setShowLogo={setShowLogo}
            setScrollHeight={setScrollHeight}
          />
        </ScrollControls>
      </Canvas>
    </CanvasWrapper>
  );
};

export default AvatarCanvas;
