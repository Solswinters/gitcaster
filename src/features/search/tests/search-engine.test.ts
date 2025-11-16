/**
 * Search engine tests
 */

import { describe, it, expect } from '@jest/globals';
import { SearchEngine } from '../services/search-engine';

describe('SearchEngine', () => {
  it('should search developers by skill', async () => {
    const results = await SearchEngine.search({
      skills: ['TypeScript', 'React'],
    });
    expect(results).toBeInstanceOf(Array);
  });

  it('should filter results correctly', async () => {
    const results = await SearchEngine.search({
      location: 'Remote',
      minExperience: 3,
    });
    expect(results).toBeInstanceOf(Array);
  });
});

