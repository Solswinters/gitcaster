# API Routes

This directory contains all API routes for the application.

## Structure

```
api/
├── features/          # Feature-specific API routes
│   ├── analytics/
│   ├── auth/
│   ├── collaboration/
│   ├── github/
│   ├── notifications/
│   ├── onboarding/
│   ├── profile/
│   ├── recruiter/
│   ├── search/
│   └── themes/
├── middleware.ts      # Centralized API middleware
├── validators.ts      # Request validation schemas
├── helpers.ts         # API route helpers
└── constants.ts       # API constants

## Usage

### Creating a New API Route

1. Create a `route.ts` file in the appropriate directory
2. Export GET, POST, PUT, DELETE, or PATCH handlers
3. Use middleware for error handling and validation

### Example

```typescript
import { NextRequest } from 'next/server';
import { withErrorHandling } from '../middleware';
import { createSuccessResponse } from '../helpers';

export async function GET(request: NextRequest) {
  return withErrorHandling(async () => {
    const data = await fetchData();
    return createSuccessResponse(data);
  }, request);
}
```

## Best Practices

- Use validators for request validation
- Implement proper error handling
- Add rate limiting for sensitive endpoints
- Cache responses when appropriate
- Document API endpoints

