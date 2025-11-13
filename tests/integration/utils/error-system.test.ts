/**
 * Error System Integration Tests
 *
 * Test the entire error handling system working together
 */

import {
  AppError,
  ErrorCode,
  handleError,
  retry,
  withTimeout,
  transformError,
  transformHTTPError,
  errorMonitor,
  errorReporter,
  logError,
  createAsyncErrorHandler,
} from '@/shared/utils/errors';

// Mock console methods
jest.spyOn(console, 'error').mockImplementation();
jest.spyOn(console, 'warn').mockImplementation();
jest.spyOn(console, 'log').mockImplementation();

describe('Error System Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    errorMonitor.reset();
  });

  describe('End-to-end error flow', () => {
    it('handles API error with full pipeline', async () => {
      const mockAPI = jest.fn().mockRejectedValue(
        new Error('Network error')
      );

      const wrapped = createAsyncErrorHandler(mockAPI, {
        operation: 'fetchUser',
      });

      await expect(wrapped()).rejects.toThrow('Network error');

      // Check monitoring
      const metrics = errorMonitor.getMetrics();
      expect(metrics.count).toBeGreaterThan(0);
    });

    it('transforms and handles HTTP errors', () => {
      const httpError = transformHTTPError(404, 'Not Found', {
        resource: 'user',
        id: '123',
      });

      errorMonitor.track(httpError);

      expect(httpError.code).toBe(ErrorCode.NOT_FOUND);
      expect(httpError.context).toMatchObject({
        status: 404,
        data: { resource: 'user', id: '123' },
      });

      const metrics = errorMonitor.getMetrics();
      expect(metrics.errorCodes.get(ErrorCode.NOT_FOUND)).toBe(1);
    });

    it('retries failing operations', async () => {
      let attempts = 0;
      const flaky = jest.fn().mockImplementation(() => {
        attempts++;
        if (attempts < 3) {
          throw new Error('Temporary failure');
        }
        return 'success';
      });

      const result = await retry(flaky, {
        maxAttempts: 3,
        delay: 10,
      });

      expect(result).toBe('success');
      expect(flaky).toHaveBeenCalledTimes(3);
    });

    it('handles timeout with recovery', async () => {
      const slow = jest.fn().mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 1000))
      );

      await expect(
        withTimeout(slow(), 100, 'Operation timed out')
      ).rejects.toThrow('Operation timed out');
    });
  });

  describe('Error monitoring and reporting', () => {
    it('tracks error patterns', () => {
      // Generate various errors
      errorMonitor.track(new AppError('Val 1', ErrorCode.VALIDATION, 'low'));
      errorMonitor.track(new AppError('Val 2', ErrorCode.VALIDATION, 'low'));
      errorMonitor.track(new AppError('Val 3', ErrorCode.VALIDATION, 'low'));
      errorMonitor.track(new AppError('Net 1', ErrorCode.NETWORK, 'high'));
      errorMonitor.track(new AppError('Server', ErrorCode.SERVER, 'critical'));

      const summary = errorMonitor.getSummary();

      expect(summary.totalErrors).toBe(5);
      expect(summary.mostCommonErrors[0][0]).toBe(ErrorCode.VALIDATION);
      expect(summary.mostCommonErrors[0][1]).toBe(3);
    });

    it('detects elevated error rate', () => {
      // Generate many errors quickly
      for (let i = 0; i < 30; i++) {
        errorMonitor.track(new Error(`Error ${i}`));
      }

      const isElevated = errorMonitor.isErrorRateElevated(5);
      expect(isElevated).toBe(true);
    });

    it('tracks critical errors separately', () => {
      errorMonitor.track(new AppError('Critical 1', ErrorCode.SERVER, 'critical'));
      errorMonitor.track(new AppError('Critical 2', ErrorCode.SERVER, 'critical'));
      errorMonitor.track(new AppError('High', ErrorCode.NETWORK, 'high'));

      const criticalCount = errorMonitor.getCriticalErrorCount(5);
      expect(criticalCount).toBe(2);
    });
  });

  describe('Error transformation pipeline', () => {
    it('transforms various error types consistently', () => {
      // Generic error
      const generic = transformError(new Error('Generic'));
      expect(generic).toBeInstanceOf(AppError);
      expect(generic.code).toBe(ErrorCode.UNKNOWN);

      // Network error
      const network = transformError(new Error('fetch failed'));
      expect(network.code).toBe(ErrorCode.NETWORK);
      expect(network.severity).toBe('high');

      // Timeout error
      const timeout = transformError(new Error('timeout exceeded'));
      expect(timeout.code).toBe(ErrorCode.TIMEOUT);

      // AppError passthrough
      const appError = new AppError('App', ErrorCode.VALIDATION, 'low');
      const passthrough = transformError(appError);
      expect(passthrough).toBe(appError);
    });

    it('transforms HTTP errors to appropriate codes', () => {
      const tests = [
        { status: 400, expectedCode: ErrorCode.VALIDATION },
        { status: 401, expectedCode: ErrorCode.UNAUTHORIZED },
        { status: 403, expectedCode: ErrorCode.FORBIDDEN },
        { status: 404, expectedCode: ErrorCode.NOT_FOUND },
        { status: 409, expectedCode: ErrorCode.CONFLICT },
        { status: 429, expectedCode: ErrorCode.RATE_LIMIT },
        { status: 500, expectedCode: ErrorCode.SERVER },
      ];

      tests.forEach(({ status, expectedCode }) => {
        const error = transformHTTPError(status, 'Error');
        expect(error.code).toBe(expectedCode);
      });
    });
  });

  describe('Error recovery strategies', () => {
    it('combines retry with timeout', async () => {
      let attempts = 0;
      const operation = jest.fn().mockImplementation(() => {
        attempts++;
        if (attempts < 2) {
          return new Promise((resolve) => setTimeout(resolve, 200));
        }
        return Promise.resolve('success');
      });

      const result = await retry(
        () => withTimeout(operation(), 100, 'Timeout'),
        { maxAttempts: 3, delay: 10 }
      );

      expect(result).toBe('success');
      expect(attempts).toBe(2);
    });

    it('uses exponential backoff for retries', async () => {
      const timestamps: number[] = [];
      let attempts = 0;

      const operation = jest.fn().mockImplementation(() => {
        timestamps.push(Date.now());
        attempts++;
        if (attempts < 3) {
          throw new Error('Fail');
        }
        return 'success';
      });

      await retry(operation, {
        maxAttempts: 3,
        delay: 50,
        backoff: 'exponential',
      });

      expect(attempts).toBe(3);
      // Verify delays increase (approximately)
      if (timestamps.length > 2) {
        const delay1 = timestamps[1] - timestamps[0];
        const delay2 = timestamps[2] - timestamps[1];
        expect(delay2).toBeGreaterThan(delay1);
      }
    });
  });

  describe('Reporting and logging integration', () => {
    it('reports errors with full context', () => {
      const error = new AppError(
        'Test error',
        ErrorCode.VALIDATION,
        'medium',
        { field: 'email' }
      );

      errorReporter.report(error, { userId: '123' }, 'medium');

      expect(console.error).toHaveBeenCalled();
    });

    it('logs errors with appropriate severity', () => {
      const errors = [
        new AppError('Low', ErrorCode.VALIDATION, 'low'),
        new AppError('Medium', ErrorCode.NETWORK, 'medium'),
        new AppError('High', ErrorCode.UNAUTHORIZED, 'high'),
        new AppError('Critical', ErrorCode.SERVER, 'critical'),
      ];

      errors.forEach((error) => {
        logError(error);
      });

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('Complete workflow example', () => {
    it('handles realistic API call with full error handling', async () => {
      // Simulate API call that fails then succeeds
      let callCount = 0;
      const mockFetch = jest.fn().mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.reject(new Error('Network timeout'));
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: 'success' }),
        });
      });

      // Wrap with error handling
      const apiCall = createAsyncErrorHandler(
        async () => {
          const response = await withTimeout(
            retry(mockFetch, { maxAttempts: 2, delay: 10 }),
            1000,
            'Request timeout'
          );
          return response.json();
        },
        { operation: 'fetchData' }
      );

      const result = await apiCall();

      expect(result).toEqual({ data: 'success' });
      expect(mockFetch).toHaveBeenCalledTimes(2);

      // Check monitoring
      const metrics = errorMonitor.getMetrics();
      expect(metrics.count).toBeGreaterThan(0);
    });
  });
});

