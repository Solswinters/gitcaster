/**
 * Search feature type definitions
 */

export interface SearchQuery {
  text: string;
  filters: SearchFilters;
  sort?: SearchSort;
  pagination?: SearchPagination;
}

export interface SearchFilters {
  languages?: string[];
  skills?: string[];
  location?: string;
  experience?: ExperienceLevel[];
  availability?: boolean;
  minStars?: number;
  maxStars?: number;
  dateRange?: DateRange;
}

export interface SearchSort {
  field: 'relevance' | 'stars' | 'contributions' | 'followers' | 'recent';
  order: 'asc' | 'desc';
}

export interface SearchPagination {
  page: number;
  perPage: number;
}

export interface SearchResult<T = any> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  hasMore: boolean;
}

export interface DeveloperSearchResult {
  id: string;
  username: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  location?: string;
  skills: string[];
  stats: {
    stars: number;
    repositories: number;
    followers: number;
    contributions: number;
  };
  score: number;
}

export interface RepositorySearchResult {
  id: string;
  name: string;
  owner: string;
  description?: string;
  language: string;
  stars: number;
  forks: number;
  topics: string[];
  updatedAt: Date;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export type ExperienceLevel = 'junior' | 'mid' | 'senior' | 'lead' | 'principal';

export interface SearchSuggestion {
  type: 'user' | 'skill' | 'location' | 'language';
  value: string;
  count?: number;
}

