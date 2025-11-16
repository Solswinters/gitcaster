/**
 * Tests for API helpers
 */

import { NextRequest } from 'next/server';
import {
  getQueryParam,
  getAllQueryParams,
  createSuccessResponse,
  createErrorResponse,
  createPaginatedResponse,
  requireMethod,
  requireAuth,
} from '../helpers';

describe('API Helpers', () => {
  describe('getQueryParam', () => {
    it('retrieves query parameter', () => {
      const request = new NextRequest('http://localhost:3000/api/test?foo=bar');
      const value = getQueryParam(request, 'foo');
      expect(value).toBe('bar');
    });

    it('returns null for missing parameter', () => {
      const request = new NextRequest('http://localhost:3000/api/test');
      const value = getQueryParam(request, 'missing');
      expect(value).toBeNull();
    });
  });

  describe('getAllQueryParams', () => {
    it('retrieves all query parameters', () => {
      const request = new NextRequest(
        'http://localhost:3000/api/test?foo=bar&baz=qux'
      );
      const params = getAllQueryParams(request);
      expect(params).toEqual({ foo: 'bar', baz: 'qux' });
    });

    it('returns empty object for no parameters', () => {
      const request = new NextRequest('http://localhost:3000/api/test');
      const params = getAllQueryParams(request);
      expect(params).toEqual({});
    });
  });

  describe('createSuccessResponse', () => {
    it('creates success response with data', async () => {
      const response = createSuccessResponse({ message: 'Success' });
      const data = await response.json();
      expect(data).toEqual({ success: true, data: { message: 'Success' } });
      expect(response.status).toBe(200);
    });

    it('allows custom status code', async () => {
      const response = createSuccessResponse({ id: 1 }, 201);
      expect(response.status).toBe(201);
    });
  });

  describe('createErrorResponse', () => {
    it('creates error response with message', async () => {
      const response = createErrorResponse('Error occurred');
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error.message).toBe('Error occurred');
      expect(response.status).toBe(400);
    });

    it('allows custom status and details', async () => {
      const response = createErrorResponse('Not found', 404, { id: 123 });
      const data = await response.json();
      expect(response.status).toBe(404);
      expect(data.error.details).toEqual({ id: 123 });
    });
  });

  describe('createPaginatedResponse', () => {
    it('creates paginated response', async () => {
      const items = [1, 2, 3, 4, 5];
      const response = createPaginatedResponse(items, 1, 5, 20);
      const data = await response.json();
      
      expect(data.success).toBe(true);
      expect(data.data).toEqual(items);
      expect(data.pagination).toEqual({
        page: 1,
        limit: 5,
        total: 20,
        totalPages: 4,
        hasMore: true,
      });
    });

    it('calculates hasMore correctly', async () => {
      const items = [1, 2, 3];
      const response = createPaginatedResponse(items, 2, 5, 8);
      const data = await response.json();
      expect(data.pagination.hasMore).toBe(false);
    });
  });

  describe('requireMethod', () => {
    it('allows valid method', () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        method: 'GET',
      });
      const result = requireMethod(request, ['GET', 'POST']);
      expect(result).toBeNull();
    });

    it('rejects invalid method', async () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        method: 'DELETE',
      });
      const result = requireMethod(request, ['GET', 'POST']);
      expect(result).not.toBeNull();
      expect(result?.status).toBe(405);
    });
  });

  describe('requireAuth', () => {
    it('allows request with authorization header', () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          authorization: 'Bearer token123',
        },
      });
      const result = requireAuth(request);
      expect(result).toBeNull();
    });

    it('rejects request without authorization', async () => {
      const request = new NextRequest('http://localhost:3000/api/test');
      const result = requireAuth(request);
      expect(result).not.toBeNull();
      expect(result?.status).toBe(401);
    });
  });
});

