import { useEffect, useState } from "react";
import styled from "styled-components";

const GrainWrapper = styled.svg`
  z-index: -100;
  position: absolute;
  opacity: 50%;
`;

const Grain = () => {
  // TODO: adjust grain on resize

  const [screenSize, setScreenSize] = useState<any>({ x: 100, y: 100 });

  useEffect(() => {
    function handleResize() {
      setScreenSize({ x: window.innerWidth, y: window.innerHeight });
    }
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [window.innerWidth]);

  return (
    <GrainWrapper
      viewBox={`0 0 ${screenSize.x * 2} ${screenSize.y * 3}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <filter id="noiseFilter">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.3"
          numOctaves="2"
          stitchTiles="stitch"
        />
      </filter>

      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </GrainWrapper>
  );
};
export default Grain;
