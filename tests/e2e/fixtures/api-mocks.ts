/**
 * API Mocking Fixtures for E2E Tests
 * 
 * Helpers for mocking API responses in Playwright tests.
 */

import { Page, Route } from '@playwright/test';

/**
 * Mock API responses
 */
export class ApiMocks {
  constructor(private page: Page) {}

  /**
   * Mock successful user profile API
   */
  async mockUserProfile(profile: any) {
    await this.page.route('**/api/profile/**', async (route: Route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: profile,
        }),
      });
    });
  }

  /**
   * Mock GitHub API responses
   */
  async mockGitHubAPI(repos: any[]) {
    await this.page.route('**/api/github/**', async (route: Route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: repos,
        }),
      });
    });
  }

  /**
   * Mock authentication API
   */
  async mockAuthentication(success: boolean = true) {
    await this.page.route('**/api/auth/**', async (route: Route) => {
      await route.fulfill({
        status: success ? 200 : 401,
        contentType: 'application/json',
        body: JSON.stringify({
          success,
          data: success ? { authenticated: true } : null,
          error: success ? null : 'Unauthorized',
        }),
      });
    });
  }

  /**
   * Mock search API
   */
  async mockSearch(results: any[]) {
    await this.page.route('**/api/search/**', async (route: Route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: results,
          meta: {
            page: 1,
            pageSize: 10,
            totalCount: results.length,
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        }),
      });
    });
  }

  /**
   * Clear all mocks
   */
  async clearMocks() {
    await this.page.unroute('**/*');
  }
}

/**
 * Create API mocks helper
 */
export function createApiMocks(page: Page): ApiMocks {
  return new ApiMocks(page);
}

