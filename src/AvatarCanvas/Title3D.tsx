import { Text3D } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useState, useRef, useEffect } from "react";
import { lerp } from "../helpers";

const Title3D = () => {
  const [mouseHover, setMouseHover] = useState(false);
  const [initialAnimationOffset, setInitialAnimationOffset] = useState(0.0);
  const textRef = useRef<any>();

  const animation = {
    start: {
      position: [-0.25, 1.8, 0.5],
      floatForce: 0.0,
      scaleZ: 0.0001,
    },
    end: {
      position: [-0.25, 1.6, 0.5],
      floatForce: 0.0,
      scaleZ: 1.0,
    },
  };

  useEffect(() => {
    if (!textRef.current) return;
    textRef.current.scale.z = animation.start.scaleZ;
  }, []);

  useFrame(() => {
    if (!textRef.current) return;
    if (mouseHover) {
      setInitialAnimationOffset(
        (initialAnimationOffset) => initialAnimationOffset + 0.01
      );
    }
    // textRef.current.scale.z += initialAnimationOffset;
    textRef.current.position.set(
      ...lerp(
        animation.start.position,
        animation.end.position,
        initialAnimationOffset
      )
    );
  });

  return (
    <Text3D
      ref={textRef}
      font={"/helvetiker_regular.typeface.json"}
      size={0.05}
      height={0.1}
      rotation={[-Math.PI / 5, 0, 0]}
      onPointerOver={() => setMouseHover(true)}
      onPointerLeave={() => setMouseHover(false)}
    >
      tomasmaillo.com
      <meshNormalMaterial />
    </Text3D>
  );
};

export default Title3D;
