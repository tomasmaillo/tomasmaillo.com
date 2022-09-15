import { OrbitControls, Float } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import styled from "styled-components";
import { Models } from "./Models";

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

const Avatar = () => {
  return (
    <AvatarHolder>
      <Canvas camera={{ position: [2.5, 1.4, 2.5] }}>
        <ambientLight />
        <OrbitControls dampingFactor={0.05} enableZoom={false} />
        <Float
          speed={1} // Animation speed, defaults to 1
          rotationIntensity={0.4} // XYZ rotation intensity, defaults to 1
          floatIntensity={0.7} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
          floatingRange={[-2, -1.5]}
          key={undefined}
          type={undefined}
          id={undefined}
          attach={undefined}
          args={undefined}
          onUpdate={undefined}
          clear={undefined}
          raycast={undefined}
          visible={undefined}
          isGroup={undefined}
          uuid={undefined}
          name={undefined}
          parent={undefined}
          modelViewMatrix={undefined}
          normalMatrix={undefined}
          matrixWorld={undefined}
          matrixAutoUpdate={undefined}
          matrixWorldNeedsUpdate={undefined}
          castShadow={undefined}
          receiveShadow={undefined}
          frustumCulled={undefined}
          renderOrder={undefined}
          animations={undefined}
          userData={undefined}
          customDepthMaterial={undefined}
          customDistanceMaterial={undefined}
          isObject3D={undefined}
          onBeforeRender={undefined}
          onAfterRender={undefined}
          applyMatrix4={undefined}
          applyQuaternion={undefined}
          setRotationFromAxisAngle={undefined}
          setRotationFromEuler={undefined}
          setRotationFromMatrix={undefined}
          setRotationFromQuaternion={undefined}
          rotateOnAxis={undefined}
          rotateOnWorldAxis={undefined}
          rotateX={undefined}
          rotateY={undefined}
          rotateZ={undefined}
          translateOnAxis={undefined}
          translateX={undefined}
          translateY={undefined}
          translateZ={undefined}
          localToWorld={undefined}
          worldToLocal={undefined}
          lookAt={undefined}
          add={undefined}
          remove={undefined}
          removeFromParent={undefined}
          getObjectById={undefined}
          getObjectByName={undefined}
          getObjectByProperty={undefined}
          getWorldPosition={undefined}
          getWorldQuaternion={undefined}
          getWorldScale={undefined}
          getWorldDirection={undefined}
          traverse={undefined}
          traverseVisible={undefined}
          traverseAncestors={undefined}
          updateMatrix={undefined}
          updateMatrixWorld={undefined}
          updateWorldMatrix={undefined}
          toJSON={undefined}
          clone={undefined}
          copy={undefined}
          addEventListener={undefined}
          hasEventListener={undefined}
          removeEventListener={undefined}
          dispatchEvent={undefined}
        >
          <Models />
        </Float>
      </Canvas>
    </AvatarHolder>
  );
};

export default Avatar;
