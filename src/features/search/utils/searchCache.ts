/**
 * Search Results Caching
 * 
 * Caches search results to reduce API calls and improve performance
 */

import { MemoryCache, searchResultsKey } from '@/shared/utils/cache';
import type { SearchFilters, SearchResponse } from '../types/search.types';

// Cache for search results (2 minutes TTL)
const searchCache = new MemoryCache<SearchResponse>(2 * 60 * 1000);

/**
 * Get cached search results
 */
export function getCachedSearchResults(filters: SearchFilters, page: number): SearchResponse | null {
  const key = searchResultsKey(JSON.stringify(filters), { page });
  return searchCache.get(key);
}

/**
 * Cache search results
 */
export function cacheSearchResults(
  filters: SearchFilters,
  page: number,
  results: SearchResponse
): void {
  const key = searchResultsKey(JSON.stringify(filters), { page });
  searchCache.set(key, results);
}

/**
 * Clear search cache
 */
export function clearSearchCache(): void {
  searchCache.clear();
}

/**
 * Prefetch next page
 */
export async function prefetchNextPage(
  filters: SearchFilters,
  currentPage: number,
  fetchFn: (filters: SearchFilters, page: number) => Promise<SearchResponse>
): Promise<void> {
  const nextPage = currentPage + 1;
  const cached = getCachedSearchResults(filters, nextPage);
  
  if (!cached) {
    try {
      const results = await fetchFn(filters, nextPage);
      cacheSearchResults(filters, nextPage, results);
    } catch (error) {
      // Silent fail for prefetch
      console.debug('Prefetch failed:', error);
    }
  }
}

/**
 * Get cache statistics
 */
export function getSearchCacheStats() {
  return searchCache.stats();
}

