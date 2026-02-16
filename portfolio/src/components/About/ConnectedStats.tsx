import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useMotionValue, useTransform, MotionValue } from 'framer-motion';
import { Code2, Brain, Bot } from 'lucide-react';

const TRIANGLE_SIZE = 280;

const initialNodes = [
  { key: 'experience', icon: Code2, x: 0, y: -TRIANGLE_SIZE / 1.7, value: '3+' },
  { key: 'technologies', icon: Brain, x: -TRIANGLE_SIZE / 1.7, y: TRIANGLE_SIZE / 3, value: '30+' },
  { key: 'systems', icon: Bot, x: TRIANGLE_SIZE / 1.7, y: TRIANGLE_SIZE / 3, value: '4' },
];

export default function ConnectedStats() {
  const containerRef = useRef<HTMLDivElement>(null);



  const node1X = useMotionValue(initialNodes[0].x);
  const node1Y = useMotionValue(initialNodes[0].y);
  
  const node2X = useMotionValue(initialNodes[1].x);
  const node2Y = useMotionValue(initialNodes[1].y);

  const node3X = useMotionValue(initialNodes[2].x);
  const node3Y = useMotionValue(initialNodes[2].y);

  const positions = [
    { x: node1X, y: node1Y },
    { x: node2X, y: node2Y },
    { x: node3X, y: node3Y },
  ];

  return (
    <div className="connected-stats-container" ref={containerRef}>
      <svg className="stats-connections">
        <ConnectionLine x1={positions[0].x} y1={positions[0].y} x2={positions[1].x} y2={positions[1].y} />
        <ConnectionLine x1={positions[1].x} y1={positions[1].y} x2={positions[2].x} y2={positions[2].y} />
        <ConnectionLine x1={positions[2].x} y1={positions[2].y} x2={positions[0].x} y2={positions[0].y} />
      </svg>

      {initialNodes.map((node, index) => (
        <DraggableNode 
          key={node.key} 
          node={node} 
          x={positions[index].x} 
          y={positions[index].y} 
        />
      ))}
    </div>
  );
}

function DraggableNode({ 
  node, 
  x, 
  y 
}: { 
  node: typeof initialNodes[0]; 
  x: MotionValue<number>; 
  y: MotionValue<number>;
}) {
  const { t } = useTranslation();

  return (
    <motion.div
      className="stat-node"
      drag
      dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
      dragElastic={0.2}
      dragMomentum={false}
      style={{ x, y }}
      whileHover={{ scale: 1.1, cursor: 'grab', zIndex: 10 }}
      whileDrag={{ scale: 1.2, cursor: 'grabbing', zIndex: 20 }}
    >
      <div className="node-content">
        <node.icon className="node-icon" size={24} />
        <span className="node-value">{node.value}</span>
      </div>
      <span className="node-label">{t(`about.highlights.${node.key}`)}</span>
    </motion.div>
  );
}

function ConnectionLine({ 
  x1, y1, x2, y2 
}: { 
  x1: MotionValue<number>; 
  y1: MotionValue<number>; 
  x2: MotionValue<number>; 
  y2: MotionValue<number>; 
}) {
  const lineX1 = useTransform(() => `calc(50% + ${x1.get()}px)`);
  const lineY1 = useTransform(() => `calc(50% + ${y1.get()}px)`);
  const lineX2 = useTransform(() => `calc(50% + ${x2.get()}px)`);
  const lineY2 = useTransform(() => `calc(50% + ${y2.get()}px)`);

  return (
    <motion.line
      x1={lineX1}
      y1={lineY1}
      x2={lineX2}
      y2={lineY2}
      stroke="rgba(0, 255, 249, 0.3)"
      strokeWidth="2"
      strokeDasharray="5 5"
    />
  );
}

