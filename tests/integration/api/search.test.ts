/**
 * Integration tests for Search API
 * Tests search functionality with database queries
 */

import { prisma } from '@/lib/db/prisma';
import { SearchQueryBuilder } from '@/lib/search/query-builder';

describe('Search API Integration', () => {
  // Test data
  const testUserIds: string[] = [];
  const testProfileIds: string[] = [];

  beforeAll(async () => {
    // Create test users and profiles
    const user1 = await prisma.user.create({
      data: {
        walletAddress: '0xsearch1',
        githubUsername: 'searchuser1',
      },
    });
    testUserIds.push(user1.id);

    const profile1 = await prisma.profile.create({
      data: {
        userId: user1.id,
        slug: 'test-search-profile-1',
        displayName: 'Senior Developer',
        bio: 'Full-stack engineer with React and Node.js',
        location: 'San Francisco',
        experienceLevel: 'senior',
        yearsOfExperience: 8,
        isPublic: true,
        talentScore: 85,
        searchTags: ['react', 'nodejs', 'typescript'],
      },
    });
    testProfileIds.push(profile1.id);

    const user2 = await prisma.user.create({
      data: {
        walletAddress: '0xsearch2',
        githubUsername: 'searchuser2',
      },
    });
    testUserIds.push(user2.id);

    const profile2 = await prisma.profile.create({
      data: {
        userId: user2.id,
        slug: 'test-search-profile-2',
        displayName: 'Junior Developer',
        bio: 'Learning Python and Go',
        location: 'New York',
        experienceLevel: 'junior',
        yearsOfExperience: 2,
        isPublic: true,
        talentScore: 65,
        searchTags: ['python', 'go'],
      },
    });
    testProfileIds.push(profile2.id);

    const user3 = await prisma.user.create({
      data: {
        walletAddress: '0xsearch3',
        githubUsername: 'searchuser3',
      },
    });
    testUserIds.push(user3.id);

    const profile3 = await prisma.profile.create({
      data: {
        userId: user3.id,
        slug: 'test-search-profile-3',
        displayName: 'Private Profile',
        bio: 'This profile is private',
        location: 'London',
        experienceLevel: 'mid',
        yearsOfExperience: 5,
        isPublic: false, // Private profile
        searchTags: ['java', 'spring'],
      },
    });
    testProfileIds.push(profile3.id);
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.profile.deleteMany({
      where: { id: { in: testProfileIds } },
    });
    await prisma.user.deleteMany({
      where: { id: { in: testUserIds } },
    });
    await prisma.$disconnect();
  });

  describe('Basic search', () => {
    it('should find profiles by text query', async () => {
      const builder = new SearchQueryBuilder({ query: 'developer' });
      const query = builder.buildQuery(1, 20);

      const results = await prisma.profile.findMany(query);

      expect(results.length).toBeGreaterThan(0);
      expect(results.some(p => p.slug.includes('test-search'))).toBe(true);
    });

    it('should only return public profiles', async () => {
      const builder = new SearchQueryBuilder({});
      const query = builder.buildQuery(1, 100);

      const results = await prisma.profile.findMany(query);

      expect(results.every(p => p.isPublic === true)).toBe(true);
      expect(results.some(p => p.slug === 'test-search-profile-3')).toBe(false);
    });

    it('should search by location', async () => {
      const builder = new SearchQueryBuilder({ location: 'San Francisco' });
      const query = builder.buildQuery(1, 20);

      const results = await prisma.profile.findMany(query);
      const sanFranciscoProfile = results.find(p => p.slug === 'test-search-profile-1');

      expect(sanFranciscoProfile).toBeDefined();
      expect(sanFranciscoProfile?.location).toContain('San Francisco');
    });
  });

  describe('Experience filters', () => {
    it('should filter by experience level', async () => {
      const builder = new SearchQueryBuilder({
        experienceLevel: ['senior'],
      });
      const query = builder.buildQuery(1, 20);

      const results = await prisma.profile.findMany(query);
      const testResults = results.filter(p => p.slug.includes('test-search'));

      expect(testResults.length).toBeGreaterThan(0);
      expect(testResults.every(p => p.experienceLevel === 'senior')).toBe(true);
    });

    it('should filter by years of experience range', async () => {
      const builder = new SearchQueryBuilder({
        minYearsExperience: 5,
        maxYearsExperience: 10,
      });
      const query = builder.buildQuery(1, 20);

      const results = await prisma.profile.findMany(query);
      const testResults = results.filter(p => p.slug.includes('test-search'));

      expect(testResults.length).toBeGreaterThan(0);
      testResults.forEach(profile => {
        if (profile.yearsOfExperience !== null) {
          expect(profile.yearsOfExperience).toBeGreaterThanOrEqual(5);
          expect(profile.yearsOfExperience).toBeLessThanOrEqual(10);
        }
      });
    });

    it('should filter by minimum talent score', async () => {
      const builder = new SearchQueryBuilder({
        minTalentScore: 75,
      });
      const query = builder.buildQuery(1, 20);

      const results = await prisma.profile.findMany(query);
      const testResults = results.filter(p => p.slug.includes('test-search'));

      expect(testResults.length).toBeGreaterThan(0);
      testResults.forEach(profile => {
        if (profile.talentScore !== null) {
          expect(profile.talentScore).toBeGreaterThanOrEqual(75);
        }
      });
    });
  });

  describe('Sorting', () => {
    it('should sort by relevance (default)', async () => {
      const builder = new SearchQueryBuilder({});
      const query = builder.buildQuery(1, 20);

      const results = await prisma.profile.findMany(query);

      // Default sorting should prioritize featured, then score, then activity
      expect(results.length).toBeGreaterThan(0);
    });

    it('should sort by talent score descending', async () => {
      const builder = new SearchQueryBuilder({
        sortBy: 'score',
        sortOrder: 'desc',
      });
      const query = builder.buildQuery(1, 20);

      const results = await prisma.profile.findMany(query);
      const testResults = results.filter(p => p.slug.includes('test-search'));

      if (testResults.length > 1) {
        for (let i = 0; i < testResults.length - 1; i++) {
          const current = testResults[i].talentScore || 0;
          const next = testResults[i + 1].talentScore || 0;
          expect(current).toBeGreaterThanOrEqual(next);
        }
      }
    });

    it('should sort by experience ascending', async () => {
      const builder = new SearchQueryBuilder({
        sortBy: 'experience',
        sortOrder: 'asc',
      });
      const query = builder.buildQuery(1, 20);

      const results = await prisma.profile.findMany(query);
      const testResults = results.filter(p => p.slug.includes('test-search'));

      if (testResults.length > 1) {
        for (let i = 0; i < testResults.length - 1; i++) {
          const current = testResults[i].yearsOfExperience || 0;
          const next = testResults[i + 1].yearsOfExperience || 0;
          expect(current).toBeLessThanOrEqual(next);
        }
      }
    });
  });

  describe('Pagination', () => {
    it('should paginate results correctly', async () => {
      const pageSize = 1;
      
      // First page
      const builder1 = new SearchQueryBuilder({});
      const query1 = builder1.buildQuery(1, pageSize);
      const page1 = await prisma.profile.findMany(query1);

      expect(page1.length).toBeLessThanOrEqual(pageSize);

      // Second page
      const builder2 = new SearchQueryBuilder({});
      const query2 = builder2.buildQuery(2, pageSize);
      const page2 = await prisma.profile.findMany(query2);

      // Pages should have different results
      if (page1.length > 0 && page2.length > 0) {
        expect(page1[0].id).not.toBe(page2[0].id);
      }
    });

    it('should respect page size', async () => {
      const pageSize = 5;
      const builder = new SearchQueryBuilder({});
      const query = builder.buildQuery(1, pageSize);

      const results = await prisma.profile.findMany(query);

      expect(results.length).toBeLessThanOrEqual(pageSize);
    });
  });

  describe('Combined filters', () => {
    it('should handle multiple filters simultaneously', async () => {
      const builder = new SearchQueryBuilder({
        query: 'developer',
        experienceLevel: ['senior', 'mid'],
        minYearsExperience: 5,
        minTalentScore: 70,
      });
      const query = builder.buildQuery(1, 20);

      const results = await prisma.profile.findMany(query);

      // All results should match all filters
      expect(results.every(p => p.isPublic === true)).toBe(true);
      
      const testResults = results.filter(p => p.slug.includes('test-search'));
      testResults.forEach(profile => {
        if (profile.experienceLevel) {
          expect(['senior', 'mid']).toContain(profile.experienceLevel);
        }
        if (profile.yearsOfExperience !== null) {
          expect(profile.yearsOfExperience).toBeGreaterThanOrEqual(5);
        }
        if (profile.talentScore !== null) {
          expect(profile.talentScore).toBeGreaterThanOrEqual(70);
        }
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle empty search query', async () => {
      const builder = new SearchQueryBuilder({ query: '' });
      const query = builder.buildQuery(1, 20);

      const results = await prisma.profile.findMany(query);

      // Should still return public profiles
      expect(results.every(p => p.isPublic === true)).toBe(true);
    });

    it('should handle no results', async () => {
      const builder = new SearchQueryBuilder({
        query: 'nonexistentrandomstring123456789',
      });
      const query = builder.buildQuery(1, 20);

      const results = await prisma.profile.findMany(query);

      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
    });

    it('should handle invalid experience range', async () => {
      const builder = new SearchQueryBuilder({
        minYearsExperience: 100,
        maxYearsExperience: 150,
      });
      const query = builder.buildQuery(1, 20);

      const results = await prisma.profile.findMany(query);

      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
    });
  });
});

