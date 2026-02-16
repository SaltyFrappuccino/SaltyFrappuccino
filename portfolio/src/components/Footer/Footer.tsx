import { useTranslation } from 'react-i18next';
import { Heart, Coffee } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-logo">
              <span className="bracket">&lt;</span>
              SF
              <span className="bracket">/&gt;</span>
            </span>
          </div>

          <div className="footer-tagline">
            <span>{t('footer.madeWith')}</span>
            <Heart className="heart-icon" size={16} />
            <span>{t('footer.and')}</span>
            <Coffee className="coffee-icon" size={16} />
          </div>

          <div className="footer-antigravity">
            <span className="footer-antigravity-label">{t('footer.assistedBy')}</span>
            <span className="footer-antigravity-name">
              Antigravity
              <span className="footer-antigravity-tooltip">
                {t('footer.antigravityTooltip')}
              </span>
            </span>
          </div>

          <p className="footer-neon-text">{t('footer.tagline')}</p>
        </div>
      </div>

      <div className="footer-decoration">
        <div className="footer-line" />
      </div>
    </footer>
  );
}
