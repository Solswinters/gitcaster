import { test, expect } from '@playwright/test'

test.describe('Public Profile', () => {
  test('should display 404 for non-existent profile', async ({ page }) => {
    await page.goto('/profile/nonexistent-user-12345')
    
    // Should show not found message or redirect to 404
    const notFoundText = page.getByText(/not found|doesn't exist|404/i)
    await expect(notFoundText).toBeVisible({ timeout: 10000 })
  })

  test('should be accessible without authentication', async ({ page }) => {
    // Try to access a profile page without logging in
    await page.goto('/profile/testuser')
    
    // Should not redirect to login page
    // Profile pages should be publicly accessible
    const url = page.url()
    expect(url).toContain('/profile/')
    expect(url).not.toContain('/login')
    expect(url).not.toContain('/onboarding')
  })

  test('should have social share meta tags', async ({ page }) => {
    await page.goto('/profile/testuser')
    
    // Check for Open Graph meta tags
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content')
    expect(ogTitle).toBeTruthy()
  })
})

test.describe('Profile Page Structure', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/profile/testuser')
    
    // Check for h1 heading
    const h1 = page.locator('h1')
    const h1Count = await h1.count()
    expect(h1Count).toBeGreaterThanOrEqual(1)
  })

  test('should handle loading states', async ({ page }) => {
    await page.goto('/profile/testuser')
    
    // Should eventually render profile content or error message
    await page.waitForLoadState('networkidle')
    
    // Check that loading state is replaced with content
    const loading = page.getByText(/loading/i)
    await expect(loading).not.toBeVisible({ timeout: 10000 })
  })
})

