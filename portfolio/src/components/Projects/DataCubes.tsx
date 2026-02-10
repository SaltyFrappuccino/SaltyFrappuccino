import { useRef, useEffect } from 'react';

interface Cube {
  x: number;
  y: number;
  z: number;
  size: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  rotationSpeedX: number;
  rotationSpeedY: number;
  rotationSpeedZ: number;
  velocityY: number;
  color: string;
  symbol: string;
  opacity: number;
  life: number;
  maxLife: number;
}

const COLORS = [
  '#a855f7', // Purple
  '#ec4899', // Pink
  '#00d4ff', // Cyan
  '#10b981', // Green
  '#f59e0b', // Amber/Orange
  '#6366f1', // Indigo
  '#ef4444', // Red
];
const SYMBOLS = [
  '{ }', '< />', '[ ]', '( )', '0x', '//', 
  '!=', '=>', '&&', '||', '++', '::',
  'await', 'fn', 'import', 'return'
];
const CUBE_COUNT = 40; // Doubled count
const MOUSE_RADIUS = 150;
const PERSPECTIVE = 500;
const FADE_FRAMES = 120;

export default function DataCubes({ isActive = true }: { isActive?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cubesRef = useRef<Cube[]>([]);
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

    const createCube = (initialSpawn = false): Cube => {
      const velocityY = 0.15 + Math.random() * 0.25;
      // Ensure life is long enough to cross screen: height / velocity
      // Add generous buffer (500) to ensure they go off-screen before dying
      const requiredLife = (canvas.height + 100) / velocityY;
      const maxLife = requiredLife + Math.random() * 200; 

      // Distribution logic: Keep center clear for cards
      // 45% Left (0-25%), 45% Right (75-100%), 10% Center
      const zone = Math.random();
      let x;
      let opacityFactor = 1;

      if (zone < 0.45) {
        // Left
        x = Math.random() * (canvas.width * 0.25);
      } else if (zone < 0.90) {
        // Right
        x = canvas.width * 0.75 + Math.random() * (canvas.width * 0.25);
      } else {
        // Center (Low probability + Low Opacity)
        x = canvas.width * 0.25 + Math.random() * (canvas.width * 0.5);
        opacityFactor = 0.3; // Much fainter in the middle
      }

      return {
        x,
        y: initialSpawn ? Math.random() * canvas.height : canvas.height + 50,
        z: 100 + Math.random() * 300,
        size: 30 + Math.random() * 40,
        rotationX: Math.random() * Math.PI * 2,
        rotationY: Math.random() * Math.PI * 2,
        rotationZ: Math.random() * Math.PI * 2,
        rotationSpeedX: (Math.random() - 0.5) * 0.02,
        rotationSpeedY: (Math.random() - 0.5) * 0.02,
        rotationSpeedZ: (Math.random() - 0.5) * 0.01,
        velocityY,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        opacity: initialSpawn ? (0.3 + Math.random() * 0.5) * opacityFactor : 0,
        life: initialSpawn ? maxLife * Math.random() : 0, 
        maxLife,
      };
    };

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
      cubesRef.current = Array.from({ length: CUBE_COUNT }, () => createCube(true));
    };

    const project = (x: number, y: number, z: number) => {
      const scale = PERSPECTIVE / (PERSPECTIVE + z);
      return {
        x: canvas.width / 2 + (x - canvas.width / 2) * scale,
        y: canvas.height / 2 + (y - canvas.height / 2) * scale,
        scale,
      };
    };

    const EDGES: [number, number][] = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
    ];

    const drawCube = (cube: Cube) => {
      if (cube.opacity <= 0.01) return;

      const h = cube.size / 2;
      const raw = [
        { x: -h, y: -h, z: -h }, { x: h, y: -h, z: -h },
        { x: h, y: h, z: -h }, { x: -h, y: h, z: -h },
        { x: -h, y: -h, z: h }, { x: h, y: -h, z: h },
        { x: h, y: h, z: h }, { x: -h, y: h, z: h },
      ];

      const rotated = raw.map((v) => {
        let { x, y, z } = v;
        let tmp: number;

        tmp = y * Math.cos(cube.rotationX) - z * Math.sin(cube.rotationX);
        z = y * Math.sin(cube.rotationX) + z * Math.cos(cube.rotationX);
        y = tmp;

        tmp = x * Math.cos(cube.rotationY) + z * Math.sin(cube.rotationY);
        z = -x * Math.sin(cube.rotationY) + z * Math.cos(cube.rotationY);
        x = tmp;

        tmp = x * Math.cos(cube.rotationZ) - y * Math.sin(cube.rotationZ);
        y = x * Math.sin(cube.rotationZ) + y * Math.cos(cube.rotationZ);
        x = tmp;

        return { x, y, z };
      });

      const projected = rotated.map((v) =>
        project(cube.x + v.x, cube.y + v.y, cube.z + v.z),
      );

      const alpha = Math.floor(cube.opacity * 128).toString(16).padStart(2, '0');
      ctx.shadowColor = cube.color;
      ctx.shadowBlur = 8 * cube.opacity;
      ctx.strokeStyle = cube.color + alpha;
      ctx.lineWidth = 1.5 * projected[0].scale;

      for (const [s, e] of EDGES) {
        ctx.beginPath();
        ctx.moveTo(projected[s].x, projected[s].y);
        ctx.lineTo(projected[e].x, projected[e].y);
        ctx.stroke();
      }

      const center = project(cube.x, cube.y, cube.z);
      ctx.shadowBlur = 0;
      ctx.font = `${12 * center.scale}px 'JetBrains Mono', monospace`;
      ctx.fillStyle = cube.color + alpha;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(cube.symbol, center.x, center.y);
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cubesRef.current.sort((a, b) => b.z - a.z);
      const mouse = mouseRef.current;

      cubesRef.current.forEach((cube, i) => {
        cube.rotationX += cube.rotationSpeedX;
        cube.rotationY += cube.rotationSpeedY;
        cube.rotationZ += cube.rotationSpeedZ;
        cube.y -= cube.velocityY;
        cube.x += Math.sin(cube.y * 0.01) * 0.3;

        const dx = cube.x - mouse.x;
        const dy = cube.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS) {
          const force = ((MOUSE_RADIUS - dist) / MOUSE_RADIUS) * 2;
          cube.x += (dx / dist) * force;
          cube.y += (dy / dist) * force;
          cube.rotationSpeedX *= 1.01;
          cube.rotationSpeedY *= 1.01;
        }

        cube.life++;
        const fadeOutStart = cube.maxLife - FADE_FRAMES;

        if (cube.life < FADE_FRAMES) {
          cube.opacity = (cube.life / FADE_FRAMES) * 0.7;
        } else if (cube.life > fadeOutStart) {
          cube.opacity = ((cube.maxLife - cube.life) / FADE_FRAMES) * 0.7;
        } else {
          // Re-check opacity factor for potentially fading in cubes
          // (Requires storing opacityFactor in Cube if we want strict consistency, 
          // but just capping max opacity based on current X is simpler)
          
          let targetOpacity = 0.7;
          // If in center zone, cap lower
          if (cube.x > canvas.width * 0.25 && cube.x < canvas.width * 0.75) {
             targetOpacity = 0.2;
          }
          
          cube.opacity = Math.min(cube.opacity + 0.01, targetOpacity);
        }

        if (cube.life >= cube.maxLife || cube.y < -cube.size * 3) {
          cubesRef.current[i] = createCube();
        }

        drawCube(cube);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    if (isActive) {
      animate();
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
      className="data-cubes-canvas"
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
