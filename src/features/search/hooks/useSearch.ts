/**
 * Search Hook
 * 
 * Custom hook for managing search state and operations
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { searchService } from '../services/searchService';
import { SearchQuery, SearchResult, SearchFilters, SearchSort } from '../types/search.types';

export function useSearch(initialQuery = '') {
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [sort, setSort] = useState<SearchSort>({ field: 'relevance', direction: 'desc' });
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const search = useCallback(async (searchQuery?: string, resetPage = true) => {
    const queryToUse = searchQuery !== undefined ? searchQuery : query;
    
    if (!queryToUse.trim()) {
      setResults([]);
      setTotal(0);
      setHasMore(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const searchParams: SearchQuery = {
        query: queryToUse,
        filters,
        sort,
        page: resetPage ? 1 : page,
        limit: 20,
      };

      const response = await searchService.search(searchParams);

      if (resetPage) {
        setResults(response.results);
        setPage(1);
      } else {
        setResults(prev => [...prev, ...response.results]);
      }

      setTotal(response.total);
      setHasMore(response.hasMore);

      // Add to recent searches
      searchService.addRecentSearch(queryToUse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setIsLoading(false);
    }
  }, [query, filters, sort, page]);

  const loadMore = useCallback(() => {
    setPage(prev => prev + 1);
  }, []);

  const updateQuery = useCallback((newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  }, []);

  const updateFilters = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  const updateSort = useCallback((newSort: SearchSort) => {
    setSort(newSort);
    setPage(1);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setTotal(0);
    setPage(1);
    setHasMore(false);
    setError(null);
  }, []);

  // Search when dependencies change
  useEffect(() => {
    if (query) {
      search();
    }
  }, [page]); // Only re-search when page changes

  return {
    query,
    filters,
    sort,
    results,
    isLoading,
    error,
    total,
    hasMore,
    search,
    loadMore,
    updateQuery,
    updateFilters,
    updateSort,
    clearSearch,
  };
}

