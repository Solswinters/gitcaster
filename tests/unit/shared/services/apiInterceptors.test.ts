import {
  interceptorManager,
  authInterceptor,
  requestIdInterceptor,
  loggingInterceptor,
  type RequestConfig,
  type ResponseData,
} from '@/shared/services/apiInterceptors';

// Mock logger
jest.mock('@/shared/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock error reporter
jest.mock('@/shared/utils/errors/ErrorReporting', () => ({
  errorReporter: {
    report: jest.fn(),
  },
}));

describe('API Interceptors', () => {
  beforeEach(() => {
    interceptorManager.clear();
    jest.clearAllMocks();
  });

  describe('InterceptorManager', () => {
    it('runs request interceptors', async () => {
      const interceptor = jest.fn((config) => ({
        ...config,
        headers: { ...config.headers, 'X-Test': 'value' },
      }));

      interceptorManager.addRequestInterceptor(interceptor);

      const config: RequestConfig = {
        url: '/test',
        method: 'GET',
      };

      const result = await interceptorManager.runRequestInterceptors(config);

      expect(interceptor).toHaveBeenCalled();
      expect(result.headers?.['X-Test']).toBe('value');
    });

    it('runs response interceptors', async () => {
      const interceptor = jest.fn((response) => ({
        ...response,
        data: { ...response.data, intercepted: true },
      }));

      interceptorManager.addResponseInterceptor(interceptor);

      const response: ResponseData = {
        data: { test: 'data' },
        status: 200,
        statusText: 'OK',
        headers: new Headers(),
      };

      const result = await interceptorManager.runResponseInterceptors(response);

      expect(interceptor).toHaveBeenCalled();
      expect(result.data.intercepted).toBe(true);
    });

    it('removes interceptors', async () => {
      const interceptor = jest.fn((config) => config);

      const remove = interceptorManager.addRequestInterceptor(interceptor);

      // Remove interceptor
      remove();

      const config: RequestConfig = {
        url: '/test',
        method: 'GET',
      };

      await interceptorManager.runRequestInterceptors(config);

      expect(interceptor).not.toHaveBeenCalled();
    });

    it('handles interceptor errors gracefully', async () => {
      const failingInterceptor = jest.fn(() => {
        throw new Error('Interceptor failed');
      });

      interceptorManager.addRequestInterceptor(failingInterceptor);

      const config: RequestConfig = {
        url: '/test',
        method: 'GET',
      };

      // Should not throw
      await expect(
        interceptorManager.runRequestInterceptors(config)
      ).resolves.toBeDefined();
    });
  });

  describe('authInterceptor', () => {
    it('adds authorization header', () => {
      const interceptor = authInterceptor('test-token');

      const config: RequestConfig = {
        url: '/test',
        method: 'GET',
      };

      const result = interceptor(config);

      expect(result.headers?.['Authorization']).toBe('Bearer test-token');
    });

    it('skips if no token provided', () => {
      const interceptor = authInterceptor();

      const config: RequestConfig = {
        url: '/test',
        method: 'GET',
      };

      const result = interceptor(config);

      expect(result.headers?.['Authorization']).toBeUndefined();
    });
  });

  describe('requestIdInterceptor', () => {
    it('adds request ID header', () => {
      const interceptor = requestIdInterceptor();

      const config: RequestConfig = {
        url: '/test',
        method: 'GET',
      };

      const result = interceptor(config);

      expect(result.headers?.['X-Request-ID']).toBeDefined();
      expect(typeof result.headers?.['X-Request-ID']).toBe('string');
    });

    it('generates unique IDs', () => {
      const interceptor = requestIdInterceptor();

      const config1: RequestConfig = {
        url: '/test',
        method: 'GET',
      };

      const config2: RequestConfig = {
        url: '/test',
        method: 'GET',
      };

      const result1 = interceptor(config1);
      const result2 = interceptor(config2);

      expect(result1.headers?.['X-Request-ID']).not.toBe(
        result2.headers?.['X-Request-ID']
      );
    });
  });

  describe('loggingInterceptor', () => {
    it('logs requests', () => {
      const { logger } = require('@/shared/utils/logger');
      const interceptor = loggingInterceptor();

      const config: RequestConfig = {
        url: '/test',
        method: 'GET',
      };

      interceptor(config);

      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining('API Request'),
        expect.any(Object)
      );
    });
  });

  describe('Chain multiple interceptors', () => {
    it('applies interceptors in order', async () => {
      const interceptor1 = jest.fn((config) => ({
        ...config,
        headers: { ...config.headers, 'X-First': '1' },
      }));

      const interceptor2 = jest.fn((config) => ({
        ...config,
        headers: { ...config.headers, 'X-Second': '2' },
      }));

      interceptorManager.addRequestInterceptor(interceptor1);
      interceptorManager.addRequestInterceptor(interceptor2);

      const config: RequestConfig = {
        url: '/test',
        method: 'GET',
      };

      const result = await interceptorManager.runRequestInterceptors(config);

      expect(interceptor1).toHaveBeenCalled();
      expect(interceptor2).toHaveBeenCalled();
      expect(result.headers?.['X-First']).toBe('1');
      expect(result.headers?.['X-Second']).toBe('2');
    });
  });
});

