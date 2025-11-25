/**
 * API route helpers
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * getRequestBody utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of getRequestBody.
 */
export function getRequestBody<T = any>(request: NextRequest): Promise<T> {
  return request.json();
}

/**
 * getQueryParam utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of getQueryParam.
 */
export function getQueryParam(request: NextRequest, key: string): string | null {
  return request.nextUrl.searchParams.get(key);
}

/**
 * getAllQueryParams utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of getAllQueryParams.
 */
export function getAllQueryParams(request: NextRequest): Record<string, string> {
  const params: Record<string, string> = {};
  request.nextUrl.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}

/**
 * createSuccessResponse utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of createSuccessResponse.
 */
export function createSuccessResponse<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ success: true, data }, { status });
}

/**
 * createErrorResponse utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of createErrorResponse.
 */
export function createErrorResponse(
  message: string,
  status = 400,
  details?: any
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: {
        message,
        details,
      },
    },
    { status }
  );
}

/**
 * createPaginatedResponse utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of createPaginatedResponse.
 */
export function createPaginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): NextResponse {
  return NextResponse.json({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  });
}

/**
 * requireMethod utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of requireMethod.
 */
export function requireMethod(
  request: NextRequest,
  allowedMethods: string[]
): NextResponse | null {
  if (!allowedMethods.includes(request.method)) {
    return createErrorResponse(
      `Method ${request.method} not allowed`,
      405
    );
  }
  return null;
}

/**
 * requireAuth utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of requireAuth.
 */
export function requireAuth(request: NextRequest): NextResponse | null {
  const token = request.headers.get('authorization');
  if (!token) {
    return createErrorResponse('Unauthorized', 401);
  }
  return null;
}

