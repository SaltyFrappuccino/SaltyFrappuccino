import { useEffect, useRef } from 'react';

interface AchievementsBackgroundProps {
  isActive?: boolean;
}

export default function AchievementsBackground({ isActive = true }: AchievementsBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<{
    x: number;
    y: number;
    size: number;
    speed: number;
    opacity: number;
    color: string;
  }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const PARTICLE_COUNT = 80;
    
    const colors = [
      'rgba(0, 212, 255, ',
      'rgba(168, 85, 247, ',
      'rgba(255, 255, 255, '
    ];

    const resetParticle = (index: number, randomY = false) => {
      const size = Math.random() * 2 + 1;
      const x = Math.random() * width;
      const y = randomY ? Math.random() * height : height + 10;
      const speed = Math.random() * 0.5 + 0.2;
      const opacity = Math.random() * 0.5 + 0.1;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      particlesRef.current[index] = { x, y, size, speed, opacity, color };
    };

    const initParticles = () => {
      if (particlesRef.current.length === 0) {
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          resetParticle(i, true);
        }
      }
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      particlesRef.current = []; 
      initParticles();
    };

    window.addEventListener('resize', handleResize);
    initParticles();

    const draw = () => {
      if (!isActive) return;

      ctx.clearRect(0, 0, width, height);

      particlesRef.current.forEach((p, i) => {
        p.y -= p.speed;

        if (p.y < -10) {
          resetParticle(i);
        }

        ctx.fillStyle = p.color + p.opacity + ')';
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    if (isActive) {
      animationRef.current = requestAnimationFrame(draw);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isActive]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
