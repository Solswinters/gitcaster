/**
 * Base error classes with enhanced features
 */

export interface ErrorMetadata {
  [key: string]: any;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code: string;
  public readonly metadata?: ErrorMetadata;
  public readonly timestamp: Date;

  constructor(
    message: string,
    statusCode: number = 500,
    code?: string,
    metadata?: ErrorMetadata,
    isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code || this.constructor.name.toUpperCase();
    this.isOperational = isOperational;
    this.metadata = metadata;
    this.timestamp = new Date();

    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Serialize error for API responses
   */
  toJSON(): Record<string, any> {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      code: this.code,
      metadata: this.metadata,
      timestamp: this.timestamp.toISOString(),
    };
  }

  /**
   * Create error with additional context
   */
  withMetadata(metadata: ErrorMetadata): this {
    return new (this.constructor as any)(
      this.message,
      this.statusCode,
      this.code,
      { ...this.metadata, ...metadata },
      this.isOperational
    );
  }
}

export class ValidationError extends AppError {
  constructor(message: string, metadata?: ErrorMetadata) {
    super(message, 400, 'VALIDATION_ERROR', metadata);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed', metadata?: ErrorMetadata) {
    super(message, 401, 'AUTHENTICATION_ERROR', metadata);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied', metadata?: ErrorMetadata) {
    super(message, 403, 'AUTHORIZATION_ERROR', metadata);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found', metadata?: ErrorMetadata) {
    super(message, 404, 'NOT_FOUND', metadata);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict', metadata?: ErrorMetadata) {
    super(message, 409, 'CONFLICT', metadata);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests', metadata?: ErrorMetadata) {
    super(message, 429, 'RATE_LIMIT_EXCEEDED', metadata);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error', metadata?: ErrorMetadata) {
    super(message, 500, 'INTERNAL_SERVER_ERROR', metadata, false);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = 'Bad request', metadata?: ErrorMetadata) {
    super(message, 400, 'BAD_REQUEST', metadata);
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message: string = 'Service unavailable', metadata?: ErrorMetadata) {
    super(message, 503, 'SERVICE_UNAVAILABLE', metadata);
  }
}

export class TimeoutError extends AppError {
  constructor(message: string = 'Request timeout', metadata?: ErrorMetadata) {
    super(message, 408, 'TIMEOUT', metadata);
  }
}

