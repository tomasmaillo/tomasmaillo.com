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
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";

import styled from "styled-components";

import { useScreenSize } from "../helpers";

import TomasSmol from "./TomasSmol";
import { Projects } from "../Projects";
import SpeechBubble from "./SpeechBubble";
import Navbar from "../Navbar";
import Gap from "../common/Gap";
import DraggableIndicator from "../common/DraggableIndicator";
import Title3D from "./Title3D";

// const ShaderTingz = () => {
//   const mat = new THREE.ShaderMaterial({
//     uniforms: {},

//     vertexShader: [
//       "varying vec2 vUV;",
//       "varying vec3 vNormal;",

//       "void main() {",

//       "vUV = uv;",
//       "vNormal = vec3( normal );",
//       "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

//       "}",
//     ].join("\n"),

//     fragmentShader: [
//       "varying vec2 vUV;",
//       "varying vec3 vNormal;",

//       "void main() {",

//       "vec4 c = vec4( abs( vNormal ) + vec3( vUV, 0.0 ), 0.0 );",
//       "gl_FragColor = c;",

//       "}",
//     ].join("\n"),
//   });
// };

const Composition = () => {
  const { progress } = useProgress();
  const scroll = useScroll();
  const [isSmallScreen] = useScreenSize();
  const [showHtml, setShowHtml] = useState(false);

  useFrame((state) => {
    const offset = 1 - scroll.offset;
    state.camera.position.set(0, offset * 2, 1);
  });

  useEffect(() => {
    setTimeout(() => {
      setShowHtml(true);
    }, 500);
  }, [progress]);

  const avatarPosition = isSmallScreen ? [0.2, 1.2, 0] : [0.8, 1.2, 0.2];

  return (
    <>
      {showHtml && (
        <Scroll html>
          <div style={{ width: "100vw" }}>
            <Navbar />
            <Gap height="30vh" />
            <Projects />
          </div>
          <h1 style={{ position: "absolute", top: "100vh" }}>Second page :D</h1>
        </Scroll>
      )}

      {false && (
        <OrbitControls
          dampingFactor={0.05}
          enableZoom={true}
          maxPolarAngle={(2 * Math.PI) / 3}
          minPolarAngle={Math.PI / 4}
        />
      )}

      <Title3D />

      <Float
        speed={1}
        rotationIntensity={0.2}
        floatIntensity={0.7}
        floatingRange={[-2.2, -2]}
      >
        <DraggableIndicator>
          <TomasSmol position={avatarPosition}>
            <SpeechBubble />
          </TomasSmol>
        </DraggableIndicator>
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
  return (
    <CanvasWrapper>
      <Canvas camera={{ position: [0, 1.5, 2], fov: 60 }}>
        <ambientLight intensity={0.1} />
        <axesHelper />
        <ScrollControls pages={2}>
          <Composition />
        </ScrollControls>
      </Canvas>
    </CanvasWrapper>
  );
};

export default AvatarCanvas;
