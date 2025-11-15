# Integration Test Helpers

Integration test helpers provide utilities for testing API routes, database operations, and service integrations.

## Database Helper

Manage database state in tests:

```typescript
import { 
  cleanDatabase, 
  seedTestData, 
  withTransaction 
} from '@/tests/integration/helpers';

beforeEach(async () => {
  await cleanDatabase();
});

test('database operations', async () => {
  await seedTestData({
    users: [{ id: '1', name: 'Test User' }],
  });
  
  await withTransaction(async (prisma) => {
    // Operations within transaction
  });
});
```

## API Helper

Test API routes with mock requests:

```typescript
import { 
  createMockRequest,
  parseApiResponse,
  assertApiSuccess,
  assertApiError 
} from '@/tests/integration/helpers';

test('API endpoint', async () => {
  const request = createMockRequest({
    method: 'POST',
    url: '/api/users',
    body: { name: 'Test User' },
  });
  
  const response = await POST(request);
  const data = await assertApiSuccess(response);
  
  expect(data.id).toBeDefined();
});

test('authenticated API', async () => {
  const request = createAuthenticatedRequest({
    method: 'GET',
    url: '/api/profile',
    userId: 'user-1',
  });
  
  const response = await GET(request);
  expect(response.status).toBe(200);
});
```

## Setup Helper

Manage test lifecycle:

```typescript
import { 
  setupTests, 
  teardownTests,
  beforeEachTest,
  afterEachTest,
  createTestContext 
} from '@/tests/integration/helpers';

beforeAll(async () => {
  await setupTests();
});

afterAll(async () => {
  await teardownTests();
});

beforeEach(async () => {
  await beforeEachTest();
});

test('with context', async () => {
  const ctx = await createTestContext();
  
  // Use ctx.userId and ctx.userToken
  
  await ctx.cleanup();
});
```

## Retry Operations

Wait for eventual consistency:

```typescript
import { retryUntil, waitFor } from '@/tests/integration/helpers';

test('async operation', async () => {
  // Trigger async operation
  await triggerJob();
  
  // Wait for result
  const result = await retryUntil(
    async () => await checkJobStatus(),
    (status) => status === 'completed',
    { maxAttempts: 10, delay: 100 }
  );
  
  expect(result).toBe('completed');
});
```

## Best Practices

### 1. Test Isolation

Clean database between tests:
```typescript
beforeEach(async () => {
  await cleanDatabase();
});
```

### 2. Transaction Rollback

Use transactions for atomic operations:
```typescript
await withTransaction(async (prisma) => {
  // All operations will rollback on error
});
```

### 3. Mock External Services

Mock external APIs in tests:
```typescript
jest.mock('@/lib/external-api');
```

### 4. Test Data Seeds

Create reusable test data:
```typescript
const testUser = {
  id: 'test-1',
  name: 'Test User',
  email: 'test@example.com',
};

await seedTestData({ users: [testUser] });
```

### 5. Assertions

Use helper assertions:
```typescript
// ✅ Good
await assertApiSuccess(response);

// ❌ Bad
expect(response.status).toBe(200);
const json = await response.json();
expect(json.success).toBe(true);
```

## Common Patterns

### API Route Testing

```typescript
describe('POST /api/users', () => {
  it('creates a user', async () => {
    const request = createMockRequest({
      method: 'POST',
      body: { name: 'New User' },
    });
    
    const response = await POST(request);
    const user = await assertApiSuccess(response);
    
    expect(user.name).toBe('New User');
  });
  
  it('validates input', async () => {
    const request = createMockRequest({
      method: 'POST',
      body: {},
    });
    
    const response = await POST(request);
    await assertApiError(response, 400);
  });
});
```

### Service Integration Testing

```typescript
describe('UserService', () => {
  let service: UserService;
  
  beforeEach(() => {
    service = new UserService();
  });
  
  it('creates user in database', async () => {
    const result = await service.createUser({
      name: 'Test User',
    });
    
    const prisma = getTestPrisma();
    const user = await prisma.user.findUnique({
      where: { id: result.id },
    });
    
    expect(user).toBeDefined();
  });
});
```

