import {

  APIError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
  TooManyRequestsError,
  InternalServerError,
  ServiceUnavailableError,
  handleAPIError,
  assertOrThrow,
  assertExists,
} from '@/lib/errors/api-errors';

describe('API Errors', () => {
  describe('APIError', () => {
    it('should create error with correct properties', () => {
      const error = new APIError('Test error', 400, 'TEST_ERROR', { field: 'test' });

      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('TEST_ERROR');
      expect(error.details).toEqual({ field: 'test' });
    });

    it('should serialize to JSON correctly', () => {
      const error = new APIError('Test error', 400, 'TEST_ERROR');
      const json = error.toJSON();

      expect(json).toEqual({
        error: {
          message: 'Test error',
          code: 'TEST_ERROR',
          statusCode: 400,
          details: undefined,
        },
      });
    });
  });

  describe('Specific error classes', () => {
    it('should create BadRequestError', () => {
      const error = new BadRequestError('Invalid input');
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('BAD_REQUEST');
    });

    it('should create UnauthorizedError', () => {
      const error = new UnauthorizedError();
      expect(error.statusCode).toBe(401);
      expect(error.code).toBe('UNAUTHORIZED');
      expect(error.message).toBe('Unauthorized');
    });

    it('should create ForbiddenError', () => {
      const error = new ForbiddenError('Access denied');
      expect(error.statusCode).toBe(403);
      expect(error.code).toBe('FORBIDDEN');
    });

    it('should create NotFoundError', () => {
      const error = new NotFoundError('User not found');
      expect(error.statusCode).toBe(404);
      expect(error.code).toBe('NOT_FOUND');
    });

    it('should create ConflictError', () => {
      const error = new ConflictError('Duplicate entry');
      expect(error.statusCode).toBe(409);
      expect(error.code).toBe('CONFLICT');
    });

    it('should create ValidationError', () => {
      const error = new ValidationError('Invalid data', { field: 'email' });
      expect(error.statusCode).toBe(422);
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.details).toEqual({ field: 'email' });
    });

    it('should create TooManyRequestsError', () => {
      const error = new TooManyRequestsError();
      expect(error.statusCode).toBe(429);
      expect(error.code).toBe('TOO_MANY_REQUESTS');
    });

    it('should create InternalServerError', () => {
      const error = new InternalServerError();
      expect(error.statusCode).toBe(500);
      expect(error.code).toBe('INTERNAL_SERVER_ERROR');
    });

    it('should create ServiceUnavailableError', () => {
      const error = new ServiceUnavailableError();
      expect(error.statusCode).toBe(503);
      expect(error.code).toBe('SERVICE_UNAVAILABLE');
    });
  });

  describe('handleAPIError', () => {
    it('should handle APIError instances', () => {
      const error = new NotFoundError('Resource not found');
      const result = handleAPIError(error);

      expect(result.statusCode).toBe(404);
      expect(result.body.error.code).toBe('NOT_FOUND');
    });

    it('should handle Prisma unique constraint violation', () => {
      const prismaError = {
        code: 'P2002',
        meta: { target: ['email'] },
      };
      const result = handleAPIError(prismaError);

      expect(result.statusCode).toBe(409);
      expect(result.body.error.code).toBe('DUPLICATE_RECORD');
    });

    it('should handle Prisma record not found', () => {
      const prismaError = {
        code: 'P2025',
      };
      const result = handleAPIError(prismaError);

      expect(result.statusCode).toBe(404);
      expect(result.body.error.code).toBe('NOT_FOUND');
    });

    it('should handle generic Error instances', () => {
      const error = new Error('Something went wrong');
      const result = handleAPIError(error);

      expect(result.statusCode).toBe(500);
      expect(result.body.error.code).toBe('INTERNAL_SERVER_ERROR');
    });

    it('should handle unknown errors', () => {
      const result = handleAPIError('string error');

      expect(result.statusCode).toBe(500);
      expect(result.body.error.code).toBe('INTERNAL_SERVER_ERROR');
    });

    it('should hide error details in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const error = new Error('Sensitive error message');
      const result = handleAPIError(error);

      expect(result.body.error.message).toBe('Internal server error');

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('assertOrThrow', () => {
    it('should not throw if condition is true', () => {
      expect(() => {
        assertOrThrow(true, BadRequestError, 'Should not throw');
      }).not.toThrow();
    });

    it('should throw specified error if condition is false', () => {
      expect(() => {
        assertOrThrow(false, BadRequestError, 'Test message');
      }).toThrow(BadRequestError);
    });

    it('should include message and details in thrown error', () => {
      try {
        assertOrThrow(false, ValidationError, 'Invalid field', { field: 'email' });
        fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).message).toBe('Invalid field');
        expect((error as ValidationError).details).toEqual({ field: 'email' });
      }
    });
  });

  describe('assertExists', () => {
    it('should not throw if value exists', () => {
      expect(() => {
        assertExists({ id: 1 }, 'Should not throw');
      }).not.toThrow();
    });

    it('should throw NotFoundError if value is null', () => {
      expect(() => {
        assertExists(null, 'Resource not found');
      }).toThrow(NotFoundError);
    });

    it('should throw NotFoundError if value is undefined', () => {
      expect(() => {
        assertExists(undefined, 'Resource not found');
      }).toThrow(NotFoundError);
    });

    it('should use default message if not provided', () => {
      try {
        assertExists(null);
        fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundError);
        expect((error as NotFoundError).message).toBe('Resource not found');
      }
    });

    it('should narrow type after assertion', () => {
      const value: string | null = 'test';
      assertExists(value);
      // TypeScript should now know value is string, not string | null
      const length: number = value.length; // No type error
      expect(length).toBe(4);
    });
  });
});

