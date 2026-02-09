import { useState, useEffect } from 'react';
import axios from 'axios';

export interface Repository {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  fork: boolean;
  created_at: string;
  pushed_at: string;
  size: number;
  watchers_count: number;
  open_issues_count: number;
  default_branch: string;
  homepage: string | null;
}

interface UseGitHubReposResult {
  repos: Repository[];
  allRepos: Repository[];
  loading: boolean;
  error: string | null;
  languages: string[];
  filterByLanguage: (lang: string | null) => void;
  activeFilter: string | null;
  searchRepos: (query: string) => void;
  searchQuery: string;
  totalCount: number;
  loadMore: () => void;
  hasMore: boolean;
}

const GITHUB_USERNAME = 'SaltyFrappuccino';
const PER_PAGE = 100;
const DISPLAY_INCREMENT = 9;

export function useGitHubRepos(): UseGitHubReposResult {
  const [allRepos, setAllRepos] = useState<Repository[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<Repository[]>([]);
  const [displayCount, setDisplayCount] = useState(DISPLAY_INCREMENT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [languages, setLanguages] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Repository[]>(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos`,
          {
            params: {
              sort: 'updated',
              direction: 'desc',
              per_page: PER_PAGE,
            },
          }
        );

        // Filter out forks and sort by stars + recent updates
        const repos = response.data
          .filter((repo) => !repo.fork)
          .sort((a, b) => {
            if (a.stargazers_count !== b.stargazers_count) {
              return b.stargazers_count - a.stargazers_count;
            }
            return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
          });

        // Extract unique languages
        const langs = [...new Set(repos.map(r => r.language).filter(Boolean) as string[])];
        
        setAllRepos(repos);
        setFilteredRepos(repos);
        setLanguages(langs);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch repos:', err);
        setError('Failed to load repositories');
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  const filterByLanguage = (lang: string | null) => {
    setActiveFilter(lang);
    setDisplayCount(DISPLAY_INCREMENT);
    
    let filtered = allRepos;
    
    if (lang) {
      filtered = allRepos.filter(r => r.language === lang);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(r => 
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredRepos(filtered);
  };

  const searchRepos = (query: string) => {
    setSearchQuery(query);
    setDisplayCount(DISPLAY_INCREMENT);
    
    let filtered = allRepos;
    
    if (activeFilter) {
      filtered = filtered.filter(r => r.language === activeFilter);
    }
    
    if (query) {
      filtered = filtered.filter(r => 
        r.name.toLowerCase().includes(query.toLowerCase()) ||
        r.description?.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    setFilteredRepos(filtered);
  };

  const loadMore = () => {
    setDisplayCount(prev => prev + DISPLAY_INCREMENT);
  };

  const repos = filteredRepos.slice(0, displayCount);
  const hasMore = displayCount < filteredRepos.length;

  return { 
    repos, 
    allRepos,
    loading, 
    error, 
    languages, 
    filterByLanguage, 
    activeFilter,
    searchRepos,
    searchQuery,
    totalCount: filteredRepos.length,
    loadMore,
    hasMore
  };
}
