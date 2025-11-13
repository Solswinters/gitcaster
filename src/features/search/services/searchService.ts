/**
 * Search Service
 * 
 * Service layer for search operations
 */

import { SearchQuery, SearchResponse, SavedSearch } from '../types/search.types';
import { createError, ErrorCode, handleError } from '@/shared/utils/errors';

/**
 * Search Service Class
 */
export class SearchService {
  private static instance: SearchService;
  private baseUrl = '/api/search';

  private constructor() {}

  static getInstance(): SearchService {
    if (!SearchService.instance) {
      SearchService.instance = new SearchService();
    }
    return SearchService.instance;
  }

  /**
   * Search profiles
   */
  async search(query: SearchQuery): Promise<SearchResponse> {
    try {
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

      return await response.json();
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
}

/**
 * Singleton instance export
 */
export const searchService = SearchService.getInstance();

/**
 * Convenience functions
 */
export const search = (query: SearchQuery) => searchService.search(query);
export const getSearchSuggestions = (query: string) => searchService.getSuggestions(query);
export const saveSearch = (name: string, query: SearchQuery) =>
  searchService.saveSearch(name, query);
export const getSavedSearches = () => searchService.getSavedSearches();
export const deleteSavedSearch = (id: string) => searchService.deleteSavedSearch(id);
export const getRecentSearches = () => searchService.getRecentSearches();
export const addRecentSearch = (query: string) => searchService.addRecentSearch(query);
export const clearRecentSearches = () => searchService.clearRecentSearches();

