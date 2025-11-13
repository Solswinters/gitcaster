/**
 * Centralized Error Service
 * 
 * Provides comprehensive error handling, logging, and reporting capabilities
 */

/**
 * Standard error codes used across the application
 */
export enum ErrorCode {
  // Generic errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  
  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  ABORT_ERROR = 'ABORT_ERROR',
  
  // Authentication errors
  AUTH_ERROR = 'AUTH_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  
  // API errors
  API_ERROR = 'API_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  RATE_LIMIT = 'RATE_LIMIT',
  SERVER_ERROR = 'SERVER_ERROR',
  
  // GitHub errors
  GITHUB_AUTH_ERROR = 'GITHUB_AUTH_ERROR',
  GITHUB_API_ERROR = 'GITHUB_API_ERROR',
  
  // Database errors
  DATABASE_ERROR = 'DATABASE_ERROR',
}

/**
 * Application error class with additional context
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public statusCode?: number,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      context: this.context,
    };
  }
}

/**
 * Error service for centralized error handling
 */
export class ErrorService {
  private static instance: ErrorService;
  private errorHandlers: Map<ErrorCode, (error: AppError) => void> = new Map();
  private errorLog: AppError[] = [];

  private constructor() {}

  static getInstance(): ErrorService {
    if (!ErrorService.instance) {
      ErrorService.instance = new ErrorService();
    }
    return ErrorService.instance;
  }

  /**
   * Register a handler for a specific error code
   */
  registerHandler(code: ErrorCode, handler: (error: AppError) => void): void {
    this.errorHandlers.set(code, handler);
  }

  /**
   * Handle an error
   */
  handle(error: unknown): AppError {
    const appError = this.normalizeError(error);
    
    // Log the error
    this.log(appError);
    
    // Call registered handler if available
    const handler = this.errorHandlers.get(appError.code);
    if (handler) {
      handler(appError);
    }
    
    return appError;
  }

  /**
   * Normalize any error to AppError
   */
  private normalizeError(error: unknown): AppError {
    if (error instanceof AppError) {
      return error;
    }

    if (error instanceof Error) {
      // Check for specific error types
      if (error.name === 'AbortError') {
        return new AppError(error.message, ErrorCode.ABORT_ERROR);
      }
      
      if (this.isNetworkError(error)) {
        return new AppError(error.message, ErrorCode.NETWORK_ERROR);
      }
      
      if (this.isTimeoutError(error)) {
        return new AppError(error.message, ErrorCode.TIMEOUT_ERROR);
      }
      
      return new AppError(error.message, ErrorCode.UNKNOWN_ERROR);
    }

    if (typeof error === 'string') {
      return new AppError(error, ErrorCode.UNKNOWN_ERROR);
    }

    return new AppError('An unexpected error occurred', ErrorCode.UNKNOWN_ERROR);
  }

  /**
   * Check if error is a network error
   */
  private isNetworkError(error: Error): boolean {
    return (
      error.message.includes('network') ||
      error.message.includes('fetch') ||
      error.message.includes('NetworkError')
    );
  }

  /**
   * Check if error is a timeout error
   */
  private isTimeoutError(error: Error): boolean {
    return error.message.toLowerCase().includes('timeout');
  }

  /**
   * Log an error
   */
  private log(error: AppError): void {
    this.errorLog.push(error);
    
    // Keep only last 100 errors
    if (this.errorLog.length > 100) {
      this.errorLog.shift();
    }
    
    // Console log in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[ErrorService]', error.toJSON());
    }
  }

  /**
   * Get error log
   */
  getErrorLog(): AppError[] {
    return [...this.errorLog];
  }

  /**
   * Clear error log
   */
  clearLog(): void {
    this.errorLog = [];
  }

  /**
   * Extract status code from error
   */
  static extractStatusCode(error: unknown): number | null {
    if (error && typeof error === 'object') {
      const err = error as any;
      return err.status || err.statusCode || err.response?.status || null;
    }
    return null;
  }

  /**
   * Create a user-friendly error message
   */
  static getUserMessage(error: AppError): string {
    const messages: Record<ErrorCode, string> = {
      [ErrorCode.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again.',
      [ErrorCode.VALIDATION_ERROR]: 'Please check your input and try again.',
      [ErrorCode.NETWORK_ERROR]: 'Network connection error. Please check your internet connection.',
      [ErrorCode.TIMEOUT_ERROR]: 'Request timed out. Please try again.',
      [ErrorCode.ABORT_ERROR]: 'Request was cancelled.',
      [ErrorCode.AUTH_ERROR]: 'Authentication failed. Please sign in again.',
      [ErrorCode.UNAUTHORIZED]: 'You are not authorized to perform this action.',
      [ErrorCode.FORBIDDEN]: 'Access to this resource is forbidden.',
      [ErrorCode.API_ERROR]: 'API request failed. Please try again.',
      [ErrorCode.NOT_FOUND]: 'The requested resource was not found.',
      [ErrorCode.RATE_LIMIT]: 'Too many requests. Please try again later.',
      [ErrorCode.SERVER_ERROR]: 'Server error. Please try again later.',
      [ErrorCode.GITHUB_AUTH_ERROR]: 'GitHub authentication failed.',
      [ErrorCode.GITHUB_API_ERROR]: 'GitHub API error. Please try again.',
      [ErrorCode.DATABASE_ERROR]: 'Database error. Please try again.',
    };

    return messages[error.code] || error.message;
  }

  /**
   * Combine multiple errors into one message
   */
  static combineErrors(errors: unknown[]): string {
    return errors
      .map(err => {
        if (err instanceof Error) return err.message;
        if (typeof err === 'string') return err;
        return 'Unknown error';
      })
      .join('; ');
  }
}

/**
 * Convenience function to handle errors
 */
export function handleError(error: unknown): AppError {
  return ErrorService.getInstance().handle(error);
}

/**
 * Create a new application error
 */
export function createError(
  message: string,
  code: ErrorCode = ErrorCode.UNKNOWN_ERROR,
  statusCode?: number,
  context?: Record<string, unknown>
): AppError {
  return new AppError(message, code, statusCode, context);
}

/**
 * Type guard to check if error is an AppError
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * Type guard to check if error is abort error
 */
export function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}

/**
 * Type guard to check if error is network error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes('network') ||
      error.message.includes('fetch') ||
      error.message.includes('NetworkError')
    );
  }
  return false;
}

/**
 * Type guard to check if error is timeout error
 */
export function isTimeoutError(error: unknown): boolean {
  return error instanceof Error && error.message.toLowerCase().includes('timeout');
}

