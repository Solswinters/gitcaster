/**
 * Visual Regression Tests for Components
 * 
 * Tests to ensure UI components don't have unexpected visual changes.
 */

import { test, expect } from '@playwright/test';

test.describe('Component Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    // Common setup
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('Button component - default state', async ({ page }) => {
    await page.goto('/components/button');
    const button = page.locator('[data-testid="button-default"]');
    await expect(button).toHaveScreenshot('button-default.png');
  });

  test('Button component - hover state', async ({ page }) => {
    await page.goto('/components/button');
    const button = page.locator('[data-testid="button-default"]');
    await button.hover();
    await expect(button).toHaveScreenshot('button-hover.png');
  });

  test('Card component - full snapshot', async ({ page }) => {
    await page.goto('/components/card');
    const card = page.locator('[data-testid="card-example"]');
    await expect(card).toHaveScreenshot('card-default.png');
  });

  test('Modal component - open state', async ({ page }) => {
    await page.goto('/components/modal');
    await page.click('[data-testid="open-modal"]');
    const modal = page.locator('[data-testid="modal"]');
    await expect(modal).toHaveScreenshot('modal-open.png');
  });

  test('Form component - with validation errors', async ({ page }) => {
    await page.goto('/components/form');
    await page.click('[data-testid="submit-button"]');
    const form = page.locator('[data-testid="form"]');
    await expect(form).toHaveScreenshot('form-with-errors.png');
  });
});

test.describe('Page Visual Regression', () => {
  test('Homepage - desktop', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('homepage-desktop.png', {
      fullPage: true,
    });
  });

  test('Homepage - mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
    });
  });

  test('Dashboard - authenticated', async ({ page }) => {
    // Mock authentication
    await page.addInitScript(() => {
      window.localStorage.setItem('authenticated', 'true');
    });
    
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('dashboard.png', {
      fullPage: true,
    });
  });
});

test.describe('Theme Visual Regression', () => {
  test('Light theme', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
    });
    await expect(page).toHaveScreenshot('theme-light.png');
  });

  test('Dark theme', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    await expect(page).toHaveScreenshot('theme-dark.png');
  });
});

