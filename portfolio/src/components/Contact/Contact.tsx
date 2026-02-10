import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Github, Send, Mail, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import TerminalRain from './TerminalRain';
import './Contact.css';

const contacts = [
  {
    id: 'github',
    icon: Github,
    url: 'https://github.com/SaltyFrappuccino',
    value: 'SaltyFrappuccino',
    color: '#ffffff',
  },
  {
    id: 'telegram',
    icon: Send,
    url: 'https://t.me/SaltyFrappuccino',
    value: '@SaltyFrappuccino',
    color: '#0088cc',
  },
  {
    id: 'email',
    icon: Mail,
    url: 'mailto:saltyfrappuccino@internet.ru',
    value: 'saltyfrappuccino@internet.ru',
    color: '#ff6b35',
  },
];

export default function Contact() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="contact" className="contact section" ref={ref}>
      {/* Terminal Rain Background */}
      <TerminalRain />

      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-subtitle">{t('contact.subtitle')}</span>
          <h2 className="section-title neon-text">{t('contact.title')}</h2>
        </motion.div>

        <motion.p
          className="contact-description"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
        >
          {t('contact.description')}
        </motion.p>

        <motion.div
          className="contact-links"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {contacts.map((contact) => {
            const Icon = contact.icon;
            return (
              <motion.div
                key={contact.id}
                className="contact-card"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                style={{ '--contact-color': contact.color } as React.CSSProperties}
              >
                <a
                  href={contact.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                >
                  <div className="contact-icon">
                    <Icon size={28} />
                  </div>
                  <div className="contact-info">
                    <span className="contact-label">
                      {t(`contact.links.${contact.id}`)}
                    </span>
                    <span className="contact-value">{contact.value}</span>
                  </div>
                </a>
                <motion.button
                  className="copy-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    copyToClipboard(contact.value, contact.id);
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Copy"
                >
                  {copied === contact.id ? (
                    <Check size={16} className="copied" />
                  ) : (
                    <Copy size={16} />
                  )}
                </motion.button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Background decoration */}
      <div className="contact-bg">
        <div className="contact-glow" />
      </div>
    </section>
  );
}
