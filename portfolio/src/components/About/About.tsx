import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import { useRef, type CSSProperties } from 'react';
import { MousePointerClick, Terminal, Monitor, Edit3, Layers3, Bot, ServerCog, Palette } from 'lucide-react';
import FlyingParticles from './FlyingParticles';
import ConnectedStats from './ConnectedStats';
import './About.css';




const focusItems = [
  { key: 'fullstack', icon: Layers3, color: '#00d4ff' },
  { key: 'automation', icon: Bot, color: '#a855f7' },
  { key: 'backend', icon: ServerCog, color: '#10b981' },
  { key: 'frontend', icon: Palette, color: '#f97316' },
];

const devTools = [
  { key: 'cursor', icon: MousePointerClick, color: '#00d4ff' },
  { key: 'antigravity', icon: Terminal, color: '#a855f7' },
  { key: 'vscode', icon: Monitor, color: '#3b82f6' },
  { key: 'nvim', icon: Edit3, color: '#10b981' },
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

            <motion.div
              className="philosophy-block"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
            >
              <h3 className="philosophy-title">{t('about.philosophy.title')}</h3>
              <blockquote className="philosophy-quote">
                {t('about.philosophy.text')}
              </blockquote>
            </motion.div>

            <div className="about-focus">
              <div className="focus-head">
                <h3>{t('about.focus.title')}</h3>
                <p>{t('about.focus.subtitle')}</p>
              </div>
              <motion.div
                className="focus-grid"
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
              >
                {focusItems.map((item) => (
                  <motion.div
                    key={item.key}
                    className="focus-card"
                    variants={itemVariants}
                    whileHover={{ y: -4 }}
                    style={{ '--focus-color': item.color } as CSSProperties}
                  >
                    <div className="focus-card-top">
                      <span className="focus-chip">{t(`about.focus.items.${item.key}.tag`)}</span>
                      <item.icon className="focus-icon" size={18} />
                    </div>
                    <h4 className="focus-name">{t(`about.focus.items.${item.key}.title`)}</h4>
                    <p className="focus-description">{t(`about.focus.items.${item.key}.desc`)}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          <div className="about-right">
            <motion.div
              className="about-stats-wrapper"
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
            >
              <ConnectedStats />
            </motion.div>


            <motion.div
              className="devtools-section"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
            >
              <h3 className="devtools-title">{t('about.devtools.title')}</h3>
              <div className="devtools-grid">
                {devTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <motion.div
                      key={tool.key}
                      className="devtool-card"
                      whileHover={{ scale: 1.05, y: -3 }}
                      style={{ '--tool-color': tool.color } as CSSProperties}
                    >
                      <div className="devtool-icon">
                        <Icon size={20} />
                      </div>
                      <div className="devtool-info">
                        <span className="devtool-name">
                          {t(`about.devtools.${tool.key}.name`)}
                        </span>
                        <span className="devtool-desc">
                          {t(`about.devtools.${tool.key}.desc`)}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="about-decoration">
        <div className="decoration-line decoration-line-1" />
        <div className="decoration-line decoration-line-2" />
      </div>
    </section>
  );
}
