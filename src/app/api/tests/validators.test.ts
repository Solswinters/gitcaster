/**
 * Tests for API validators
 */

import { z } from 'zod';
import {
  validateRequest,
  validateRequestSafe,
  paginationSchema,
  idParamSchema,
  usernameParamSchema,
  searchQuerySchema,
} from '../validators';

describe('API Validators', () => {
  describe('validateRequest', () => {
    it('validates valid data', () => {
      const schema = z.object({ name: z.string() });
      const result = validateRequest(schema, { name: 'test' });
      expect(result).toEqual({ name: 'test' });
    });

    it('throws on invalid data', () => {
      const schema = z.object({ name: z.string() });
      expect(() => validateRequest(schema, { name: 123 })).toThrow();
    });
  });

  describe('validateRequestSafe', () => {
    it('returns success for valid data', () => {
      const schema = z.object({ name: z.string() });
      const result = validateRequestSafe(schema, { name: 'test' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({ name: 'test' });
      }
    });

    it('returns error for invalid data', () => {
      const schema = z.object({ name: z.string() });
      const result = validateRequestSafe(schema, { name: 123 });
      expect(result.success).toBe(false);
    });
  });

  describe('paginationSchema', () => {
    it('validates pagination params', () => {
      const result = paginationSchema.parse({
        page: 1,
        limit: 10,
        sortBy: 'name',
        sortOrder: 'asc',
      });
      expect(result).toEqual({
        page: 1,
        limit: 10,
        sortBy: 'name',
        sortOrder: 'asc',
      });
    });

    it('applies defaults', () => {
      const result = paginationSchema.parse({});
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.sortOrder).toBe('desc');
    });

    it('rejects invalid page', () => {
      expect(() =>
        paginationSchema.parse({ page: -1 })
      ).toThrow();
    });

    it('rejects limit over 100', () => {
      expect(() =>
        paginationSchema.parse({ limit: 101 })
      ).toThrow();
    });
  });

  describe('idParamSchema', () => {
    it('validates id param', () => {
      const result = idParamSchema.parse({ id: '123' });
      expect(result).toEqual({ id: '123' });
    });

    it('rejects empty id', () => {
      expect(() => idParamSchema.parse({ id: '' })).toThrow();
    });
  });

  describe('usernameParamSchema', () => {
    it('validates username param', () => {
      const result = usernameParamSchema.parse({ username: 'johndoe' });
      expect(result).toEqual({ username: 'johndoe' });
    });

    it('rejects empty username', () => {
      expect(() => usernameParamSchema.parse({ username: '' })).toThrow();
    });
  });

  describe('searchQuerySchema', () => {
    it('validates search query', () => {
      const result = searchQuerySchema.parse({
        q: 'test query',
        page: 1,
        limit: 20,
      });
      expect(result.q).toBe('test query');
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
    });

    it('requires q parameter', () => {
      expect(() => searchQuerySchema.parse({ page: 1 })).toThrow();
    });

    it('accepts filters', () => {
      const result = searchQuerySchema.parse({
        q: 'test',
        filters: { category: 'tech' },
      });
      expect(result.filters).toEqual({ category: 'tech' });
    });
  });
});


