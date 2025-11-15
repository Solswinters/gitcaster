/**
 * Search engine service
 */

import type { SearchQuery, SearchResult, DeveloperSearchResult } from '../types';

export class SearchEngine {
  /**
   * Execute search query
   */
  static async search(query: SearchQuery): Promise<SearchResult<DeveloperSearchResult>> {
    // Build query
    const results = await this.executeQuery(query);
    
    // Apply filters
    const filtered = this.applyFilters(results, query.filters);
    
    // Sort results
    const sorted = this.sortResults(filtered, query.sort);
    
    // Paginate
    const paginated = this.paginate(sorted, query.pagination);
    
    return {
      items: paginated,
      total: filtered.length,
      page: query.pagination?.page || 1,
      perPage: query.pagination?.perPage || 20,
      hasMore: (query.pagination?.page || 1) * (query.pagination?.perPage || 20) < filtered.length,
    };
  }

  private static async executeQuery(query: SearchQuery): Promise<DeveloperSearchResult[]> {
    // TODO: Implement actual search logic
    return [];
  }

  private static applyFilters(
    results: DeveloperSearchResult[],
    filters: SearchQuery['filters']
  ): DeveloperSearchResult[] {
    let filtered = results;

    if (filters.languages?.length) {
      filtered = filtered.filter((r) =>
        filters.languages!.some((lang) => r.skills.includes(lang))
      );
    }

    if (filters.skills?.length) {
      filtered = filtered.filter((r) =>
        filters.skills!.some((skill) => r.skills.includes(skill))
      );
    }

    if (filters.location) {
      filtered = filtered.filter((r) =>
        r.location?.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    if (filters.minStars) {
      filtered = filtered.filter((r) => r.stats.stars >= filters.minStars!);
    }

    return filtered;
  }

  private static sortResults(
    results: DeveloperSearchResult[],
    sort?: SearchQuery['sort']
  ): DeveloperSearchResult[] {
    if (!sort) return results;

    const sorted = [...results].sort((a, b) => {
      let compareValue = 0;

      switch (sort.field) {
        case 'relevance':
          compareValue = b.score - a.score;
          break;
        case 'stars':
          compareValue = b.stats.stars - a.stats.stars;
          break;
        case 'contributions':
          compareValue = b.stats.contributions - a.stats.contributions;
          break;
        case 'followers':
          compareValue = b.stats.followers - a.stats.followers;
          break;
      }

      return sort.order === 'asc' ? -compareValue : compareValue;
    });

    return sorted;
  }

  private static paginate(
    results: DeveloperSearchResult[],
    pagination?: SearchQuery['pagination']
  ): DeveloperSearchResult[] {
    if (!pagination) return results.slice(0, 20);

    const start = (pagination.page - 1) * pagination.perPage;
    const end = start + pagination.perPage;

    return results.slice(start, end);
  }
}

