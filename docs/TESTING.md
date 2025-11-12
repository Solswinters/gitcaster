# Testing Guidelines

This document outlines the testing strategy and guidelines for GitCaster.

## Table of Contents

- [Overview](#overview)
- [Test Structure](#test-structure)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Coverage Requirements](#coverage-requirements)
- [Best Practices](#best-practices)

## Overview

GitCaster uses a comprehensive testing strategy with:

- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: API route testing
- **E2E Tests**: Playwright for full user flows
- **Coverage**: 70% minimum threshold

## Test Structure

```
tests/
├── unit/               # Unit tests for components and utilities
│   ├── components/     # React component tests
│   ├── lib/           # Library and utility tests
│   └── hooks/         # Custom hook tests
├── integration/        # Integration tests
│   └── api/           # API route tests
├── e2e/               # End-to-end tests
│   ├── homepage.spec.ts
│   ├── profile.spec.ts
│   └── authentication.spec.ts
├── fixtures/          # Test data and fixtures
├── utils/             # Test utilities and helpers
└── setup/             # Test setup and configuration
```

## Running Tests

### All Tests

```bash
# Run all unit tests in watch mode
npm test

# Run tests once (CI mode)
npm run test:ci

# Run tests with coverage
npm run test:coverage
```

### E2E Tests

```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

### Type Checking

```bash
npm run type-check
```

## Writing Tests

### Unit Tests

Use Jest and React Testing Library for unit tests:

```typescript
import { render, screen } from '../../../utils/test-helpers'
import MyComponent from '@/components/MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

### API Tests

Test API routes with mock data:

```typescript
import { GET } from '@/app/api/myroute/route'
import { NextRequest } from 'next/server'

describe('GET /api/myroute', () => {
  it('should return data', async () => {
    const request = new NextRequest('http://localhost:3000/api/myroute')
    const response = await GET(request)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data).toHaveProperty('success', true)
  })
})
```

### E2E Tests

Use Playwright for end-to-end testing:

```typescript
import { test, expect } from '@playwright/test'

test('should complete user flow', async ({ page }) => {
  await page.goto('/')
  await page.click('button:has-text("Get Started")')
  await expect(page).toHaveURL('/onboarding')
})
```

## Coverage Requirements

Minimum coverage thresholds (enforced by Jest):

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

### Checking Coverage

```bash
npm run test:coverage
```

Coverage report will be available in `coverage/lcov-report/index.html`.

## Best Practices

### 1. Test Behavior, Not Implementation

```typescript
// ❌ Bad: Testing implementation details
expect(component.state.count).toBe(1)

// ✅ Good: Testing behavior
expect(screen.getByText('Count: 1')).toBeInTheDocument()
```

### 2. Use Descriptive Test Names

```typescript
// ❌ Bad
it('should work', () => {})

// ✅ Good
it('should display error message when form validation fails', () => {})
```

### 3. Arrange, Act, Assert

```typescript
it('should increment counter when button is clicked', () => {
  // Arrange
  render(<Counter />)
  
  // Act
  fireEvent.click(screen.getByRole('button', { name: 'Increment' }))
  
  // Assert
  expect(screen.getByText('Count: 1')).toBeInTheDocument()
})
```

### 4. Mock External Dependencies

```typescript
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

it('should fetch data', async () => {
  mockedAxios.get.mockResolvedValueOnce({ data: { name: 'Test' } })
  // ... rest of test
})
```

### 5. Clean Up After Tests

```typescript
afterEach(() => {
  jest.clearAllMocks()
  cleanup()
})
```

### 6. Use Test Utilities

Import from our custom test helpers:

```typescript
import { render, screen, fireEvent } from '../../../utils/test-helpers'
```

### 7. Test Accessibility

```typescript
it('should be keyboard accessible', async () => {
  render(<MyComponent />)
  
  const button = screen.getByRole('button')
  button.focus()
  
  expect(button).toHaveFocus()
})
```

### 8. Test Error States

```typescript
it('should display error message when API fails', async () => {
  mockedAxios.get.mockRejectedValueOnce(new Error('API Error'))
  
  render(<MyComponent />)
  
  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument()
  })
})
```

## Continuous Integration

Tests run automatically on:

- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`

See `.github/workflows/test.yml` for CI configuration.

## Troubleshooting

### Tests Hanging

If tests hang, check for:
- Unresolved promises
- Missing `await` statements
- Infinite loops

### Flaky Tests

To debug flaky tests:
1. Run the test multiple times: `npm test -- --testNamePattern="test name" --runInBand`
2. Check for race conditions
3. Ensure proper cleanup between tests

### Coverage Not Meeting Threshold

To identify uncovered code:
```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

