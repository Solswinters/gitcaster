# Test Coverage Guide

This document outlines test coverage requirements and best practices for the GitCaster project.

## Coverage Thresholds

### Global Requirements

Minimum coverage for the entire codebase:
- **Branches**: 75%
- **Functions**: 75%
- **Lines**: 75%
- **Statements**: 75%

### Domain Layer (Business Logic)

The domain layer requires the highest coverage as it contains core business logic:
- **Branches**: 90%
- **Functions**: 90%
- **Lines**: 90%
- **Statements**: 90%

**Files**: `src/domain/**/*.{ts,tsx}`

### Application Layer (Services)

Application services need strong coverage:
- **Branches**: 85%
- **Functions**: 85%
- **Lines**: 85%
- **Statements**: 85%

**Files**: `src/application/**/*.{ts,tsx}`

### Shared Utilities

Utilities should be thoroughly tested:
- **Branches**: 85%
- **Functions**: 85%
- **Lines**: 85%
- **Statements**: 85%

**Files**: `src/shared/utils/**/*.{ts,tsx}`

## Running Coverage Reports

### Generate Coverage Report

```bash
npm run test:coverage
```

This generates:
- Console summary
- HTML report in `coverage/lcov-report/index.html`
- JSON report in `coverage/coverage-final.json`

### View HTML Report

```bash
open coverage/lcov-report/index.html
```

### Check Coverage Against Thresholds

```bash
npm test -- --coverage --coverageThreshold='{"global":{"branches":75,"functions":75,"lines":75,"statements":75}}'
```

## What to Test

### Priority 1: Critical Business Logic

- Domain validators
- Business rule enforcement
- Data transformations
- Authentication/authorization logic
- Payment processing
- User data handling

### Priority 2: Application Services

- Service methods
- Use case implementations
- Error handling
- Edge cases
- State management

### Priority 3: Infrastructure

- Repository implementations
- API clients
- Database queries
- External integrations

### Priority 4: Presentation

- Component logic (not just UI)
- Form validation
- User input handling
- State management hooks

## What NOT to Test

### Don't Over-Test

- **Simple getters/setters**: Properties that just return values
- **Trivial formatters**: Single-line formatting functions
- **Configuration files**: Static configuration objects
- **Type definitions**: TypeScript interfaces and types
- **Barrel exports**: Simple re-export index files

### UI Testing Considerations

- Test component **logic**, not visual appearance
- Use E2E tests for visual/interaction testing
- Mock external dependencies
- Focus on user interactions, not implementation details

## Coverage Metrics Explained

### Lines Coverage

Percentage of code lines executed during tests.

```typescript
// 2 lines, both must be executed for 100% lines coverage
function add(a: number, b: number) {
  return a + b;
}
```

### Branches Coverage

Percentage of conditional branches executed.

```typescript
// 2 branches: if true and if false
function isEven(n: number) {
  if (n % 2 === 0) {  // Branch 1: true
    return true;
  }
  return false;        // Branch 2: false
}

// Need tests for both even and odd numbers
```

### Functions Coverage

Percentage of functions called during tests.

```typescript
export function func1() { } // Must be called
export function func2() { } // Must be called
```

### Statements Coverage

Percentage of statements executed.

```typescript
const x = 1;        // Statement 1
const y = 2;        // Statement 2
const z = x + y;    // Statement 3
```

## Improving Coverage

### Identify Uncovered Code

```bash
npm run test:coverage
# Look for red lines in HTML report
```

### Add Missing Tests

```typescript
// Before: 50% branch coverage
describe('isEven', () => {
  it('returns true for even numbers', () => {
    expect(isEven(2)).toBe(true);
  });
  // Missing: odd number test
});

// After: 100% branch coverage
describe('isEven', () => {
  it('returns true for even numbers', () => {
    expect(isEven(2)).toBe(true);
  });
  
  it('returns false for odd numbers', () => {
    expect(isEven(3)).toBe(false);
  });
});
```

### Test Edge Cases

