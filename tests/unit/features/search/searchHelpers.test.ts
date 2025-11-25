import {

  buildSearchQuery,
  parseSearchQuery,
  calculateRelevanceScore,
  validateSearchFilters,
  formatResultsCount,
  deduplicateResults,
} from '@/features/search/utils/searchHelpers';

describe('Search Helpers', () => {
  describe('buildSearchQuery', () => {
    it('builds query string from filters', () => {
      const filters = {
        query: 'react developer',
        skills: ['React', 'TypeScript'],
        location: 'San Francisco',
        minYears: 3,
      };

      const queryString = buildSearchQuery(filters);

      expect(queryString).toContain('q=react+developer');
      expect(queryString).toContain('skills=React%2CTypeScript');
      expect(queryString).toContain('location=San+Francisco');
      expect(queryString).toContain('minYears=3');
    });

    it('handles empty filters', () => {
      const queryString = buildSearchQuery({});
      expect(queryString).toBe('');
    });
  });

  describe('parseSearchQuery', () => {
    it('parses query string into filters', () => {
      const queryString = 'q=react&skills=React,TypeScript&minYears=3';
      const filters = parseSearchQuery(queryString);

      expect(filters.query).toBe('react');
      expect(filters.skills).toEqual(['React', 'TypeScript']);
      expect(filters.minYears).toBe(3);
    });
  });

  describe('calculateRelevanceScore', () => {
    it('calculates score based on matches', () => {
      const result = {
        name: 'John Doe',
        bio: 'React developer',
        skills: [{ name: 'React' }, { name: 'TypeScript' }],
        location: 'San Francisco',
      };

      const filters = {
        query: 'react',
        skills: ['React', 'TypeScript'],
        location: 'San Francisco',
      };

      const score = calculateRelevanceScore(result, filters);

      expect(score).toBeGreaterThan(0);
    });
  });

  describe('validateSearchFilters', () => {
    it('validates min/max years', () => {
      const errors = validateSearchFilters({
        minYears: 5,
        maxYears: 3,
      });

      expect(errors).toContain('Minimum years cannot exceed maximum years');
    });

    it('validates score range', () => {
      const errors = validateSearchFilters({
        minScore: 150,
      });

      expect(errors).toContain('Score must be between 0 and 100');
    });

    it('returns no errors for valid filters', () => {
      const errors = validateSearchFilters({
        minYears: 2,
        maxYears: 5,
        minScore: 50,
      });

      expect(errors).toHaveLength(0);
    });
  });

  describe('formatResultsCount', () => {
    it('formats result counts correctly', () => {
      expect(formatResultsCount(0)).toBe('No results');
      expect(formatResultsCount(1)).toBe('1 result');
      expect(formatResultsCount(50)).toBe('50 results');
      expect(formatResultsCount(1500)).toBe('1.5K results');
      expect(formatResultsCount(1500000)).toBe('1.5M results');
    });
  });

  describe('deduplicateResults', () => {
    it('removes duplicate results', () => {
      const results = [
        { id: '1', name: 'John' },
        { id: '2', name: 'Jane' },
        { id: '1', name: 'John' },
      ] as any;

      const deduped = deduplicateResults(results);

      expect(deduped).toHaveLength(2);
      expect(deduped.map(r => r.id)).toEqual(['1', '2']);
    });
  });
});

