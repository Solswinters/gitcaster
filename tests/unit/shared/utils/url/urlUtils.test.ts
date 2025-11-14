import { buildUrl, parseQueryString, addQueryParams } from '@/shared/utils/url/urlUtils';

describe('urlUtils', () => {
  describe('buildUrl', () => {
    it('builds URL with base path', () => {
      expect(buildUrl('/api/users')).toBe('/api/users');
    });

    it('builds URL with query params', () => {
      const url = buildUrl('/api/users', { page: 1, limit: 10 });
      expect(url).toContain('/api/users');
      expect(url).toContain('page=1');
      expect(url).toContain('limit=10');
    });

    it('handles undefined params', () => {
      const url = buildUrl('/api/users', { page: 1, filter: undefined });
      expect(url).toContain('page=1');
      expect(url).not.toContain('filter');
    });
  });

  describe('parseQueryString', () => {
    it('parses query string', () => {
      const result = parseQueryString('?page=1&limit=10');
      expect(result).toEqual({ page: '1', limit: '10' });
    });

    it('handles empty query string', () => {
      expect(parseQueryString('')).toEqual({});
    });
  });

  describe('addQueryParams', () => {
    it('adds query params to URL', () => {
      const url = addQueryParams('/api/users', { page: 1 });
      expect(url).toContain('/api/users');
      expect(url).toContain('page=1');
    });

    it('preserves existing query params', () => {
      const url = addQueryParams('/api/users?sort=name', { page: 1 });
      expect(url).toContain('sort=name');
      expect(url).toContain('page=1');
    });
  });
});

