import { metrics, businessMetrics } from '@/lib/monitoring/metrics';

describe('Metrics Collector', () => {
  beforeEach(() => {
    metrics.clear();
  });

  describe('Counter metrics', () => {
    it('should increment counter', () => {
      metrics.incrementCounter('test.counter', 1);
      expect(metrics.getCounter('test.counter')).toBe(1);

      metrics.incrementCounter('test.counter', 2);
      expect(metrics.getCounter('test.counter')).toBe(3);
    });

    it('should handle counters with tags', () => {
      metrics.incrementCounter('test.counter', 1, { type: 'A' });
      metrics.incrementCounter('test.counter', 1, { type: 'B' });

      expect(metrics.getCounter('test.counter', { type: 'A' })).toBe(1);
      expect(metrics.getCounter('test.counter', { type: 'B' })).toBe(1);
    });

    it('should default increment to 1', () => {
      metrics.incrementCounter('test.counter');
      expect(metrics.getCounter('test.counter')).toBe(1);
    });
  });

  describe('Gauge metrics', () => {
    it('should record gauge value', () => {
      metrics.recordGauge('test.gauge', 42);
      expect(metrics.getGauge('test.gauge')).toBe(42);

      metrics.recordGauge('test.gauge', 100);
      expect(metrics.getGauge('test.gauge')).toBe(100);
    });

    it('should handle gauges with tags', () => {
      metrics.recordGauge('test.gauge', 10, { server: '1' });
      metrics.recordGauge('test.gauge', 20, { server: '2' });

      expect(metrics.getGauge('test.gauge', { server: '1' })).toBe(10);
      expect(metrics.getGauge('test.gauge', { server: '2' })).toBe(20);
    });
  });

  describe('Timing metrics', () => {
    it('should record timing', () => {
      metrics.recordTiming('test.duration', 123);

      const allMetrics = metrics.getMetrics();
      const timingMetric = allMetrics.find((m) => m.name === 'test.duration');

      expect(timingMetric).toBeDefined();
      expect(timingMetric?.value).toBe(123);
      expect(timingMetric?.unit).toBe('ms');
    });

    it('should track timer duration', () => {
      const timer = metrics.startTimer('test.timer');
      expect(timer.startTime).toBeLessThanOrEqual(Date.now());

      // Simulate some work
      const duration = metrics.stopTimer(timer);

      expect(duration).toBeGreaterThanOrEqual(0);

      const allMetrics = metrics.getMetrics();
      const timingMetric = allMetrics.find((m) => m.name === 'test.timer');
      expect(timingMetric).toBeDefined();
    });

    it('should include tags in timer', () => {
      const timer = metrics.startTimer('test.timer', { operation: 'sync' });
      metrics.stopTimer(timer);

      const allMetrics = metrics.getMetrics();
      const timingMetric = allMetrics.find((m) => m.name === 'test.timer');
      expect(timingMetric?.tags).toEqual({ operation: 'sync' });
    });
  });

  describe('Histogram metrics', () => {
    it('should record histogram values', () => {
      metrics.recordHistogram('test.histogram', 10);
      metrics.recordHistogram('test.histogram', 20);
      metrics.recordHistogram('test.histogram', 30);

      const allMetrics = metrics.getMetrics();
      const histogramMetrics = allMetrics.filter((m) => m.name === 'test.histogram');

      expect(histogramMetrics).toHaveLength(3);
      expect(histogramMetrics.map((m) => m.value)).toEqual([10, 20, 30]);
    });
  });

  describe('Metrics management', () => {
    it('should return all metrics', () => {
      metrics.incrementCounter('counter1');
      metrics.recordGauge('gauge1', 50);
      metrics.recordTiming('timer1', 100);

      const allMetrics = metrics.getMetrics();
      expect(allMetrics.length).toBeGreaterThanOrEqual(3);
    });

    it('should clear all metrics', () => {
      metrics.incrementCounter('test');
      metrics.recordGauge('test', 10);

      metrics.clear();

      expect(metrics.getCounter('test')).toBe(0);
      expect(metrics.getGauge('test')).toBe(0);
      expect(metrics.getMetrics()).toHaveLength(0);
    });

    it('should limit metrics in memory', () => {
      // Record more than 1000 metrics
      for (let i = 0; i < 1100; i++) {
        metrics.recordTiming('test', i);
      }

      const allMetrics = metrics.getMetrics();
      expect(allMetrics.length).toBeLessThanOrEqual(1000);
    });
  });

  describe('Business metrics', () => {
    it('should track profile views', () => {
      businessMetrics.trackProfileView('profile-123');
      expect(metrics.getCounter('profile.views', { profileId: 'profile-123' })).toBe(1);
    });

    it('should track searches', () => {
      businessMetrics.trackSearch('developer', 25);
      expect(metrics.getCounter('search.queries')).toBe(1);
    });

    it('should track GitHub syncs', () => {
      businessMetrics.trackGitHubSync('user-123', 1500);
      expect(metrics.getCounter('github.syncs')).toBe(1);
    });

    it('should track API calls', () => {
      businessMetrics.trackAPICall('/api/profile', 'GET', 200, 150);
      expect(metrics.getCounter('api.requests', {
        endpoint: '/api/profile',
        method: 'GET',
        status: '200',
      })).toBe(1);
    });

    it('should track errors', () => {
      businessMetrics.trackError('validation', 'Invalid input');
      expect(metrics.getCounter('errors', {
        type: 'validation',
        message: 'Invalid input',
      })).toBe(1);
    });

    it('should track user signups', () => {
      businessMetrics.trackUserSignup();
      expect(metrics.getCounter('user.signups')).toBe(1);
    });

    it('should track user logins', () => {
      businessMetrics.trackUserLogin('wallet');
      expect(metrics.getCounter('user.logins', { method: 'wallet' })).toBe(1);
    });
  });
});

