import { Float, Text3D, useProgress } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useState, useRef, useEffect } from "react";
import { lerp, lerp2 } from "../helpers";

const Title3D = () => {
  const [mouseHover, setMouseHover] = useState(false);
  const [animationEnabled, setAnimationEnabled] = useState(false);
  const [initialAnimationOffset, setInitialAnimationOffset] = useState(0.0);
  const { progress } = useProgress();

  const textRef = useRef<any>();

  const animation = {
    start: {
      position: [-0.25, 1.8, 0.5],
      floatForce: 0.0,
      scaleZ: 0.0001,
    },
    end: {
      position: [-0.25, 1.799, 0.5],
      floatForce: 0.0,
      scaleZ: 0.1,
    },
  };

  useEffect(() => {
    if (!textRef.current) return;
    textRef.current.scale.z = animation.start.scaleZ;
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

    setInitialAnimationOffset((initialAnimationOffset) =>
      initialAnimationOffset < 1
        ? initialAnimationOffset + 0.01
        : initialAnimationOffset
    );

    textRef.current.position.set(
      ...lerp(
        animation.start.position,
        animation.end.position,
        initialAnimationOffset
      )
    );

    textRef.current.scale.z = lerp2(
      animation.start.scaleZ,
      animation.end.scaleZ,
      initialAnimationOffset
    );
  });

  return (
    <Float
      floatIntensity={initialAnimationOffset / 100}
      floatingRange={[0.00001, -0.00001]}
      speed={1}
    >
      <Text3D
        ref={textRef}
        font={"/helvetiker_regular.typeface.json"}
        size={0.05}
        height={0.1}
        rotation={[-Math.PI / 5, 0, 0]}
        onPointerOver={() => setMouseHover(true)}
        onPointerLeave={() => setMouseHover(false)}
      >
        :DDD
        <meshNormalMaterial />
      </Text3D>
    </Float>
  );
};

export default Title3D;
