import { useEffect, useState } from "react";

const DraggableIndicator = (props: { children?: React.ReactNode }) => {
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

export default DraggableIndicator;
