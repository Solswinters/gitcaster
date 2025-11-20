/**
 * Search Service
 * 
 * Service layer for search operations with advanced filtering
 */

import { SearchQuery, SearchResponse, SavedSearch } from '../types/search.types';
import { createError, ErrorCode, handleError } from '@/shared/utils/errors';

interface SearchCache {
  query: string;
  response: SearchResponse;
  timestamp: number;
  expiresAt: number;
}

interface SearchFacets {
  skills: { value: string; count: number }[];
  locations: { value: string; count: number }[];
  companies: { value: string; count: number }[];
  experienceLevels: { value: string; count: number }[];
  languages: { value: string; count: number }[];
}

interface SearchAnalytics {
  totalSearches: number;
  popularQueries: { query: string; count: number }[];
  averageResultCount: number;
  searchTrends: { date: string; count: number }[];
}

/**
 * Search Service Class
 */
export class SearchService {
  private static instance: SearchService;
  private baseUrl = '/api/search';
  private cache: Map<string, SearchCache> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private searchHistory: { query: string; timestamp: number }[] = [];
  private readonly MAX_HISTORY = 50;

  private constructor() {
    this.loadSearchHistory();
  }

  static getInstance(): SearchService {
    if (!SearchService.instance) {
      SearchService.instance = new SearchService();
    }
    return SearchService.instance;
  }

  /**
   * Load search history from localStorage
   */
  private loadSearchHistory(): void {
    if (typeof window === 'undefined') return;

    try {
      const history = localStorage.getItem('searchHistory');
      if (history) {
        this.searchHistory = JSON.parse(history);
      }
    } catch {
      // Silently fail
    }
  }

