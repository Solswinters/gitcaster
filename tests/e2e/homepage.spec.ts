import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/')
    
    // Check for main heading or key content
    await expect(page).toHaveTitle(/GitCaster/i)
  })

  test('should display create profile button', async ({ page }) => {
    await page.goto('/')
    
    // Look for the main CTA button
    const createButton = page.getByRole('button', { name: /create.*profile/i })
    await expect(createButton).toBeVisible()
  })

  test('should navigate to onboarding when clicking create profile', async ({ page }) => {
    await page.goto('/')
    
    const createButton = page.getByRole('button', { name: /create.*profile/i })
    await createButton.click()
    
    // Should navigate to onboarding page
    await expect(page).toHaveURL(/\/onboarding/)
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Check that page loads on mobile viewport
    await expect(page).toHaveTitle(/GitCaster/i)
  })

  test('should have accessible navigation', async ({ page }) => {
    await page.goto('/')
    
    // Check for navigation landmarks
    const nav = page.locator('nav, [role="navigation"]')
    await expect(nav.first()).toBeVisible()
  })
})

