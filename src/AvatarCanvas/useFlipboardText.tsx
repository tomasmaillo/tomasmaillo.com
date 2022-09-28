import { useEffect, useState } from "react";

const ascii =
  " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";

// TODO: oof
const useFlipboardText = (text: string): [string, number, () => void] => {
  const [flipboardText, setFlipboardText] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const flipSpeed = 40; // ms

  const restart = () => {
    setCurrentIndex(0);
    flipText();
  };

  useEffect(() => flipText(), [text]);

  const flipText = () => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        setFlipboardText(() =>
          text.split("").map((char, i) => {
            const charIndex = char.charCodeAt(0);
            if (prevIndex + 31 - i < charIndex) {
              return ascii[prevIndex - i];
            } else {
              return char;
            }
          })
        );

        if (prevIndex + 31 > 126) {
          clearInterval(interval);
          return prevIndex;
        }
        return prevIndex + 1;
      });
    }, flipSpeed);

    return () => {
      clearInterval(interval);
    };
  };

  return [flipboardText.join(""), currentIndex / ascii.length, restart];
};

export default useFlipboardText;
