/**
 * API Mock Factory
 * 
 * Factory functions for creating mock API responses.
 */

import type { ApiResponse, PaginatedResponse, PaginationMeta } from '@/domain/entities';

/**
 * Build a successful API response
 */
export function buildApiSuccess<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
  };
}

/**
 * Build an API error response
 */
export function buildApiError(error: string, message?: string): ApiResponse {
  return {
    success: false,
    error,
    message,
  };
}

/**
 * Build pagination metadata
 */
export function buildPaginationMeta(overrides?: Partial<PaginationMeta>): PaginationMeta {
  return {
    page: 1,
    pageSize: 10,
    totalPages: 5,
    totalCount: 50,
    hasNextPage: true,
    hasPreviousPage: false,
    ...overrides,
  };
}

/**
 * Build a paginated response
 */
export function buildPaginatedResponse<T>(
  data: T[],
  metaOverrides?: Partial<PaginationMeta>
): PaginatedResponse<T> {
  const totalCount = metaOverrides?.totalCount || data.length;
  const pageSize = metaOverrides?.pageSize || 10;
  const totalPages = Math.ceil(totalCount / pageSize);
  const page = metaOverrides?.page || 1;
  
  return {
    data,
    meta: buildPaginationMeta({
      page,
      pageSize,
      totalPages,
      totalCount,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      ...metaOverrides,
    }),
  };
}

/**
 * Build HTTP response
 */
export function buildHttpResponse<T>(
  data: T,
  status = 200,
  headers?: Record<string, string>
): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    json: async () => data,
    text: async () => JSON.stringify(data),
    headers: new Headers(headers),
  } as Response;
}

/**
 * Build HTTP error response
 */
export function buildHttpError(
  message: string,
  status = 500,
  headers?: Record<string, string>
): Response {
  return buildHttpResponse(
    { error: message, success: false },
    status,
    headers
  );
}

