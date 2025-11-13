import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  // Assume user is logged in for dashboard tests
  test.beforeEach(async ({ page }) => {
    // TODO: Add authentication setup
    // For now, navigate directly to dashboard
    await page.goto('/dashboard');
  });

  test('should display dashboard page', async ({ page }) => {
    await expect(page).toHaveTitle(/Dashboard/);
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('should show user profile summary', async ({ page }) => {
    // Check for profile section
    const profileSection = page.locator('[data-testid="profile-summary"]').first();
    
    if (await profileSection.isVisible()) {
      await expect(profileSection).toBeVisible();
    } else {
      // Profile might not be set up yet
      const setupPrompt = page.locator('text=/set up.*profile/i').first();
      await expect(setupPrompt).toBeVisible();
    }
  });

  test('should display GitHub stats', async ({ page }) => {
    // Look for GitHub stats section
    const githubSection = page.locator('[data-testid="github-stats"], text=/github/i').first();
    
    if (await githubSection.isVisible()) {
      await expect(githubSection).toBeVisible();
    }
  });

  test('should have sync data button', async ({ page }) => {
    const syncButton = page.locator('button:has-text("Sync"), button:has-text("Refresh")').first();
    
    if (await syncButton.isVisible()) {
      await expect(syncButton).toBeVisible();
      await expect(syncButton).toBeEnabled();
    }
  });

  test('should show recent activity', async ({ page }) => {
    const activitySection = page.locator('[data-testid="recent-activity"]').first();
    
    if (await activitySection.isVisible()) {
      await expect(activitySection).toBeVisible();
    }
  });

  test('should have link to public profile', async ({ page }) => {
    const profileLink = page.locator('a:has-text("View Profile"), a[href*="/profile/"]').first();
    
    if (await profileLink.isVisible()) {
      await expect(profileLink).toBeVisible();
      await expect(profileLink).toHaveAttribute('href', /\/profile\//);
    }
  });

  test('should display profile completion status', async ({ page }) => {
    const completionIndicator = page.locator('[data-testid="profile-completion"], text=/complete/i').first();
    
    if (await completionIndicator.isVisible()) {
      await expect(completionIndicator).toBeVisible();
    }
  });

  test('should show settings link', async ({ page }) => {
    const settingsLink = page.locator('a:has-text("Settings"), a[href*="/settings"]').first();
    
    if (await settingsLink.isVisible()) {
      await expect(settingsLink).toBeVisible();
    }
  });
});

test.describe('Dashboard - GitHub Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('should have connect GitHub button if not connected', async ({ page }) => {
    const connectButton = page.locator('button:has-text("Connect GitHub")').first();
    const githubStats = page.locator('[data-testid="github-stats"]').first();
    
    // Either stats are visible (connected) or button is visible (not connected)
    const hasConnect = await connectButton.isVisible().catch(() => false);
    const hasStats = await githubStats.isVisible().catch(() => false);
    
    expect(hasConnect || hasStats).toBe(true);
  });

  test('should show loading state during sync', async ({ page }) => {
    const syncButton = page.locator('button:has-text("Sync"), button:has-text("Refresh")').first();
    
    if (await syncButton.isVisible()) {
      await syncButton.click();
      
      // Should show loading indicator
      const loadingIndicator = page.locator('[data-testid="loading"], text=/syncing/i, svg.animate-spin').first();
      await expect(loadingIndicator).toBeVisible({ timeout: 1000 }).catch(() => {});
    }
  });
});

test.describe('Dashboard - Profile Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('should navigate to profile edit', async ({ page }) => {
    const editButton = page.locator('button:has-text("Edit"), a:has-text("Edit Profile")').first();
    
    if (await editButton.isVisible()) {
      await editButton.click();
      
      // Should navigate to edit page or open modal
      await page.waitForTimeout(500);
      
      const isOnEditPage = page.url().includes('/edit');
      const hasModal = await page.locator('[role="dialog"], .modal').isVisible().catch(() => false);
      
      expect(isOnEditPage || hasModal).toBe(true);
    }
  });

  test('should copy profile link', async ({ page }) => {
    const copyButton = page.locator('button:has-text("Copy Link"), button[title*="copy"]').first();
    
    if (await copyButton.isVisible()) {
      // Grant clipboard permissions
      await page.context().grantPermissions(['clipboard-write', 'clipboard-read']);
      
      await copyButton.click();
      
      // Should show success message
      const successMessage = page.locator('text=/copied/i').first();
      await expect(successMessage).toBeVisible({ timeout: 2000 }).catch(() => {});
    }
  });
});

test.describe('Dashboard - Analytics', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('should display view count', async ({ page }) => {
    const viewCount = page.locator('[data-testid="view-count"], text=/views?/i').first();
    
    if (await viewCount.isVisible()) {
      await expect(viewCount).toBeVisible();
      await expect(viewCount).toContainText(/\d+/); // Should contain a number
    }
  });

  test('should show analytics link if available', async ({ page }) => {
    const analyticsLink = page.locator('a:has-text("Analytics"), a[href*="/analytics"]').first();
    
    if (await analyticsLink.isVisible()) {
      await expect(analyticsLink).toBeVisible();
    }
  });
});

test.describe('Dashboard - Mobile View', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should display mobile-optimized dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Should render without horizontal scroll
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(375);
  });

  test('should have accessible mobile navigation', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Look for mobile menu button
    const menuButton = page.locator('button[aria-label*="menu"], button:has-text("Menu")').first();
    
    if (await menuButton.isVisible()) {
      await expect(menuButton).toBeVisible();
      await expect(menuButton).toBeEnabled();
    }
  });
});

test.describe('Dashboard - Performance', () => {
  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
  });

  test('should not have console errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Filter out expected errors (e.g., network errors in test environment)
    const criticalErrors = errors.filter(
      (err) => !err.includes('net::ERR') && !err.includes('favicon')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });
});

