# ADR 0001: Adopting Layered Architecture

## Status

Accepted

## Context

The GitCaster codebase was initially organized in a feature-based structure with some mixing of concerns across different modules. As the project grows, we need a clear architectural pattern that:

- Enforces separation of concerns
- Makes dependencies explicit
- Improves testability
- Scales with team size
- Maintains code quality

## Decision

We will adopt a **Layered Architecture** pattern with four distinct layers:

1. **Presentation Layer** (`src/presentation/`)
   - UI components, pages, layouts
   - Depends on Application layer only

2. **Application Layer** (`src/application/`)
   - Business logic, use cases, services
   - Depends on Domain and Infrastructure layers

3. **Domain Layer** (`src/domain/`)
   - Core business entities, rules, interfaces
   - Independent of all other layers

4. **Infrastructure Layer** (`src/infrastructure/`)
   - External systems, databases, APIs
   - Implements Domain interfaces
   - Used by Application layer

## Consequences

### Positive

- **Clear Boundaries**: Each layer has explicit responsibilities
- **Testability**: Layers can be tested in isolation
- **Maintainability**: Changes in one layer don't cascade
- **Onboarding**: New developers understand structure quickly
- **Scalability**: Pattern works as team and codebase grow

### Negative

- **Migration Effort**: Existing code must be refactored
- **Learning Curve**: Team must understand layered architecture
- **Boilerplate**: More files and interfaces required
- **Initial Overhead**: Takes longer to set up new features

### Neutral

- **Shared Code**: Kept separate in `src/shared/` for cross-cutting concerns
- **Legacy Code**: Existing `src/lib/` and `src/components/` will be gradually migrated

## Implementation

- Created folder structure for all layers
- Added ESLint rules to enforce boundaries
- Created repository interfaces in Domain layer
- Implemented dependency injection container
- Added comprehensive documentation for each layer

## Alternatives Considered

1. **Hexagonal Architecture (Ports & Adapters)**
   - More complex, overkill for current needs
   - Would require more significant refactoring

2. **Clean Architecture**
   - Similar benefits but more rigid
   - Harder to explain to team

3. **Keep Current Structure**
   - Rejected: doesn't scale, mixing concerns

## References

- Domain-Driven Design by Eric Evans
- Clean Architecture by Robert C. Martin
- Layered Architecture Pattern (Microsoft)

