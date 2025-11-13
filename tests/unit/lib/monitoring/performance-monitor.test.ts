import { performanceMonitor } from '@/lib/monitoring/performance-monitor';

// Mock performance API
const mockPerformance = {
  now: jest.fn(),
  mark: jest.fn(),
  measure: jest.fn(),
  getEntriesByName: jest.fn(),
  getEntriesByType: jest.fn(),
};

describe('Performance Monitor', () => {
  beforeEach(() => {
    performanceMonitor.clear();
    jest.clearAllMocks();
    mockPerformance.now.mockReturnValue(100);
  });

  describe('reportWebVitals', () => {
    it('should log web vitals metrics', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const metric = {
        id: 'test-id',
        name: 'CLS',
        value: 0.1,
        rating: 'good' as const,
        delta: 0.05,
        entries: [],
      };

      performanceMonitor.reportWebVitals(metric);

      expect(consoleSpy).toHaveBeenCalledWith(
        '[Web Vitals]',
        expect.objectContaining({
          name: 'CLS',
          value: 0.1,
          rating: 'good',
        })
      );

      consoleSpy.mockRestore();
    });
  });

  describe('measureFunction', () => {
    it('should measure function execution time', () => {
      // Mock performance.now to return different values
      let callCount = 0;
      global.performance.now = jest.fn(() => {
        callCount++;
        return callCount === 1 ? 100 : 150; // 50ms duration
      });

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const result = performanceMonitor.measureFunction('test-function', () => {
        return 'result';
      });

      expect(result).toBe('result');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[Performance] test-function:'),
        expect.stringContaining('50')
      );

      consoleSpy.mockRestore();
    });

    it('should handle function errors', () => {
      global.performance.now = jest.fn(() => 100);
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const error = new Error('Test error');
      
      expect(() => {
        performanceMonitor.measureFunction('failing-function', () => {
          throw error;
        });
      }).toThrow(error);

      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });

    it('should optionally skip logging', () => {
      global.performance.now = jest.fn()
        .mockReturnValueOnce(100)
        .mockReturnValueOnce(150);
      
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      performanceMonitor.measureFunction(
        'silent-function',
        () => 'result',
        { logResult: false }
      );

      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('measureAsyncFunction', () => {
    it('should measure async function execution time', async () => {
      let callCount = 0;
      global.performance.now = jest.fn(() => {
        callCount++;
        return callCount === 1 ? 100 : 200; // 100ms duration
      });

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const result = await performanceMonitor.measureAsyncFunction(
        'async-function',
        async () => {
          return 'async-result';
        }
      );

      expect(result).toBe('async-result');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[Performance] async-function:'),
        expect.stringContaining('100')
      );

      consoleSpy.mockRestore();
    });

    it('should handle async function errors', async () => {
      global.performance.now = jest.fn(() => 100);
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const error = new Error('Async error');
      
      await expect(
        performanceMonitor.measureAsyncFunction('failing-async', async () => {
          throw error;
        })
      ).rejects.toThrow(error);

      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('getAveragePageLoad', () => {
    it('should return 0 for no metrics', () => {
      expect(performanceMonitor.getAveragePageLoad()).toBe(0);
    });

    it('should calculate average correctly', () => {
      // Manually add metrics for testing
      (performanceMonitor as any).pageLoadMetrics = [
        { url: '/page1', loadTime: 100, domContentLoaded: 50, timestamp: Date.now() },
        { url: '/page2', loadTime: 200, domContentLoaded: 100, timestamp: Date.now() },
        { url: '/page3', loadTime: 150, domContentLoaded: 75, timestamp: Date.now() },
      ];

      expect(performanceMonitor.getAveragePageLoad()).toBe(150);
    });
  });

  describe('getPageLoadMetrics', () => {
    it('should return copy of metrics array', () => {
      (performanceMonitor as any).pageLoadMetrics = [
        { url: '/test', loadTime: 100, domContentLoaded: 50, timestamp: Date.now() },
      ];

      const metrics = performanceMonitor.getPageLoadMetrics();
      expect(metrics).toHaveLength(1);
      expect(metrics[0].url).toBe('/test');

      // Modifying returned array should not affect internal state
      metrics.push({ url: '/new', loadTime: 200, domContentLoaded: 100, timestamp: Date.now() });
      expect(performanceMonitor.getPageLoadMetrics()).toHaveLength(1);
    });
  });

  describe('clear', () => {
    it('should clear all metrics', () => {
      (performanceMonitor as any).pageLoadMetrics = [
        { url: '/test', loadTime: 100, domContentLoaded: 50, timestamp: Date.now() },
      ];
      (performanceMonitor as any).resourceTimings = [
        { name: 'resource.js', duration: 50, type: 'script' },
      ];

      performanceMonitor.clear();

      expect(performanceMonitor.getPageLoadMetrics()).toHaveLength(0);
      expect(performanceMonitor.getResourceTimings()).toHaveLength(0);
    });
  });
});

