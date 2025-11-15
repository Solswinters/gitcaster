# Test Data Builders

Test data builders provide a fluent API for creating test data with sensible defaults.

## Why Builders?

- **Readability**: Tests express intent clearly
- **Maintainability**: Change defaults in one place
- **Flexibility**: Override only what you need
- **Type Safety**: Full TypeScript support

## Usage Examples

### User Builder

```typescript
import { aUser } from '@/tests/builders';

// Simple user with defaults
const user = aUser().build();

// Customized user
const user = aUser()
  .withDisplayName('John Doe')
  .withBio('Software Engineer')
  .withGitHub('johndoe')
  .withTalentScore(90)
  .asPublic()
  .build();

// Complete user profile
const user = aUser().complete().build();

// Multiple users
const users = aUser().buildMany(5);
```

### GitHub Builder

```typescript
import { aRepository, aGitHubUser } from '@/tests/builders';

// Simple repository
const repo = aRepository()
  .withName('my-project')
  .withLanguage('TypeScript')
  .withStars(100)
  .build();

// Popular repository
const repo = aRepository().popular().build();

// GitHub user
const githubUser = aGitHubUser()
  .withLogin('johndoe')
  .withName('John Doe')
  .withBio('Developer')
  .popular()
  .build();
```

### API Response Builder

```typescript
import { anApiResponse, aPaginatedResponse } from '@/tests/builders';

// Success response
const response = anApiResponse()
  .withSuccess({ id: '123', name: 'Test' })
  .build();

// Error response
const response = anApiResponse()
  .withError('Not found', 'The resource was not found')
  .build();

// Paginated response
const response = aPaginatedResponse()
  .withData([item1, item2, item3])
  .withPage(2)
  .withPageSize(10)
  .withTotalCount(50)
  .withNextPage()
  .withPreviousPage()
  .build();
```

## Creating New Builders

Follow the builder pattern:

```typescript
export class MyEntityBuilder {
  private data: Partial<MyEntity> = {
    // defaults
  };

  withField(value: any): this {
    this.data.field = value;
    return this;
  }

  build(): MyEntity {
    return this.data as MyEntity;
  }
}

export function aMyEntity(): MyEntityBuilder {
  return new MyEntityBuilder();
}
```

## Best Practices

### 1. Sensible Defaults
Provide minimal valid defaults:
```typescript
private data = {
  id: 'test-1',
  name: 'Test Name',
  // minimum required fields
};
```

### 2. Chaining Methods
Return `this` for method chaining:
```typescript
withName(name: string): this {
  this.data.name = name;
  return this;
}
```

### 3. Convenience Methods
Add helpers for common scenarios:
```typescript
complete(): this {
  // Set all fields to realistic values
  return this;
}

minimal(): this {
  // Set only required fields
  return this;
}
```

### 4. Type Safety
Ensure `build()` returns complete types:
```typescript
build(): MyEntity {
  if (!this.data.requiredField) {
    throw new Error('Missing required field');
  }
  return this.data as MyEntity;
}
```

### 5. Test Isolation
Each `build()` should create independent instances:
```typescript
const user1 = aUser().build();
const user2 = aUser().build();
// user1 and user2 are independent
```

## Anti-Patterns

### ❌ Don't: Mutate Data After Build
```typescript
const user = aUser().build();
user.name = 'Changed'; // Don't modify after build
```

### ❌ Don't: Share Builder Instances
```typescript
const builder = aUser();
const user1 = builder.build();
const user2 = builder.build(); // Creates same data
```

### ✅ Do: Create New Builder Each Time
```typescript
const user1 = aUser().build();
const user2 = aUser().build(); // Independent
```

