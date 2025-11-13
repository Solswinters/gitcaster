/**
 * Search Helper Utilities
 * 
 * Helper functions for search operations
 */

import { SearchFilters, SearchQuery, SearchResult } from '../types/search.types';
import { UserProfile } from '@/shared/types';

/**
 * Build search query from filters
 */
export function buildSearchQuery(
  query: string,
  filters?: SearchFilters,
  page = 1,
  limit = 20
): SearchQuery {
  return {
    query,
    filters,
    page,
    limit,
    sort: { field: 'relevance', direction: 'desc' },
  };
}

/**
 * Filter profiles by languages
 */
export function filterByLanguages(
  profiles: UserProfile[],
  languages: string[]
): UserProfile[] {
  if (languages.length === 0) return profiles;

  return profiles.filter(profile => {
    const profileLanguages =
      profile.githubStats?.languages.map(l => l.language.toLowerCase()) || [];
    return languages.some(lang =>
      profileLanguages.includes(lang.toLowerCase())
    );
  });
}

/**
 * Filter profiles by star range
 */
export function filterByStars(
  profiles: UserProfile[],
  min?: number,
  max?: number
): UserProfile[] {
  return profiles.filter(profile => {
    const stars = profile.githubStats?.totalStars || 0;
    if (min !== undefined && stars < min) return false;
    if (max !== undefined && stars > max) return false;
    return true;
  });
}

/**
 * Filter profiles by repository count
 */
export function filterByRepos(
  profiles: UserProfile[],
  min?: number,
  max?: number
): UserProfile[] {
  return profiles.filter(profile => {
    const repos = profile.githubStats?.publicRepos || 0;
    if (min !== undefined && repos < min) return false;
    if (max !== undefined && repos > max) return false;
    return true;
  });
}

/**
 * Filter profiles by location
 */
export function filterByLocation(
  profiles: UserProfile[],
  location: string
): UserProfile[] {
  if (!location) return profiles;

  const searchTerm = location.toLowerCase();
  return profiles.filter(profile =>
    profile.location?.toLowerCase().includes(searchTerm)
  );
}

/**
 * Sort profiles by field
 */
export function sortProfiles(
  profiles: UserProfile[],
  field: 'stars' | 'repos' | 'commits' | 'talentScore',
  direction: 'asc' | 'desc' = 'desc'
): UserProfile[] {
  const sorted = [...profiles].sort((a, b) => {
    let aValue = 0;
    let bValue = 0;

    switch (field) {
      case 'stars':
        aValue = a.githubStats?.totalStars || 0;
        bValue = b.githubStats?.totalStars || 0;
        break;
      case 'repos':
        aValue = a.githubStats?.publicRepos || 0;
        bValue = b.githubStats?.publicRepos || 0;
        break;
      case 'commits':
        aValue = a.githubStats?.totalCommits || 0;
        bValue = b.githubStats?.totalCommits || 0;
        break;
      case 'talentScore':
        aValue = a.talentScore || 0;
        bValue = b.talentScore || 0;
        break;
    }

    return direction === 'desc' ? bValue - aValue : aValue - bValue;
  });

  return sorted;
}

/**
 * Calculate search relevance score
 */
export function calculateRelevance(profile: UserProfile, query: string): number {
  let score = 0;
  const searchTerm = query.toLowerCase();

  // Exact matches get highest score
  if (profile.displayName?.toLowerCase() === searchTerm) score += 100;
  if (profile.githubUsername?.toLowerCase() === searchTerm) score += 100;

  // Partial matches get medium score
  if (profile.displayName?.toLowerCase().includes(searchTerm)) score += 50;
  if (profile.githubUsername?.toLowerCase().includes(searchTerm)) score += 50;
  if (profile.bio?.toLowerCase().includes(searchTerm)) score += 30;
  if (profile.company?.toLowerCase().includes(searchTerm)) score += 20;
  if (profile.location?.toLowerCase().includes(searchTerm)) score += 10;

  // Language match
  const languages =
    profile.githubStats?.languages.map(l => l.language.toLowerCase()) || [];
  if (languages.some(lang => lang.includes(searchTerm))) {
    score += 40;
  }

  return score;
}

