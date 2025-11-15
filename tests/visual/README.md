# Visual Regression Testing

Visual regression tests ensure that UI components and pages don't have unexpected visual changes.

## Running Visual Tests

```bash
# Run all visual regression tests
npm run test:visual

# Update snapshots (use after intentional UI changes)
UPDATE_SNAPSHOTS=1 npm run test:visual

# Run specific visual test
npx playwright test tests/visual/component-snapshots.visual.test.ts
```

## Adding New Visual Tests

1. Create a new test file: `*.visual.test.ts`
2. Use `toHaveScreenshot()` matcher
3. Run with `UPDATE_SNAPSHOTS=1` to create baseline
4. Commit the snapshot images

```typescript
test('my component', async ({ page }) => {
  await page.goto('/my-component');
  await expect(page.locator('[data-testid="my-component"]'))
    .toHaveScreenshot('my-component.png');
});
```

## Best Practices

### 1. Stable State
Wait for animations and loading to complete:
```typescript
await page.waitForLoadState('networkidle');
await page.waitForTimeout(500); // If needed for animations
```

### 2. Viewport Consistency
Set consistent viewport sizes:
```typescript
await page.setViewportSize({ width: 1280, height: 720 });
```

### 3. Test Isolation
Each test should be independent:
```typescript
test.beforeEach(async ({ page }) => {
  // Reset state
  await page.goto('/');
});
```

### 4. Meaningful Names
Use descriptive snapshot names:
```typescript
// ✅ Good
await expect(element).toHaveScreenshot('button-primary-hover.png');

// ❌ Bad
await expect(element).toHaveScreenshot('test1.png');
```

### 5. Threshold Configuration
Adjust thresholds for flaky tests:
```typescript
await expect(element).toHaveScreenshot('element.png', {
  maxDiffPixels: 100,  // Allow up to 100 different pixels
  threshold: 0.2,      // 20% difference threshold
});
```

## Handling Flaky Tests

If visual tests are flaky due to fonts or rendering differences:

1. **Increase threshold**: Allow minor pixel differences
2. **Mask dynamic content**: Hide timestamps, user-specific data
3. **Use `toHaveScreenshot` options**: Customize comparison

```typescript
await expect(page).toHaveScreenshot('page.png', {
  mask: [page.locator('[data-dynamic]')],
  maxDiffPixels: 200,
});
```

## CI/CD Integration

Visual tests run in CI with consistent environment:
- Fixed viewport sizes
- Stable fonts (loaded via Docker)
- Headless browser with consistent rendering

## Updating Snapshots

When UI changes are intentional:

```bash
# Update all snapshots
UPDATE_SNAPSHOTS=1 npm run test:visual

# Update specific test snapshots
UPDATE_SNAPSHOTS=1 npx playwright test component-snapshots.visual.test.ts
```

Review the diff before committing:
```bash
npx playwright show-report
```

## Snapshot Storage

Snapshots are stored in:
- `tests/visual/__snapshots__/` - Baseline images
- Commit snapshots to Git for version control
- Large snapshots may increase repo size

## Testing Responsive Design

Test multiple viewports:
```typescript
const viewports = [
  { width: 375, height: 667, name: 'mobile' },
  { width: 768, height: 1024, name: 'tablet' },
  { width: 1920, height: 1080, name: 'desktop' },
];

for (const viewport of viewports) {
  test(`responsive - ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');
    await expect(page).toHaveScreenshot(`home-${viewport.name}.png`);
  });
}
```

