import { useRef, useEffect } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  color: string;
  twinkleSpeed: number;
  twinkleOffset: number;
  depth: number;
}

interface Nebula {
  x: number;
  y: number;
  radius: number;
  color: string;
  opacity: number;
}

const STAR_COLORS = ['#ffffff', '#00d4ff', '#a855f7', '#ec4899', '#ffd700'];
const STAR_COUNT = 150;
const PARALLAX_STAR = 30;
const PARALLAX_NEBULA = 15;

export default function InteractiveCosmos() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const nebulaeRef = useRef<Nebula[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const toHex = (value: number) => Math.floor(value * 255).toString(16).padStart(2, '0');

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
      initCosmos();
    };

    const initCosmos = () => {
      starsRef.current = Array.from({ length: STAR_COUNT }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 0.5 + Math.random() * 2,
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        twinkleSpeed: 0.01 + Math.random() * 0.03,
        twinkleOffset: Math.random() * Math.PI * 2,
        depth: 0.3 + Math.random() * 0.7,
      }));

      nebulaeRef.current = [
        { x: canvas.width * 0.3, y: canvas.height * 0.3, radius: 200, color: '#a855f7', opacity: 0.05 },
        { x: canvas.width * 0.7, y: canvas.height * 0.6, radius: 250, color: '#00d4ff', opacity: 0.04 },
        { x: canvas.width * 0.5, y: canvas.height * 0.8, radius: 180, color: '#ec4899', opacity: 0.03 },
      ];
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left - canvas.width / 2) / canvas.width,
        y: (e.clientY - rect.top - canvas.height / 2) / canvas.height,
      };
    };
    const onScroll = () => {
      resizeCanvas();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('scroll', onScroll);

    let time = 0;

    const drawShootingStar = () => {
      const startX = Math.random() * canvas.width;
      const startY = Math.random() * canvas.height * 0.3;
      const length = 100 + Math.random() * 100;
      const angle = Math.PI / 4 + Math.random() * 0.2;
      const endX = startX + Math.cos(angle) * length;
      const endY = startY + Math.sin(angle) * length;

      const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(0.3, 'rgba(0, 212, 255, 0.4)');
      gradient.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    const animate = () => {
      time += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      nebulaeRef.current.forEach((n) => {
        const px = n.x + mouseRef.current.x * PARALLAX_NEBULA;
        const py = n.y + mouseRef.current.y * PARALLAX_NEBULA;

        const gradient = ctx.createRadialGradient(px, py, 0, px, py, n.radius);
        gradient.addColorStop(0, n.color + toHex(n.opacity * 2));
        gradient.addColorStop(0.5, n.color + toHex(n.opacity));
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(px, py, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      starsRef.current.forEach((s) => {
        const px = s.x + mouseRef.current.x * PARALLAX_STAR * s.depth;
        const py = s.y + mouseRef.current.y * PARALLAX_STAR * s.depth;
        const twinkle = Math.sin(time * s.twinkleSpeed * 60 + s.twinkleOffset) * 0.5 + 0.5;
        const size = s.size * (0.5 + twinkle * 0.5);
        const opacity = 0.3 + twinkle * 0.7;

        const gradient = ctx.createRadialGradient(px, py, 0, px, py, size * 3);
        gradient.addColorStop(0, s.color);
        gradient.addColorStop(0.3, s.color + toHex(opacity * 0.5));
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(px, py, size * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(px, py, size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
      });

      if (Math.random() < 0.002) drawShootingStar();

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="interactive-cosmos-canvas"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'auto',
        zIndex: 0,
      }}
    />
  );
}
