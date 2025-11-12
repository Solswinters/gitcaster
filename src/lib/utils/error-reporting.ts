import { ErrorLogger } from './error-logger';
import { ErrorContext } from './error-context';

/**
 * Error reporting service for production monitoring
 */
class ErrorReporter {
  private enabled: boolean;

  constructor() {
    this.enabled = process.env.NODE_ENV === 'production';
  }

  /**
   * Report error to monitoring service
   */
  report(error: Error, context?: ErrorContext): void {
    if (!this.enabled) {
      console.error('[Development Error]', error, context);
      return;
    }

    // Log locally
    ErrorLogger.log(error, context?.component);

    // In production, send to monitoring service
    // Example: Sentry, LogRocket, DataDog, etc.
    try {
      // TODO: Implement actual error reporting service integration
      // Sentry.captureException(error, { contexts: { custom: context } });
      console.error('[Production Error]', {
        message: error.message,
        stack: error.stack,
        context,
        timestamp: new Date().toISOString(),
      });
    } catch (reportError) {
      console.error('Failed to report error:', reportError);
    }
  }

  /**
   * Report message (non-error)
   */
  reportMessage(message: string, level: 'info' | 'warning' | 'error' = 'info'): void {
    if (!this.enabled) return;

    // TODO: Send to monitoring service
    console.log(`[${level.toUpperCase()}]`, message);
  }
}

export const errorReporter = new ErrorReporter();

