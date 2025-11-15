/**
 * Test Setup Helper
 * 
 * Utilities for setting up and tearing down integration tests.
 */

import { cleanDatabase, closeDatabase } from './database-helper';

/**
 * Setup before all tests
 */
export async function setupTests(): Promise<void> {
  // Set test environment
  process.env.NODE_ENV = 'test';
  
  // Clean database
  await cleanDatabase();
  
  console.log('✅ Test setup complete');
}

/**
 * Teardown after all tests
 */
export async function teardownTests(): Promise<void> {
  // Clean database
  await cleanDatabase();
  
  // Close connections
  await closeDatabase();
  
  console.log('✅ Test teardown complete');
}

/**
 * Setup before each test
 */
export async function beforeEachTest(): Promise<void> {
  // Clean database before each test for isolation
  await cleanDatabase();
}

/**
 * Teardown after each test
 */
export async function afterEachTest(): Promise<void> {
  // Optional: Additional cleanup
}

/**
 * Create test context
 */
export interface TestContext {
  userId: string;
  userToken: string;
  cleanup: () => Promise<void>;
}

export async function createTestContext(): Promise<TestContext> {
  const userId = 'test-user-' + Date.now();
  const userToken = 'test-token-' + Date.now();
  
  const cleanup = async () => {
    // Cleanup any test-specific resources
  };
  
  return {
    userId,
    userToken,
    cleanup,
  };
}

/**
 * Wait for async operations to complete
 */
export function waitFor(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry operation until it succeeds or times out
 */
export async function retryUntil<T>(
  operation: () => Promise<T>,
  condition: (result: T) => boolean,
  options: {
    maxAttempts?: number;
    delay?: number;
    timeout?: number;
  } = {}
): Promise<T> {
  const {
    maxAttempts = 10,
    delay = 100,
    timeout = 5000,
  } = options;
  
  const startTime = Date.now();
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    if (Date.now() - startTime > timeout) {
      throw new Error(`Operation timed out after ${timeout}ms`);
    }
    
    try {
      const result = await operation();
      
      if (condition(result)) {
        return result;
      }
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;
      }
    }
    
    await waitFor(delay);
  }
  
  throw new Error(`Operation failed after ${maxAttempts} attempts`);
}

