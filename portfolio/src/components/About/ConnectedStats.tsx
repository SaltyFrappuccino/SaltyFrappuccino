import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion, MotionValue, useMotionValue, useTransform } from 'framer-motion';
import { Bot, Brain, Code2, X } from 'lucide-react';

const TRIANGLE_SIZE = 280;

type StatNode = {
  key: 'experience' | 'technologies' | 'systems';
  icon: typeof Code2 | typeof Brain | typeof Bot;
  x: number;
  y: number;
  value: string;
};

const initialNodes: StatNode[] = [
  { key: 'experience', icon: Code2, x: 0, y: -TRIANGLE_SIZE / 1.7, value: '3+' },
  { key: 'technologies', icon: Brain, x: -TRIANGLE_SIZE / 1.7, y: TRIANGLE_SIZE / 3, value: '30+' },
  { key: 'systems', icon: Bot, x: TRIANGLE_SIZE / 1.7, y: TRIANGLE_SIZE / 3, value: '4' },
];

const agentItems = ['arti', 'bpmnWorkbench', 'aiProfiler', 'cohortAnalysis'] as const;

export default function ConnectedStats() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAgentsOpen, setIsAgentsOpen] = useState(false);

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

  useEffect(() => {
    if (!isAgentsOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsAgentsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAgentsOpen]);

  return (
    <>
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
            onOpenAgents={() => setIsAgentsOpen(true)}
          />
        ))}
      </div>

      <AnimatePresence>
        {isAgentsOpen && (
          <motion.div
            className="agents-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsAgentsOpen(false)}
          >
            <motion.div
              className="agents-modal"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="agents-modal-title"
            >
              <div className="agents-modal-header">
                <div>
                  <span className="agents-modal-kicker">{t('about.agents.kicker')}</span>
                  <h3 id="agents-modal-title" className="agents-modal-title">
                    {t('about.agents.title')}
                  </h3>
                  <p className="agents-modal-subtitle">{t('about.agents.subtitle')}</p>
                </div>

                <button
                  type="button"
                  className="agents-modal-close"
                  onClick={() => setIsAgentsOpen(false)}
                  aria-label={t('about.agents.close')}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="agents-modal-grid">
                {agentItems.map((item) => (
                  <article key={item} className="agent-card">
                    <div className="agent-card-dot" />
                    <div className="agent-card-body">
                      <h4 className="agent-card-title">{t(`about.agents.items.${item}.name`)}</h4>
                      <p className="agent-card-description">{t(`about.agents.items.${item}.desc`)}</p>
                    </div>
                  </article>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function DraggableNode({
  node,
  x,
  y,
  onOpenAgents,
}: {
  node: StatNode;
  x: MotionValue<number>;
  y: MotionValue<number>;
  onOpenAgents: () => void;
}) {
  const { t } = useTranslation();
  const isClickable = node.key === 'systems';

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isClickable) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onOpenAgents();
    }
  };

  return (
    <motion.div
      className={`stat-node ${isClickable ? 'is-clickable' : ''}`}
      drag={!isClickable}
      dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
      dragElastic={0.2}
      dragMomentum={false}
      style={{ x, y }}
      whileHover={{ scale: 1.08, zIndex: 10 }}
      whileDrag={{ scale: 1.2, cursor: 'grabbing', zIndex: 20 }}
      onClick={isClickable ? onOpenAgents : undefined}
      onKeyDown={handleKeyDown}
      tabIndex={isClickable ? 0 : -1}
      role={isClickable ? 'button' : undefined}
      aria-haspopup={isClickable ? 'dialog' : undefined}
      aria-label={isClickable ? t('about.agents.trigger') : undefined}
    >
      {isClickable && (
        <span className="node-click-badge">
          <span className="node-click-badge-dot" />
          {t('about.agents.badge')}
        </span>
      )}

      <div className="node-content">
        <node.icon className="node-icon" size={24} />
        <span className="node-value">{node.value}</span>
      </div>

      <span className="node-label">{t(`about.highlights.${node.key}`)}</span>
      {isClickable && <span className="node-action-hint">{t('about.agents.hint')}</span>}
    </motion.div>
  );
}

function ConnectionLine({
  x1,
  y1,
  x2,
  y2,
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
