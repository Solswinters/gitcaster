# Domain Layer

The domain layer contains the core business entities, value objects, and business rules. It is independent of all other layers.

## Structure

```
domain/
├── entities/      # Core business entities
├── repositories/  # Repository interfaces
└── validators/    # Business rule validators
```

## Responsibilities

- Defining business entities and their behavior
- Enforcing business rules
- Defining data access contracts (repositories)
- Value object implementations
- Domain-specific validation

## Dependencies

- Cannot depend on any other layers
- Pure domain logic only

## Best Practices

1. Keep entities framework-agnostic
2. Encapsulate business rules
3. Use value objects for complex types
4. Define clear interfaces
5. Validate at domain boundaries
6. Document business logic

## Example Entity

```typescript
export interface UserProfile {
  id: string;
  slug: string;
  displayName: string | null;
  bio: string | null;
  walletAddress: string;
  githubUsername: string | null;
  createdAt: string;
  updatedAt: string;
}

export function isProfileComplete(profile: UserProfile): boolean {
  return !!(
    profile.displayName &&
    profile.bio &&
    profile.githubUsername
  );
}
```