  /**
   * Save search history to localStorage
   */
  private saveSearchHistory(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
    } catch {
      // Silently fail
    }
  }

  /**
   * Add to search history
   */
  private addToHistory(query: string): void {
    this.searchHistory = [
      { query, timestamp: Date.now() },
      ...this.searchHistory.filter((h) => h.query !== query),
    ].slice(0, this.MAX_HISTORY);

    this.saveSearchHistory();
  }

  /**
   * Generate cache key from query
   */
  private getCacheKey(query: SearchQuery): string {
    return JSON.stringify(query);
  }

  /**
   * Get cached search result
   */
  private getCachedResult(query: SearchQuery): SearchResponse | null {
    const key = this.getCacheKey(query);
    const cached = this.cache.get(key);

    if (cached && cached.expiresAt > Date.now()) {
      return cached.response;
    }

    if (cached) {
      this.cache.delete(key);
    }

    return null;
  }

  /**
   * Cache search result
   */
  private cacheResult(query: SearchQuery, response: SearchResponse): void {
    const key = this.getCacheKey(query);
    const now = Date.now();

    this.cache.set(key, {
      query: key,
      response,
      timestamp: now,
      expiresAt: now + this.CACHE_DURATION,
    });

    // Limit cache size
    if (this.cache.size > 100) {
      const oldestKey = Array.from(this.cache.entries()).sort(
        ([, a], [, b]) => a.timestamp - b.timestamp,
      )[0]?.[0];

      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }
  }

  /**
   * Search profiles with caching
   */
  async search(query: SearchQuery, useCache: boolean = true): Promise<SearchResponse> {
    try {
      // Check cache first
      if (useCache) {
        const cached = this.getCachedResult(query);
        if (cached) {
          return cached;
        }
      }

      // Add to history
      if (query.query) {
        this.addToHistory(query.query);
        this.addRecentSearch(query.query);
      }

      const params = new URLSearchParams();
      params.set('q', query.query);
      
      if (query.page) params.set('page', query.page.toString());
      if (query.limit) params.set('limit', query.limit.toString());
      
      if (query.sort) {
        params.set('sort', query.sort.field);
        params.set('direction', query.sort.direction);
      }

      if (query.filters) {
        Object.entries(query.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              value.forEach(v => params.append(key, v.toString()));
            } else {
              params.set(key, value.toString());
            }
          }
        });
      }

      const response = await fetch(`${this.baseUrl}?${params.toString()}`);

      if (!response.ok) {
        throw createError(
          'Search failed',
          ErrorCode.API_ERROR,
          response.status
        );
      }

      const data = await response.json();

      // Cache result
      this.cacheResult(query, data);

      return data;
    } catch (error) {
      throw handleError(error);
    }
  }

  /**
   * Get search suggestions
   */
  async getSuggestions(query: string): Promise<string[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/suggestions?q=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data.suggestions || [];
    } catch {
      return [];
    }
  }

  /**
   * Save a search
   */
  async saveSearch(name: string, query: SearchQuery): Promise<SavedSearch> {
    try {
      const response = await fetch(`${this.baseUrl}/saved`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, query }),
      });

      if (!response.ok) {
        throw createError(
          'Failed to save search',
          ErrorCode.API_ERROR,
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      throw handleError(error);
    }
  }

  /**
   * Get saved searches
   */
  async getSavedSearches(): Promise<SavedSearch[]> {
    try {
      const response = await fetch(`${this.baseUrl}/saved`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw createError(
          'Failed to get saved searches',
          ErrorCode.API_ERROR,
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      throw handleError(error);
    }
  }

  /**
   * Delete saved search
   */
  async deleteSavedSearch(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/saved/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw createError(
          'Failed to delete saved search',
          ErrorCode.API_ERROR,
          response.status
        );
      }
    } catch (error) {
      throw handleError(error);
    }
  }

  /**
   * Get recent searches (from local storage)
   */
  getRecentSearches(): string[] {
    if (typeof window === 'undefined') return [];

    try {
      const recent = localStorage.getItem('recentSearches');
      return recent ? JSON.parse(recent) : [];
    } catch {
      return [];
    }
  }

  /**
   * Add to recent searches
   */
  addRecentSearch(query: string): void {
    if (typeof window === 'undefined') return;

    try {
      const recent = this.getRecentSearches();
      const filtered = recent.filter(q => q !== query);
      const updated = [query, ...filtered].slice(0, 10);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    } catch {
      // Silently fail
    }
  }

  /**
   * Clear recent searches
   */
  clearRecentSearches(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem('recentSearches');
    } catch {
      // Silently fail
    }
  }

  /**
   * Get search facets
   */
  async getFacets(query?: string): Promise<SearchFacets> {
    try {
      const url = query
        ? `${this.baseUrl}/facets?q=${encodeURIComponent(query)}`
        : `${this.baseUrl}/facets`;

      const response = await fetch(url);

      if (!response.ok) {
        throw createError(
          'Failed to get facets',
          ErrorCode.API_ERROR,
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      throw handleError(error);
    }
  }

  /**
   * Advanced search with multiple criteria
   */
  async advancedSearch(criteria: {
    keywords?: string[];
    skills?: string[];
    location?: string;
    minExperience?: number;
    maxExperience?: number;
    languages?: string[];
    companies?: string[];
    page?: number;
    limit?: number;
  }): Promise<SearchResponse> {
    const filters: any = {};

    if (criteria.skills) filters.skills = criteria.skills;
    if (criteria.location) filters.location = criteria.location;
    if (criteria.minExperience) filters.minExperience = criteria.minExperience;
    if (criteria.maxExperience) filters.maxExperience = criteria.maxExperience;
    if (criteria.languages) filters.languages = criteria.languages;
    if (criteria.companies) filters.companies = criteria.companies;

    return this.search({
      query: criteria.keywords?.join(' ') || '',
      filters,
      page: criteria.page,
      limit: criteria.limit,
    });
  }

  /**
   * Fuzzy search with similarity threshold
   */
  async fuzzySearch(
    query: string,
    threshold: number = 0.7,
  ): Promise<SearchResponse> {
    try {
      const params = new URLSearchParams();
      params.set('q', query);
      params.set('fuzzy', 'true');
      params.set('threshold', threshold.toString());

      const response = await fetch(`${this.baseUrl}?${params.toString()}`);

      if (!response.ok) {
        throw createError(
          'Fuzzy search failed',
          ErrorCode.API_ERROR,
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      throw handleError(error);
    }
  }

  /**
   * Search by similar profiles
   */
  async searchSimilar(profileId: string, limit: number = 10): Promise<SearchResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/similar/${profileId}?limit=${limit}`,
      );

      if (!response.ok) {
        throw createError(
          'Similar search failed',
          ErrorCode.API_ERROR,
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      throw handleError(error);
    }
  }

  /**
   * Get search analytics
   */
  async getSearchAnalytics(): Promise<SearchAnalytics> {
    try {
      const response = await fetch(`${this.baseUrl}/analytics`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw createError(
          'Failed to get analytics',
          ErrorCode.API_ERROR,
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      throw handleError(error);
    }
  }

  /**
   * Get popular queries
   */
  async getPopularQueries(limit: number = 10): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/popular?limit=${limit}`);

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data.queries || [];
    } catch {
      return [];
    }
  }

  /**
   * Get trending searches
   */
  async getTrendingSearches(timeframe: 'day' | 'week' | 'month' = 'day'): Promise<string[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/trending?timeframe=${timeframe}`,
      );

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data.queries || [];
    } catch {
      return [];
    }
  }

  /**
   * Clear search cache
   */
  clearCache(query?: SearchQuery): void {
    if (query) {
      const key = this.getCacheKey(query);
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    size: number;
    keys: number;
    oldestEntry: number | null;
    newestEntry: number | null;
  } {
    let oldestEntry: number | null = null;
    let newestEntry: number | null = null;

    for (const [, entry] of this.cache) {
      if (oldestEntry === null || entry.timestamp < oldestEntry) {
        oldestEntry = entry.timestamp;
      }
      if (newestEntry === null || entry.timestamp > newestEntry) {
        newestEntry = entry.timestamp;
      }
    }

    return {
      size: this.cache.size,
      keys: this.cache.size,
      oldestEntry,
      newestEntry,
    };
  }

  /**
   * Get search history
   */
  getSearchHistory(limit?: number): { query: string; timestamp: number }[] {
    const history = [...this.searchHistory];
    return limit ? history.slice(0, limit) : history;
  }

  /**
   * Clear search history
   */
  clearSearchHistory(): void {
    this.searchHistory = [];
    this.saveSearchHistory();
  }

  /**
   * Export search history
   */
  exportSearchHistory(): string {
    return JSON.stringify(this.searchHistory, null, 2);
  }

  /**
   * Import search history
   */
  importSearchHistory(data: string): void {
    try {
      const history = JSON.parse(data);
      if (Array.isArray(history)) {
        this.searchHistory = history.slice(0, this.MAX_HISTORY);
        this.saveSearchHistory();
      }
    } catch {
      throw new Error('Invalid search history data');
    }
  }

  /**
   * Build search query from filters
   */
  buildQueryFromFilters(filters: Record<string, any>): string {
    const parts: string[] = [];

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          parts.push(`${key}:(${value.join(' OR ')})`);
        } else {
          parts.push(`${key}:${value}`);
        }
      }
    });

    return parts.join(' AND ');
  }

  /**
   * Validate search query
   */
  validateQuery(query: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!query || query.trim().length === 0) {
      errors.push('Query cannot be empty');
    }

    if (query.length > 500) {
      errors.push('Query is too long (max 500 characters)');
    }

    // Check for invalid characters
    const invalidChars = /[<>{}]/g;
    if (invalidChars.test(query)) {
      errors.push('Query contains invalid characters');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Sanitize search query
   */
  sanitizeQuery(query: string): string {
    // Remove special characters and extra whitespace
    return query
      .replace(/[<>{}]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
}

/**
 * Singleton instance export
 */
export const searchService = SearchService.getInstance();

/**
 * Convenience functions
 */
export const search = (query: SearchQuery, useCache?: boolean) =>
  searchService.search(query, useCache);
export const getSearchSuggestions = (query: string) => searchService.getSuggestions(query);
export const saveSearch = (name: string, query: SearchQuery) =>
  searchService.saveSearch(name, query);
export const getSavedSearches = () => searchService.getSavedSearches();
export const deleteSavedSearch = (id: string) => searchService.deleteSavedSearch(id);
export const getRecentSearches = () => searchService.getRecentSearches();
export const addRecentSearch = (query: string) => searchService.addRecentSearch(query);
export const clearRecentSearches = () => searchService.clearRecentSearches();
export const getSearchFacets = (query?: string) => searchService.getFacets(query);
export const advancedSearch = (criteria: Parameters<typeof searchService.advancedSearch>[0]) =>
  searchService.advancedSearch(criteria);
export const fuzzySearch = (query: string, threshold?: number) =>
  searchService.fuzzySearch(query, threshold);
export const searchSimilar = (profileId: string, limit?: number) =>
  searchService.searchSimilar(profileId, limit);
export const getSearchAnalytics = () => searchService.getSearchAnalytics();
export const getPopularQueries = (limit?: number) => searchService.getPopularQueries(limit);
export const getTrendingSearches = (timeframe?: 'day' | 'week' | 'month') =>
  searchService.getTrendingSearches(timeframe);
export const clearSearchCache = (query?: SearchQuery) => searchService.clearCache(query);
export const getSearchHistory = (limit?: number) => searchService.getSearchHistory(limit);
export const clearSearchHistory = () => searchService.clearSearchHistory();
export const validateSearchQuery = (query: string) => searchService.validateQuery(query);
export const sanitizeSearchQuery = (query: string) => searchService.sanitizeQuery(query);

