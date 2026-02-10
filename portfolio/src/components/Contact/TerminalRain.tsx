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
  trail: { y: number; char: string; opacity: number }[];
}

const CHARS =
  '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン</>{} []()=+-*&%$#@!';
const FONT_SIZE = 14;
const COLUMN_WIDTH = FONT_SIZE + 4;
const TRAIL_LENGTH = 12;
const MOUSE_RADIUS = 100;
const SPAWN_RATE = 0.008;
const FRAME_INTERVAL = 1000 / 30;

const randomChar = () => CHARS[Math.floor(Math.random() * CHARS.length)];

export default function TerminalRain({ isActive = true }: { isActive?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const columnsRef = useRef<Column[]>([]);
  const animationRef = useRef<number | undefined>(undefined);
  const mouseRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const lastTimeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
      initColumns();
    };

    const initColumns = () => {
      const count = Math.floor(canvas.width / COLUMN_WIDTH);
      columnsRef.current = Array.from({ length: count }, (_, i) => {
        const col: Column = { x: i * COLUMN_WIDTH, drops: [], speed: 0.5 + Math.random() * 1.5 };
        const initialDrops = Math.floor(Math.random() * 3);
        for (let j = 0; j < initialDrops; j++) {
          const opacity = 0.3 + Math.random() * 0.4;
          col.drops.push({
            y: Math.random() * canvas.height,
            char: randomChar(),
            opacity,
            fadeSpeed: opacity / (canvas.height / col.speed),
            trail: [],
          });
        }
        return col;
      });
    };

    const MAX_DROPS_PER_COL = 3;

    const animate = (time: number) => {
      animationRef.current = requestAnimationFrame(animate);

      if (!isActive) return;

      const delta = time - lastTimeRef.current;
      if (delta < FRAME_INTERVAL) return;
      lastTimeRef.current = time - (delta % FRAME_INTERVAL);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${FONT_SIZE}px 'JetBrains Mono', monospace`;
      const mouse = mouseRef.current;

      columnsRef.current.forEach((col) => {
        if (col.drops.length < MAX_DROPS_PER_COL && Math.random() < SPAWN_RATE) {
          const opacity = 0.6 + Math.random() * 0.4;
          col.drops.push({
            y: -FONT_SIZE,
            char: randomChar(),
            opacity,
            fadeSpeed: opacity / (canvas.height / col.speed),
            trail: [],
          });
        }

        col.drops = col.drops.filter((drop) => {
          drop.trail.push({ y: drop.y, char: drop.char, opacity: drop.opacity });
          if (drop.trail.length > TRAIL_LENGTH) drop.trail.shift();

          drop.y += col.speed;
          drop.opacity -= drop.fadeSpeed;

          if (Math.random() < 0.02) drop.char = randomChar();

          drop.trail.forEach((t, i) => {
            const alpha = (i / drop.trail.length) * t.opacity * 0.3;
            if (alpha > 0.01) {
              ctx.fillStyle = `rgba(0, 212, 255, ${alpha})`;
              ctx.fillText(t.char, col.x, t.y);
            }
          });

          const dx = col.x - mouse.x;
          const dy = drop.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          let brightness = Math.min(drop.opacity, 0.7);

          if (dist < MOUSE_RADIUS) {
            const boost = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
            drop.y += boost * 2;
            brightness = Math.min(brightness + boost * 0.4, 1.0);
          }

          if (drop.opacity > 0) {
            ctx.fillStyle = `rgba(0, 212, 255, ${brightness})`;
            ctx.fillText(drop.char, col.x, drop.y);
          }

          return drop.opacity > 0 && drop.y < canvas.height + FONT_SIZE;
        });
      });
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    if (isActive) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isActive]);

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
        zIndex: 0,
        opacity: 0.5,
      }}
    />
  );
}
