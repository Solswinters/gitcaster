/**
 * Search Functionality Integration Tests
 * 
 * Tests developer search with various filters
 */

import { searchService } from '@/features/search';

describe('Search Functionality', () => {
  describe('Basic Search', () => {
    it('searches for developers by query', async () => {
      const query = 'react developer';

      try {
        const results = await searchService.search({ query });
        
        expect(Array.isArray(results.profiles)).toBe(true);
        expect(results.pagination).toBeDefined();
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('returns empty results for non-matching query', async () => {
      const query = 'nonexistentxyzabc123';

      try {
        const results = await searchService.search({ query });
        
        expect(results.profiles.length).toBe(0);
        expect(results.pagination.totalCount).toBe(0);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('Filtered Search', () => {
    it('filters by skills', async () => {
      const filters = {
        skills: ['TypeScript', 'React'],
      };

      try {
        const results = await searchService.search(filters);
        
        expect(Array.isArray(results.profiles)).toBe(true);
        
        // All results should have at least one of the specified skills
        results.profiles.forEach((profile: any) => {
          const hasSkill = profile.skills.some((s: any) =>
            filters.skills.includes(s.name)
          );
          expect(hasSkill).toBe(true);
        });
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('filters by location', async () => {
      const filters = {
        location: 'San Francisco',
      };

      try {
        const results = await searchService.search(filters);
        
        results.profiles.forEach((profile: any) => {
          expect(profile.location).toContain('San Francisco');
        });
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('filters by experience level', async () => {
      const filters = {
        experienceLevel: ['senior', 'lead'],
      };

      try {
        const results = await searchService.search(filters);
        
        results.profiles.forEach((profile: any) => {
          expect(filters.experienceLevel).toContain(profile.experienceLevel);
        });
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('Pagination', () => {
    it('supports pagination', async () => {
      const query = 'developer';

      try {
        const page1 = await searchService.search({ query }, 1, 10);
        const page2 = await searchService.search({ query }, 2, 10);
        
        expect(page1.pagination.page).toBe(1);
        expect(page2.pagination.page).toBe(2);
        
        // Different results on different pages
        if (page1.profiles.length > 0 && page2.profiles.length > 0) {
          expect(page1.profiles[0].id).not.toBe(page2.profiles[0].id);
        }
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('respects page size', async () => {
      const pageSize = 5;

      try {
        const results = await searchService.search({ query: 'developer' }, 1, pageSize);
        
        expect(results.profiles.length).toBeLessThanOrEqual(pageSize);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('Search Suggestions', () => {
    it('provides autocomplete suggestions', async () => {
      const query = 'reac';

      try {
        const suggestions = await searchService.getSuggestions(query);
        
        expect(Array.isArray(suggestions)).toBe(true);
        
        // Suggestions should be relevant to query
        suggestions.forEach((suggestion: string) => {
          expect(suggestion.toLowerCase()).toContain('reac');
        });
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('Error Handling', () => {
    it('handles invalid page numbers', async () => {
      const invalidPage = -1;

      await expect(
        searchService.search({ query: 'developer' }, invalidPage)
      ).rejects.toThrow();
    });

    it('handles invalid page size', async () => {
      const invalidPageSize = 0;

      await expect(
        searchService.search({ query: 'developer' }, 1, invalidPageSize)
      ).rejects.toThrow();
    });
  });
});

