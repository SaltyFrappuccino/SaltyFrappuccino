import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Moon } from 'lucide-react';
import { useChillMode } from '../../context/ChillModeContext';
import { useTranslation } from 'react-i18next';
import './ChillModeToggle.css';

export default function ChillModeToggle() {
  const { isChillMode, toggleChillMode } = useChillMode();
  const { i18n } = useTranslation();

  const label = i18n.language === 'ru' 
    ? (isChillMode ? '🔥 Вернуть вырвиглазность' : '😎 Убрать вырвиглазность')
    : (isChillMode ? '🔥 Enable Eye-Burn Mode' : '😎 Chill Mode');

  return (
    <motion.button
      className={`chill-toggle ${isChillMode ? 'chill-active' : ''}`}
      onClick={toggleChillMode}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={isChillMode ? 'moon' : 'sparkles'}
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 180, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {isChillMode ? <Moon size={16} /> : <Sparkles size={16} />}
        </motion.span>
      </AnimatePresence>
      <span className="chill-label">{label}</span>
    </motion.button>
  );
}
