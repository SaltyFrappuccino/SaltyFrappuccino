import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe } from 'lucide-react';
import './Header.css';

const NAV_ITEMS = ['home', 'about', 'skills', 'projects', 'contact'] as const;

export default function Header() {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ru' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.header
      className={`header ${isScrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="header-container container">
        <motion.a
          href="#home"
          className="logo"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('home');
          }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="logo-bracket">&lt;</span>
          <span className="logo-text">Salty</span>
          <span className="logo-accent">Frappuccino</span>
          <span className="logo-bracket">/&gt;</span>
        </motion.a>

        <nav className="nav-desktop">
          {NAV_ITEMS.map((item, index) => (
            <motion.a
              key={item}
              href={`#${item}`}
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(item);
              }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {t(`nav.${item}`)}
              <span className="nav-link-underline" />
            </motion.a>
          ))}
        </nav>

        <div className="header-actions">
          <motion.button
            className="lang-toggle"
            onClick={toggleLanguage}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Toggle language"
          >
            <Globe size={20} />
            <span className="lang-code">{i18n.language.toUpperCase()}</span>
          </motion.button>

          <motion.button
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.9 }}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            className="nav-mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {NAV_ITEMS.map((item, index) => (
              <motion.a
                key={item}
                href={`#${item}`}
                className="nav-link-mobile"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item);
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {t(`nav.${item}`)}
              </motion.a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
