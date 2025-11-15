/**
 * API Test Helper
 * 
 * Utilities for testing API routes in integration tests.
 */

import { NextRequest } from 'next/server';

/**
 * Create a mock Next.js request
 */
export function createMockRequest(options: {
  method?: string;
  url?: string;
  body?: any;
  headers?: Record<string, string>;
  cookies?: Record<string, string>;
}): Request {
  const {
    method = 'GET',
    url = 'http://localhost:3000/api/test',
    body,
    headers = {},
    cookies = {},
  } = options;

  const requestHeaders = new Headers(headers);
  
  // Add cookies to headers
  if (Object.keys(cookies).length > 0) {
    const cookieString = Object.entries(cookies)
      .map(([key, value]) => `${key}=${value}`)
      .join('; ');
    requestHeaders.set('Cookie', cookieString);
  }

  const requestInit: RequestInit = {
    method,
    headers: requestHeaders,
  };

  if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    requestInit.body = JSON.stringify(body);
    requestHeaders.set('Content-Type', 'application/json');
  }

  return new Request(url, requestInit);
}

/**
 * Parse API response
 */
export async function parseApiResponse<T = any>(response: Response): Promise<T> {
  const text = await response.text();
  
  if (!text) {
    return {} as T;
  }
  
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Failed to parse response: ${text}`);
  }
}

/**
 * Create authenticated request
 */
export function createAuthenticatedRequest(options: {
  method?: string;
  url?: string;
  body?: any;
  userId?: string;
  token?: string;
}): Request {
  const { userId = 'test-user', token = 'test-token', ...rest } = options;

  return createMockRequest({
    ...rest,
    headers: {
      Authorization: `Bearer ${token}`,
      'X-User-Id': userId,
      ...rest.headers,
    },
  });
}

/**
 * Assert API response status
 */
export function assertApiResponse(
  response: Response,
  expectedStatus: number,
  message?: string
): void {
  if (response.status !== expectedStatus) {
    throw new Error(
      message || `Expected status ${expectedStatus}, got ${response.status}`
    );
  }
}

/**
 * Assert API success response
 */
export async function assertApiSuccess<T>(
  response: Response
): Promise<T> {
  assertApiResponse(response, 200);
  const data = await parseApiResponse<{ success: boolean; data: T }>(response);
  
  if (!data.success) {
    throw new Error('API response indicated failure');
  }
  
  return data.data;
}

/**
 * Assert API error response
 */
export async function assertApiError(
  response: Response,
  expectedStatus: number = 400
): Promise<{ error: string; message?: string }> {
  assertApiResponse(response, expectedStatus);
  return await parseApiResponse(response);
}

