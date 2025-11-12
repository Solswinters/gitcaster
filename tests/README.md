# Test Suite

Comprehensive testing infrastructure for GitCaster.

## Directory Structure

```
tests/
├── unit/               # Unit tests
│   ├── components/     # React component tests
│   ├── lib/           # Library and utility tests
│   └── hooks/         # Custom hook tests
├── integration/        # Integration tests
│   └── api/           # API route tests
├── e2e/               # End-to-end tests
├── fixtures/          # Test data fixtures
├── utils/             # Test utilities and helpers
└── setup/             # Test configuration
```

## Quick Start

```bash
# Run all tests in watch mode
npm test

# Run tests once (CI mode)
npm run test:ci

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

## Test Types

### Unit Tests

Test individual components and functions in isolation.

**Location**: `tests/unit/`

**Examples**:
- Component rendering
- Function logic
- Error handling
- Edge cases

### Integration Tests

Test how different parts of the application work together.

**Location**: `tests/integration/`

**Examples**:
- API route functionality
- Database interactions
- Authentication flows

### E2E Tests

Test complete user journeys through the application.

**Location**: `tests/e2e/`

**Examples**:
- User signup flow
- Profile creation
- GitHub connection
- Data synchronization

## Coverage

Minimum coverage requirements:
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

View coverage report:
```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

## Writing Tests

### Test Structure

```typescript
describe('Feature Name', () => {
  beforeEach(() => {
    // Setup before each test
  })

  it('should do something specific', () => {
    // Arrange
    const input = 'test'
    
    // Act
    const result = someFunction(input)
    
    // Assert
    expect(result).toBe('expected')
  })

  afterEach(() => {
    // Cleanup after each test
  })
})
```

### Best Practices

1. **Test behavior, not implementation**
2. **Use descriptive test names**
3. **Follow AAA pattern** (Arrange, Act, Assert)
4. **Mock external dependencies**
5. **Test edge cases and errors**
6. **Keep tests isolated and independent**

## Test Utilities

### Custom Render

```typescript
import { render, screen } from '../../../utils/test-helpers'

it('renders component', () => {
  render(<MyComponent />)
  expect(screen.getByText('Hello')).toBeInTheDocument()
})
```

### Mock Data

```typescript
import { mockGitHubUser, mockRepository } from '../../../utils/mock-data'

it('displays user data', () => {
  render(<Profile user={mockGitHubUser} />)
  expect(screen.getByText(mockGitHubUser.name)).toBeInTheDocument()
})
```

### Database Setup

```typescript
import { setupTestDatabase, teardownTestDatabase } from '../../setup/test-db'

beforeAll(async () => {
  await setupTestDatabase()
})

afterAll(async () => {
  await teardownTestDatabase()
})
```

## CI/CD

Tests run automatically on:
- Push to `main` or `develop`
- Pull requests
- Pre-deployment checks

See `.github/workflows/test.yml` for configuration.

## Debugging

### Failed Tests

```bash
# Run specific test file
npm test -- path/to/test.test.ts

# Run specific test
npm test -- --testNamePattern="test name"

# Run in debug mode
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Playwright Debug

```bash
# Run with UI
npm run test:e2e:ui

# Debug mode
PWDEBUG=1 npm run test:e2e

# Headed mode (see browser)
npm run test:e2e -- --headed
```

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [Main Testing Guide](../docs/TESTING.md)

