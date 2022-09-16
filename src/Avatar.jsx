import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls, Float, Text, CatmullRomLine } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";

import styled from "styled-components";
import Tomas from "./Tomas";

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
      maxWidth={0.6}
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
    <group position={[0.6, 3, -0.3]} rotation={[0, Math.PI / 4, 0]}>
      <BubbleOutline />
      <BubbleText />
    </group>
  );
};

const AvatarHolder = styled.div`
  position: absolute;
  bottom: -40%;
  right: 0;
  width: 50%;
  height: 60rem;
  /* background-color: #ffffff77; */

  @media (max-width: 768px) {
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

const Avatar = () => {
  return (
    <AvatarHolder>
      <Canvas camera={{ position: [2.5, 1.4, 2.5] }}>
        <ambientLight />
        <axesHelper />
        <OrbitControls dampingFactor={0.05} enableZoom={false} />
        <Float
          speed={1} // Animation speed, defaults to 1
          rotationIntensity={0.4} // XYZ rotation intensity, defaults to 1
          floatIntensity={0.7} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
          floatingRange={[-2, -1.5]}
        >
          <SpeechBubble />
          <DraggableIndicator>
            <Tomas />
          </DraggableIndicator>
        </Float>
      </Canvas>
    </AvatarHolder>
  );
};

export default Avatar;
