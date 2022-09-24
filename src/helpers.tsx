import { useEffect, useState } from "react";

export const useScreenSize = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsSmallScreen(window.innerWidth < 768);
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
