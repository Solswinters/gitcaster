/**
 * Application metrics collection and reporting
 * Tracks performance, errors, and business metrics
 */

export interface Metric {
  name: string;
  value: number;
  unit?: string;
  timestamp: number;
  tags?: Record<string, string>;
}

export interface TimerMetric {
  name: string;
  startTime: number;
  tags?: Record<string, string>;
}

class MetricsCollector {
  private metrics: Metric[] = [];
  private counters: Map<string, number> = new Map();
  private gauges: Map<string, number> = new Map();

  /**
   * Record a counter metric (incremental)
   */
  incrementCounter(name: string, value: number = 1, tags?: Record<string, string>): void {
    const key = this.generateKey(name, tags);
    const current = this.counters.get(key) || 0;
    this.counters.set(key, current + value);

    this.recordMetric({
      name,
      value: current + value,
      unit: 'count',
      timestamp: Date.now(),
      tags,
    });
  }

  /**
   * Record a gauge metric (current value)
   */
  recordGauge(name: string, value: number, tags?: Record<string, string>): void {
    const key = this.generateKey(name, tags);
    this.gauges.set(key, value);

    this.recordMetric({
      name,
      value,
      timestamp: Date.now(),
      tags,
    });
  }

  /**
   * Record a timing metric
   */
  recordTiming(name: string, duration: number, tags?: Record<string, string>): void {
    this.recordMetric({
      name,
      value: duration,
      unit: 'ms',
      timestamp: Date.now(),
      tags,
    });
  }

  /**
   * Start a timer
   */
  startTimer(name: string, tags?: Record<string, string>): TimerMetric {
    return {
      name,
      startTime: Date.now(),
      tags,
    };
  }

  /**
   * Stop a timer and record duration
   */
  stopTimer(timer: TimerMetric): number {
    const duration = Date.now() - timer.startTime;
    this.recordTiming(timer.name, duration, timer.tags);
    return duration;
  }

  /**
   * Record a histogram metric
   */
  recordHistogram(name: string, value: number, tags?: Record<string, string>): void {
    this.recordMetric({
      name,
      value,
      timestamp: Date.now(),
      tags,
    });
  }

  /**
   * Get all recorded metrics
   */
  getMetrics(): Metric[] {
    return [...this.metrics];
  }

  /**
   * Get counter value
   */
  getCounter(name: string, tags?: Record<string, string>): number {
    const key = this.generateKey(name, tags);
    return this.counters.get(key) || 0;
  }

  /**
   * Get gauge value
   */
  getGauge(name: string, tags?: Record<string, string>): number {
    const key = this.generateKey(name, tags);
    return this.gauges.get(key) || 0;
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics = [];
    this.counters.clear();
    this.gauges.clear();
  }

  /**
   * Record a metric
   */
  private recordMetric(metric: Metric): void {
    this.metrics.push(metric);

    // Keep only last 1000 metrics in memory
    if (this.metrics.length > 1000) {
      this.metrics.shift();
    }

    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoringService(metric);
    }
  }

  /**
   * Generate unique key for metric with tags
   */
  private generateKey(name: string, tags?: Record<string, string>): string {
    if (!tags) return name;
    const tagString = Object.entries(tags)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}:${value}`)
      .join(',');
    return `${name}[${tagString}]`;
  }

  /**
   * Send metric to monitoring service (Datadog, Prometheus, etc.)
   */
  private sendToMonitoringService(metric: Metric): void {
    // TODO: Implement integration with monitoring service
    // For now, just log in production
    if (process.env.NODE_ENV === 'production') {
      console.log('[Metrics]', JSON.stringify(metric));
    }
  }
}

// Global metrics instance
export const metrics = new MetricsCollector();

/**
 * Business metrics helpers
 */
export const businessMetrics = {
  trackProfileView: (profileId: string) => {
    metrics.incrementCounter('profile.views', 1, { profileId });
  },

  trackSearch: (query: string, results: number) => {
    metrics.incrementCounter('search.queries', 1);
    metrics.recordHistogram('search.results', results, { query });
  },

  trackGitHubSync: (userId: string, duration: number) => {
    metrics.incrementCounter('github.syncs', 1);
    metrics.recordTiming('github.sync.duration', duration, { userId });
  },

  trackAPICall: (endpoint: string, method: string, status: number, duration: number) => {
    metrics.incrementCounter('api.requests', 1, { endpoint, method, status: String(status) });
    metrics.recordTiming('api.response_time', duration, { endpoint, method });
  },

  trackError: (type: string, message: string) => {
    metrics.incrementCounter('errors', 1, { type, message });
  },

  trackUserSignup: () => {
    metrics.incrementCounter('user.signups', 1);
  },

  trackUserLogin: (method: string) => {
    metrics.incrementCounter('user.logins', 1, { method });
  },
};

/**
 * Decorator for tracking function execution time
 */
export function trackExecutionTime(metricName: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const timer = metrics.startTimer(metricName, {
        method: propertyKey,
      });

      try {
        const result = await originalMethod.apply(this, args);
        metrics.stopTimer(timer);
        return result;
      } catch (error) {
        metrics.stopTimer(timer);
        businessMetrics.trackError(metricName, (error as Error).message);
        throw error;
      }
    };

    return descriptor;
  };
}