/**
 * Highlight search term in text
 */
export function highlightMatch(text: string, query: string): string {
  if (!query || !text) return text;

  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

/**
 * Escape special regex characters
 */
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Generate search suggestions from profiles
 */
export function generateSuggestions(
  profiles: UserProfile[],
  query: string,
  limit = 5
): string[] {
  const suggestions = new Set<string>();
  const searchTerm = query.toLowerCase();

  profiles.forEach(profile => {
    // Username suggestions
    if (profile.githubUsername?.toLowerCase().includes(searchTerm)) {
      suggestions.add(profile.githubUsername);
    }

    // Display name suggestions
    if (profile.displayName?.toLowerCase().includes(searchTerm)) {
      suggestions.add(profile.displayName);
    }

    // Language suggestions
    profile.githubStats?.languages.forEach(lang => {
      if (lang.language.toLowerCase().includes(searchTerm)) {
        suggestions.add(lang.language);
      }
    });

    // Location suggestions
    if (profile.location?.toLowerCase().includes(searchTerm)) {
      suggestions.add(profile.location);
    }
  });

  return Array.from(suggestions).slice(0, limit);
}

/**
 * Parse search query for filters
 */
export function parseSearchQuery(query: string): {
  cleanQuery: string;
  filters: Partial<SearchFilters>;
} {
  const filters: Partial<SearchFilters> = {};
  let cleanQuery = query;

  // Parse language filter: lang:javascript
  const langMatch = query.match(/lang:(\w+)/i);
  if (langMatch) {
    filters.languages = [langMatch[1]];
    cleanQuery = cleanQuery.replace(langMatch[0], '').trim();
  }

  // Parse location filter: location:usa
  const locationMatch = query.match(/location:([^\s]+)/i);
  if (locationMatch) {
    filters.location = locationMatch[1];
    cleanQuery = cleanQuery.replace(locationMatch[0], '').trim();
  }

  // Parse stars filter: stars:>100
  const starsMatch = query.match(/stars:(>|<)(\d+)/i);
  if (starsMatch) {
    const operator = starsMatch[1];
    const value = parseInt(starsMatch[2]);
    if (operator === '>') filters.minStars = value;
    if (operator === '<') filters.maxStars = value;
    cleanQuery = cleanQuery.replace(starsMatch[0], '').trim();
  }

  return { cleanQuery, filters };
}

/**
 * Paginate search results
 */
export function paginateResults<T>(
  results: T[],
  page: number,
  limit: number
): {
  items: T[];
  total: number;
  hasMore: boolean;
} {
  const start = (page - 1) * limit;
  const end = start + limit;
  const items = results.slice(start, end);

  return {
    items,
    total: results.length,
    hasMore: end < results.length,
  };
}

/**
 * Deduplicate search results
 */
export function deduplicateResults(results: SearchResult[]): SearchResult[] {
  const seen = new Set<string>();
  return results.filter(result => {
    const id = result.profile.id;
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

/**
 * Merge and sort search results
 */
export function mergeSearchResults(
  results1: SearchResult[],
  results2: SearchResult[]
): SearchResult[] {
  const merged = [...results1, ...results2];
  const deduplicated = deduplicateResults(merged);
  return deduplicated.sort((a, b) => b.score - a.score);
}

/**
 * Filter empty queries
 */
export function isValidQuery(query: string): boolean {
  return query.trim().length >= 2;
}

/**
 * Format search count
 */
export function formatSearchCount(count: number): string {
  if (count === 0) return 'No results';
  if (count === 1) return '1 result';
  if (count < 1000) return `${count} results`;
  return `${(count / 1000).toFixed(1)}K results`;
}

