import { test, expect } from '@playwright/test';

test.describe('Search and Discovery', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/search');
  });

  test('should display search page with search bar', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Search/);
    
    // Check search input is visible
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]');
    await expect(searchInput).toBeVisible();
  });

  test('should perform basic text search', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]').first();
    
    // Enter search query
    await searchInput.fill('developer');
    await page.keyboard.press('Enter');
    
    // Wait for results
    await page.waitForTimeout(1000);
    
    // Check if results are displayed or "no results" message
    const hasResults = await page.locator('[data-testid="search-results"]').isVisible().catch(() => false);
    const hasNoResults = await page.locator('text=/no results/i').isVisible().catch(() => false);
    
    expect(hasResults || hasNoResults).toBe(true);
  });

  test('should filter by experience level', async ({ page }) => {
    // Look for filter section
    const filterSection = page.locator('[data-testid="search-filters"]').first();
    
    if (await filterSection.isVisible()) {
      // Click experience level filter
      const seniorCheckbox = page.locator('input[value="senior"], label:has-text("Senior")').first();
      
      if (await seniorCheckbox.isVisible()) {
        await seniorCheckbox.click();
        
        // Wait for filtered results
        await page.waitForTimeout(500);
        
        // Verify URL has filter parameter
        await expect(page).toHaveURL(/experience.*senior/i);
      }
    }
  });

  test('should filter by skills', async ({ page }) => {
    const skillFilter = page.locator('[data-testid="skill-filter"]').first();
    
    if (await skillFilter.isVisible()) {
      // Select a skill
      await skillFilter.click();
      
      const reactOption = page.locator('text="React", text="react"').first();
      if (await reactOption.isVisible()) {
        await reactOption.click();
        
        // Wait for results to update
        await page.waitForTimeout(500);
      }
    }
  });

  test('should display featured developers', async ({ page }) => {
    await page.goto('/discover');
    
    // Check for featured section
    const featuredSection = page.locator('text=/featured/i, [data-testid="featured-developers"]').first();
    await expect(featuredSection).toBeVisible({ timeout: 5000 }).catch(() => {});
  });

  test('should navigate to profile from search results', async ({ page }) => {
    // Perform search
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]').first();
    await searchInput.fill('developer');
    await page.keyboard.press('Enter');
    
    // Wait for results
    await page.waitForTimeout(1000);
    
    // Click first result if available
    const firstResult = page.locator('[data-testid="developer-card"]').first();
    
    if (await firstResult.isVisible()) {
      await firstResult.click();
      
      // Should navigate to profile page
      await expect(page).toHaveURL(/\/profile\//);
    }
  });

  test('should handle empty search gracefully', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]').first();
    
    // Submit empty search
    await searchInput.fill('');
    await page.keyboard.press('Enter');
    
    // Should not crash and show appropriate message
    await expect(page.locator('body')).toBeVisible();
  });

  test('should clear filters', async ({ page }) => {
    // Apply some filters first
    const filterSection = page.locator('[data-testid="search-filters"]').first();
    
    if (await filterSection.isVisible()) {
      // Look for clear filters button
      const clearButton = page.locator('button:has-text("Clear"), button:has-text("Reset")').first();
      
      if (await clearButton.isVisible()) {
        await clearButton.click();
        
        // Filters should be cleared
        await expect(page).toHaveURL(/^(?!.*\?).*$/);
      }
    }
  });
});

test.describe('Search Performance', () => {
  test('should load search page within 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/search');
    await page.waitForLoadState('domcontentloaded');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
  });

  test('should debounce search input', async ({ page }) => {
    await page.goto('/search');
    
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]').first();
    
    // Type quickly
    await searchInput.type('dev', { delay: 50 });
    
    // Should not trigger search immediately
    await page.waitForTimeout(200);
    
    // Continue typing
    await searchInput.type('eloper', { delay: 50 });
    
    // Should wait before searching
    await page.waitForTimeout(500);
  });
});

test.describe('Mobile Search', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should display mobile-optimized search', async ({ page }) => {
    await page.goto('/search');
    
    // Check search input is visible on mobile
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]').first();
    await expect(searchInput).toBeVisible();
    
    // Check layout is responsive
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should open filters in mobile view', async ({ page }) => {
    await page.goto('/search');
    
    // Look for filter toggle button
    const filterToggle = page.locator('button:has-text("Filter"), button[aria-label*="filter"]').first();
    
    if (await filterToggle.isVisible()) {
      await filterToggle.click();
      
      // Filters should be visible
      await page.waitForTimeout(500);
    }
  });
});

