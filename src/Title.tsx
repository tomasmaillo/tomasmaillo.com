import { useEffect, useRef, useState } from "react";

const lerp = (a: number, b: number, t: number) => {
  return a + (b - a) * t;
};

const Title = (props: { text: string }) => {
  const { text } = props;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  const draw = (ctx: any) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    const isSmallDisplay = window.innerWidth < 768;

    ctx.clearRect(0, 0, width, height);

    ctx.textBaseline = "middle";
    ctx.fillStyle = "#FFFAEB";

    const blockSpaces = isSmallDisplay ? 3 : 5;
    for (let i = 0; i < width; i += blockSpaces) {
      for (let j = 0; j < height; j += blockSpaces) {
        if (Math.random() > 0) {
          ctx.fillRect(i, j, 1, 1);
        }
      }
    }

    const fontSize = Math.max(window.innerWidth / 5, 100);
    const marginSize = {
      x: isSmallDisplay ? width / 2 : Math.min(fontSize / 2, 100),
      y: isSmallDisplay ? 120 : fontSize,
    };
    ctx.textAlign = isSmallDisplay ? "center" : "left";
    const shadowOffset = {
      x: isSmallDisplay ? 20 : 30,
      y: isSmallDisplay ? 20 : 30,
    };

    ctx.font = `${fontSize}px 'Inconsolata'`;
    ctx.fillStyle = "#4466ba";
    ctx.globalCompositeOperation = "source-atop";
    ctx.fillText(
      text,
      marginSize.x + shadowOffset.x + mousePos.x / 10,
      marginSize.y + shadowOffset.y + mousePos.y / 10
    );

    ctx.fillStyle = "#4466ba";
    ctx.globalCompositeOperation = "source-over";
    ctx.fillText(
      text,
      marginSize.x + mousePos.x / 50,
      marginSize.y + mousePos.y / 50
    );

    ctx.fillStyle = "#ba4477";

    ctx.font = `1.2em 'Inconsolata'`;
    const descriptionText = isSmallDisplay
      ? "CS and AI student"
      : "Computer Science and Artificial Intelligence student";
    ctx.fillText(
      descriptionText,
      marginSize.x + mousePos.x / 30,
      marginSize.y * 1.5 + mousePos.y / 30
    );
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();

    canvasRef.current.onmousemove = (e: any) => {
      if (!canvasRef.current) return;

      setMousePos({
        x: lerp(e.clientX - rect.left, mousePos.x, 0.9),
        y: lerp(e.clientY - rect.top, mousePos.y, 0.9),
      });

      setHovering(true);

      setTimeout(() => {
        setHovering(false);
      }, 1000);
    };

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!hovering) {
      setMousePos({
        x: lerp(Math.sin(performance.now() / 1000) * 50, mousePos.x, 0.99),
        y: lerp(Math.cos(performance.now() / 1000) * 50, mousePos.y, 0.99),
      });
    }

    draw(context);
  }, [draw]);

  return (
    <canvas
      width={window.innerWidth}
      height={window.innerHeight - 100}
      ref={canvasRef}
    />
  );
};

export default Title;
