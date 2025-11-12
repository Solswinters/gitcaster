/**
 * Log errors for debugging and monitoring
 */
export class ErrorLogger {
  private static logs: Array<{
    error: unknown;
    timestamp: Date;
    context?: string;
  }> = [];

  /**
   * Log an error with optional context
   */
  static log(error: unknown, context?: string): void {
    this.logs.push({
      error,
      timestamp: new Date(),
      context,
    });

    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to error monitoring service (Sentry, LogRocket, etc.)
      console.error('[ERROR]', context || 'Uncaught error:', error);
    } else {
      console.error('[ERROR]', context || 'Error:', error);
    }
  }

  /**
   * Get recent error logs
   */
  static getRecentLogs(count: number = 10) {
    return this.logs.slice(-count);
  }

  /**
   * Clear error logs
   */
  static clear(): void {
    this.logs = [];
  }
}

