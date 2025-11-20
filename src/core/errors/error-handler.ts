/**
 * Error handler utility with enhanced features
 */

import { AppError } from './base-error';

export interface ErrorResponse {
  message: string;
  statusCode: number;
  code?: string;
  stack?: string;
  timestamp: string;
  correlationId?: string;
  metadata?: Record<string, any>;
}

export interface ErrorContext {
  userId?: string;
  requestId?: string;
  path?: string;
  method?: string;
  ip?: string;
  userAgent?: string;
  [key: string]: any;
}

export class ErrorHandler {
  private static errorLog: Array<{ error: Error; timestamp: number; context?: ErrorContext }> = [];
  private static readonly MAX_ERROR_LOG_SIZE = 100;

  static handle(error: Error, context?: ErrorContext): ErrorResponse {
    const isAppError = error instanceof AppError;
    const statusCode = isAppError ? error.statusCode : 500;
    const message = this.sanitizeMessage(
      isAppError ? error.message : 'Internal server error',
    );

    const correlationId = this.generateCorrelationId();

    const response: ErrorResponse = {
      message,
      statusCode,
      code: isAppError ? error.code : 'INTERNAL_ERROR',
      timestamp: new Date().toISOString(),
      correlationId,
    };

    // Include metadata for AppErrors
    if (isAppError && error.metadata) {
      response.metadata = error.metadata;
    }

    // Include stack trace in development
    if (process.env.NODE_ENV === 'development') {
      response.stack = error.stack;
    }

    // Log error with context
    this.logError(error, { ...context, correlationId });

    // Store error in memory log
    this.addToErrorLog(error, context);

    // Track error metrics
    this.trackError(error, context);

    return response;
  }

  static isOperationalError(error: Error): boolean {
    if (error instanceof AppError) {
      return error.isOperational;
    }
    return false;
  }

  static logError(error: Error, context?: ErrorContext): void {
    const logEntry = {
      level: this.isOperationalError(error) ? 'warn' : 'error',
      name: error.name,
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    };

    if (this.isOperationalError(error)) {
      console.warn('[OPERATIONAL ERROR]', logEntry);
    } else {
      console.error('[CRITICAL ERROR]', logEntry);
    }

    // Send to external error tracking service in production
    if (process.env.NODE_ENV === 'production') {
      this.reportToExternalService(error, context);
    }
  }

  static async handleAsync<T>(
    fn: () => Promise<T>,
    fallback?: T,
    context?: ErrorContext,
  ): Promise<T | undefined> {
    try {
      return await fn();
    } catch (error) {
      this.handle(error as Error, context);
      return fallback;
    }
  }

  static wrapAsync<TArgs extends any[], TReturn>(
    fn: (...args: TArgs) => Promise<TReturn>,
    context?: ErrorContext,
  ): (...args: TArgs) => Promise<TReturn> {
    return async (...args: TArgs) => {
      try {
        return await fn(...args);
      } catch (error) {
        this.handle(error as Error, context);
        throw error;
      }
    };
  }

  static getUserFriendlyMessage(error: Error): string {
    if (error instanceof AppError) {
      return error.message;
    }

    // Map common error types to user-friendly messages
    const errorMessage = error.message.toLowerCase();

    if (errorMessage.includes('network')) {
      return 'Network connection issue. Please check your connection and try again.';
    }

    if (errorMessage.includes('timeout')) {
      return 'The request took too long. Please try again.';
    }

    if (errorMessage.includes('fetch')) {
      return 'Failed to load data. Please try again.';
    }

    return 'Something went wrong. Please try again later.';
  }

  static getErrorLog(): Array<{ error: Error; timestamp: number; context?: ErrorContext }> {
    return [...this.errorLog];
  }

  static clearErrorLog(): void {
    this.errorLog = [];
  }

  private static generateCorrelationId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(7)}`;
  }

  private static sanitizeMessage(message: string): string {
    // Remove sensitive information patterns
    return message
      .replace(/password[^\s]*/gi, 'password=***')
      .replace(/token[^\s]*/gi, 'token=***')
      .replace(/key[^\s]*/gi, 'key=***')
      .replace(/secret[^\s]*/gi, 'secret=***')
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '***@***.***');
  }

  private static addToErrorLog(error: Error, context?: ErrorContext): void {
    this.errorLog.push({
      error,
      timestamp: Date.now(),
      context,
    });

    // Maintain max size
    if (this.errorLog.length > this.MAX_ERROR_LOG_SIZE) {
      this.errorLog.shift();
    }
  }

  private static trackError(error: Error, context?: ErrorContext): void {
    // Track error metrics (can be sent to analytics)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: error.message,
        fatal: !this.isOperationalError(error),
      });
    }
  }

  private static reportToExternalService(error: Error, context?: ErrorContext): void {
    // Placeholder for external error reporting service (e.g., Sentry)
    // In a real implementation, you would send the error to your tracking service
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      // Sentry.captureException(error, { contexts: { custom: context } });
    }
  }
}

