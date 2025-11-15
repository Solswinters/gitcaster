# Code Style Guide

## Import Order

Organize imports in the following order:

1. External dependencies (React, Next.js, etc.)
2. Internal absolute imports (@/...)
3. Relative imports (../, ./)
4. Type imports
5. CSS/Style imports

```typescript
// 1. External
import React from 'react';
import { useRouter } from 'next/router';

// 2. Internal absolute
import { Button } from '@/shared/components/ui';
import { useAuth } from '@/application/hooks';
import { UserProfile } from '@/domain/entities';

// 3. Relative
import { helper } from '../utils';
import { LocalComponent } from './components';

// 4. Types
import type { ComponentProps } from 'react';

// 5. Styles
import styles from './styles.module.css';
```

## Naming Conventions

### Files and Directories
- Components: `PascalCase.tsx` (e.g., `UserProfile.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`)
- Constants: `UPPER_SNAKE_CASE.ts` or `kebab-case.ts`
- Tests: `*.test.ts` or `*.spec.ts`

### Variables and Functions
- Variables: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Functions: `camelCase`
- React Components: `PascalCase`
- Custom Hooks: `use + PascalCase`

```typescript
// Variables
const userName = 'John';
const MAX_RETRIES = 3;

// Functions
function calculateTotal() {}
const handleClick = () => {};

// Components
function UserProfile() {}
const Button = () => {};

// Hooks
function useUserProfile() {}
```

### Types and Interfaces
- Interfaces: `PascalCase` prefixed with `I` for domain interfaces
- Types: `PascalCase`
- Enums: `PascalCase`

```typescript
// Interfaces
interface IUserRepository {}
interface UserProfile {}

// Types
type Status = 'active' | 'inactive';
type ApiResponse<T> = { data: T };

// Enums
enum UserRole {
  Admin = 'ADMIN',
  User = 'USER',
}
```

## Component Structure

```typescript
// 1. Imports
import React from 'react';
import { useAuth } from '@/application/hooks';

// 2. Types/Interfaces
interface Props {
  userId: string;
  onClose: () => void;
}

// 3. Component
export function UserCard({ userId, onClose }: Props) {
  // 3a. Hooks
  const { user } = useAuth();
  
  // 3b. State
  const [loading, setLoading] = React.useState(false);
  
  // 3c. Effects
  React.useEffect(() => {
    // ...
  }, []);
  
  // 3d. Handlers
  const handleClick = () => {
    // ...
  };
  
  // 3e. Render helpers
  const renderContent = () => {
    // ...
  };
  
  // 3f. Render
  return (
    <div>
      {renderContent()}
    </div>
  );
}

// 4. Exports
export default UserCard;
```

## TypeScript Guidelines

### Use Strict Types
```typescript
// ✅ Good
function getUser(id: string): Promise<User | null> {
  // ...
}

// ❌ Avoid
function getUser(id: any): any {
  // ...
}
```

### Prefer Type Inference
```typescript
// ✅ Good
const count = 5;
const users = ['alice', 'bob'];

// ❌ Unnecessary
const count: number = 5;
const users: string[] = ['alice', 'bob'];
```

### Use Optional Chaining
```typescript
// ✅ Good
const name = user?.profile?.name;

// ❌ Avoid
const name = user && user.profile && user.profile.name;
```

## React Best Practices

### Use Functional Components
```typescript
// ✅ Good
export function UserProfile({ userId }: Props) {
  return <div>{userId}</div>;
}

// ❌ Avoid class components for new code
class UserProfile extends React.Component {}
```

### Extract Complex Logic to Hooks
```typescript
// ✅ Good
function useUserData(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  // Complex logic here
  return { user };
}

function UserProfile({ userId }: Props) {
  const { user } = useUserData(userId);
  return <div>{user?.name}</div>;
}
```

### Avoid Prop Drilling
```typescript
// ✅ Good - Use context or state management
const UserContext = createContext<User | null>(null);

// ❌ Avoid passing props through many levels
<GrandParent user={user}>
  <Parent user={user}>
    <Child user={user} />
  </Parent>
</GrandParent>
```

## Error Handling

### Always Handle Errors
```typescript
// ✅ Good
try {
  const data = await fetchData();
  return data;
} catch (error) {
  logger.error('Failed to fetch data', error);
  throw new AppError('Data fetch failed', error);
}

// ❌ Avoid silent failures
try {
  await fetchData();
} catch {}
```

### Use Type Guards
```typescript
// ✅ Good
function isUser(value: unknown): value is User {
  return typeof value === 'object' && value !== null && 'id' in value;
}

if (isUser(data)) {
  console.log(data.id);
}
```

## Comments and Documentation

### Use JSDoc for Public APIs
```typescript
/**
 * Fetches user profile by ID
 * @param userId - The unique user identifier
 * @returns Promise resolving to user profile or null
 * @throws {NotFoundError} When user doesn't exist
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  // ...
}
```

### Avoid Obvious Comments
```typescript
// ✅ Good - Explains WHY
// Using exponential backoff to handle rate limiting
await retry(fetchData, { backoff: 'exponential' });

// ❌ Bad - Explains WHAT (obvious from code)
// Increment counter by 1
counter++;
```

## File Size Guidelines

- Components: < 250 lines
- Utilities: < 150 lines
- Services: < 300 lines
- Maximum: 500 lines (split if exceeded)

## Testing

### Test File Naming
- Unit tests: `*.test.ts` or `*.test.tsx`
- Integration tests: `*.integration.test.ts`
- E2E tests: `*.e2e.ts`

### Test Structure
```typescript
describe('UserService', () => {
  describe('getUserProfile', () => {
    it('should return user profile when user exists', async () => {
      // Arrange
      const userId = '123';
      
      // Act
      const result = await userService.getUserProfile(userId);
      
      // Assert
      expect(result).toBeDefined();
      expect(result?.id).toBe(userId);
    });
  });
});
```

## Git Commit Messages

Follow Conventional Commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

Examples:
```
feat(auth): add OAuth login support
fix(profile): resolve avatar upload issue
docs(api): update endpoint documentation
refactor(user): extract validation logic
```

