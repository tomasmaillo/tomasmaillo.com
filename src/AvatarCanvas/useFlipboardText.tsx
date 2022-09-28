import { useEffect, useState } from "react";

const ascii =
  " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";

// TODO: oof
const useFlipboardText = (text: string) => {
  const [flipboardText, setFlipboardText] = useState<string[]>([]);
  const [, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        setFlipboardText(() => {
          const hiii = text.split("").map((char, i) => {
            const charIndex = char.charCodeAt(0);
            if (prevIndex + 31 - i < charIndex) {
              return ascii[prevIndex - i];
            } else {
              return char;
            }
          });
          return hiii;
        });
        if (prevIndex + 31 > 126) {
          clearInterval(interval);
          return prevIndex;
        }
        return prevIndex + 1;
      });
    }, 50);

    return () => {
      clearInterval(interval);
    };
  }, [text]);

  return flipboardText.join("");
};

export default useFlipboardText;
