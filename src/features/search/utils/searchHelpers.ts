/**
 * Search Helper Utilities
 */

import type { SearchFilters, SearchResult } from '../types/search.types';

/**
 * Build query string from search filters
 */
export function buildSearchQuery(filters: SearchFilters): string {
  const params = new URLSearchParams();

  if (filters.query) params.set('q', filters.query);
  if (filters.skills?.length) params.set('skills', filters.skills.join(','));
  if (filters.languages?.length) params.set('languages', filters.languages.join(','));
  if (filters.location) params.set('location', filters.location);
  if (filters.experienceLevel?.length) {
    params.set('experienceLevel', filters.experienceLevel.join(','));
  }
  if (filters.minYears !== null && filters.minYears !== undefined) {
    params.set('minYears', filters.minYears.toString());
  }
  if (filters.maxYears !== null && filters.maxYears !== undefined) {
    params.set('maxYears', filters.maxYears.toString());
  }
  if (filters.minScore !== null && filters.minScore !== undefined) {
    params.set('minScore', filters.minScore.toString());
  }
  if (filters.featured) params.set('featured', 'true');
  if (filters.hasGitHub) params.set('hasGitHub', 'true');
  if (filters.hasTalentProtocol) params.set('hasTalentProtocol', 'true');

  return params.toString();
}

/**
 * Parse query string into search filters
 */
export function parseSearchQuery(queryString: string): Partial<SearchFilters> {
  const params = new URLSearchParams(queryString);
  
  return {
    query: params.get('q') || undefined,
    skills: params.get('skills')?.split(',').filter(Boolean) || undefined,
    languages: params.get('languages')?.split(',').filter(Boolean) || undefined,
    location: params.get('location') || undefined,
    experienceLevel: params.get('experienceLevel')?.split(',').filter(Boolean) || undefined,
    minYears: params.get('minYears') ? parseInt(params.get('minYears')!) : undefined,
    maxYears: params.get('maxYears') ? parseInt(params.get('maxYears')!) : undefined,
    minScore: params.get('minScore') ? parseFloat(params.get('minScore')!) : undefined,
    featured: params.get('featured') === 'true',
    hasGitHub: params.get('hasGitHub') === 'true',
    hasTalentProtocol: params.get('hasTalentProtocol') === 'true',
  };
}

/**
 * Calculate search relevance score
 */
export function calculateRelevanceScore(
  result: any,
  filters: SearchFilters
): number {
  let score = 0;

  // Query match in name/bio (50 points)
  if (filters.query) {
    const query = filters.query.toLowerCase();
    if (result.name?.toLowerCase().includes(query)) score += 50;
    if (result.bio?.toLowerCase().includes(query)) score += 30;
  }

  // Skill matches (10 points each)
  if (filters.skills?.length) {
    const matchingSkills = result.skills?.filter((s: any) =>
      filters.skills?.includes(s.name)
    ).length || 0;
    score += matchingSkills * 10;
  }

  // Language matches (5 points each)
  if (filters.languages?.length) {
    const matchingLangs = result.languages?.filter((l: any) =>
      filters.languages?.includes(l.name)
    ).length || 0;
    score += matchingLangs * 5;
  }

  // Location match (20 points)
  if (filters.location && result.location?.toLowerCase().includes(filters.location.toLowerCase())) {
    score += 20;
  }

  // Experience level match (15 points)
  if (filters.experienceLevel?.includes(result.experienceLevel)) {
    score += 15;
  }

  // GitHub presence (10 points)
  if (filters.hasGitHub && result.githubUsername) {
    score += 10;
  }

  // Talent Protocol (10 points)
  if (filters.hasTalentProtocol && result.talentPassportId) {
    score += 10;
  }

  return score;
}

/**
 * Highlight search terms in text
 */
export function highlightSearchTerms(text: string, query: string): string {
  if (!query || !text) return text;

  const terms = query.toLowerCase().split(' ').filter(Boolean);
  let result = text;

  terms.forEach(term => {
    const regex = new RegExp(`(${term})`, 'gi');
    result = result.replace(regex, '<mark>$1</mark>');
  });

  return result;
}

/**
 * Validate search filters
 */
export function validateSearchFilters(filters: SearchFilters): string[] {
  const errors: string[] = [];

  if (filters.minYears !== null && filters.minYears !== undefined && filters.minYears < 0) {
    errors.push('Minimum years must be non-negative');
  }

  if (filters.maxYears !== null && filters.maxYears !== undefined && filters.maxYears < 0) {
    errors.push('Maximum years must be non-negative');
  }

  if (
    filters.minYears !== null && filters.minYears !== undefined &&
    filters.maxYears !== null && filters.maxYears !== undefined &&
    filters.minYears > filters.maxYears
  ) {
    errors.push('Minimum years cannot exceed maximum years');
  }

  if (filters.minScore !== null && filters.minScore !== undefined) {
    if (filters.minScore < 0 || filters.minScore > 100) {
      errors.push('Score must be between 0 and 100');
    }
  }

  return errors;
}

/**
 * Get popular search suggestions
 */
export function getPopularSearchTerms(): string[] {
  return [
    'React Developer',
    'TypeScript Expert',
    'Full Stack Engineer',
    'Frontend Developer',
    'Backend Developer',
    'DevOps Engineer',
    'Machine Learning',
    'Smart Contracts',
    'Web3 Developer',
    'Mobile Developer',
  ];
}

/**
 * Format search results count
 */
export function formatResultsCount(count: number): string {
  if (count === 0) return 'No results';
  if (count === 1) return '1 result';
  if (count < 1000) return `${count} results`;
  if (count < 1000000) return `${(count / 1000).toFixed(1)}K results`;
  return `${(count / 1000000).toFixed(1)}M results`;
}

/**
 * Deduplicate search results
 */
export function deduplicateResults(results: SearchResult[]): SearchResult[] {
  const seen = new Set<string>();
  return results.filter(result => {
    if (seen.has(result.id)) return false;
    seen.add(result.id);
    return true;
  });
}
