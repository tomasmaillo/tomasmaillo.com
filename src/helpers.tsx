import { useEffect, useState } from "react";

const SMALL_SCREEN_WIDTH = 600;
export const SMALL_SCREEN_WIDTH_PX = SMALL_SCREEN_WIDTH + "px";

export const useScreenSize = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsSmallScreen(window.innerWidth < SMALL_SCREEN_WIDTH);
    }
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [window.innerWidth]);

  return [isSmallScreen];
};

export const lerp = (a: number[], b: number[], n: number) => {
  return a.map((x, i) => x * (1 - n) + b[i] * n) as [number, number, number];
};

// TODO: WTF NOT THIS
export const lerp2 = (a: number, b: number, n: number) => {
  return a * (1 - n) + b * n;
};
