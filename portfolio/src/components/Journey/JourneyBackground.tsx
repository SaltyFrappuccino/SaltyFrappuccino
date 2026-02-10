import { useEffect, useRef } from 'react';

export default function JourneyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const stars: { x: number; y: number; z: number; o: number }[] = [];
    const STAR_COUNT = 800;
    const SPEED = 2; // Base speed
    
    // Initialize stars
    for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
            x: (Math.random() - 0.5) * width,
            y: (Math.random() - 0.5) * height,
            z: Math.random() * width,
            o: Math.random() // opacity offset
        });
    }

    let mouseX = 0;
    let mouseY = 0;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = (e.clientX - rect.left - width / 2) * 0.5;
        mouseY = (e.clientY - rect.top - height / 2) * 0.5;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    let animationId: number;

    const draw = () => {
      // Clear with trail effect
      ctx.fillStyle = 'rgba(10, 10, 18, 0.4)'; // Dark background with slight trail
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      stars.forEach((star) => {
        // Move star closer
        star.z -= SPEED;

        // Reset if passed viewer
        if (star.z <= 0) {
            star.x = (Math.random() - 0.5) * width;
            star.y = (Math.random() - 0.5) * height;
            star.z = width;
        }

        // Project 3D position to 2D
        // Parallax effect with mouse
        const px = (star.x - mouseX) / star.z * width + cx;
        const py = (star.y - mouseY) / star.z * height + cy; // Using height for consistent perspective? usually width is used for FOV

        // Calculate size based on distance
        const size = (1 - star.z / width) * 3;
        
        // Render
        if (px >= 0 && px <= width && py >= 0 && py <= height) {
            const opacity = (1 - star.z / width);
            const colorVal = Math.floor(opacity * 255);
            
            // Color shift based on position
            // Center = Cyan, Edges = Purple
            const distRatio = Math.sqrt(Math.pow(px - cx, 2) + Math.pow(py - cy, 2)) / (width / 2);
            
            if (distRatio < 0.5) {
                ctx.fillStyle = `rgba(0, 212, 255, ${opacity})`; // Cyan
            } else {
                ctx.fillStyle = `rgba(168, 85, 247, ${opacity})`; // Purple
            }

            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fill();
        }
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

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
