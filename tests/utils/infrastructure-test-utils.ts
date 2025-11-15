/**
 * Infrastructure Layer Testing Utilities
 * 
 * Utilities for testing repositories, APIs, and external integrations.
 */

/**
 * Create mock database client
 */
export function createMockPrismaClient() {
  return {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    profile: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    $disconnect: jest.fn(),
  };
}

/**
 * Create mock API response
 */
export function createMockApiResponse<T>(data: T, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
    text: async () => JSON.stringify(data),
    headers: new Headers(),
  } as Response;
}

/**
 * Create mock API error response
 */
export function createMockApiError(message: string, status = 500) {
  return createMockApiResponse({ error: message, success: false }, status);
}

/**
 * Mock fetch globally
 */
export function mockFetch(implementation?: jest.Mock) {
  const mockFn = implementation || jest.fn();
  global.fetch = mockFn as any;
  return mockFn;
}

/**
 * Restore fetch
 */
export function restoreFetch() {
  if (global.fetch && 'mockRestore' in global.fetch) {
    (global.fetch as any).mockRestore();
  }
}

