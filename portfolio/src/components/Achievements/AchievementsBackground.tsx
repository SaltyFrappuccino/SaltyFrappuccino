import { useEffect, useRef } from 'react';

export default function AchievementsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // Hexagon configuration
    const hexRadius = 30;
    const hexHeight = Math.sqrt(3) * hexRadius;
    const hexWidth = 2 * hexRadius;
    const hexVertDist = hexHeight;
    const hexHorizDist = 1.5 * hexRadius;

    let mouseX = -1000;
    let mouseY = -1000;

    interface Hex {
      x: number;
      y: number;
      activeLevel: number; // 0 to 1
    }

    let hexes: Hex[] = [];

    const initHexes = () => {
      hexes = [];
      const cols = Math.ceil(width / hexHorizDist) + 2;
      const rows = Math.ceil(height / hexVertDist) + 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const xOffset = (c % 2 === 1) ? hexHeight / 2 : 0;
          const x = c * hexHorizDist;
          const y = r * hexVertDist - xOffset;
          hexes.push({ x, y, activeLevel: 0 });
        }
      }
    };

    initHexes();

    const drawHexagon = (x: number, y: number, r: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        ctx.lineTo(x + r * Math.cos(angle), y + r * Math.sin(angle));
      }
      ctx.closePath();
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initHexes();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    let animationId: number;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Background gradient
      // ctx.fillStyle = 'rgba(10, 10, 20, 1)';
      // ctx.fillRect(0, 0, width, height);

      hexes.forEach(hex => {
        // Calculate distance to mouse
        const dx = hex.x - mouseX;
        const dy = hex.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Activation radius
        const maxDist = 200;
        let targetLevel = 0;
        
        if (dist < maxDist) {
            targetLevel = 1 - (dist / maxDist);
        }

        // Decay/Grow
        hex.activeLevel += (targetLevel - hex.activeLevel) * 0.1;

        if (hex.activeLevel > 0.01) {
            drawHexagon(hex.x, hex.y, hexRadius - 2); // Slightly smaller for spacing
            
            // Stroke
            ctx.strokeStyle = `rgba(0, 212, 255, ${hex.activeLevel * 0.3})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Fill
            ctx.fillStyle = `rgba(168, 85, 247, ${hex.activeLevel * 0.1})`;
            ctx.fill();
        } else {
             // Very faint grid always visible?
             drawHexagon(hex.x, hex.y, hexRadius - 2);
             ctx.strokeStyle = `rgba(255, 255, 255, 0.03)`;
             ctx.lineWidth = 1;
             ctx.stroke();
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
