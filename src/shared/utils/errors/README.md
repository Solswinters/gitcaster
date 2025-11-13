# Error Handling System

Comprehensive error handling utilities for GitCaster.

## Overview

The error handling system provides a robust, production-ready solution for managing errors across the application.

## Features

- **Custom Error Types**: Structured error hierarchy with error codes and severity levels
- **Error Recovery**: Retry logic, circuit breakers, timeouts, and fallbacks
- **Error Boundaries**: React error boundaries and HOCs
- **Error Reporting**: Centralized error reporting with context
- **Error Transformations**: Convert various error types to structured format
- **Error Logging**: Categorized logging with context
- **Error Monitoring**: Track error patterns, frequency, and metrics
- **Global Handlers**: Catch unhandled errors and rejections

## Core Components

### ErrorService

Central error handling service with custom error types.

```typescript
import { AppError, ErrorCode, handleError } from '@/shared/utils/errors';

// Create custom error
const error = new AppError(
  'Invalid user input',
  ErrorCode.VALIDATION,
  'low',
  { field: 'email', value: 'invalid@' }
);

// Handle error (logs, notifies user, etc.)
handleError(error);
```

### Error Recovery

Strategies for handling and recovering from errors.

```typescript
import { retry, withTimeout, withFallback, CircuitBreaker } from '@/shared/utils/errors';

// Retry failed operations
const result = await retry(
  () => fetchData(),
  { maxAttempts: 3, delay: 1000 }
);

// Add timeout
const data = await withTimeout(
  fetchData(),
  5000,
  'Request timed out'
);

// Provide fallback
const value = await withFallback(
  () => fetchRemoteConfig(),
  defaultConfig
);

// Circuit breaker for failing services
const breaker = new CircuitBreaker(3, 60000);
const result = await breaker.execute(() => callExternalAPI());
```

### Error Boundaries

React components for catching component errors.

```typescript
import { ErrorBoundary, withErrorBoundary } from '@/shared/utils/errors';

// As component
<ErrorBoundary fallback={<ErrorPage />}>
  <MyComponent />
</ErrorBoundary>

// As HOC
const SafeComponent = withErrorBoundary(MyComponent, {
  fallback: <ErrorPage />,
  onError: (error, errorInfo) => console.error(error),
});
```

### Error Reporting

Report errors to logging services.

```typescript
import { errorReporter } from '@/shared/utils/errors';

// Report error
errorReporter.report(error, { userId: '123' }, 'high');

// Report API error
errorReporter.reportAPIError(error, '/api/users', 'GET', 500);

// Set user context
errorReporter.setUser('user-123', 'user@example.com');
```

### Error Transforms

Convert various error types to structured AppError.

```typescript
import {
  transformError,
  transformHTTPError,
  getUserMessage,
  isRetryableError,
} from '@/shared/utils/errors';

// Transform generic error
const appError = transformError(someError);

// Transform HTTP response
const httpError = transformHTTPError(404, 'Not Found', data);

// Get user-friendly message
const message = getUserMessage(error);

// Check if error is retryable
if (isRetryableError(error)) {
  // Retry logic
}
```

### Error Logging

Structured error logging with context.

```typescript
import {
  logError,
  logAPIError,
  logComponentError,
  createErrorLogger,
} from '@/shared/utils/errors';

// Log error
logError(error, { component: 'UserProfile' });

// Log API error
logAPIError('/api/users', 'POST', 400, error);

// Log component error
logComponentError('UserForm', error, errorInfo);

// Create scoped logger
const logger = createErrorLogger('AuthModule');
logger.logError(error);
```

### Error Monitoring

Track and analyze error patterns.

```typescript
import { errorMonitor } from '@/shared/utils/errors';

// Track error
errorMonitor.track(error);

// Get metrics
const metrics = errorMonitor.getMetrics();

// Get error summary
const summary = errorMonitor.getSummary();
console.log(`Total errors: ${summary.totalErrors}`);
console.log(`Error rate: ${summary.errorRate} per minute`);
console.log(`Critical errors: ${summary.criticalErrors}`);

// Check if error rate is elevated
if (errorMonitor.isErrorRateElevated()) {
  console.warn('High error rate detected!');
}
```

### Global Error Handlers

Setup global error handling for uncaught errors.

```typescript
import { setupGlobalErrorHandlers } from '@/shared/utils/errors';

// In app initialization
setupGlobalErrorHandlers();
```

## Error Codes

Standard error codes used throughout the application:

