/**
 * Error Monitor
 *
 * Monitor and track error patterns and frequency
 *
 * @module shared/utils/errors/ErrorMonitor
 */

import { AppError } from './ErrorService';

interface ErrorMetrics {
  count: number;
  firstOccurrence: Date;
  lastOccurrence: Date;
  errorCodes: Map<string, number>;
  severityCounts: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}

class ErrorMonitor {
  private metrics: ErrorMetrics = {
    count: 0,
    firstOccurrence: new Date(),
    lastOccurrence: new Date(),
    errorCodes: new Map(),
    severityCounts: {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    },
  };

  private recentErrors: Array<{
    error: unknown;
    timestamp: Date;
  }> = [];

  private maxRecentErrors = 100;

  /**
   * Track an error occurrence
   */
  track(error: unknown): void {
    this.metrics.count++;
    this.metrics.lastOccurrence = new Date();

    // Track in recent errors
    this.recentErrors.push({
      error,
      timestamp: new Date(),
    });

    // Keep only recent errors
    if (this.recentErrors.length > this.maxRecentErrors) {
      this.recentErrors.shift();
    }

    // Track AppError specific metrics
    if (error instanceof AppError) {
      // Track error code
      const codeCount = this.metrics.errorCodes.get(error.code) || 0;
      this.metrics.errorCodes.set(error.code, codeCount + 1);

      // Track severity
      this.metrics.severityCounts[error.severity]++;
    }
  }

  /**
   * Get error metrics
   */
  getMetrics(): ErrorMetrics {
    return {
      ...this.metrics,
      errorCodes: new Map(this.metrics.errorCodes),
      severityCounts: { ...this.metrics.severityCounts },
    };
  }

  /**
   * Get recent errors
   */
  getRecentErrors(limit?: number): Array<{ error: unknown; timestamp: Date }> {
    const count = limit || this.maxRecentErrors;
    return this.recentErrors.slice(-count);
  }

  /**
   * Get error frequency (errors per minute)
   */
  getErrorFrequency(timeWindowMinutes: number = 5): number {
    const now = new Date();
    const windowStart = new Date(now.getTime() - timeWindowMinutes * 60 * 1000);

    const errorsInWindow = this.recentErrors.filter(
      (e) => e.timestamp >= windowStart
    ).length;

    return errorsInWindow / timeWindowMinutes;
  }

  /**
   * Check if error rate is elevated
   */
  isErrorRateElevated(threshold: number = 5): boolean {
    return this.getErrorFrequency() > threshold;
  }

  /**
   * Get most common error codes
   */
  getMostCommonErrors(limit: number = 5): Array<[string, number]> {
    return Array.from(this.metrics.errorCodes.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit);
  }

  /**
   * Get critical error count in time window
   */
  getCriticalErrorCount(timeWindowMinutes: number = 5): number {
    const now = new Date();
    const windowStart = new Date(now.getTime() - timeWindowMinutes * 60 * 1000);

    return this.recentErrors.filter((e) => {
      if (e.error instanceof AppError) {
        return e.error.severity === 'critical' && e.timestamp >= windowStart;
      }
      return false;
    }).length;
  }

  /**
   * Reset metrics
   */
  reset(): void {
    this.metrics = {
      count: 0,
      firstOccurrence: new Date(),
      lastOccurrence: new Date(),
      errorCodes: new Map(),
      severityCounts: {
        low: 0,
        medium: 0,
        high: 0,
        critical: 0,
      },
    };
    this.recentErrors = [];
  }

  /**
   * Get error summary
   */
  getSummary(): {
    totalErrors: number;
    errorRate: number;
    criticalErrors: number;
    mostCommonErrors: Array<[string, number]>;
    isElevated: boolean;
  } {
    return {
      totalErrors: this.metrics.count,
      errorRate: this.getErrorFrequency(),
      criticalErrors: this.getCriticalErrorCount(),
      mostCommonErrors: this.getMostCommonErrors(),
      isElevated: this.isErrorRateElevated(),
    };
  }
}

// Singleton instance
export const errorMonitor = new ErrorMonitor();

// Export class for testing
export { ErrorMonitor };

