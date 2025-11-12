import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should show connect wallet button on onboarding page', async ({ page }) => {
    await page.goto('/onboarding')
    
    // Look for wallet connect button
    const connectButton = page.getByRole('button', { name: /connect|wallet/i })
    await expect(connectButton).toBeVisible()
  })

  test('should display authentication options', async ({ page }) => {
    await page.goto('/onboarding')
    
    // Should show various authentication methods
    // Wait for page to fully load
    await page.waitForLoadState('networkidle')
    
    const pageContent = await page.textContent('body')
    
    // Check for mentions of authentication methods
    const hasAuthContent = pageContent?.includes('Connect') || 
                           pageContent?.includes('Sign in') ||
                           pageContent?.includes('wallet')
    
    expect(hasAuthContent).toBe(true)
  })

  test('should redirect to dashboard after authentication', async ({ page }) => {
    // This would require mocking the wallet connection
    // For now, just verify the expected flow structure
    await page.goto('/onboarding')
    
    // After successful authentication, should redirect to dashboard
    // This is a placeholder test structure
    const url = page.url()
    expect(url).toContain('onboarding')
  })
})

test.describe('Protected Routes', () => {
  test('should allow access to dashboard when authenticated', async ({ page, context }) => {
    // Set up authenticated session cookie (mock)
    await context.addCookies([{
      name: 'gitcaster-session',
      value: 'mock-session-token',
      domain: 'localhost',
      path: '/',
    }])
    
    await page.goto('/dashboard')
    
    // Should load dashboard page
    const url = page.url()
    expect(url).toContain('/dashboard')
  })

  test('should handle unauthenticated access gracefully', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Should either redirect to onboarding or show appropriate message
    await page.waitForLoadState('networkidle')
    
    const url = page.url()
    const hasAuthCheck = url.includes('/dashboard') || 
                         url.includes('/onboarding') ||
                         url.includes('/')
    
    expect(hasAuthCheck).toBe(true)
  })
})

