import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  OrbitControls,
  Float,
  Text,
  CatmullRomLine,
  SpotLight,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";

import styled from "styled-components";

import TomasSmol from "./TomasSmol";

const BubbleTextVariants = [
  "Hi there! Thanks for checking my site out :D",
  "Feel free to reach out to me!",
  "Hope you enjoy it!",
  "Great weather eh?",
  "Im running out of things to say",
  "Please stop reading this",
  "Stop",
  ":(",
  "...",
];

function BubbleOutline({}) {
  return (
    <CatmullRomLine
      points={[
        [-0.35, -0.181, 0],
        [0.3, -0.15, 0],
        [0.3, 0.1, 0],
        [-0.3, 0.1, 0],
        [-0.3, -0.1, 0],
        [-0.351, -0.185, 0],
      ]} // Array of Points
      closed={false} // Default
      curveType="chordal" // One of "centripetal" (default), "chordal", or "catmullrom"
      tension={1} // Default (only applies to "catmullrom" curveType)
      color="black" // Default
      lineWidth={0.8} // In pixels (default)
      dashed={false} // Default
      segments={100} // Default
    />
  );
}

const BubbleText = () => {
  const textRef = useRef();
  const [chosenText, setChosenText] = useState(0);
  const [mouseHover, setMouseHover] = useState(false);

  useEffect(() => {
    document.body.style.cursor = mouseHover ? "pointer" : "auto";
  }, [mouseHover]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    textRef.current.text = BubbleTextVariants[chosenText].slice(
      0,
      Math.floor(time * 10)
    );
  });

  return (
    <Text
      ref={textRef}
      color={"black"}
      textAlign={"center"}
      fontSize={0.06}
      maxWidth={0.5}
      lineHeight={1}
      letterSpacing={0.02}
      anchorX="center"
      anchorY="middle"
      onPointerOver={() => {
        setMouseHover(true);
      }}
      onPointerLeave={() => {
        setMouseHover(false);
      }}
      onClick={() => {
        setChosenText((chosenText + 1) % BubbleTextVariants.length);
      }}
    />
  );
};

const SpeechBubble = () => {
  return (
    <group position={[0.5, 2.9, -0.2]} rotation={[0, Math.PI / 4, 0]}>
      <BubbleOutline />
      <BubbleText />
    </group>
  );
};

const AvatarHolder = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  width: 50%;
  height: 200vh;
  /* background-color: #ffffff77; */

  @media (max-width: 768px) {
    top: 25%;
    width: 100%;
  }
`;

const DraggableIndicator = (props) => {
  const [mouseState, setMouseState] = useState("auto");

  useEffect(() => {
    document.body.style.cursor = mouseState;
  }, [mouseState]);
  return (
    <mesh
      {...props}
      onPointerOver={() => setMouseState("grab")}
      onPointerOut={() => setMouseState("auto")}
      onPointerDown={() => setMouseState("grabbing")}
      onPointerUp={() => setMouseState("grab")}
    >
      {props.children}
    </mesh>
  );
};

function MovingLight({ vec = new Vector3(), ...props }) {
  const light = useRef();
  const viewport = useThree((state) => state.viewport);
  useFrame((state) => {
    light.current.target.position.lerp(
      vec.set(
        (state.mouse.x * viewport.width) / 2,
        (state.mouse.y * viewport.height) / 2,
        0
      ),
      0.1
    );
    light.current.target.updateMatrixWorld();
  });
  return (
    <SpotLight
      castShadow
      ref={light}
      penumbra={1}
      distance={6}
      angle={0.1}
      attenuation={5}
      anglePower={4}
      intensity={10}
      {...props}
    />
  );
}

const Avatar = () => {
  return (
    <AvatarHolder>
      {/* camera looking at avatar */}
      <Canvas camera={{ position: [2.5, 1.4, 2.5], fov: 60 }}>
        <MovingLight position={[3, 1, 2]} color="#0c8cbf" />
        <MovingLight position={[4, 2, 3]} color="#b00c3f" />
        <ambientLight intensity={0.1} />
        <axesHelper />
        {window.innerWidth > 700 && (
          <OrbitControls
            dampingFactor={0.05}
            enableZoom={false}
            maxPolarAngle={(2 * Math.PI) / 3}
            minPolarAngle={Math.PI / 4}
          />
        )}
        <Float
          speed={1} // Animation speed, defaults to 1
          rotationIntensity={0.2} // XYZ rotation intensity, defaults to 1
          floatIntensity={0.7} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
          floatingRange={[-2.2, -2]}
        >
          <SpeechBubble />
          <DraggableIndicator>
            <TomasSmol />
          </DraggableIndicator>
        </Float>
      </Canvas>
    </AvatarHolder>
  );
};

export default Avatar;
