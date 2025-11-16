/**
 * Error handler utility
 */

import { AppError } from './base-error';

export interface ErrorResponse {
  message: string;
  statusCode: number;
  stack?: string;
  timestamp: string;
}

export class ErrorHandler {
  static handle(error: Error): ErrorResponse {
    const isAppError = error instanceof AppError;
    const statusCode = isAppError ? error.statusCode : 500;
    const message = isAppError ? error.message : 'Internal server error';

    const response: ErrorResponse = {
      message,
      statusCode,
      timestamp: new Date().toISOString(),
    };

    // Include stack trace in development
    if (process.env.NODE_ENV === 'development') {
      response.stack = error.stack;
    }

    // Log operational errors
    if (!isAppError || !error.isOperational) {
      console.error('[ERROR]', error);
    }

    return response;
  }

  static isOperationalError(error: Error): boolean {
    if (error instanceof AppError) {
      return error.isOperational;
    }
    return false;
  }

  static logError(error: Error, context?: Record<string, any>): void {
    console.error({
      name: error.name,
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    });
  }
}

