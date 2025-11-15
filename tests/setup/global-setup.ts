/**
 * Global Test Setup
 * 
 * Runs once before all tests.
 */

export default async function globalSetup() {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.NEXT_PUBLIC_APP_ENV = 'test';
  
  // Mock environment variables if not set
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/gitcaster_test';
  }
  
  if (!process.env.NEXTAUTH_SECRET) {
    process.env.NEXTAUTH_SECRET = 'test-secret-key-for-testing-only';
  }
  
  console.log('🧪 Global test setup complete');
}

