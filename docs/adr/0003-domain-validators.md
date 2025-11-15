# ADR 0003: Domain-Level Validation

## Status

Accepted

## Context

Validation is currently scattered across components, API routes, and utilities. We need a consistent approach to validate business rules that:

- Enforces domain constraints
- Provides clear error messages
- Can be reused across layers
- Is framework-independent

## Decision

We will implement **Domain Validators** in the Domain layer that:

- Define business rule validation functions
- Return structured `ValidationResult` objects
- Are pure functions with no side effects
- Can be composed for complex validations

## Consequences

### Positive

- **Single Source of Truth**: Business rules in one place
- **Reusability**: Same validators work everywhere
- **Clarity**: Explicit validation rules
- **Testing**: Easy to unit test validators

### Negative

- **Duplication**: Some overlap with schema validation (Zod, Yup)
- **Maintenance**: Must keep validators in sync with requirements

## Implementation

```typescript
export function validateUserProfile(
  profile: Partial<UserProfile>
): ValidationResult {
  const errors: string[] = [];
  
  if (!isValidSlug(profile.slug)) {
    errors.push('Invalid slug format');
  }
  
  return { isValid: errors.length === 0, errors };
}
```

## Alternatives Considered

1. **Schema Validation Libraries (Zod)**
   - Still used for API validation
   - Domain validators for business logic

2. **Class Validators (class-validator)**
   - Rejected: decorator-based, ties to classes

3. **No Formal Validation**
   - Rejected: leads to inconsistency

## References

- Domain-Driven Design validation patterns
- Functional validation approaches

