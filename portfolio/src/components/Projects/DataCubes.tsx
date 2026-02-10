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
}

const colors = ['#a855f7', '#ec4899', '#00d4ff', '#10b981'];
const symbols = ['{ }', '< />', '[ ]', '( )', '0x', '//'];

export default function DataCubes() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cubesRef = useRef<Cube[]>([]);
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
        initCubes();
      }
    };

    const initCubes = () => {
      const cubeCount = 12;
      cubesRef.current = [];

      for (let i = 0; i < cubeCount; i++) {
        cubesRef.current.push(createCube(canvas));
      }
    };

    const createCube = (canvas: HTMLCanvasElement): Cube => {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: 100 + Math.random() * 300,
        size: 30 + Math.random() * 40,
        rotationX: Math.random() * Math.PI * 2,
        rotationY: Math.random() * Math.PI * 2,
        rotationZ: Math.random() * Math.PI * 2,
        rotationSpeedX: (Math.random() - 0.5) * 0.02,
        rotationSpeedY: (Math.random() - 0.5) * 0.02,
        rotationSpeedZ: (Math.random() - 0.5) * 0.01,
        velocityY: 0.2 + Math.random() * 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
      };
    };

    const project3D = (x: number, y: number, z: number, canvas: HTMLCanvasElement) => {
      const perspective = 500;
      const scale = perspective / (perspective + z);
      return {
        x: canvas.width / 2 + (x - canvas.width / 2) * scale,
        y: canvas.height / 2 + (y - canvas.height / 2) * scale,
        scale,
      };
    };

    const drawCube = (cube: Cube) => {
      const halfSize = cube.size / 2;
      
      // Cube vertices
      const vertices = [
        { x: -halfSize, y: -halfSize, z: -halfSize },
        { x: halfSize, y: -halfSize, z: -halfSize },
        { x: halfSize, y: halfSize, z: -halfSize },
        { x: -halfSize, y: halfSize, z: -halfSize },
        { x: -halfSize, y: -halfSize, z: halfSize },
        { x: halfSize, y: -halfSize, z: halfSize },
        { x: halfSize, y: halfSize, z: halfSize },
        { x: -halfSize, y: halfSize, z: halfSize },
      ];

      // Rotate vertices
      const rotatedVertices = vertices.map(v => {
        // Rotate X
        let y = v.y * Math.cos(cube.rotationX) - v.z * Math.sin(cube.rotationX);
        let z = v.y * Math.sin(cube.rotationX) + v.z * Math.cos(cube.rotationX);
        v.y = y;
        v.z = z;

        // Rotate Y
        let x = v.x * Math.cos(cube.rotationY) + v.z * Math.sin(cube.rotationY);
        z = -v.x * Math.sin(cube.rotationY) + v.z * Math.cos(cube.rotationY);
        v.x = x;
        v.z = z;

        // Rotate Z
        x = v.x * Math.cos(cube.rotationZ) - v.y * Math.sin(cube.rotationZ);
        y = v.x * Math.sin(cube.rotationZ) + v.y * Math.cos(cube.rotationZ);
        v.x = x;
        v.y = y;

        return v;
      });

      // Project vertices
      const projectedVertices = rotatedVertices.map(v => 
        project3D(cube.x + v.x, cube.y + v.y, cube.z + v.z, canvas)
      );

      // Draw edges with glow
      const edges = [
        [0, 1], [1, 2], [2, 3], [3, 0], // Front face
        [4, 5], [5, 6], [6, 7], [7, 4], // Back face
        [0, 4], [1, 5], [2, 6], [3, 7], // Connecting edges
      ];

      ctx.shadowColor = cube.color;
      ctx.shadowBlur = 10;
      ctx.strokeStyle = cube.color + '80';
      ctx.lineWidth = 1.5 * projectedVertices[0].scale;

      edges.forEach(([start, end]) => {
        ctx.beginPath();
        ctx.moveTo(projectedVertices[start].x, projectedVertices[start].y);
        ctx.lineTo(projectedVertices[end].x, projectedVertices[end].y);
        ctx.stroke();
      });

      // Draw symbol in center
      const center = project3D(cube.x, cube.y, cube.z, canvas);
      ctx.shadowBlur = 0;
      ctx.font = `${12 * center.scale}px 'JetBrains Mono', monospace`;
      ctx.fillStyle = cube.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(cube.symbol, center.x, center.y);
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Sort cubes by z for proper depth ordering
      cubesRef.current.sort((a, b) => b.z - a.z);

      cubesRef.current.forEach((cube, index) => {
        // Update rotation
        cube.rotationX += cube.rotationSpeedX;
        cube.rotationY += cube.rotationSpeedY;
        cube.rotationZ += cube.rotationSpeedZ;

        // Float upward
        cube.y -= cube.velocityY;

        // Gentle horizontal drift
        cube.x += Math.sin(cube.y * 0.01) * 0.3;

        // Reset when off screen
        if (cube.y < -cube.size * 2) {
          cubesRef.current[index] = createCube(canvas);
          cubesRef.current[index].y = canvas.height + cube.size;
        }

        drawCube(cube);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
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
      className="data-cubes-canvas"
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
