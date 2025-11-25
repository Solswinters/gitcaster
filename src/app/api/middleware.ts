/**
 * Centralized API middleware
 */

import { NextRequest, NextResponse } from 'next/server';
import { handleApiError } from '@/core/errors/error-middleware';

export interface ApiMiddleware {
  (request: NextRequest): Promise<NextResponse | null>;
}

/**
 * composeMiddleware utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of composeMiddleware.
 */
export function composeMiddleware(...middlewares: ApiMiddleware[]): ApiMiddleware {
  return async (request: NextRequest) => {
    for (const middleware of middlewares) {
      const result = await middleware(request);
      if (result) return result;
    }
    return null;
  };
}

/**
 * withErrorHandling utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of withErrorHandling.
 */
export async function withErrorHandling(
  handler: (request: NextRequest) => Promise<NextResponse>,
  request: NextRequest
): Promise<NextResponse> {
  try {
    return await handler(request);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * cors utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of cors.
 */
export function cors(request: NextRequest): NextResponse | null {
  const origin = request.headers.get('origin');
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

  if (origin && allowedOrigins.includes(origin)) {
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
  }

  return null;
}