```typescript
describe('divide', () => {
  it('divides numbers', () => {
    expect(divide(10, 2)).toBe(5);
  });
  
  // Edge cases
  it('handles division by zero', () => {
    expect(() => divide(10, 0)).toThrow();
  });
  
  it('handles negative numbers', () => {
    expect(divide(-10, 2)).toBe(-5);
  });
  
  it('handles decimals', () => {
    expect(divide(5, 2)).toBe(2.5);
  });
});
```

## Coverage Best Practices

### 1. Write Tests First (TDD)

```typescript
// 1. Write failing test
test('adds numbers', () => {
  expect(add(1, 2)).toBe(3);
});

// 2. Implement function
function add(a: number, b: number) {
  return a + b;
}

// 3. Refactor
```

### 2. Test Behavior, Not Implementation

```typescript
// ✅ Good: Tests behavior
test('authenticates user', async () => {
  const result = await authenticateUser(credentials);
  expect(result.success).toBe(true);
});

// ❌ Bad: Tests implementation
test('calls bcrypt.compare', async () => {
  await authenticateUser(credentials);
  expect(bcrypt.compare).toHaveBeenCalled();
});
```

### 3. One Concept Per Test

```typescript
// ✅ Good: Focused tests
test('validates email format', () => {
  expect(validateEmail('test@example.com')).toBe(true);
});

test('rejects invalid email', () => {
  expect(validateEmail('invalid')).toBe(false);
});

// ❌ Bad: Multiple concepts
test('email validation', () => {
  expect(validateEmail('test@example.com')).toBe(true);
  expect(validateEmail('invalid')).toBe(false);
  expect(validateEmail('')).toBe(false);
});
```

### 4. Use Descriptive Test Names

```typescript
// ✅ Good
test('returns 400 when email is missing', () => {});

// ❌ Bad
test('test email', () => {});
```

### 5. Arrange-Act-Assert Pattern

```typescript
test('creates user', async () => {
  // Arrange
  const userData = { name: 'Test User' };
  
  // Act
  const user = await createUser(userData);
  
  // Assert
  expect(user.id).toBeDefined();
});
```

## CI/CD Integration

### Enforcing Coverage in CI

```yaml
# .github/workflows/test.yml
- name: Run tests with coverage
  run: npm run test:coverage
  
- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/coverage-final.json
```

### Preventing Coverage Regression

```json
// jest.config.js
coverageThresholds: {
  global: {
    branches: 75,
    functions: 75,
    lines: 75,
    statements: 75
  }
}
```

Build fails if coverage drops below thresholds.

## Monitoring Coverage Trends

### Track Coverage Over Time

- Use Codecov or Coveralls
- Set up coverage badges
- Review coverage in PRs
- Trend toward 80%+ coverage

### Coverage Goals

- **Phase 1** (Current): 75% global, 90% domain
- **Phase 2**: 80% global, 95% domain
- **Phase 3**: 85% global, 100% domain

## Common Pitfalls

### ❌ Testing for 100% Coverage

100% coverage doesn't mean bug-free code. Focus on meaningful tests.

### ❌ Ignoring Coverage Locally

Run coverage before pushing:
```bash
npm run test:coverage
```

### ❌ Not Testing Error Cases

Don't forget unhappy paths:
```typescript
test('handles API errors', async () => {
  mockAPI.mockRejectedValue(new Error('API Error'));
  await expect(fetchData()).rejects.toThrow();
});
```

### ❌ Shallow Tests

Tests should verify behavior, not just execute code:
```typescript
// ❌ Shallow
test('function runs', () => {
  myFunction();
  expect(true).toBe(true);
});

// ✅ Deep
test('function returns correct result', () => {
  const result = myFunction(input);
  expect(result).toEqual(expectedOutput);
});
```

## Resources

- [Jest Coverage Documentation](https://jestjs.io/docs/configuration#coveragethreshold-object)
- [Testing Best Practices](https://testingjavascript.com/)
- [Coverage Anti-Patterns](https://stackoverflow.com/questions/695811/pitfalls-of-code-coverage)



