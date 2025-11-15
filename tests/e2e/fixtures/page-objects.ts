/**
 * Page Object Models for E2E Tests
 * 
 * Encapsulate page interactions in reusable objects.
 */

import { Page, Locator } from '@playwright/test';

/**
 * Home Page Object
 */
export class HomePage {
  readonly page: Page;
  readonly heroSection: Locator;
  readonly connectWalletButton: Locator;
  readonly featuresSection: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heroSection = page.locator('[data-testid="hero-section"]');
    this.connectWalletButton = page.locator('[data-testid="connect-wallet"]');
    this.featuresSection = page.locator('[data-testid="features"]');
  }

  async goto() {
    await this.page.goto('/');
  }

  async connectWallet() {
    await this.connectWalletButton.click();
  }
}

/**
 * Dashboard Page Object
 */
export class DashboardPage {
  readonly page: Page;
  readonly profileCard: Locator;
  readonly statsSection: Locator;
  readonly recentActivity: Locator;

  constructor(page: Page) {
    this.page = page;
    this.profileCard = page.locator('[data-testid="profile-card"]');
    this.statsSection = page.locator('[data-testid="stats-section"]');
    this.recentActivity = page.locator('[data-testid="recent-activity"]');
  }

  async goto() {
    await this.page.goto('/dashboard');
  }

  async waitForLoad() {
    await this.profileCard.waitFor({ state: 'visible' });
  }
}

/**
 * Profile Page Object
 */
export class ProfilePage {
  readonly page: Page;
  readonly profileHeader: Locator;
  readonly editButton: Locator;
  readonly githubSection: Locator;

  constructor(page: Page) {
    this.page = page;
    this.profileHeader = page.locator('[data-testid="profile-header"]');
    this.editButton = page.locator('[data-testid="edit-profile"]');
    this.githubSection = page.locator('[data-testid="github-section"]');
  }

  async goto(username: string) {
    await this.page.goto(`/profile/${username}`);
  }

  async editProfile() {
    await this.editButton.click();
  }
}

/**
 * Search Page Object
 */
export class SearchPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly resultsContainer: Locator;
  readonly filterButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('[data-testid="search-input"]');
    this.resultsContainer = page.locator('[data-testid="search-results"]');
    this.filterButton = page.locator('[data-testid="filter-button"]');
  }

  async goto() {
    await this.page.goto('/search');
  }

  async search(query: string) {
    await this.searchInput.fill(query);
    await this.searchInput.press('Enter');
  }

  async waitForResults() {
    await this.resultsContainer.waitFor({ state: 'visible' });
  }
}

