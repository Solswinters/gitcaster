import { SearchQueryBuilder, createSearchQuery, SearchFilters } from '@/lib/search/query-builder';

describe('SearchQueryBuilder', () => {
  describe('buildWhereClause', () => {
    it('should build basic where clause with isPublic true', () => {
      const builder = new SearchQueryBuilder({});
      const where = builder.buildWhereClause();

      expect(where.isPublic).toBe(true);
    });

    it('should add text search across multiple fields', () => {
      const builder = new SearchQueryBuilder({ query: 'developer' });
      const where = builder.buildWhereClause();

      expect(where.OR).toBeDefined();
      expect(where.OR).toHaveLength(4);
      expect(where.OR).toContainEqual({
        displayName: {
          contains: 'developer',
          mode: 'insensitive',
        },
      });
    });

    it('should filter by location', () => {
      const builder = new SearchQueryBuilder({ location: 'San Francisco' });
      const where = builder.buildWhereClause();

      expect(where.location).toEqual({
        contains: 'San Francisco',
        mode: 'insensitive',
      });
    });

    it('should filter by experience level', () => {
      const builder = new SearchQueryBuilder({
        experienceLevel: ['senior', 'lead'],
      });
      const where = builder.buildWhereClause();

      expect(where.experienceLevel).toEqual({
        in: ['senior', 'lead'],
      });
    });

    it('should filter by years of experience range', () => {
      const builder = new SearchQueryBuilder({
        minYearsExperience: 3,
        maxYearsExperience: 7,
      });
      const where = builder.buildWhereClause();

      expect(where.yearsOfExperience).toEqual({
        gte: 3,
        lte: 7,
      });
    });

    it('should filter by minimum talent score', () => {
      const builder = new SearchQueryBuilder({
        minTalentScore: 75,
      });
      const where = builder.buildWhereClause();

      expect(where.talentScore).toEqual({
        gte: 75,
      });
    });

    it('should filter by featured status', () => {
      const builder = new SearchQueryBuilder({
        isFeatured: true,
      });
      const where = builder.buildWhereClause();

      expect(where.isFeatured).toBe(true);
    });

    it('should filter by skills', () => {
      const builder = new SearchQueryBuilder({
        skills: ['JavaScript', 'TypeScript'],
      });
      const where = builder.buildWhereClause();

      expect(where.skills).toEqual({
        some: {
          skill: {
            name: {
              in: ['JavaScript', 'TypeScript'],
            },
          },
        },
      });
    });

    it('should filter by GitHub presence', () => {
      const builder = new SearchQueryBuilder({
        hasGitHub: true,
      });
      const where = builder.buildWhereClause();

      expect(where.user).toEqual({
        githubUsername: {
          not: null,
        },
      });
    });

    it('should filter by Talent Protocol presence', () => {
      const builder = new SearchQueryBuilder({
        hasTalentProtocol: true,
      });
      const where = builder.buildWhereClause();

      expect(where.talentScore).toEqual({
        not: null,
      });
    });

    it('should combine multiple filters', () => {
      const builder = new SearchQueryBuilder({
        query: 'engineer',
        location: 'Remote',
        experienceLevel: ['senior'],
        minYearsExperience: 5,
        skills: ['React'],
      });
      const where = builder.buildWhereClause();

      expect(where.isPublic).toBe(true);
      expect(where.OR).toBeDefined();
      expect(where.location).toBeDefined();
      expect(where.experienceLevel).toBeDefined();
      expect(where.yearsOfExperience).toBeDefined();
      expect(where.skills).toBeDefined();
    });
  });

  describe('buildOrderByClause', () => {
    it('should default to relevance sorting', () => {
      const builder = new SearchQueryBuilder({});
      const orderBy = builder.buildOrderByClause();

      expect(Array.isArray(orderBy)).toBe(true);
      expect(orderBy).toEqual([
        { isFeatured: 'desc' },
        { talentScore: 'desc' },
        { lastActiveAt: 'desc' },
      ]);
    });

    it('should sort by activity', () => {
      const builder = new SearchQueryBuilder({
        sortBy: 'activity',
        sortOrder: 'desc',
      });
      const orderBy = builder.buildOrderByClause();

      expect(orderBy).toEqual({ lastActiveAt: 'desc' });
    });

    it('should sort by talent score', () => {
      const builder = new SearchQueryBuilder({
        sortBy: 'score',
        sortOrder: 'asc',
      });
      const orderBy = builder.buildOrderByClause();

      expect(orderBy).toEqual({ talentScore: 'asc' });
    });

    it('should sort by experience', () => {
      const builder = new SearchQueryBuilder({
        sortBy: 'experience',
        sortOrder: 'desc',
      });
      const orderBy = builder.buildOrderByClause();

      expect(orderBy).toEqual({ yearsOfExperience: 'desc' });
    });
  });

  describe('buildQuery', () => {
    it('should build complete query with pagination', () => {
      const builder = new SearchQueryBuilder({
        query: 'developer',
      });
      const query = builder.buildQuery(1, 20);

      expect(query.where).toBeDefined();
      expect(query.orderBy).toBeDefined();
      expect(query.skip).toBe(0);
      expect(query.take).toBe(20);
      expect(query.include).toBeDefined();
    });

    it('should calculate pagination correctly', () => {
      const builder = new SearchQueryBuilder({});

      expect(builder.buildQuery(1, 20).skip).toBe(0);
      expect(builder.buildQuery(2, 20).skip).toBe(20);
      expect(builder.buildQuery(3, 10).skip).toBe(20);
      expect(builder.buildQuery(5, 15).skip).toBe(60);
    });

    it('should include related data', () => {
      const builder = new SearchQueryBuilder({});
      const query = builder.buildQuery();

      expect(query.include.user).toBeDefined();
      expect(query.include.skills).toBeDefined();
      expect(query.include.user.select.githubUsername).toBe(true);
      expect(query.include.user.select.githubStats).toBeDefined();
    });
  });

  describe('createSearchQuery helper', () => {
    it('should create search query from filters', () => {
      const filters: SearchFilters = {
        query: 'engineer',
        location: 'Remote',
        skills: ['React', 'Node.js'],
      };

      const query = createSearchQuery(filters, 1, 20);

      expect(query.where).toBeDefined();
      expect(query.where.isPublic).toBe(true);
      expect(query.skip).toBe(0);
      expect(query.take).toBe(20);
    });

    it('should handle empty filters', () => {
      const query = createSearchQuery({});

      expect(query.where).toEqual({ isPublic: true });
      expect(query.skip).toBe(0);
      expect(query.take).toBe(20);
    });
  });
});

