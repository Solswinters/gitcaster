# Shared Services

Centralized service layer for GitCaster.

## Overview

The services module provides production-ready API clients, interceptors, and configuration for communicating with backend services.

## Components

### API Client (`apiClient.ts`)

Centralized HTTP client with error handling, retry logic, and timeout support.

```typescript
import { apiClient } from '@/shared/services';

// GET request
const users = await apiClient.get<User[]>('/users');

// POST request
const newUser = await apiClient.post('/users', { name: 'John' });

// With retry
const data = await apiClient.get('/flaky-endpoint', { retries: 3 });

// With timeout
const quick = await apiClient.get('/fast', { timeout: 5000 });
```

#### Features

- **Singleton Pattern**: Single client instance across the app
- **Timeout Support**: Automatic request cancellation
- **Retry Logic**: Exponential backoff for failed requests
- **Error Handling**: Structured error responses with error codes
- **Type Safety**: Full TypeScript support

### API Configuration (`apiConfig.ts`)

Configuration management for different API environments.

```typescript
import { createAPIConfig, githubAPIConfig, talentAPIConfig } from '@/shared/services';

// Default configuration
const config = createAPIConfig();

// GitHub API
const githubConfig = createAPIConfig(githubAPIConfig);

// Custom configuration
const custom = createAPIConfig({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  headers: {
    'X-API-Key': process.env.API_KEY,
  },
});
```

#### Configurations

- **Default**: Basic configuration for internal API
- **GitHub**: Pre-configured for GitHub REST API
- **Talent Protocol**: Pre-configured for Talent Protocol API

### API Interceptors (`apiInterceptors.ts`)

Request/response interceptors for cross-cutting concerns.

```typescript
import {
  interceptorManager,
  authInterceptor,
  requestIdInterceptor,
  loggingInterceptor,
} from '@/shared/services';

// Add auth token to requests
interceptorManager.addRequestInterceptor(authInterceptor('token'));

// Add request ID for tracing
interceptorManager.addRequestInterceptor(requestIdInterceptor());

// Log all requests
interceptorManager.addRequestInterceptor(loggingInterceptor());

// Remove interceptor
const remove = interceptorManager.addRequestInterceptor(myInterceptor);
remove(); // Unsubscribe
```

#### Built-in Interceptors

- **authInterceptor**: Add authorization header
- **requestIdInterceptor**: Add request ID for tracing
- **loggingInterceptor**: Log requests and responses
- **transformRequestInterceptor**: Transform request data
- **transformResponseInterceptor**: Transform response data
- **errorHandlingInterceptor**: Handle errors globally
- **cacheInterceptor**: Cache responses
- **retryInterceptor**: Retry failed requests

#### Custom Interceptors

```typescript
import { interceptorManager } from '@/shared/services';

// Request interceptor
interceptorManager.addRequestInterceptor((config) => {
  // Modify request
  config.headers = {
    ...config.headers,
    'X-Custom-Header': 'value',
  };
  return config;
});

// Response interceptor
interceptorManager.addResponseInterceptor((response) => {
  // Transform response
  response.data = {
    ...response.data,
    transformed: true,
  };
  return response;
});

// Error interceptor
interceptorManager.addErrorInterceptor((error) => {
  // Handle error
  console.error('API Error:', error);
  return error;
});
```

## Usage Examples

### Basic API Call

```typescript
import { apiClient } from '@/shared/services';

async function fetchUsers() {
  try {
    const users = await apiClient.get<User[]>('/users');
    return users;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw error;
  }
}
```

### With Authentication

```typescript
import { apiClient, interceptorManager, authInterceptor } from '@/shared/services';

// Setup
function setupAuth(token: string) {
  interceptorManager.addRequestInterceptor(authInterceptor(token));
}

// Use
setupAuth('my-token');
const protectedData = await apiClient.get('/protected');
```

### With Retry and Timeout

```typescript
import { apiClient } from '@/shared/services';

const data = await apiClient.get('/unreliable', {
  retries: 3,     // Retry 3 times
  timeout: 5000,  // 5 second timeout
});
```

### Multiple APIs

```typescript
import { ApiClient, createAPIConfig, githubAPIConfig } from '@/shared/services';

// Internal API
const internalAPI = ApiClient.getInstance('/api');

// GitHub API
const githubAPI = ApiClient.getInstance('https://api.github.com');

// Usage
const users = await internalAPI.get('/users');
const repos = await githubAPI.get('/users/octocat/repos');
```

## Best Practices

### 1. Use Singleton Instance

```typescript
// ✅ Good: Use singleton
import { apiClient } from '@/shared/services';
const data = await apiClient.get('/data');

// ❌ Bad: Create new instances
const client = new ApiClient();
```

### 2. Handle Errors Properly

```typescript
// ✅ Good: Handle errors
try {
  const data = await apiClient.get('/data');
  return data;
} catch (error) {
  logger.error('API failed:', error);
  throw error;
}

// ❌ Bad: No error handling
const data = await apiClient.get('/data');
```

### 3. Use Type Safety

```typescript
// ✅ Good: Typed responses
const users = await apiClient.get<User[]>('/users');

// ❌ Bad: No types
const users = await apiClient.get('/users');
```

### 4. Configure Retry for Unreliable Endpoints

```typescript
// ✅ Good: Retry unreliable endpoints
const data = await apiClient.get('/flaky', { retries: 3 });

// ❌ Bad: No retry
const data = await apiClient.get('/flaky');
```

### 5. Use Interceptors for Cross-Cutting Concerns

```typescript
// ✅ Good: Use interceptors for auth
interceptorManager.addRequestInterceptor(authInterceptor(token));

// ❌ Bad: Add auth to every request manually
apiClient.get('/data', { headers: { Authorization: `Bearer ${token}` } });
```

## Testing

All services are thoroughly tested:

```bash
# Test all services
npm test -- src/shared/services

# Test with coverage
npm test -- src/shared/services --coverage
```

## Architecture

Services follow clean architecture principles:

1. **Client Layer**: HTTP client (`apiClient.ts`)
2. **Configuration Layer**: API configuration (`apiConfig.ts`)
3. **Middleware Layer**: Interceptors (`apiInterceptors.ts`)

## Error Handling

API client integrates with the error handling system:

```typescript
import { apiClient } from '@/shared/services';
import { handleError } from '@/shared/utils/errors';

try {
  const data = await apiClient.get('/data');
} catch (error) {
  handleError(error); // Logs, reports, and notifies user
  throw error;
}
```

## Performance

- **Request Deduplication**: Prevent duplicate requests
- **Response Caching**: Cache frequently accessed data
- **Lazy Loading**: Load services on demand
- **Tree Shaking**: Import only what you need

## Security

- **HTTPS Only**: Enforce secure connections
- **CSRF Protection**: Include CSRF tokens
- **Rate Limiting**: Respect API rate limits
- **Token Management**: Secure token storage and refresh

## Related

- [Error Handling](../utils/errors/README.md)
- [Shared Hooks](../hooks/README.md)
- [Feature Services](../../features/README.md)

