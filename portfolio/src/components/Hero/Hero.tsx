import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ChevronDown, Github, Send } from 'lucide-react';
import './Hero.css';

export default function Hero() {
  const { t } = useTranslation();

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="hero">
      {/* Animated background elements */}
      <div className="hero-bg">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
        <div className="hero-grid" />
      </div>

      <div className="hero-content container">
        <motion.div
          className="hero-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.p
            className="hero-greeting"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {t('hero.greeting')}
          </motion.p>

          <motion.h1
            className="hero-name glitch"
            data-text={t('hero.nickname')}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {t('hero.nickname')}
          </motion.h1>

          <motion.div
            className="hero-role-wrapper"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <span className="hero-role-prefix">{'>'}</span>
            <span className="hero-role typing-effect">{t('hero.role')}</span>
            <span className="cursor">_</span>
          </motion.div>

          <motion.p
            className="hero-description"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            {t('hero.description')}
          </motion.p>

          <motion.div
            className="hero-cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <motion.button
              className="btn btn-primary"
              onClick={scrollToProjects}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Github size={20} />
              {t('hero.cta.projects')}
            </motion.button>
            <motion.button
              className="btn btn-secondary"
              onClick={scrollToContact}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Send size={20} />
              {t('hero.cta.contact')}
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Decorative code block */}
        <motion.div
          className="hero-decoration"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="code-window">
            <div className="code-window-header">
              <span className="code-dot red" />
              <span className="code-dot yellow" />
              <span className="code-dot green" />
              <span className="code-title">developer.ts</span>
            </div>
            <div className="code-content">
              <pre>
{`const developer = {
  name: "Alexander",
  aka: "SaltyFrappuccino",
  age: 21,
  location: "Russia 🇷🇺",
  
  skills: [
    "Fullstack",
    "AI Engineering",
    "System Design"
  ],
  
  currentlyLearning: "∞",
  
  getDrink(): string {
    return "☕ Frappuccino";
  }
};`}
              </pre>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <span>{t('hero.scroll')}</span>
        <ChevronDown className="scroll-arrow" />
      </motion.div>
    </section>
  );
}
