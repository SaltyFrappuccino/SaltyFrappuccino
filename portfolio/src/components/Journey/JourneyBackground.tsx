import { useEffect, useRef } from 'react';

interface JourneyBackgroundProps {
  isActive?: boolean;
}

export default function JourneyBackground({ isActive = true }: JourneyBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const starsRef = useRef<{ x: number; y: number; z: number; o: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const STAR_COUNT = 200; 
    const SPEED = 2; 
    
    // Initialize stars if empty
    if (starsRef.current.length === 0) {
        for (let i = 0; i < STAR_COUNT; i++) {
            starsRef.current.push({
                x: (Math.random() - 0.5) * width,
                y: (Math.random() - 0.5) * height,
                z: Math.random() * width,
                o: Math.random() 
            });
        }
    }

    let mouseX = 0;
    let mouseY = 0;
    let canvasRect = canvas.getBoundingClientRect();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      canvasRect = canvas.getBoundingClientRect();
    };

    const handleMouseMove = (e: MouseEvent) => {
        // Use cached rect
        mouseX = (e.clientX - canvasRect.left - width / 2) * 0.5;
        mouseY = (e.clientY - canvasRect.top - height / 2) * 0.5;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', () => { canvasRect = canvas.getBoundingClientRect(); });
    window.addEventListener('mousemove', handleMouseMove);

    let lastTime = 0;
    
    const draw = (time: number) => {
      if (!isActive) {
        // Just keep checking, or we can cancel entirely and restart in useEffect dependency change
        // But for rAF loop, stopping it is better.
        // We will handle stopping via useEffect dependency on isActive
        return; 
      }

      const deltaTime = time - lastTime;
      lastTime = time;

      // Limit max delta time to prevent huge jumps
      const dt = Math.min(deltaTime, 50);

      // Clear with trail effect - use slightly more transparency for less ghosting
       ctx.fillStyle = 'rgba(10, 10, 18, 0.8)'; 
       ctx.fillRect(0, 0, width, height);
      // Or use clearRect for crisp non-trail (user asked for smoothness, sometimes trails look like lag)
      // ctx.clearRect(0, 0, width, height); 

      const cx = width / 2;
      const cy = height / 2;

      starsRef.current.forEach((star) => {
        // Move star closer - time based
        star.z -= SPEED * (dt / 16); 

        // Reset if passed viewer
        if (star.z <= 0) {
            star.x = (Math.random() - 0.5) * width;
            star.y = (Math.random() - 0.5) * height;
            star.z = width;
        }

        const px = (star.x - mouseX) / star.z * width + cx;
        const py = (star.y - mouseY) / star.z * height + cy;

        const size = (1 - star.z / width) * 4; 
        
        if (px >= 0 && px <= width && py >= 0 && py <= height) {
            const opacity = (1 - star.z / width);
            
            // Simpler color logic
            const distRatio = Math.sqrt(Math.pow(px - cx, 2) + Math.pow(py - cy, 2)) / (width / 2);
            if (distRatio < 0.5) {
                ctx.fillStyle = `rgba(0, 212, 255, ${opacity})`;
            } else {
                ctx.fillStyle = `rgba(168, 85, 247, ${opacity})`;
            }

            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fill();
        }
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    if (isActive) {
      animationRef.current = requestAnimationFrame(draw);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', () => { canvasRect = canvas.getBoundingClientRect(); });
      window.removeEventListener('mousemove', handleMouseMove);
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
