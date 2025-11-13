# Shared Module

This directory contains shared functionality used across the entire application.

## Structure

```
shared/
├── components/     # Reusable UI components
├── constants/      # Application constants
├── hooks/          # Custom React hooks
├── services/       # API and service clients
├── test-utils/     # Testing utilities
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## Components

### Loading Components
- `Loader` - Unified loading indicator with multiple variants
- `Skeleton` - Skeleton loaders for content placeholders
- `Progress` - Progress bars and indicators
- `LoadingContainer` - Containers with loading states

## Hooks

- `useAuth` - Authentication state management
- `useDebounce` - Debounce rapidly changing values
- `useLocalStorage` - Persist state in localStorage
- `useMediaQuery` - Responsive design helpers

## Services

- `apiClient` - Centralized HTTP client with retry logic

## Types

Organized by domain:
- `auth.ts` - Authentication types
- `github.ts` - GitHub integration types
- `profile.ts` - User profile types
- `integrations.ts` - Third-party integration types
- `common.ts` - Shared common types

## Utils

### Error Handling
- `ErrorService` - Centralized error management
- `retry`, `withTimeout`, `CircuitBreaker` - Error recovery

### Validation
- Form validation utilities
- Field validators
- Schema builders

### Formatting
- Number formatting (currency, percentages, file sizes)
- Date formatting (relative time, ISO, calendar)
- String manipulation

### Async Operations
- `sleep`, `debounce`, `throttle`
- `parallel`, `series` - Promise execution
- `AsyncQueue` - Queue management

### Collections
- Array utilities (unique, chunk, group, sort)
- Object utilities (pick, omit, merge, flatten)

## Usage

Import from the shared module:

```typescript
import {  
  Loader,
  useDebounce,
  apiClient,
  UserProfile,
  formatDate,
  validateEmail
} from '@/shared';
```

Or import from specific submodules:

```typescript
import { Loader } from '@/shared/components/loading';
import { useDebounce } from '@/shared/hooks';
import { formatDate } from '@/shared/utils/formatting';
```

