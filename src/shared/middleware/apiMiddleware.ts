import { NextRequest, NextResponse } from 'next/server';

/**
 * API Middleware Utilities
 * 
 * Provides common middleware patterns for API routes:
 * - Error handling
 * - Request validation
 * - Response formatting
 * - Rate limiting support
 */

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  statusCode: number;
}

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Wraps an API route handler with error handling
 */
export function withErrorHandling<T = any>(
  handler: (req: NextRequest) => Promise<NextResponse<T>>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      return await handler(req);
    } catch (error) {
      console.error('[API Error]', error);

      if (error instanceof AppError) {
        return NextResponse.json(
          {
            error: {
              code: error.code,
              message: error.message,
              details: error.details,
            },
          },
          { status: error.statusCode }
        );
      }

      // Generic error response
      return NextResponse.json(
        {
          error: {
            code: 'INTERNAL_ERROR',
            message: 'An unexpected error occurred',
          },
        },
        { status: 500 }
      );
    }
  };
}

/**
 * Validates required query parameters
 */
export function validateQueryParams(
  searchParams: URLSearchParams,
  required: string[]
): void {
  const missing = required.filter((param) => !searchParams.has(param));
  
  if (missing.length > 0) {
    throw new AppError(
      `Missing required parameters: ${missing.join(', ')}`,
      'VALIDATION_ERROR',
      400,
      { missing }
    );
  }
}

/**
 * Validates request body
 */
export async function validateBody<T = any>(
  req: NextRequest,
  required: string[] = []
): Promise<T> {
  let body: any;

  try {
    body = await req.json();
  } catch (error) {
    throw new AppError(
      'Invalid JSON body',
      'INVALID_BODY',
      400
    );
  }

  const missing = required.filter((field) => !(field in body));
  
  if (missing.length > 0) {
    throw new AppError(
      `Missing required fields: ${missing.join(', ')}`,
      'VALIDATION_ERROR',
      400,
      { missing }
    );
  }

  return body as T;
}

/**
 * Success response helper
 */
export function successResponse<T = any>(
  data: T,
  statusCode: number = 200
): NextResponse<{ data: T }> {
  return NextResponse.json({ data }, { status: statusCode });
}

/**
 * Error response helper
 */
export function errorResponse(
  message: string,
  code: string = 'ERROR',
  statusCode: number = 500,
  details?: any
): NextResponse {
  return NextResponse.json(
    {
      error: {
        code,
        message,
        details,
      },
    },
    { status: statusCode }
  );
}

/**
 * Paginated response helper
 */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export function paginatedResponse<T = any>(
  data: T[],
  pagination: PaginationMeta
): NextResponse {
  return NextResponse.json({
    data,
    pagination,
  });
}

/**
 * Parse pagination params from search params
 */
export function parsePaginationParams(
  searchParams: URLSearchParams
): { page: number; pageSize: number } {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const pageSize = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get('pageSize') || '20'))
  );

  return { page, pageSize };
}

/**
 * Calculate pagination metadata
 */
export function calculatePagination(
  totalCount: number,
  page: number,
  pageSize: number
): PaginationMeta {
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    page,
    pageSize,
    totalCount,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

/**
 * HTTP method validator
 */
export function validateMethod(
  req: NextRequest,
  allowedMethods: string[]
): void {
  if (!allowedMethods.includes(req.method)) {
    throw new AppError(
      `Method ${req.method} not allowed`,
      'METHOD_NOT_ALLOWED',
      405,
      { allowed: allowedMethods }
    );
  }
}

/**
 * Rate limit check (placeholder - implement with actual rate limiting)
 */
export async function checkRateLimit(
  identifier: string,
  limit: number = 100
): Promise<boolean> {
  // TODO: Implement actual rate limiting with Redis or similar
  return true;
}

