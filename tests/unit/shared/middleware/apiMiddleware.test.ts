import { NextRequest } from 'next/server';
import {
  AppError,
  withErrorHandling,
  validateQueryParams,
  validateBody,
  successResponse,
  errorResponse,
  paginatedResponse,
  parsePaginationParams,
  calculatePagination,
  validateMethod,
} from '@/shared/middleware/apiMiddleware';

describe('API Middleware', () => {
  describe('AppError', () => {
    it('creates error with all properties', () => {
      const error = new AppError('Test error', 'TEST_ERROR', 400, { extra: 'data' });
      
      expect(error.message).toBe('Test error');
      expect(error.code).toBe('TEST_ERROR');
      expect(error.statusCode).toBe(400);
      expect(error.details).toEqual({ extra: 'data' });
      expect(error.name).toBe('AppError');
    });

    it('uses default status code 500', () => {
      const error = new AppError('Test error', 'TEST_ERROR');
      expect(error.statusCode).toBe(500);
    });
  });

  describe('validateQueryParams', () => {
    it('passes validation when all params present', () => {
      const searchParams = new URLSearchParams('foo=bar&baz=qux');
      expect(() => {
        validateQueryParams(searchParams, ['foo', 'baz']);
      }).not.toThrow();
    });

    it('throws error when param missing', () => {
      const searchParams = new URLSearchParams('foo=bar');
      expect(() => {
        validateQueryParams(searchParams, ['foo', 'missing']);
      }).toThrow(AppError);
    });

    it('includes missing params in error', () => {
      const searchParams = new URLSearchParams('foo=bar');
      try {
        validateQueryParams(searchParams, ['foo', 'missing1', 'missing2']);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).details.missing).toEqual(['missing1', 'missing2']);
      }
    });
  });

  describe('validateBody', () => {
    it('parses valid JSON body', async () => {
      const req = new NextRequest('http://localhost/api/test', {
        method: 'POST',
        body: JSON.stringify({ name: 'Test', value: 123 }),
      });

      const body = await validateBody(req);
      expect(body).toEqual({ name: 'Test', value: 123 });
    });

    it('validates required fields', async () => {
      const req = new NextRequest('http://localhost/api/test', {
        method: 'POST',
        body: JSON.stringify({ name: 'Test' }),
      });

      await expect(validateBody(req, ['name', 'value'])).rejects.toThrow(AppError);
    });

    it('throws error for invalid JSON', async () => {
      const req = new NextRequest('http://localhost/api/test', {
        method: 'POST',
        body: 'invalid json{',
      });

      await expect(validateBody(req)).rejects.toThrow(AppError);
    });
  });

  describe('successResponse', () => {
    it('returns JSON response with data', () => {
      const data = { message: 'Success' };
      const response = successResponse(data);
      
      expect(response.status).toBe(200);
    });

    it('uses custom status code', () => {
      const response = successResponse({ id: 1 }, 201);
      expect(response.status).toBe(201);
    });
  });

  describe('errorResponse', () => {
    it('returns error response', () => {
      const response = errorResponse('Error occurred', 'ERROR_CODE', 400);
      expect(response.status).toBe(400);
    });

    it('includes error details', () => {
      const response = errorResponse(
        'Validation failed',
        'VALIDATION_ERROR',
        400,
        { field: 'email' }
      );
      expect(response.status).toBe(400);
    });
  });

  describe('paginatedResponse', () => {
    it('returns paginated data', () => {
      const data = [1, 2, 3];
      const pagination = {
        page: 1,
        pageSize: 3,
        totalCount: 10,
        totalPages: 4,
        hasNextPage: true,
        hasPrevPage: false,
      };

      const response = paginatedResponse(data, pagination);
      expect(response.status).toBe(200);
    });
  });

  describe('parsePaginationParams', () => {
    it('parses page and pageSize from search params', () => {
      const searchParams = new URLSearchParams('page=2&pageSize=50');
      const result = parsePaginationParams(searchParams);
      
      expect(result).toEqual({ page: 2, pageSize: 50 });
    });

    it('uses defaults when params missing', () => {
      const searchParams = new URLSearchParams();
      const result = parsePaginationParams(searchParams);
      
      expect(result).toEqual({ page: 1, pageSize: 20 });
    });

    it('enforces minimum page of 1', () => {
      const searchParams = new URLSearchParams('page=0');
      const result = parsePaginationParams(searchParams);
      
      expect(result.page).toBe(1);
    });

    it('enforces maximum pageSize of 100', () => {
      const searchParams = new URLSearchParams('pageSize=200');
      const result = parsePaginationParams(searchParams);
      
      expect(result.pageSize).toBe(100);
    });
  });

  describe('calculatePagination', () => {
    it('calculates pagination metadata', () => {
      const result = calculatePagination(100, 2, 20);
      
      expect(result).toEqual({
        page: 2,
        pageSize: 20,
        totalCount: 100,
        totalPages: 5,
        hasNextPage: true,
        hasPrevPage: true,
      });
    });

    it('handles first page', () => {
      const result = calculatePagination(50, 1, 10);
      
      expect(result.hasNextPage).toBe(true);
      expect(result.hasPrevPage).toBe(false);
    });

    it('handles last page', () => {
      const result = calculatePagination(50, 5, 10);
      
      expect(result.hasNextPage).toBe(false);
      expect(result.hasPrevPage).toBe(true);
    });

    it('handles only page', () => {
      const result = calculatePagination(5, 1, 10);
      
      expect(result.totalPages).toBe(1);
      expect(result.hasNextPage).toBe(false);
      expect(result.hasPrevPage).toBe(false);
    });
  });

  describe('validateMethod', () => {
    it('passes validation for allowed method', () => {
      const req = new NextRequest('http://localhost/api/test', {
        method: 'POST',
      });

      expect(() => {
        validateMethod(req, ['POST', 'PUT']);
      }).not.toThrow();
    });

    it('throws error for disallowed method', () => {
      const req = new NextRequest('http://localhost/api/test', {
        method: 'DELETE',
      });

      expect(() => {
        validateMethod(req, ['POST', 'PUT']);
      }).toThrow(AppError);
    });

    it('includes allowed methods in error', () => {
      const req = new NextRequest('http://localhost/api/test', {
        method: 'DELETE',
      });

      try {
        validateMethod(req, ['POST', 'PUT']);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).statusCode).toBe(405);
        expect((error as AppError).details.allowed).toEqual(['POST', 'PUT']);
      }
    });
  });
});

