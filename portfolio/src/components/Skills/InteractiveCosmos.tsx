import { useRef, useEffect } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  color: string;
  twinkleSpeed: number;
  twinkleOffset: number;
  depth: number; // for parallax
}

interface Nebula {
  x: number;
  y: number;
  radius: number;
  color: string;
  opacity: number;
}

const starColors = ['#ffffff', '#00d4ff', '#a855f7', '#ec4899', '#ffd700'];

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

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
        initCosmos();
      }
    };

    const initCosmos = () => {
      // Create stars
      const starCount = 150;
      starsRef.current = [];
      
      for (let i = 0; i < starCount; i++) {
        starsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: 0.5 + Math.random() * 2,
          color: starColors[Math.floor(Math.random() * starColors.length)],
          twinkleSpeed: 0.01 + Math.random() * 0.03,
          twinkleOffset: Math.random() * Math.PI * 2,
          depth: 0.3 + Math.random() * 0.7, // depth for parallax effect
        });
      }

      // Create nebulae
      nebulaeRef.current = [
        {
          x: canvas.width * 0.3,
          y: canvas.height * 0.3,
          radius: 200,
          color: '#a855f7',
          opacity: 0.05,
        },
        {
          x: canvas.width * 0.7,
          y: canvas.height * 0.6,
          radius: 250,
          color: '#00d4ff',
          opacity: 0.04,
        },
        {
          x: canvas.width * 0.5,
          y: canvas.height * 0.8,
          radius: 180,
          color: '#ec4899',
          opacity: 0.03,
        },
      ];
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left - canvas.width / 2) / canvas.width,
        y: (e.clientY - rect.top - canvas.height / 2) / canvas.height,
      };
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    canvas.addEventListener('mousemove', handleMouseMove);

    let time = 0;

    const animate = () => {
      time += 0.016; // ~60fps
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw nebulae with parallax
      nebulaeRef.current.forEach((nebula) => {
        const parallaxX = mouseRef.current.x * 15;
        const parallaxY = mouseRef.current.y * 15;

        const gradient = ctx.createRadialGradient(
          nebula.x + parallaxX,
          nebula.y + parallaxY,
          0,
          nebula.x + parallaxX,
          nebula.y + parallaxY,
          nebula.radius
        );
        gradient.addColorStop(0, nebula.color + Math.floor(nebula.opacity * 2 * 255).toString(16).padStart(2, '0'));
        gradient.addColorStop(0.5, nebula.color + Math.floor(nebula.opacity * 255).toString(16).padStart(2, '0'));
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(nebula.x + parallaxX, nebula.y + parallaxY, nebula.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // Draw stars with parallax and twinkle
      starsRef.current.forEach((star) => {
        const parallaxX = mouseRef.current.x * 30 * star.depth;
        const parallaxY = mouseRef.current.y * 30 * star.depth;
        
        const twinkle = Math.sin(time * star.twinkleSpeed * 60 + star.twinkleOffset) * 0.5 + 0.5;
        const currentSize = star.size * (0.5 + twinkle * 0.5);
        const currentOpacity = 0.3 + twinkle * 0.7;

        const x = star.x + parallaxX;
        const y = star.y + parallaxY;

        // Star glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, currentSize * 3);
        gradient.addColorStop(0, star.color);
        gradient.addColorStop(0.3, star.color + Math.floor(currentOpacity * 128).toString(16).padStart(2, '0'));
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(x, y, currentSize * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Star core
        ctx.beginPath();
        ctx.arc(x, y, currentSize * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
        ctx.fill();
      });

      // Add shooting star occasionally
      if (Math.random() < 0.002) {
        drawShootingStar(ctx, canvas);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    const drawShootingStar = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      const startX = Math.random() * canvas.width;
      const startY = Math.random() * canvas.height * 0.3;
      const length = 100 + Math.random() * 100;
      const angle = Math.PI / 4 + Math.random() * 0.2;

      const gradient = ctx.createLinearGradient(
        startX,
        startY,
        startX + Math.cos(angle) * length,
        startY + Math.sin(angle) * length
      );
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(0.3, 'rgba(0, 212, 255, 0.4)');
      gradient.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(startX + Math.cos(angle) * length, startY + Math.sin(angle) * length);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
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
