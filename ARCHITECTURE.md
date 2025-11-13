# Architecture Overview

## Project Structure

GitCaster follows a feature-based architecture with clear separation of concerns.

```
gitcaster/
├── src/
│   ├── app/                  # Next.js App Router (pages & API routes)
│   ├── features/             # Feature modules (domain logic)
│   │   ├── auth/            # Authentication feature
│   │   │   ├── types/       # Auth-specific types
│   │   │   ├── services/    # Auth API services
│   │   │   ├── hooks/       # Auth React hooks
│   │   │   └── utils/       # Auth utilities
│   │   ├── github/          # GitHub integration
│   │   │   ├── types/       # GitHub types
│   │   │   ├── services/    # GitHub API services
│   │   │   ├── hooks/       # GitHub hooks
│   │   │   └── utils/       # GitHub utilities
│   │   ├── profile/         # User profiles
│   │   │   ├── types/       # Profile types
│   │   │   ├── services/    # Profile services
│   │   │   ├── hooks/       # Profile hooks
│   │   │   └── utils/       # Profile utilities
│   │   └── search/          # Developer search
│   │       ├── types/       # Search types
│   │       ├── services/    # Search services
│   │       ├── hooks/       # Search hooks
│   │       └── utils/       # Search utilities
│   ├── shared/              # Shared across features
│   │   ├── components/      # Reusable UI components
│   │   │   ├── loading/    # Loading indicators
│   │   │   ├── error/      # Error components
│   │   │   ├── feedback/   # Toasts, alerts
│   │   │   ├── layout/     # Layout components
│   │   │   └── ui/         # 20+ UI components
│   │   ├── hooks/          # 15+ custom React hooks
│   │   ├── contexts/       # React context providers
│   │   ├── middleware/     # API middleware utilities
│   │   ├── services/       # Shared services (API clients)
│   │   ├── constants/      # App-wide constants
│   │   ├── test-utils/     # Testing utilities
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Comprehensive utility library
│   │       ├── errors/     # Error handling
│   │       ├── validation/ # Form & data validation
│   │       ├── formatting/ # Number, date, string formatting
│   │       ├── async/      # Async utilities
│   │       ├── cache/      # Memory caching
│   │       ├── logger/     # Logging utilities
│   │       ├── analytics/  # Analytics tracking
│   │       ├── performance/# Performance monitoring
│   │       ├── storage/    # Browser storage
│   │       ├── array/      # Array utilities
│   │       ├── object/     # Object utilities
│   │       ├── env/        # Environment utilities
│   │       ├── url/        # URL utilities
│   │       └── string/     # String utilities
│   ├── components/          # Legacy/page-specific components
│   ├── lib/                 # Legacy utilities (being migrated)
│   └── types/               # Legacy types (being migrated)
├── tests/                   # Test suites
├── prisma/                  # Database schema
└── public/                  # Static assets
```

## Design Principles

### 1. Feature-Based Organization
Each feature is self-contained with its own:
- Types & interfaces
- Services & API clients
- React hooks
- Utility functions
- Components (when feature-specific)

### 2. Separation of Concerns
- **Features**: Domain logic and business rules
- **Shared**: Reusable utilities and components
- **App**: Routing and page composition
- **Tests**: Comprehensive test coverage

### 3. Type Safety
- Strict TypeScript throughout
- Shared type definitions
- Type guards and validation

### 4. Error Handling
- Centralized error service
- Consistent error types
- Recovery strategies (retry, fallback, circuit breaker)

### 5. State Management
- React hooks for local state
- Server state via API calls
- localStorage for persistence
- No global state library (yet)

## Data Flow

### Client-Side
```
Component
  ↓
Custom Hook (useAuth, useProfile)
  ↓
Service (authService, profileService)
  ↓
API Client (shared/services/apiClient)
  ↓
API Route (/api/*)
```

### Server-Side
```
API Route
  ↓
Business Logic
  ↓
Prisma Client
  ↓
Database
```

## Key Patterns

### Service Layer Pattern
Each feature has a service class managing API calls:
```typescript
export class AuthService {
  async getNonce(address: string): Promise<string> {
    // API call logic
  }
}

export const authService = AuthService.getInstance();
```

### Custom Hooks Pattern
Features expose React hooks for state management:
```typescript
export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  // Hook logic
  return { session, isAuthenticated, logout };
}
```

### Barrel Exports
Each module has an index.ts for clean imports:
```typescript
// features/auth/index.ts
export * from './types';
export * from './services';
export * from './hooks';
```

## Testing Strategy

### Unit Tests
- Utility functions
- Service methods
- Validation logic

### Integration Tests
- API routes
- Database interactions
- Feature workflows

### E2E Tests
- Critical user journeys
- Authentication flows
- Profile creation

## Migration Strategy

### Phase 1: Foundation ✅
- Create shared utilities
- Establish type system
- Set up error handling

### Phase 2: Features (In Progress)
- Organize into feature modules
- Create services and hooks
- Migrate components

### Phase 3: Testing
- Add unit tests
- Expand integration tests
- E2E coverage

### Phase 4: Optimization
- Performance improvements
- Code splitting
- Bundle optimization

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (NativeWind)
- **State**: React Hooks
- **Web3**: Wagmi v2 + Viem + Reown AppKit

### Backend
- **Runtime**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: SIWE + Iron Session

### Testing
- **Unit**: Jest
- **Integration**: Jest + Supertest
- **E2E**: Playwright
- **Utilities**: Testing Library

### DevOps
- **Hosting**: Vercel
- **Database**: Railway
- **CI/CD**: GitHub Actions
- **Monitoring**: Built-in (planned)

## Code Quality

### Standards
- ESLint for linting
- Prettier for formatting (via Tailwind)
- Conventional commits
- File size limits (500 lines recommended)

### Type Safety
- Strict TypeScript mode
- No implicit any
- Type guards for runtime checks

### Error Handling
- Try-catch in async operations
- Error boundaries for React
- Centralized error logging

## Future Considerations

### Scalability
- Consider state management library if complexity grows
- Implement caching strategy (Redis)
- Add CDN for static assets

### Performance
- Code splitting by feature
- Lazy loading components
- Image optimization
- API response caching

### Monitoring
- Error tracking (Sentry)
- Performance monitoring
- User analytics
- API metrics

## Contributing

When adding new features:
1. Follow the feature module structure
2. Add types first
3. Implement services
4. Create hooks
5. Add tests
6. Document in README
7. Update this architecture doc if needed

