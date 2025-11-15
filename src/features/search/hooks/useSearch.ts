/**
 * Search hook
 */

import { useState, useCallback } from 'react';
import type { SearchQuery, SearchResult, DeveloperSearchResult } from '../types';
import { SearchEngine } from '../services';

export function useSearch() {
  const [results, setResults] = useState<SearchResult<DeveloperSearchResult> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const search = useCallback(async (query: SearchQuery) => {
    try {
      setLoading(true);
      const searchResults = await SearchEngine.search(query);
      setResults(searchResults);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Search failed'));
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults(null);
    setError(null);
  }, []);

  return { results, loading, error, search, clearResults };
}
