import {
  parseQueryString,
  buildQueryString,
  addQueryParams,
  removeQueryParams,
  getQueryParam,
  hasQueryParam,
  updateQueryParam,
  parseQueryArray,
  buildQueryArray,
} from '@/shared/utils/query/queryUtils';

describe('Query Utils', () => {
  describe('parseQueryString', () => {
    it('parses query string to object', () => {
      const result = parseQueryString('?name=John&age=30');
      expect(result).toEqual({ name: 'John', age: '30' });
    });

    it('handles empty query string', () => {
      const result = parseQueryString('');
      expect(result).toEqual({});
    });

    it('handles URL-encoded values', () => {
      const result = parseQueryString('?message=Hello%20World');
      expect(result).toEqual({ message: 'Hello World' });
    });
  });

  describe('buildQueryString', () => {
    it('builds query string from object', () => {
      const result = buildQueryString({ name: 'John', age: 30 });
      expect(result).toBe('?name=John&age=30');
    });

    it('excludes null and undefined values', () => {
      const result = buildQueryString({ name: 'John', age: null, city: undefined });
      expect(result).toBe('?name=John');
    });

    it('excludes empty strings', () => {
      const result = buildQueryString({ name: 'John', age: '' });
      expect(result).toBe('?name=John');
    });

    it('returns empty string for empty object', () => {
      const result = buildQueryString({});
      expect(result).toBe('');
    });
  });

  describe('addQueryParams', () => {
    it('adds query params to URL', () => {
      const result = addQueryParams('https://example.com', { name: 'John' });
      expect(result).toBe('https://example.com?name=John');
    });

    it('merges with existing query params', () => {
      const result = addQueryParams('https://example.com?age=30', { name: 'John' });
      expect(result).toContain('age=30');
      expect(result).toContain('name=John');
    });

    it('overwrites existing params with same key', () => {
      const result = addQueryParams('https://example.com?name=Jane', { name: 'John' });
      expect(result).toContain('name=John');
      expect(result).not.toContain('name=Jane');
    });
  });

  describe('removeQueryParams', () => {
    it('removes specified query params', () => {
      const result = removeQueryParams('https://example.com?name=John&age=30', ['age']);
      expect(result).toBe('https://example.com?name=John');
    });

    it('handles multiple params to remove', () => {
      const result = removeQueryParams('https://example.com?name=John&age=30&city=NYC', [
        'age',
        'city',
      ]);
      expect(result).toBe('https://example.com?name=John');
    });

    it('handles URL without query params', () => {
      const result = removeQueryParams('https://example.com', ['age']);
      expect(result).toBe('https://example.com');
    });
  });

  describe('getQueryParam', () => {
    it('gets query parameter value', () => {
      const result = getQueryParam('?name=John&age=30', 'name');
      expect(result).toBe('John');
    });

    it('returns null for non-existent param', () => {
      const result = getQueryParam('?name=John', 'age');
      expect(result).toBeNull();
    });
  });

  describe('hasQueryParam', () => {
    it('checks if query parameter exists', () => {
      expect(hasQueryParam('?name=John&age=30', 'name')).toBe(true);
      expect(hasQueryParam('?name=John&age=30', 'city')).toBe(false);
    });
  });

  describe('updateQueryParam', () => {
    it('updates single query parameter', () => {
      const result = updateQueryParam('https://example.com?name=Jane', 'name', 'John');
      expect(result).toContain('name=John');
    });

    it('adds param if it does not exist', () => {
      const result = updateQueryParam('https://example.com', 'name', 'John');
      expect(result).toBe('https://example.com?name=John');
    });
  });

  describe('parseQueryArray', () => {
    it('parses array from query string', () => {
      const result = parseQueryArray('?ids=1,2,3', 'ids');
      expect(result).toEqual(['1', '2', '3']);
    });

    it('handles custom separator', () => {
      const result = parseQueryArray('?ids=1|2|3', 'ids', '|');
      expect(result).toEqual(['1', '2', '3']);
    });

    it('returns empty array for non-existent param', () => {
      const result = parseQueryArray('?name=John', 'ids');
      expect(result).toEqual([]);
    });
  });

  describe('buildQueryArray', () => {
    it('builds query string with array values', () => {
      const result = buildQueryArray('ids', ['1', '2', '3']);
      expect(result).toBe('ids=1,2,3');
    });

    it('handles custom separator', () => {
      const result = buildQueryArray('ids', ['1', '2', '3'], '|');
      expect(result).toBe('ids=1|2|3');
    });

    it('returns empty string for empty array', () => {
      const result = buildQueryArray('ids', []);
      expect(result).toBe('');
    });
  });
});

