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

const colors = [
  '#00d4ff', // cyan
  '#a855f7', // purple
  '#ec4899', // pink
  '#10b981', // green
  '#f97316', // orange
];

export default function FlyingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

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
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const initParticles = () => {
      const particleCount = 20;
      particlesRef.current = [];

      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push(createParticle(canvas, true));
      }
    };

    const createParticle = (canvas: HTMLCanvasElement, randomX = false): Particle => {
      return {
        x: randomX ? Math.random() * canvas.width : -20,
        y: Math.random() * canvas.height,
        vx: 1 + Math.random() * 2,
        vy: (Math.random() - 0.5) * 0.5,
        size: 3 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        trail: [],
        alpha: 0.6 + Math.random() * 0.4,
      };
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, index) => {
        // Update trail
        particle.trail.push({
          x: particle.x,
          y: particle.y,
          alpha: particle.alpha,
        });

        // Limit trail length
        if (particle.trail.length > 30) {
          particle.trail.shift();
        }

        // Draw trail
        particle.trail.forEach((point, i) => {
          const trailAlpha = (i / particle.trail.length) * point.alpha * 0.5;
          const trailSize = (i / particle.trail.length) * particle.size;
          
          ctx.beginPath();
          ctx.arc(point.x, point.y, trailSize * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = particle.color + Math.floor(trailAlpha * 255).toString(16).padStart(2, '0');
          ctx.fill();
        });

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        
        // Glow effect
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 2
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(0.5, particle.color + '80');
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.fill();

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Gentle wave motion
        particle.y += Math.sin(particle.x * 0.01) * 0.3;

        // Reset particle when it goes off screen
        if (particle.x > canvas.width + 50) {
          particlesRef.current[index] = createParticle(canvas, false);
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    initParticles();
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
      className="flying-particles-canvas"
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
