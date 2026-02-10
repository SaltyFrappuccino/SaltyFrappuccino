import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Code2, Brain, Rocket, Zap } from 'lucide-react';
import FlyingParticles from './FlyingParticles';
import './About.css';

const stats = [
  { key: 'experience', value: '3+', icon: Code2 },
  { key: 'projects', value: '50+', icon: Rocket },
  { key: 'technologies', value: '30+', icon: Zap },
  { key: 'coffee', value: '∞', icon: Brain },
];

const focusItems = [
  { key: 'fullstack', icon: '🚀' },
  { key: 'ai', icon: '🤖' },
  { key: 'backend', icon: '⚡' },
  { key: 'frontend', icon: '🎨' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function About() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="about section" ref={ref}>
      <FlyingParticles />

      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-subtitle">{t('about.subtitle')}</span>
          <h2 className="section-title neon-text">{t('about.title')}</h2>
        </motion.div>

        <div className="about-content">
          <motion.div
            className="about-text"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="about-description">{t('about.description')}</p>

            <div className="about-focus">
              <h3>{t('about.focus.title')}</h3>
              <motion.div
                className="focus-grid"
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
              >
                {focusItems.map((item) => (
                  <motion.div
                    key={item.key}
                    className="focus-item"
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, x: 10 }}
                  >
                    <span className="focus-icon">{item.icon}</span>
                    <span>{t(`about.focus.items.${item.key}`)}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="about-stats"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.key}
                  className="stat-card"
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '0 0 30px rgba(0, 255, 249, 0.3)',
                  }}
                >
                  <div className="stat-icon">
                    <Icon size={28} />
                  </div>
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{t(`about.highlights.${stat.key}`)}</div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      <div className="about-decoration">
        <div className="decoration-line decoration-line-1" />
        <div className="decoration-line decoration-line-2" />
      </div>
    </section>
  );
}
