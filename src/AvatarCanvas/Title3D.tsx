import { Text3D, useProgress } from "@react-three/drei";
import { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { useSpring } from "@react-spring/core";
import { a } from "@react-spring/three";

import { useScreenSize } from "../helpers";
import useFlipboardText from "./useFlipboardText";

const Title3D = () => {
  const { progress } = useProgress();
  const [isSmallScreen] = useScreenSize();

  const [flippingText, flipProgress, flipRestart] = useFlipboardText(
    isSmallScreen ? "Tomas\nMaillo\n.com" : "TomasMaillo.com"
  );

  const [active, setActive] = useState(0);

  const posXOffset = isSmallScreen ? -0.1 : -0.26;
  const startPosY = isSmallScreen ? 1.78 : 1.7;
  const endPosY = isSmallScreen ? 1.84 : 1.82;

  const { spring } = useSpring({
    spring: active,
    config: {
      mass: 50,
      tension: 400,
      friction: 200,
      precision: 0.0001,
    },
  });

  const posY = spring.to([0, 1], [startPosY, endPosY]);
  const scaleZ = spring.to([0, 1], [0.000001, 0.3]);
  const rotationX = spring.to([0, 1], [-Math.PI / 5, -Math.PI / 6]);

  useEffect(() => {
    if (progress >= 100 && flipProgress > 0.95 && !active)
      setActive(Number(!active));
  }, [progress, flipProgress]);

  return (
    <group position={[posXOffset, 0, 0.6]}>
      <a.group position-y={posY}>
        <a.mesh scale-z={scaleZ} rotation-x={rotationX}>
          <Text3D
            onClick={() => flipRestart()}
            font={"/SpaceMono_Bold.json"}
            size={0.04}
            height={0.1}
          >
            {flippingText}
            <meshNormalMaterial />
          </Text3D>
        </a.mesh>
      </a.group>
    </group>
  );
};

export default Title3D;
