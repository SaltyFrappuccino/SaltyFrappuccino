import { useRef, useEffect } from 'react';

interface Column {
  x: number;
  drops: Drop[];
  speed: number;
}

interface Drop {
  y: number;
  char: string;
  opacity: number;
  fadeSpeed: number;
}

const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン</>{}[]()=+-*&%$#@!';

export default function TerminalRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const columnsRef = useRef<Column[]>([]);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const fontSize = 14;
    const columnWidth = fontSize + 4;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
        initColumns();
      }
    };

    const initColumns = () => {
      const columnCount = Math.floor(canvas.width / columnWidth);
      columnsRef.current = [];

      for (let i = 0; i < columnCount; i++) {
        columnsRef.current.push({
          x: i * columnWidth,
          drops: [],
          speed: 0.5 + Math.random() * 1.5,
        });

        // Initial drops
        const initialDrops = Math.floor(Math.random() * 8);
        for (let j = 0; j < initialDrops; j++) {
          columnsRef.current[i].drops.push({
            y: Math.random() * canvas.height,
            char: chars[Math.floor(Math.random() * chars.length)],
            opacity: 0.3 + Math.random() * 0.5,
            fadeSpeed: 0.005 + Math.random() * 0.01,
          });
        }
      }
    };

    const animate = () => {
      // Semi-transparent black for trail effect
      ctx.fillStyle = 'rgba(5, 5, 16, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

      columnsRef.current.forEach((column) => {
        // Add new drops randomly
        if (Math.random() < 0.01) {
          column.drops.push({
            y: -fontSize,
            char: chars[Math.floor(Math.random() * chars.length)],
            opacity: 0.6 + Math.random() * 0.4,
            fadeSpeed: 0.005 + Math.random() * 0.01,
          });
        }

        // Update and draw drops
        column.drops = column.drops.filter((drop) => {
          // Update
          drop.y += column.speed;
          drop.opacity -= drop.fadeSpeed;

          // Randomly change character
          if (Math.random() < 0.01) {
            drop.char = chars[Math.floor(Math.random() * chars.length)];
          }

          // Draw
          if (drop.opacity > 0) {
            // Leading character (brighter)
            const isLeading = drop.opacity > 0.5;
            
            if (isLeading) {
              ctx.shadowColor = '#00d4ff';
              ctx.shadowBlur = 10;
              ctx.fillStyle = `rgba(0, 212, 255, ${drop.opacity})`;
            } else {
              ctx.shadowBlur = 0;
              ctx.fillStyle = `rgba(0, 212, 255, ${drop.opacity * 0.5})`;
            }

            ctx.fillText(drop.char, column.x, drop.y);
          }

          // Keep if still visible and on screen
          return drop.opacity > 0 && drop.y < canvas.height + fontSize;
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="terminal-rain-canvas"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.4,
      }}
    />
  );
}
