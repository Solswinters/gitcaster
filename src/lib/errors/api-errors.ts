/**
 * Standardized API error classes and handlers
 */

export class APIError extends Error {
  statusCode: number;
  code: string;
  details?: any;

  constructor(message: string, statusCode: number, code: string, details?: any) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      error: {
        message: this.message,
        code: this.code,
        statusCode: this.statusCode,
        details: this.details,
      },
    };
  }
}

export class BadRequestError extends APIError {
  constructor(message: string = 'Bad Request', details?: any) {
    super(message, 400, 'BAD_REQUEST', details);
    this.name = 'BadRequestError';
  }
}

export class UnauthorizedError extends APIError {
  constructor(message: string = 'Unauthorized', details?: any) {
    super(message, 401, 'UNAUTHORIZED', details);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends APIError {
  constructor(message: string = 'Forbidden', details?: any) {
    super(message, 403, 'FORBIDDEN', details);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends APIError {
  constructor(message: string = 'Resource not found', details?: any) {
    super(message, 404, 'NOT_FOUND', details);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends APIError {
  constructor(message: string = 'Resource conflict', details?: any) {
    super(message, 409, 'CONFLICT', details);
    this.name = 'ConflictError';
  }
}

export class ValidationError extends APIError {
  constructor(message: string = 'Validation failed', details?: any) {
    super(message, 422, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class TooManyRequestsError extends APIError {
  constructor(message: string = 'Too many requests', details?: any) {
    super(message, 429, 'TOO_MANY_REQUESTS', details);
    this.name = 'TooManyRequestsError';
  }
}

export class InternalServerError extends APIError {
  constructor(message: string = 'Internal server error', details?: any) {
    super(message, 500, 'INTERNAL_SERVER_ERROR', details);
    this.name = 'InternalServerError';
  }
}

export class ServiceUnavailableError extends APIError {
  constructor(message: string = 'Service temporarily unavailable', details?: any) {
    super(message, 503, 'SERVICE_UNAVAILABLE', details);
    this.name = 'ServiceUnavailableError';
  }
}

/**
 * Error handler for API routes
 */
export function handleAPIError(error: unknown): {
  statusCode: number;
  body: any;
} {
  // Handle known API errors
  if (error instanceof APIError) {
    return {
      statusCode: error.statusCode,
      body: error.toJSON(),
    };
  }

  // Handle Prisma errors
  if (error && typeof error === 'object' && 'code' in error) {
    const prismaError = error as any;
    
    // Unique constraint violation
    if (prismaError.code === 'P2002') {
      return {
        statusCode: 409,
        body: {
          error: {
            message: 'A record with this value already exists',
            code: 'DUPLICATE_RECORD',
            statusCode: 409,
            details: prismaError.meta,
          },
        },
      };
    }

    // Record not found
    if (prismaError.code === 'P2025') {
      return {
        statusCode: 404,
        body: {
          error: {
            message: 'Record not found',
            code: 'NOT_FOUND',
            statusCode: 404,
          },
        },
      };
    }
  }

  // Handle generic errors
  const message = error instanceof Error ? error.message : 'Unknown error occurred';
  
  // Log unexpected errors
  console.error('Unexpected API error:', error);

  return {
    statusCode: 500,
    body: {
      error: {
        message: process.env.NODE_ENV === 'production' 
          ? 'Internal server error' 
          : message,
        code: 'INTERNAL_SERVER_ERROR',
        statusCode: 500,
      },
    },
  };
}

/**
 * Async error wrapper for API route handlers
 */
export function asyncHandler<T>(
  handler: (req: any, res: any) => Promise<T>
) {
  return async (req: any, res: any) => {
    try {
      return await handler(req, res);
    } catch (error) {
      const { statusCode, body } = handleAPIError(error);
      return res.status(statusCode).json(body);
    }
  };
}

/**
 * Assert condition or throw error
 */
export function assertOrThrow(
  condition: boolean,
  ErrorClass: typeof APIError,
  message?: string,
  details?: any
): asserts condition {
  if (!condition) {
    throw new ErrorClass(message, details);
  }
}

/**
 * Assert value is not null/undefined or throw
 */
export function assertExists<T>(
  value: T | null | undefined,
  message: string = 'Resource not found'
): asserts value is T {
  if (value === null || value === undefined) {
    throw new NotFoundError(message);
  }
}

