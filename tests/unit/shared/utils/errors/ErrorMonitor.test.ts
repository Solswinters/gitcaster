import { ErrorMonitor, errorMonitor } from '@/shared/utils/errors/ErrorMonitor';
import { AppError, ErrorCode } from '@/shared/utils/errors/ErrorService';

describe('ErrorMonitor', () => {
  let monitor: ErrorMonitor;

  beforeEach(() => {
    monitor = new ErrorMonitor();
  });

  describe('track', () => {
    it('tracks error count', () => {
      const error = new Error('Test error');

      monitor.track(error);
      monitor.track(error);

      const metrics = monitor.getMetrics();
      expect(metrics.count).toBe(2);
    });

    it('tracks AppError codes', () => {
      const error1 = new AppError('Validation', ErrorCode.VALIDATION, 'low');
      const error2 = new AppError('Network', ErrorCode.NETWORK, 'high');

      monitor.track(error1);
      monitor.track(error1);
      monitor.track(error2);

      const metrics = monitor.getMetrics();
      expect(metrics.errorCodes.get(ErrorCode.VALIDATION)).toBe(2);
      expect(metrics.errorCodes.get(ErrorCode.NETWORK)).toBe(1);
    });

    it('tracks severity counts', () => {
      monitor.track(new AppError('Low', ErrorCode.VALIDATION, 'low'));
      monitor.track(new AppError('Medium', ErrorCode.NETWORK, 'medium'));
      monitor.track(new AppError('High', ErrorCode.SERVER, 'high'));
      monitor.track(new AppError('Critical', ErrorCode.SERVER, 'critical'));

      const metrics = monitor.getMetrics();
      expect(metrics.severityCounts.low).toBe(1);
      expect(metrics.severityCounts.medium).toBe(1);
      expect(metrics.severityCounts.high).toBe(1);
      expect(metrics.severityCounts.critical).toBe(1);
    });

    it('updates last occurrence timestamp', () => {
      const before = new Date();
      monitor.track(new Error('Test'));
      const after = new Date();

      const metrics = monitor.getMetrics();
      expect(metrics.lastOccurrence.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(metrics.lastOccurrence.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe('getRecentErrors', () => {
    it('returns recent errors', () => {
      monitor.track(new Error('Error 1'));
      monitor.track(new Error('Error 2'));
      monitor.track(new Error('Error 3'));

      const recent = monitor.getRecentErrors();
      expect(recent.length).toBe(3);
    });

    it('respects limit parameter', () => {
      monitor.track(new Error('Error 1'));
      monitor.track(new Error('Error 2'));
      monitor.track(new Error('Error 3'));

      const recent = monitor.getRecentErrors(2);
      expect(recent.length).toBe(2);
    });

    it('includes timestamps', () => {
      monitor.track(new Error('Test'));

      const recent = monitor.getRecentErrors();
      expect(recent[0].timestamp).toBeInstanceOf(Date);
    });
  });

  describe('getErrorFrequency', () => {
    it('calculates errors per minute', () => {
      // Track 5 errors
      for (let i = 0; i < 5; i++) {
        monitor.track(new Error(`Error ${i}`));
      }

      // With 5 minute window, should be 1 error per minute
      const frequency = monitor.getErrorFrequency(5);
      expect(frequency).toBe(1);
    });
  });

  describe('isErrorRateElevated', () => {
    it('detects elevated error rate', () => {
      // Track many errors
      for (let i = 0; i < 30; i++) {
        monitor.track(new Error(`Error ${i}`));
      }

      expect(monitor.isErrorRateElevated(5)).toBe(true);
    });

    it('returns false for normal error rate', () => {
      monitor.track(new Error('Single error'));

      expect(monitor.isErrorRateElevated(5)).toBe(false);
    });
  });

  describe('getMostCommonErrors', () => {
    it('returns most common error codes', () => {
      monitor.track(new AppError('Val 1', ErrorCode.VALIDATION, 'low'));
      monitor.track(new AppError('Val 2', ErrorCode.VALIDATION, 'low'));
      monitor.track(new AppError('Val 3', ErrorCode.VALIDATION, 'low'));
      monitor.track(new AppError('Net 1', ErrorCode.NETWORK, 'high'));
      monitor.track(new AppError('Net 2', ErrorCode.NETWORK, 'high'));
      monitor.track(new AppError('Server', ErrorCode.SERVER, 'critical'));

      const common = monitor.getMostCommonErrors(2);

      expect(common[0][0]).toBe(ErrorCode.VALIDATION);
      expect(common[0][1]).toBe(3);
      expect(common[1][0]).toBe(ErrorCode.NETWORK);
      expect(common[1][1]).toBe(2);
    });

    it('respects limit parameter', () => {
      monitor.track(new AppError('Val', ErrorCode.VALIDATION, 'low'));
      monitor.track(new AppError('Net', ErrorCode.NETWORK, 'high'));
      monitor.track(new AppError('Server', ErrorCode.SERVER, 'critical'));

      const common = monitor.getMostCommonErrors(2);
      expect(common.length).toBe(2);
    });
  });

  describe('getCriticalErrorCount', () => {
    it('counts critical errors in time window', () => {
      monitor.track(new AppError('Critical 1', ErrorCode.SERVER, 'critical'));
      monitor.track(new AppError('Critical 2', ErrorCode.SERVER, 'critical'));
      monitor.track(new AppError('High', ErrorCode.NETWORK, 'high'));

      const count = monitor.getCriticalErrorCount(5);
      expect(count).toBe(2);
    });
  });

  describe('reset', () => {
    it('resets all metrics', () => {
      monitor.track(new Error('Error 1'));
      monitor.track(new Error('Error 2'));

      monitor.reset();

      const metrics = monitor.getMetrics();
      expect(metrics.count).toBe(0);
      expect(monitor.getRecentErrors().length).toBe(0);
    });
  });

  describe('getSummary', () => {
    it('returns comprehensive summary', () => {
      monitor.track(new AppError('Critical', ErrorCode.SERVER, 'critical'));
      monitor.track(new AppError('Validation', ErrorCode.VALIDATION, 'low'));

      const summary = monitor.getSummary();

      expect(summary.totalErrors).toBe(2);
      expect(summary).toHaveProperty('errorRate');
      expect(summary).toHaveProperty('criticalErrors');
      expect(summary).toHaveProperty('mostCommonErrors');
      expect(summary).toHaveProperty('isElevated');
    });
  });

  describe('singleton instance', () => {
    it('exports singleton error monitor', () => {
      expect(errorMonitor).toBeInstanceOf(ErrorMonitor);
    });
  });
});

