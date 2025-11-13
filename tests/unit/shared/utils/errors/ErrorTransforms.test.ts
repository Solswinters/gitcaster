import {
  transformError,
  transformHTTPError,
  transformValidationError,
  transformAPIError,
  getUserMessage,
  isRetryableError,
  getErrorSeverity,
} from '@/shared/utils/errors/ErrorTransforms';
import { AppError, ErrorCode } from '@/shared/utils/errors/ErrorService';

describe('Error Transforms', () => {
  describe('transformError', () => {
    it('returns AppError as-is', () => {
      const appError = new AppError('Test error', ErrorCode.VALIDATION, 'low');
      const result = transformError(appError);

      expect(result).toBe(appError);
    });

    it('transforms AbortError', () => {
      const error = new Error('Aborted');
      error.name = 'AbortError';

      const result = transformError(error);

      expect(result.code).toBe(ErrorCode.CANCELLED);
      expect(result.message).toBe('Request was cancelled');
    });

    it('transforms TimeoutError', () => {
      const error = new Error('Request timeout');

      const result = transformError(error);

      expect(result.code).toBe(ErrorCode.TIMEOUT);
    });

    it('transforms network errors', () => {
      const error = new Error('fetch failed');

      const result = transformError(error);

      expect(result.code).toBe(ErrorCode.NETWORK);
      expect(result.severity).toBe('high');
    });

    it('transforms generic errors', () => {
      const error = new Error('Something went wrong');

      const result = transformError(error);

      expect(result.code).toBe(ErrorCode.UNKNOWN);
    });

    it('transforms unknown errors', () => {
      const result = transformError('string error');

      expect(result.code).toBe(ErrorCode.UNKNOWN);
      expect(result.message).toBe('An unexpected error occurred');
    });
  });

  describe('transformHTTPError', () => {
    it('transforms 400 Bad Request', () => {
      const result = transformHTTPError(400, 'Bad Request');

      expect(result.code).toBe(ErrorCode.VALIDATION);
      expect(result.severity).toBe('low');
    });

    it('transforms 401 Unauthorized', () => {
      const result = transformHTTPError(401, 'Unauthorized');

      expect(result.code).toBe(ErrorCode.UNAUTHORIZED);
      expect(result.severity).toBe('high');
    });

    it('transforms 403 Forbidden', () => {
      const result = transformHTTPError(403, 'Forbidden');

      expect(result.code).toBe(ErrorCode.FORBIDDEN);
      expect(result.severity).toBe('high');
    });

    it('transforms 404 Not Found', () => {
      const result = transformHTTPError(404, 'Not Found');

      expect(result.code).toBe(ErrorCode.NOT_FOUND);
      expect(result.severity).toBe('low');
    });

    it('transforms 409 Conflict', () => {
      const result = transformHTTPError(409, 'Conflict');

      expect(result.code).toBe(ErrorCode.CONFLICT);
    });

    it('transforms 429 Rate Limit', () => {
      const result = transformHTTPError(429, 'Too Many Requests');

      expect(result.code).toBe(ErrorCode.RATE_LIMIT);
    });

    it('transforms 500 Server Error', () => {
      const result = transformHTTPError(500, 'Internal Server Error');

      expect(result.code).toBe(ErrorCode.SERVER);
      expect(result.severity).toBe('critical');
    });
  });

  describe('transformValidationError', () => {
    it('creates validation error with field context', () => {
      const result = transformValidationError('email', 'Invalid email format', 'test@');

      expect(result.code).toBe(ErrorCode.VALIDATION);
      expect(result.message).toContain('Invalid email format');
      expect(result.context).toEqual({ field: 'email', value: 'test@' });
    });
  });

  describe('transformAPIError', () => {
    it('transforms API error with message', () => {
      const response = {
        status: 400,
        data: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
        },
      };

      const result = transformAPIError(response);

      expect(result.code).toBe(ErrorCode.VALIDATION);
      expect(result.message).toBe('Validation failed');
    });

    it('uses error field if message is missing', () => {
      const response = {
        status: 500,
        data: {
          error: 'Server malfunction',
        },
      };

      const result = transformAPIError(response);

      expect(result.message).toBe('Server malfunction');
    });

    it('falls back to statusText', () => {
      const response = {
        status: 500,
        statusText: 'Internal Server Error',
      };

      const result = transformAPIError(response);

      expect(result.message).toBe('Internal Server Error');
    });
  });

  describe('getUserMessage', () => {
    it('returns AppError message', () => {
      const error = new AppError('User-friendly message', ErrorCode.VALIDATION, 'low');

      expect(getUserMessage(error)).toBe('User-friendly message');
    });

    it('returns friendly message for network errors', () => {
      const error = new Error('fetch failed');

      expect(getUserMessage(error)).toBe('Network connection error. Please try again.');
    });

    it('returns friendly message for timeout errors', () => {
      const error = new Error('timeout exceeded');

      expect(getUserMessage(error)).toBe('Request timed out. Please try again.');
    });

    it('returns generic message for unknown errors', () => {
      expect(getUserMessage('unknown')).toBe('An unexpected error occurred.');
    });
  });

  describe('isRetryableError', () => {
    it('identifies retryable AppError codes', () => {
      expect(
        isRetryableError(new AppError('Network', ErrorCode.NETWORK, 'high'))
      ).toBe(true);
      expect(
        isRetryableError(new AppError('Timeout', ErrorCode.TIMEOUT, 'medium'))
      ).toBe(true);
      expect(
        isRetryableError(new AppError('Rate limit', ErrorCode.RATE_LIMIT, 'medium'))
      ).toBe(true);
      expect(
        isRetryableError(new AppError('Server', ErrorCode.SERVER, 'critical'))
      ).toBe(true);
    });

    it('identifies non-retryable AppError codes', () => {
      expect(
        isRetryableError(new AppError('Validation', ErrorCode.VALIDATION, 'low'))
      ).toBe(false);
      expect(
        isRetryableError(new AppError('Not Found', ErrorCode.NOT_FOUND, 'low'))
      ).toBe(false);
    });

    it('identifies retryable Error types', () => {
      const timeoutError = new Error('Request timeout');
      timeoutError.name = 'TimeoutError';
      expect(isRetryableError(timeoutError)).toBe(true);

      const networkError = new Error('network failed');
      expect(isRetryableError(networkError)).toBe(true);
    });

    it('returns false for non-retryable errors', () => {
      expect(isRetryableError(new Error('Generic error'))).toBe(false);
    });
  });

  describe('getErrorSeverity', () => {
    it('returns critical for 5xx errors', () => {
      expect(getErrorSeverity(500)).toBe('critical');
      expect(getErrorSeverity(503)).toBe('critical');
    });

    it('returns high for auth errors', () => {
      expect(getErrorSeverity(401)).toBe('high');
      expect(getErrorSeverity(403)).toBe('high');
    });

    it('returns medium for rate limit and conflict', () => {
      expect(getErrorSeverity(429)).toBe('medium');
      expect(getErrorSeverity(409)).toBe('medium');
    });

    it('returns low for client errors', () => {
      expect(getErrorSeverity(400)).toBe('low');
      expect(getErrorSeverity(404)).toBe('low');
    });
  });
});