- `VALIDATION`: Invalid input or data
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Access denied
- `NOT_FOUND`: Resource not found
- `CONFLICT`: Resource conflict
- `RATE_LIMIT`: Too many requests
- `SERVER`: Server error
- `NETWORK`: Network connectivity issue
- `TIMEOUT`: Operation timed out
- `CANCELLED`: Operation cancelled
- `UNKNOWN`: Unknown error

## Error Severity

Error severity levels for prioritization:

- `low`: Minor issues, doesn't affect core functionality
- `medium`: Moderate issues, some functionality affected
- `high`: Serious issues, significant functionality impaired
- `critical`: Critical issues, core functionality broken

## Best Practices

### 1. Use AppError for All Application Errors

```typescript
// ✅ Good
throw new AppError('User not found', ErrorCode.NOT_FOUND, 'low', { userId });

// ❌ Bad
throw new Error('User not found');
```

### 2. Add Context to Errors

```typescript
// ✅ Good
const error = new AppError('API failed', ErrorCode.SERVER, 'high', {
  endpoint: '/api/users',
  method: 'POST',
  status: 500,
});

// ❌ Bad
const error = new AppError('API failed', ErrorCode.SERVER, 'high');
```

### 3. Use Error Recovery Strategies

```typescript
// ✅ Good
const data = await retry(
  () => fetchUserData(userId),
  { maxAttempts: 3, delay: 1000 }
);

// ❌ Bad
const data = await fetchUserData(userId); // No retry
```

### 4. Wrap Components with Error Boundaries

```typescript
// ✅ Good
<ErrorBoundary fallback={<ErrorPage />}>
  <UserProfile />
</ErrorBoundary>

// ❌ Bad
<UserProfile /> // No error boundary
```

### 5. Transform Errors for Consistency

```typescript
// ✅ Good
try {
  await apiCall();
} catch (error) {
  const appError = transformError(error);
  handleError(appError);
}

// ❌ Bad
try {
  await apiCall();
} catch (error) {
  console.error(error); // No transformation
}
```

### 6. Log Errors with Context

```typescript
// ✅ Good
logAPIError('/api/users', 'GET', 500, error);

// ❌ Bad
console.error(error); // No context
```

### 7. Monitor Error Patterns

```typescript
// ✅ Good
errorMonitor.track(error);
if (errorMonitor.isErrorRateElevated()) {
  notifyDevTeam();
}

// ❌ Bad
// No monitoring
```

## Integration Example

Complete example showing all components working together:

```typescript
import {
  AppError,
  ErrorCode,
  handleError,
  retry,
  withTimeout,
  transformHTTPError,
  errorMonitor,
  errorReporter,
  logAPIError,
  setupGlobalErrorHandlers,
} from '@/shared/utils/errors';

// Setup global handlers (in app initialization)
setupGlobalErrorHandlers();

// API call with error handling
async function fetchUserData(userId: string) {
  try {
    // Add timeout and retry logic
    const response = await retry(
      () => withTimeout(
        fetch(`/api/users/${userId}`),
        5000,
        'Request timed out'
      ),
      { maxAttempts: 3, delay: 1000 }
    );

    if (!response.ok) {
      // Transform HTTP error
      const error = transformHTTPError(
        response.status,
        response.statusText,
        await response.json()
      );
      throw error;
    }

    return await response.json();
  } catch (error) {
    // Track error
    errorMonitor.track(error);

    // Log error
    logAPIError(`/api/users/${userId}`, 'GET', 500, error);

    // Report error
    errorReporter.reportAPIError(error, `/api/users/${userId}`, 'GET', 500);

    // Handle error (show user notification, etc.)
    handleError(error);

    throw error;
  }
}

// Check error rate
if (errorMonitor.isErrorRateElevated()) {
  console.warn('High error rate detected!', errorMonitor.getSummary());
}
```

## Testing

All error utilities include comprehensive test coverage:

```bash
# Run error utility tests
npm test -- src/shared/utils/errors
```

## Architecture

The error handling system follows a layered architecture:

1. **Core Layer**: `ErrorService` with base error types
2. **Recovery Layer**: `ErrorRecovery` with retry and fallback strategies
3. **Presentation Layer**: `ErrorBoundary` and error display components
4. **Reporting Layer**: `ErrorReporting` and `ErrorLogger`
5. **Transform Layer**: `ErrorTransforms` for error normalization
6. **Monitoring Layer**: `ErrorMonitor` for tracking and analytics
7. **Handler Layer**: `ErrorHandlers` for global error catching

## Future Enhancements

- [ ] Error aggregation and batching
- [ ] Error rate limiting
- [ ] Integration with external error tracking services (Sentry, etc.)
- [ ] Machine learning for error pattern detection
- [ ] Automated error recovery suggestions
- [ ] Error analytics dashboard

