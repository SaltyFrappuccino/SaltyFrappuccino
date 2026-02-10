import { useState, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Star,
  GitFork,
  ExternalLink,
  Github,
  Search,
  X,
  Calendar,
  Code2,
  ChevronDown,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import { useGitHubRepos, type Repository } from '../../hooks/useGitHubRepos';
import DataCubes from './DataCubes';
import './Projects.css';
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178C6',
  JavaScript: '#F7DF1E',
  Python: '#3776AB',
  Go: '#00ADD8',
  Java: '#007396',
  PHP: '#777BB4',
  'C++': '#00599C',
  C: '#A8B9CC',
  Rust: '#DEA584',
  HTML: '#E34F26',
  CSS: '#1572B6',
  SCSS: '#CC6699',
  Vue: '#4FC08D',
  Svelte: '#FF3E00',
  Kotlin: '#A97BFF',
  Swift: '#FA7343',
  Ruby: '#CC342D',
  Shell: '#89E051',
  Lua: '#000080',
  Dart: '#0175C2',
};

type SortType = 'stars' | 'date' | 'name';
type DateRange = 'all' | 'thisYear' | 'lastYear';

const PAGE_SIZE = 9;

export default function Projects() {
  const { t } = useTranslation();
  const { allRepos, loading, error, languages } = useGitHubRepos();

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  // Separate ref/check for background performance (toggles continuously)
  const isBackgroundActive = useInView(ref, { margin: '100px 0px 100px 0px' });

  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLanguages, setActiveLanguages] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortType>('stars');
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);

  const filteredRepos = useMemo(() => {
    let result = [...allRepos];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q) ||
          r.topics?.some((topic) => topic.toLowerCase().includes(q)),
      );
    }

    if (activeLanguages.length > 0) {
      result = result.filter((r) => r.language && activeLanguages.includes(r.language));
    }

    const thisYear = new Date().getFullYear();
    if (dateRange === 'thisYear') {
      result = result.filter((r) => new Date(r.updated_at).getFullYear() === thisYear);
    } else if (dateRange === 'lastYear') {
      result = result.filter((r) => new Date(r.updated_at).getFullYear() === thisYear - 1);
    }

    result.sort((a, b) => {
      if (sortBy === 'stars') return b.stargazers_count - a.stargazers_count;
      if (sortBy === 'date') return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [allRepos, searchQuery, activeLanguages, dateRange, sortBy]);

  const displayedRepos = filteredRepos.slice(0, displayCount);
  const hasMore = displayCount < filteredRepos.length;

  const toggleLanguage = (lang: string) => {
    setActiveLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang],
    );
    setDisplayCount(PAGE_SIZE);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setActiveLanguages([]);
    setDateRange('all');
    setSortBy('stars');
    setDisplayCount(PAGE_SIZE);
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  return (
    <section id="projects" className="projects section" ref={ref}>
      <DataCubes isActive={isBackgroundActive} />

      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-subtitle">{t('projects.subtitle')}</span>
          <h2 className="section-title neon-text">{t('projects.title')}</h2>
          <p className="section-description-nda">
            {t('projects.ndaNote')}
          </p>
        </motion.div>

        <motion.div
          className="projects-controls"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
        >
          <div className="controls-row">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder={t('projects.search')}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setDisplayCount(PAGE_SIZE);
                }}
              />
              {searchQuery && (
                <button className="search-clear" onClick={() => setSearchQuery('')}>
                  <X size={16} />
                </button>
              )}
            </div>

            <button
              className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} />
              {t('projects.filter.sort')}
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                className="filters-panel"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="filter-group">
                  <label><ArrowUpDown size={14} /> {t('projects.filter.sort')}</label>
                  <div className="filter-options">
                    <button className={`filter-option ${sortBy === 'stars' ? 'active' : ''}`} onClick={() => setSortBy('stars')}>
                      <Star size={14} /> {t('projects.filter.byStars')}
                    </button>
                    <button className={`filter-option ${sortBy === 'date' ? 'active' : ''}`} onClick={() => setSortBy('date')}>
                      <Calendar size={14} /> {t('projects.filter.byDate')}
                    </button>
                    <button className={`filter-option ${sortBy === 'name' ? 'active' : ''}`} onClick={() => setSortBy('name')}>
                      {t('projects.filter.byName')}
                    </button>
                  </div>
                </div>

                <div className="filter-group">
                  <label><Calendar size={14} /> {t('projects.filter.dateRange')}</label>
                  <div className="filter-options">
                    <button className={`filter-option ${dateRange === 'all' ? 'active' : ''}`} onClick={() => setDateRange('all')}>
                      {t('projects.filter.allTime')}
                    </button>
                    <button className={`filter-option ${dateRange === 'thisYear' ? 'active' : ''}`} onClick={() => setDateRange('thisYear')}>
                      {t('projects.filter.thisYear')}
                    </button>
                    <button className={`filter-option ${dateRange === 'lastYear' ? 'active' : ''}`} onClick={() => setDateRange('lastYear')}>
                      {t('projects.filter.lastYear')}
                    </button>
                  </div>
                </div>

                {(activeLanguages.length > 0 || searchQuery || dateRange !== 'all') && (
                  <button className="clear-filters-btn" onClick={clearFilters}>
                    <X size={14} /> {t('projects.filter.clearAll')}
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="filter-tags">
            <motion.button
              className={`filter-tag ${activeLanguages.length === 0 ? 'active' : ''}`}
              onClick={() => setActiveLanguages([])}
            >
              {t('projects.all')}
            </motion.button>
            {languages.slice(0, 10).map((lang) => (
              <motion.button
                key={lang}
                className={`filter-tag ${activeLanguages.includes(lang) ? 'active' : ''}`}
                onClick={() => toggleLanguage(lang)}
                style={{
                  borderColor: activeLanguages.includes(lang) ? LANGUAGE_COLORS[lang] : undefined,
                  boxShadow: activeLanguages.includes(lang) ? `0 0 15px ${LANGUAGE_COLORS[lang]}40` : undefined,
                }}
              >
                <span className="lang-dot" style={{ backgroundColor: LANGUAGE_COLORS[lang] || '#888' }} />
                {lang}
              </motion.button>
            ))}
          </div>

          <div className="results-count">
            {t('projects.found')}: {filteredRepos.length} {t('projects.projects_count')}
          </div>
        </motion.div>

        {loading ? (
          <div className="projects-loading">
            <div className="loading-spinner" />
            <p>{t('projects.loading')}</p>
          </div>
        ) : error ? (
          <div className="projects-error">
            <p>{t('projects.error')}</p>
          </div>
        ) : (
          <>
            <motion.div
              className="projects-grid"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
              }}
            >
              {displayedRepos.map((repo, index) => (
                <motion.div
                  key={repo.id}
                  className="project-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index < PAGE_SIZE ? index * 0.05 : 0 }}
                  layout
                  onClick={() => setSelectedRepo(repo)}
                  style={{ '--lang-color': LANGUAGE_COLORS[repo.language || ''] || '#00d4ff' } as React.CSSProperties}
                >
                  <div className="project-header">
                    <h3 className="project-name">{repo.name}</h3>
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link-icon"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink size={18} />
                    </a>
                  </div>

                  <p className="project-description">
                    {repo.description || t('projects.noDescription')}
                  </p>

                  <div className="project-footer">
                    {repo.language && (
                      <span className="project-language">
                        <span
                          className="language-dot"
                          style={{ backgroundColor: LANGUAGE_COLORS[repo.language] || '#888' }}
                        />
                        {repo.language}
                      </span>
                    )}
                    <div className="project-stats">
                      {repo.stargazers_count > 0 && (
                        <span className="project-stat">
                          <Star size={14} />
                          {repo.stargazers_count}
                        </span>
                      )}
                      {repo.forks_count > 0 && (
                        <span className="project-stat">
                          <GitFork size={14} />
                          {repo.forks_count}
                        </span>
                      )}
                    </div>
                  </div>

                  {repo.topics && repo.topics.length > 0 && (
                    <div className="project-topics">
                      {repo.topics.slice(0, 3).map((topic) => (
                        <span key={topic} className="topic-tag">{topic}</span>
                      ))}
                      {repo.topics.length > 3 && (
                        <span className="topic-more">+{repo.topics.length - 3}</span>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>

            {hasMore && (
              <motion.div
                className="load-more-wrapper"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <motion.button
                  className="btn btn-secondary load-more-btn"
                  onClick={() => setDisplayCount((prev) => prev + PAGE_SIZE)}
                >
                  <ChevronDown size={20} />
                  {t('projects.loadMore')}
                </motion.button>
              </motion.div>
            )}

            <motion.div
              className="projects-cta"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
            >
              <a
                href="https://github.com/SaltyFrappuccino"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <Github size={20} />
                {t('projects.viewAll')}
              </a>
            </motion.div>
          </>
        )}
      </div>

      <AnimatePresence>
        {selectedRepo && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedRepo(null)}
          >
            <motion.div
              className="project-modal"
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setSelectedRepo(null)}>
                <X size={24} />
              </button>

              <div className="modal-header">
                <h2>{selectedRepo.name}</h2>
                {selectedRepo.language && (
                  <span
                    className="modal-language"
                    style={{
                      borderColor: LANGUAGE_COLORS[selectedRepo.language] || '#888',
                      color: LANGUAGE_COLORS[selectedRepo.language] || '#888',
                    }}
                  >
                    <Code2 size={16} />
                    {selectedRepo.language}
                  </span>
                )}
              </div>

              <p className="modal-description">
                {selectedRepo.description || t('projects.noDescription')}
              </p>

              <div className="modal-stats">
                <div className="modal-stat">
                  <Star size={20} />
                  <span>{selectedRepo.stargazers_count}</span>
                  <label>{t('projects.stars')}</label>
                </div>
                <div className="modal-stat">
                  <GitFork size={20} />
                  <span>{selectedRepo.forks_count}</span>
                  <label>{t('projects.forks')}</label>
                </div>
                <div className="modal-stat">
                  <Calendar size={20} />
                  <span>{formatDate(selectedRepo.updated_at)}</span>
                  <label>Updated</label>
                </div>
              </div>

              {selectedRepo.topics && selectedRepo.topics.length > 0 && (
                <div className="modal-topics">
                  {selectedRepo.topics.map((topic) => (
                    <span key={topic} className="topic-tag">{topic}</span>
                  ))}
                </div>
              )}

              <div className="modal-actions">
                <a
                  href={selectedRepo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  <Github size={20} />
                  {t('projects.viewRepo')}
                </a>
                {selectedRepo.homepage && (
                  <a
                    href={selectedRepo.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                  >
                    <ExternalLink size={20} />
                    Demo
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
