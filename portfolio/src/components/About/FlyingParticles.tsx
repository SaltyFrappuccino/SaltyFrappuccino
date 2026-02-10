import { useRef, useEffect } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  trail: { x: number; y: number; alpha: number }[];
  alpha: number;
}

const COLORS = ['#00d4ff', '#a855f7', '#ec4899', '#10b981', '#f97316'];
const PARTICLE_COUNT = 20;
const TRAIL_LENGTH = 30;
const MOUSE_RADIUS = 120;

export default function FlyingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | undefined>(undefined);
  const mouseRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });

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
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const createParticle = (randomX = false): Particle => ({
      x: randomX ? Math.random() * canvas.width : -20,
      y: Math.random() * canvas.height,
      vx: 1 + Math.random() * 2,
      vy: (Math.random() - 0.5) * 0.5,
      size: 3 + Math.random() * 4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      trail: [],
      alpha: 0.6 + Math.random() * 0.4,
    });

    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => createParticle(true));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mouse = mouseRef.current;

      particlesRef.current.forEach((p, i) => {
        p.trail.push({ x: p.x, y: p.y, alpha: p.alpha });
        if (p.trail.length > TRAIL_LENGTH) p.trail.shift();

        p.trail.forEach((point, idx) => {
          const trailAlpha = (idx / p.trail.length) * point.alpha * 0.5;
          const trailSize = (idx / p.trail.length) * p.size;
          ctx.beginPath();
          ctx.arc(point.x, point.y, trailSize * 0.5, 0, Math.PI * 2);
          ctx.fillStyle =
            p.color + Math.floor(trailAlpha * 255).toString(16).padStart(2, '0');
          ctx.fill();
        });

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(0.5, p.color + '80');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        p.y += Math.sin(p.x * 0.01) * 0.3;

        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS) {
          const force = ((MOUSE_RADIUS - dist) / MOUSE_RADIUS) * 1.5;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }

        if (p.x > canvas.width + 50) {
          particlesRef.current[i] = createParticle(false);
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="flying-particles-canvas"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
    />
  );
}
