/**
 * Playwright Base Fixtures
 * 
 * Custom fixtures for E2E tests.
 */

import { test as base, Page } from '@playwright/test';

// Define types for fixtures
export interface TestFixtures {
  authenticatedPage: Page;
  mockUser: {
    walletAddress: string;
    displayName: string;
    email: string;
  };
}

/**
 * Extend base test with custom fixtures
 */
export const test = base.extend<TestFixtures>({
  // Mock user data
  mockUser: async ({}, use) => {
    const user = {
      walletAddress: '0x1234567890123456789012345678901234567890',
      displayName: 'Test User',
      email: 'test@example.com',
    };
    await use(user);
  },

  // Authenticated page fixture
  authenticatedPage: async ({ page, mockUser }, use) => {
    // Navigate to app
    await page.goto('/');

    // Mock authentication state
    await page.addInitScript((user) => {
      // Set session storage or cookies for authenticated state
      window.localStorage.setItem('authenticated', 'true');
      window.localStorage.setItem('user', JSON.stringify(user));
    }, mockUser);

    // Use the authenticated page
    await use(page);

    // Cleanup
    await page.evaluate(() => {
      window.localStorage.clear();
      window.sessionStorage.clear();
    });
  },
});

export { expect } from '@playwright/test';

