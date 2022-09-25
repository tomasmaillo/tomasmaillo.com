import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Text, CatmullRomLine } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

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
  const textRef = useRef<any>();
  const [chosenText, setChosenText] = useState(0);
  const [mouseHover, setMouseHover] = useState(false);

  useEffect(() => {
    document.body.style.cursor = mouseHover ? "pointer" : "auto";
  }, [mouseHover]);

  useFrame((state) => {
    if (!textRef.current) return;
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
    >
      {""}
    </Text>
  );
};

const SpeechBubble = () => {
  return (
    <group position={[-0.2, 0.3, 0]} rotation={[0, Math.PI / 4, 0]}>
      <BubbleOutline />
      <BubbleText />
    </group>
  );
};

export default SpeechBubble;
