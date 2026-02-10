import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import InteractiveCosmos from './InteractiveCosmos';
import './Skills.css';

const skillCategories = {
  languages: [
    { name: 'Python', color: '#3776AB' },
    { name: 'TypeScript', color: '#3178C6' },
    { name: 'JavaScript', color: '#F7DF1E' },
    { name: 'Go', color: '#00ADD8' },
    { name: 'Java', color: '#007396' },
    { name: 'PHP', color: '#777BB4' },
    { name: 'C++', color: '#00599C' },
    { name: 'Rust', color: '#DEA584' },
  ],
  backend: [
    { name: 'FastAPI', color: '#009688' },
    { name: 'Django', color: '#092E20' },
    { name: 'Laravel', color: '#FF2D20' },
    { name: 'Gin', color: '#00D33E' },
    { name: 'Node.js', color: '#339933' },
    { name: 'PostgreSQL', color: '#336791' },
    { name: 'Redis', color: '#DC382D' },
    { name: 'MySQL', color: '#4479A1' },
    { name: 'Mongo', color: '#47A248' },
    { name: 'SQLite', color: '#003B57' },
  ],
  frontend: [
    { name: 'React', color: '#61DAFB' },
    { name: 'Next.js', color: '#000000' },
    { name: 'Redux', color: '#764ABC' },
    { name: 'Vite', color: '#646CFF' },
    { name: 'Bun', color: '#FBF0DF' },
    { name: 'SASS', color: '#CC6699' },
    { name: 'Framer Motion', color: '#00D8FF' },
  ],
  ai: [
    { name: 'LangChain', color: '#1C3C3C' },
    { name: 'LangGraph', color: '#2D5A5A' },
    { name: 'scikit-learn', color: '#F7931E' },
    { name: 'TensorFlow', color: '#FF6F00' },
    { name: 'Pandas', color: '#150458' },
  ],
  devops: [
    { name: 'Docker', color: '#2496ED' },
    { name: 'AWS', color: '#FF9900' },
    { name: 'Google Cloud', color: '#4285F4' },
    { name: 'Vercel', color: '#000000' },
    { name: 'Git', color: '#F05032' },
    { name: 'GitHub Actions', color: '#2088FF' },
    { name: 'Nginx', color: '#009639' },
  ],
  tools: [
    { name: 'Cursor', color: '#00d4ff' },
    { name: 'Antigravity', color: '#a855f7' },
    { name: 'VS Code', color: '#007ACC' },
    { name: 'Neovim', color: '#57A143' },
    { name: 'WAMP', color: '#FF0080' },
    { name: 'API Studio', color: '#28A745' },
    { name: 'DataGrip', color: '#000000' },
    { name: 'DataSpell', color: '#000000' },
    { name: 'Notebooks', color: '#F37626' },
  ],
} as const;

const categoryColors: Record<keyof typeof skillCategories, string> = {
  languages: '#3b82f6', // Brighter Blue
  backend: '#10b981',   // Brighter Green
  frontend: '#61DAFB',
  ai: '#FF6F00',
  devops: '#ef4444',    // More Red
  tools: '#a855f7',
};


const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

export default function Skills() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="skills" className="skills section" ref={ref}>
      <InteractiveCosmos />

      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-subtitle">{t('skills.subtitle')}</span>
          <h2 className="section-title neon-text">{t('skills.title')}</h2>
        </motion.div>

        {/* CodeWars Badge */}
        <motion.div
          className="codewars-section"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
        >
          <h3 className="codewars-title">{t('skills.codewars.title')}</h3>
          <a
            href="https://www.codewars.com/users/SaltyFrappuccino"
            target="_blank"
            rel="noopener noreferrer"
            className="codewars-badge-link"
          >
            <img
              src="https://www.codewars.com/users/SaltyFrappuccino/badges/large"
              alt="CodeWars Badge"
              className="codewars-badge"
            />
          </a>
        </motion.div>

        <div className="skills-grid">
          {Object.entries(skillCategories).map(([category, skills], catIndex) => (
            <motion.div
              key={category}
              className="skill-category"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: catIndex * 0.1 }}
              style={{ '--category-color': categoryColors[category as keyof typeof skillCategories] } as React.CSSProperties}
            >
              <h3 className="category-title" style={{ color: 'var(--category-color)' }}>
                {t(`skills.categories.${category}`)}
              </h3>
              <motion.div
                className="skill-tags"
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
              >
                {skills.map((skill) => (
                  <motion.span
                    key={skill.name}
                    className="skill-tag"
                    variants={itemVariants}
                    style={{ '--skill-color': skill.color } as React.CSSProperties}
                  >
                    <span className="skill-dot" style={{ backgroundColor: skill.color }} />
                    {skill.name}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="skills-bg">
        <div className="hex-grid" />
      </div>
    </section>
  );
}
