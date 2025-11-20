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

export class NetworkError extends AppError {
  constructor(message: string = 'Network error', metadata?: ErrorMetadata) {
    super(message, 503, 'NETWORK_ERROR', metadata);
  }
}

export class PaymentRequiredError extends AppError {
  constructor(message: string = 'Payment required', metadata?: ErrorMetadata) {
    super(message, 402, 'PAYMENT_REQUIRED', metadata);
  }
}

export class UnprocessableEntityError extends AppError {
  constructor(message: string = 'Unprocessable entity', metadata?: ErrorMetadata) {
    super(message, 422, 'UNPROCESSABLE_ENTITY', metadata);
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message: string = 'Too many requests', metadata?: ErrorMetadata) {
    super(message, 429, 'TOO_MANY_REQUESTS', metadata);
  }
}

export class GatewayTimeoutError extends AppError {
  constructor(message: string = 'Gateway timeout', metadata?: ErrorMetadata) {
    super(message, 504, 'GATEWAY_TIMEOUT', metadata);
  }
}

export class MethodNotAllowedError extends AppError {
  constructor(message: string = 'Method not allowed', metadata?: ErrorMetadata) {
    super(message, 405, 'METHOD_NOT_ALLOWED', metadata);
  }
}

export class NotAcceptableError extends AppError {
  constructor(message: string = 'Not acceptable', metadata?: ErrorMetadata) {
    super(message, 406, 'NOT_ACCEPTABLE', metadata);
  }
}

export class UnsupportedMediaTypeError extends AppError {
  constructor(message: string = 'Unsupported media type', metadata?: ErrorMetadata) {
    super(message, 415, 'UNSUPPORTED_MEDIA_TYPE', metadata);
  }
}

export class PreconditionFailedError extends AppError {
  constructor(message: string = 'Precondition failed', metadata?: ErrorMetadata) {
    super(message, 412, 'PRECONDITION_FAILED', metadata);
  }
}

/**
 * Error factory for creating errors with consistent structure
 */
export class ErrorFactory {
  static createValidationError(field: string, message: string): ValidationError {
    return new ValidationError(message, { field });
  }

  static createNotFoundError(resource: string, id?: string): NotFoundError {
    const message = id 
      ? `${resource} with ID ${id} not found`
      : `${resource} not found`;
    return new NotFoundError(message, { resource, id });
  }

  static createAuthenticationError(reason?: string): AuthenticationError {
    return new AuthenticationError('Authentication failed', { reason });
  }

  static createRateLimitError(limit: number, window: string): RateLimitError {
    return new RateLimitError(`Rate limit of ${limit} requests per ${window} exceeded`, {
      limit,
      window,
    });
  }

  static fromUnknown(error: unknown): AppError {
    if (error instanceof AppError) {
      return error;
    }

    if (error instanceof Error) {
      return new InternalServerError(error.message, {
        originalError: error.name,
      });
    }

    if (typeof error === 'string') {
      return new InternalServerError(error);
    }

    return new InternalServerError('An unknown error occurred', {
      originalError: typeof error,
    });
  }
}

/**
 * Type guard to check if error is an AppError
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * Type guard to check if error is operational
 */
export function isOperationalError(error: unknown): boolean {
  return error instanceof AppError && error.isOperational;
}

