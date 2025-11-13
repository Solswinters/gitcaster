/**
 * Search Feature Types
 * 
 * Type definitions for search functionality
 */

import { UserProfile } from '@/shared/types';

/**
 * Search query parameters
 */
export interface SearchQuery {
  query: string;
  filters?: SearchFilters;
  sort?: SearchSort;
  page?: number;
  limit?: number;
}

/**
 * Search filters
 */
export interface SearchFilters {
  languages?: string[];
  minStars?: number;
  maxStars?: number;
  minRepos?: number;
  maxRepos?: number;
  location?: string;
  hasGitHub?: boolean;
  hasTalentScore?: boolean;
  minTalentScore?: number;
  maxTalentScore?: number;
}

/**
 * Search sort options
 */
export interface SearchSort {
  field: 'relevance' | 'stars' | 'repos' | 'commits' | 'talentScore' | 'recent';
  direction: 'asc' | 'desc';
}

/**
 * Search result
 */
export interface SearchResult {
  profile: UserProfile;
  score: number;
  highlights?: {
    displayName?: string;
    bio?: string;
    githubUsername?: string;
  };
}

/**
 * Search response
 */
export interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  aggregations?: SearchAggregations;
}

/**
 * Search aggregations for faceted search
 */
export interface SearchAggregations {
  languages: Array<{
    language: string;
    count: number;
  }>;
  locations: Array<{
    location: string;
    count: number;
  }>;
  starRanges: Array<{
    range: string;
    count: number;
  }>;
}

/**
 * Saved search
 */
export interface SavedSearch {
  id: string;
  userId: string;
  name: string;
  query: SearchQuery;
  createdAt: string;
  updatedAt: string;
}

/**
 * Search suggestion
 */
export interface SearchSuggestion {
  text: string;
  type: 'username' | 'language' | 'skill' | 'location';
  count?: number;
}

/**
 * Search state
 */
export interface SearchState {
  query: string;
  filters: SearchFilters;
  sort: SearchSort;
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
  total: number;
  hasMore: boolean;
}

/**
 * Recent search
 */
export interface RecentSearch {
  query: string;
  timestamp: string;
}

