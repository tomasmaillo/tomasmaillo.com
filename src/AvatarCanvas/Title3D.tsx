import { Float, Text3D, useProgress } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { lerp, lerp2, useScreenSize } from "../helpers";
import useFlipboardText from "./useFlipboardText";

const Title3D = () => {
  const [animationEnabled, setAnimationEnabled] = useState(false);
  const { progress } = useProgress();
  const [isSmallScreen] = useScreenSize();

  const [flippingText, flipProgress, flipRestart] = useFlipboardText(
    isSmallScreen ? "Tomas\nMaillo\n.com" : "TomasMaillo.com"
  );

  const textRef = useRef<any>();

  const animation = {
    start: {
      position: new THREE.Vector3(-0.3, 1.6, 0.5),
      floatForce: 0.0,
      scaleZ: 0.0001,
    },
    end: {
      position: new THREE.Vector3(-0.3, 1.79, 0.5),
      floatForce: 0.0,
      scaleZ: 0.3,
    },
  };

  useEffect(() => {
    if (!textRef.current) return;
    textRef.current.scale.z = animation.start.scaleZ;
    textRef.current.position.set(
      animation.start.position.x,
      animation.start.position.y,
      animation.start.position.z
    );
  }, []);

  useEffect(() => {
    if (progress >= 100)
      setTimeout(() => {
        setAnimationEnabled(true);
      }, 100);
  }, [progress]);

  useFrame(() => {
    if (!textRef.current) return;
    if (!animationEnabled) return;

    if (flipProgress < 0.8) return;
    textRef.current.scale.z = lerp2(
      animation.end.scaleZ,
      textRef.current.scale.z,
      0.99
    );

    if (flipProgress < 1) return;
    // TODO: text animation with sigmoid curve (maybe react-spring?)
    textRef.current.position.lerp(animation.end.position, 0.01);
  });

  return (
    <group position={isSmallScreen ? [0.2, 0, 0] : [0, 0, 0]}>
      <Text3D
        ref={textRef}
        font={"/SpaceMono_Bold.json"}
        size={0.04}
        height={0.1}
        rotation={[-Math.PI / 5, 0, 0]}
      >
        {flippingText}
        <meshNormalMaterial />
      </Text3D>
    </group>
  );
};

export default Title3D;
