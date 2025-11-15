# Application Layer

The application layer contains business logic, use cases, and orchestrates the flow between presentation and domain layers.

## Structure

```
application/
├── services/   # Business services
├── hooks/      # React hooks for state management
├── stores/     # State management stores
└── use-cases/  # Application workflows
```

## Responsibilities

- Implementing business workflows
- Coordinating domain entities
- Managing application state
- Providing hooks for presentation layer
- Error handling and logging

## Dependencies

- Can depend on: Domain, Infrastructure layers
- Used by: Presentation layer

## Best Practices

1. Keep business logic testable
2. Use dependency injection for services
3. Handle errors gracefully
4. Log important operations
5. Keep hooks focused and reusable
6. Document complex workflows

## Example Service

```typescript
import { IUserRepository } from '@/domain/repositories';
import { container, SERVICE_KEYS } from '@/infrastructure/di';

export class UserService {
  private userRepo: IUserRepository;
  
  constructor() {
    this.userRepo = container.resolve(SERVICE_KEYS.USER_REPOSITORY);
  }
  
  async getUserProfile(userId: string) {
    return await this.userRepo.findById(userId);
  }
}
```

