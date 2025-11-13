# Testing Guide

Comprehensive testing guide for GitCaster.

## Table of Contents

- [Testing Stack](#testing-stack)
- [Running Tests](#running-tests)
- [Unit Tests](#unit-tests)
- [Integration Tests](#integration-tests)
- [E2E Tests](#e2e-tests)
- [Best Practices](#best-practices)
- [Coverage](#coverage)

## Testing Stack

- **Jest**: Test runner and assertion library
- **React Testing Library**: Component testing
- **Playwright**: E2E testing
- **MSW**: API mocking

## Running Tests

```bash
# Run all tests
npm test

# Run in watch mode
npm test -- --watch

# Run specific test file
npm test -- Button.test.tsx

# Run tests with coverage
npm test -- --coverage

# Run E2E tests
npm run test:e2e
```

## Unit Tests

Unit tests focus on individual functions and components.

### Component Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/shared/components/ui/Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });
});
```

### Hook Testing

```typescript
import { renderHook, act } from '@testing-library/react';
import { useToggle } from '@/shared/hooks/useToggle';

describe('useToggle', () => {
  it('initializes with false', () => {
    const { result } = renderHook(() => useToggle());
    expect(result.current[0]).toBe(false);
  });

  it('toggles value', () => {
    const { result } = renderHook(() => useToggle());

    act(() => {
      result.current[1]();
    });

    expect(result.current[0]).toBe(true);
  });
});
```

### Utility Testing

```typescript
import { formatDate } from '@/shared/utils/date';

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2024-01-15');
    expect(formatDate(date)).toBe('Jan 15, 2024');
  });

  it('handles invalid date', () => {
    expect(formatDate(null)).toBe('Invalid date');
  });
});
```

## Integration Tests

Integration tests verify multiple units working together.

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UserProfile } from '@/features/profile/components/UserProfile';

describe('UserProfile Integration', () => {
  it('loads and displays user data', async () => {
    render(<UserProfile userId="123" />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('handles edit and save', async () => {
    render(<UserProfile userId="123" />);

    await waitFor(() => {
      fireEvent.click(screen.getByText('Edit'));
    });

    const nameInput = screen.getByLabelText('Name');
    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });
  });
});
```

## E2E Tests

End-to-end tests verify complete user flows.

```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('user can sign in with GitHub', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Sign in');

    // GitHub OAuth flow
    await page.click('text=Sign in with GitHub');

    // Mock GitHub auth for testing
    await page.waitForURL('/dashboard');

    await expect(page.locator('text=Welcome')).toBeVisible();
  });

  test('user can sign out', async ({ page }) => {
    // Assuming already signed in
    await page.goto('/dashboard');

    await page.click('[aria-label="User menu"]');
    await page.click('text=Sign out');

    await page.waitForURL('/');
    await expect(page.locator('text=Sign in')).toBeVisible();
  });
});
```

## Best Practices

### 1. Test User Behavior

```typescript
// ✅ Good: Test what users see and do
it('submits form when clicking submit button', () => {
  render(<LoginForm />);

  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: 'test@example.com' },
  });
  fireEvent.click(screen.getByText('Submit'));

  expect(screen.getByText('Success!')).toBeInTheDocument();
});

// ❌ Bad: Test implementation details
it('calls handleSubmit function', () => {
  const handleSubmit = jest.fn();
  const { rerender } = render(<LoginForm onSubmit={handleSubmit} />);
  // ...
});
```

### 2. Use Descriptive Test Names

```typescript
// ✅ Good
it('displays error message when email is invalid', () => {});

// ❌ Bad
it('test error', () => {});
```

### 3. Follow AAA Pattern

```typescript
it('updates counter when button is clicked', () => {
  // Arrange
  render(<Counter initialCount={0} />);

  // Act
  fireEvent.click(screen.getByText('Increment'));

  // Assert
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

### 4. Test Edge Cases

```typescript
describe('divide', () => {
  it('divides numbers correctly', () => {
    expect(divide(10, 2)).toBe(5);
  });

  it('handles division by zero', () => {
    expect(divide(10, 0)).toBe(Infinity);
  });

  it('handles negative numbers', () => {
    expect(divide(-10, 2)).toBe(-5);
  });
});
```

### 5. Mock External Dependencies

```typescript
// Mock API calls
jest.mock('@/shared/services/apiClient', () => ({
  get: jest.fn().mockResolvedValue({ data: [] }),
}));

// Mock router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));
```

## Coverage

### Viewing Coverage

```bash
# Generate coverage report
npm test -- --coverage

# Open HTML report
open coverage/lcov-report/index.html
```

### Coverage Goals

- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 80%+
- **Lines**: 80%+

### What to Cover

✅ **Do Cover:**
- Business logic
- User interactions
- Error handling
- Edge cases
- Critical paths

❌ **Don't Cover:**
- Third-party code
- Config files
- Type definitions
- Trivial getters/setters

## Debugging Tests

### Using console.log

```typescript
it('debugs test', () => {
  const { container } = render(<Component />);

  // Print HTML
  console.log(container.innerHTML);

  // Print specific element
  screen.debug(screen.getByText('Test'));
});
```

### Using VS Code Debugger

1. Set breakpoint in test
2. Click "Debug" in test file
3. Step through code

### Common Issues

**Issue**: "Unable to find element"

```typescript
// ❌ Bad: Element not rendered yet
expect(screen.getByText('Loaded')).toBeInTheDocument();

// ✅ Good: Wait for element
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});
```

**Issue**: "Act warning"

```typescript
// Wrap state updates in act()
act(() => {
  fireEvent.click(button);
});
```

## Continuous Integration

Tests run automatically on:
- Pull requests
- Commits to main
- Pre-deployment

### GitHub Actions

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm test -- --coverage
      - run: npm run test:e2e
```

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright](https://playwright.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

