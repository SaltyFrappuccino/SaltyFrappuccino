import { useRef, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Award, Download, X, FileText, Image as ImageIcon, Search, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import AchievementsBackground from './AchievementsBackground';
import './Achievements.css';

const achievementFiles = import.meta.glob('../../assets/achievements/*', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

interface Achievement {
  filename: string;
  url: string;
  title: string;
  year: string;
  type: 'image' | 'pdf';
}

function parseAchievement(filename: string, url: string): Achievement {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const type: 'image' | 'pdf' = ext === 'pdf' ? 'pdf' : 'image';

  // Clean up filename for display
  let title = filename.replace(/\.[^.]+$/, ''); // remove extension
  
  // Extract year if present
  const yearMatch = title.match(/\b(20\d{2})\b/);
  const year = yearMatch ? yearMatch[1] : '';

  // Clean up common patterns
  title = title
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return { filename, url, title, year, type };
}

const achievements: Achievement[] = Object.entries(achievementFiles)
  .map(([path, url]) => {
    const filename = path.split('/').pop() || '';
    return parseAchievement(filename, url);
  })
  .sort((a, b) => {
    // Sort by year descending, then alphabetically
    if (a.year && b.year) return b.year.localeCompare(a.year);
    if (a.year) return -1;
    if (b.year) return 1;
    return a.title.localeCompare(b.title);
  });

const ITEMS_PER_PAGE = 6;

interface SelectedItem {
  url: string;
  type: 'image' | 'pdf';
}

export default function Achievements() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const isBackgroundActive = useInView(ref, { margin: '100px 0px 100px 0px' });
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInputValue, setPageInputValue] = useState('1');

  // Extract unique years
  const years = useMemo(() => {
    const uniqueYears = [...new Set(achievements.map(a => a.year).filter(Boolean))];
    return uniqueYears.sort((a, b) => b.localeCompare(a));
  }, []);

  // Filtered achievements
  const filtered = useMemo(() => {
    return achievements.filter(item => {
      const matchesSearch = !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesYear = !selectedYear || item.year === selectedYear;
      return matchesSearch && matchesYear;
    });
  }, [searchQuery, selectedYear]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedItems = filtered.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  // Reset page when filters change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    setPageInputValue('1');
  };

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
    setCurrentPage(1);
    setPageInputValue('1');
  };

  const goToPage = (page: number) => {
    const clamped = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(clamped);
    setPageInputValue(String(clamped));
  };

  const handlePageInputChange = (value: string) => {
    setPageInputValue(value);
    const num = parseInt(value);
    if (!isNaN(num) && num >= 1 && num <= totalPages) {
      setCurrentPage(num);
    }
  };

  const handlePageInputBlur = () => {
    setPageInputValue(String(safePage));
  };

  const handlePageInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePageInputBlur();
    }
  };

  const handleOpen = (item: Achievement) => {
    setSelectedItem({ url: item.url, type: item.type });
  };

  return (
    <section id="achievements" className="achievements section" ref={ref}>
      <div className="achievements-bg">
        <AchievementsBackground isActive={isBackgroundActive} />
      </div>

      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-subtitle">{t('achievements.subtitle')}</span>
          <h2 className="section-title neon-text">{t('achievements.title')}</h2>
        </motion.div>

        <motion.div
          className="achievements-cta-banner"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
        >
          <Award size={24} />
          <p>{t('achievements.cta')}</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="achievements-filters"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.25 }}
        >
          <div className="achievements-search-wrapper">
            <Search size={16} className="achievements-search-icon" />
            <input
              type="text"
              className="achievements-search-input"
              placeholder={t('achievements.search')}
              value={searchQuery}
              onChange={e => handleSearchChange(e.target.value)}
            />
          </div>

          <div className="achievements-year-wrapper">
            <Calendar size={16} className="achievements-year-icon" />
            <select
              className="achievements-year-select"
              value={selectedYear}
              onChange={e => handleYearChange(e.target.value)}
            >
              <option value="">{t('achievements.allYears')}</option>
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="achievements-filter-info">
            {t('achievements.found')} <strong>{filtered.length}</strong> {t('achievements.items')}
          </div>
        </motion.div>

        {/* Grid */}
        <motion.div
          className="achievements-grid"
          key={`${searchQuery}-${selectedYear}-${safePage}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {paginatedItems.length > 0 ? (
            paginatedItems.map((item, index) => (
              <motion.div
                key={item.filename}
                className={`achievement-card ${item.type}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * index, duration: 0.25 }}
              >
                {item.type === 'image' ? (
                  <div
                    className="achievement-preview"
                    onClick={() => handleOpen(item)}
                  >
                    <img
                      src={item.url}
                      alt={item.title}
                      loading="lazy"
                    />
                    <div className="achievement-overlay">
                      <ImageIcon size={24} />
                    </div>
                  </div>
                ) : (
                  <div 
                    className="achievement-preview pdf-preview"
                    onClick={() => handleOpen(item)}
                  >
                    <FileText size={40} />
                    <span className="pdf-label">PDF</span>
                    <div className="achievement-overlay">
                      <FileText size={24} />
                    </div>
                  </div>
                )}

                <div className="achievement-info">
                  <h4 className="achievement-title">{item.title}</h4>
                  {item.year && (
                    <span className="achievement-year">{item.year}</span>
                  )}
                  <div className="achievement-actions">
                    <button
                      className="achievement-btn"
                      onClick={() => handleOpen(item)}
                    >
                      {item.type === 'pdf' ? <FileText size={14} /> : <ImageIcon size={14} />}
                      {t('achievements.view')}
                    </button>
                    {item.type === 'pdf' && (
                       <a
                         href={item.url}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="achievement-btn"
                         onClick={(e) => e.stopPropagation()}
                       >
                         <Download size={14} />
                       </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="achievements-empty">
              <Search size={40} />
              <p>{t('achievements.noResults')}</p>
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            className="achievements-pagination"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.35 }}
          >
            <button
              className="achievements-page-btn"
              onClick={() => goToPage(safePage - 1)}
              disabled={safePage <= 1}
            >
              <ChevronLeft size={18} />
            </button>

            <div className="achievements-page-indicator">
              <span>{t('achievements.page')}</span>
              <input
                type="text"
                className="achievements-page-input"
                value={pageInputValue}
                onChange={e => handlePageInputChange(e.target.value)}
                onBlur={handlePageInputBlur}
                onKeyDown={handlePageInputKeyDown}
              />
              <span>{t('achievements.of')} {totalPages}</span>
            </div>

            <button
              className="achievements-page-btn"
              onClick={() => goToPage(safePage + 1)}
              disabled={safePage >= totalPages}
            >
              <ChevronRight size={18} />
            </button>
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              className={`lightbox-content ${selectedItem.type === 'pdf' ? 'lightbox-pdf' : ''}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="lightbox-close"
                onClick={() => setSelectedItem(null)}
              >
                <X size={24} />
              </button>
              
              {selectedItem.type === 'image' ? (
                <img src={selectedItem.url} alt="Achievement" />
              ) : (
                <iframe 
                  src={selectedItem.url} 
                  title="PDF Preview"
                  className="pdf-frame"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
