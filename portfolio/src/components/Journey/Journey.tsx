import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import {
  GraduationCap,
  Gamepad2,
  Brain,
  Code2,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import JourneyBackground from './JourneyBackground';
import './Journey.css';

const journeyItems = [
  { key: 'quantorium1', icon: GraduationCap, color: '#10b981' },
  { key: 'gameford', icon: Gamepad2, color: '#f97316' },
  { key: 'sber_ai', icon: Brain, color: '#3b82f6' },
  { key: 'sber_fullstack', icon: Code2, color: '#a855f7' },
  { key: 'teacher', icon: BookOpen, color: '#ec4899' },
  { key: 'current', icon: Sparkles, color: '#00d4ff' },
] as const;

export default function Journey() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="journey" className="journey section" ref={ref}>
      <div className="journey-bg">
        <JourneyBackground />
      </div>

      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-subtitle">{t('journey.subtitle')}</span>
          <h2 className="section-title neon-text">{t('journey.title')}</h2>
        </motion.div>

        <div className="timeline">
          <div className="timeline-line" />

          {journeyItems.map((item, index) => {
            const Icon = item.icon;
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={item.key}
                className={`timeline-item ${isEven ? 'left' : 'right'}`}
                initial={{ opacity: 0, x: isEven ? -60 : 60 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <div
                  className="timeline-node"
                  style={{
                    borderColor: item.color,
                    boxShadow: `0 0 20px ${item.color}40`,
                  }}
                >
                  <Icon size={20} style={{ color: item.color }} />
                </div>

                <motion.div
                  className="timeline-card"
                  whileHover={{
                    scale: 1.03,
                    boxShadow: `0 0 30px ${item.color}25`,
                  }}
                  style={
                    {
                      '--card-accent': item.color,
                    } as React.CSSProperties
                  }
                >
                  <span className="timeline-period">
                    {t(`journey.items.${item.key}.period`)}
                  </span>
                  <h3 className="timeline-title">
                    {t(`journey.items.${item.key}.title`)}
                  </h3>
                  <p className="timeline-desc">
                    {t(`journey.items.${item.key}.desc`)}
                  </p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
