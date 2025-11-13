/**
 * Error Reporting Service
 * 
 * Centralized error reporting to external services
 */

import { logger } from '../logger/logger';
import { analytics } from '../analytics/analytics';

export interface ErrorReport {
  message: string;
  stack?: string;
  context?: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  user?: {
    id?: string;
    email?: string;
  };
}

class ErrorReporter {
  private isProduction = process.env.NODE_ENV === 'production';

  /**
   * Report error to external service
   */
  report(error: Error, context?: Record<string, any>, severity: ErrorReport['severity'] = 'medium') {
    const report: ErrorReport = {
      message: error.message,
      stack: error.stack,
      context,
      severity,
      timestamp: new Date(),
    };

    // Log locally
    logger.error('Error reported', error, context);

    // Track in analytics
    analytics.trackError(error.message, error.stack, context);

    if (this.isProduction) {
      // TODO: Send to error reporting service (e.g., Sentry, Bugsnag)
      this.sendToService(report);
    } else {
      console.error('[Error Report]', report);
    }
  }

  /**
   * Report with additional context
   */
  reportWithContext(
    error: Error,
    context: {
      component?: string;
      action?: string;
      userId?: string;
      [key: string]: any;
    },
    severity: ErrorReport['severity'] = 'medium'
  ) {
    this.report(error, context, severity);
  }

  /**
   * Report API error
   */
  reportAPIError(
    error: Error,
    endpoint: string,
    method: string,
    statusCode?: number
  ) {
    this.reportWithContext(
      error,
      {
        type: 'api_error',
        endpoint,
        method,
        statusCode,
      },
      statusCode && statusCode >= 500 ? 'high' : 'medium'
    );
  }

  /**
   * Report network error
   */
  reportNetworkError(error: Error, url: string) {
    this.reportWithContext(
      error,
      {
        type: 'network_error',
        url,
      },
      'high'
    );
  }

  /**
   * Report validation error
   */
  reportValidationError(error: Error, field: string, value: any) {
    this.reportWithContext(
      error,
      {
        type: 'validation_error',
        field,
        value,
      },
      'low'
    );
  }

  /**
   * Send error report to external service
   */
  private async sendToService(report: ErrorReport) {
    try {
      // TODO: Implement actual error reporting service integration
      // Example: Sentry, Bugsnag, etc.
      console.log('Would send to error reporting service:', report);
    } catch (err) {
      console.error('Failed to send error report:', err);
    }
  }

  /**
   * Set user context for error reports
   */
  setUser(userId: string, email?: string) {
    // TODO: Set user context in error reporting service
    console.log('Set user context:', { userId, email });
  }

  /**
   * Clear user context
   */
  clearUser() {
    // TODO: Clear user context in error reporting service
    console.log('Cleared user context');
  }
}

export const errorReporter = new ErrorReporter();

