import {
  createAsyncErrorHandler,
  createSyncErrorHandler,
  withErrorHandling,
  createAPIErrorHandler,
  createComponentErrorHandler,
} from '@/shared/utils/errors/ErrorHandlers';
import { errorMonitor } from '@/shared/utils/errors/ErrorMonitor';

// Mock dependencies
jest.mock('@/shared/utils/errors/ErrorMonitor', () => ({
  errorMonitor: {
    track: jest.fn(),
  },
}));

jest.mock('@/shared/utils/errors/ErrorReporting', () => ({
  errorReporter: {
    report: jest.fn(),
    reportAPIError: jest.fn(),
  },
}));

jest.mock('@/shared/utils/errors/ErrorLogger', () => ({
  logError: jest.fn(),
}));

describe('Error Handlers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('createAsyncErrorHandler', () => {
    it('handles successful async function', async () => {
      const fn = jest.fn().mockResolvedValue('success');
      const wrapped = createAsyncErrorHandler(fn);

      const result = await wrapped('arg1', 'arg2');

      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('handles async function error', async () => {
      const error = new Error('Async error');
      const fn = jest.fn().mockRejectedValue(error);
      const wrapped = createAsyncErrorHandler(fn, { context: 'test' });

      await expect(wrapped()).rejects.toThrow('Async error');
      expect(errorMonitor.track).toHaveBeenCalledWith(error);
    });
  });

  describe('createSyncErrorHandler', () => {
    it('handles successful sync function', () => {
      const fn = jest.fn().mockReturnValue('success');
      const wrapped = createSyncErrorHandler(fn);

      const result = wrapped('arg1', 'arg2');

      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('handles sync function error', () => {
      const error = new Error('Sync error');
      const fn = jest.fn().mockImplementation(() => {
        throw error;
      });
      const wrapped = createSyncErrorHandler(fn, { context: 'test' });

      expect(() => wrapped()).toThrow('Sync error');
      expect(errorMonitor.track).toHaveBeenCalledWith(error);
    });
  });

  describe('withErrorHandling', () => {
    it('wraps sync function', () => {
      const fn = jest.fn().mockReturnValue('result');
      const wrapped = withErrorHandling(fn);

      expect(wrapped()).toBe('result');
    });

    it('wraps async function', async () => {
      const fn = jest.fn().mockResolvedValue('result');
      const wrapped = withErrorHandling(fn);

      await expect(wrapped()).resolves.toBe('result');
    });
  });

  describe('createAPIErrorHandler', () => {
    it('creates handler for API errors', () => {
      const handler = createAPIErrorHandler('/api/users', 'GET');
      const error = new Error('API failed');

      handler(error, 500);

      expect(errorMonitor.track).toHaveBeenCalledWith(error);
    });
  });

  describe('createComponentErrorHandler', () => {
    it('creates handler for component errors', () => {
      const handler = createComponentErrorHandler('TestComponent');
      const error = new Error('Render failed');
      const errorInfo = { componentStack: 'at TestComponent...' };

      handler(error, errorInfo);

      expect(errorMonitor.track).toHaveBeenCalledWith(error);
    });
  });
});

