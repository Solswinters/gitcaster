# ADR 0002: Implementing Dependency Injection

## Status

Accepted

## Context

With layered architecture, we need a way to manage dependencies between layers without creating tight coupling. Services in the Application layer need to depend on Repository interfaces from the Domain layer, while Infrastructure provides implementations.

## Decision

We will implement a lightweight **Dependency Injection Container** that:

- Registers services by string keys
- Supports singleton and transient lifetimes
- Resolves dependencies at runtime
- Remains simple and TypeScript-friendly

## Consequences

### Positive

- **Decoupling**: Layers depend on interfaces, not implementations
- **Testability**: Easy to inject mocks for testing
- **Flexibility**: Can swap implementations without changing code
- **Type Safety**: Full TypeScript support

### Negative

- **Runtime Resolution**: Dependencies resolved at runtime, not compile-time
- **Learning Curve**: Team must understand DI pattern
- **Potential Overhead**: Small performance cost for resolution

## Implementation

```typescript
// Register
container.registerSingleton(
  SERVICE_KEYS.USER_REPOSITORY,
  PrismaUserRepository
);

// Resolve
const userRepo = container.resolve<IUserRepository>(
  SERVICE_KEYS.USER_REPOSITORY
);
```

## Alternatives Considered

1. **No DI (Direct Imports)**
   - Rejected: creates tight coupling

2. **Full DI Framework (InversifyJS)**
   - Rejected: too heavy, decorator-based

3. **React Context for DI**
   - Rejected: mixes concerns, only works in React

## References

- Dependency Injection Principles by Mark Seemann
- TypeScript Dependency Injection patterns

