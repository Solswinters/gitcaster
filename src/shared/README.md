# Shared Module

This directory contains shared, reusable code used throughout the application. It provides a comprehensive library of components, hooks, utilities, and services that promote code reuse and consistency.

## Structure

```
shared/
├── components/       # Shared React components
│   ├── loading/     # Loading indicators (Spinner, Skeleton, Progress)
│   ├── error/       # Error handling components (ErrorBoundary, ErrorDisplay)
│   ├── feedback/    # User feedback (Toast notifications)
│   ├── layout/      # Layout components (Container)
│   └── ui/          # UI components (Button, Input, Card, Modal, etc.)
├── hooks/           # Custom React hooks (15+ hooks)
├── contexts/        # React context providers (Toast, Theme)
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
│   ├── errors/      # Error handling utilities
│   ├── validation/  # Form and data validation
│   ├── formatting/  # Number, date, string formatting
│   ├── async/       # Async operation helpers
│   ├── cache/       # Caching utilities
│   ├── logger/      # Logging utilities
│   ├── analytics/   # Analytics tracking
│   ├── performance/ # Performance monitoring
│   └── storage/     # Browser storage utilities
├── middleware/      # API middleware utilities
├── constants/       # Application constants
├── services/        # Shared services (API clients, etc.)
└── test-utils/      # Testing utilities
```

## Components

### Loading Components
```typescript
import { 
  Spinner, 
  LoadingDots, 
  Skeleton, 
  Progress,
  LoadingContainer 
} from '@/shared/components/loading';
```

### UI Components
```typescript
import { 
  Button, 
  Input, 
  Select, 
  Textarea,
  Checkbox, 
  Radio, 
  Switch,
  Card, 
  Modal, 
  Alert,
  Badge, 
  Avatar,
  Tabs,
  Dropdown,
  Breadcrumbs,
  Tooltip
} from '@/shared/components/ui';
```

### Error Components
```typescript
import { 
  ErrorBoundary, 
  ErrorDisplay,
  InlineError,
  ErrorBanner,
  ErrorCard,
  PageError
} from '@/shared/components/error';
```

## Hooks

### State Management
- `useDebounce` - Debounce value changes
- `useLocalStorage` - Persist state to localStorage
- `useToggle` - Toggle boolean state
- `usePrevious` - Track previous value

### Form Handling
- `useForm` - Complete form management with validation
- `useAsync` - Manage async operations state

### UI Interactions
- `useClickOutside` - Detect clicks outside element
- `useOnScreen` - Detect if element is visible
- `useCopyToClipboard` - Copy text to clipboard
- `useToast` - Show toast notifications

### Utility Hooks
- `useMediaQuery` - Responsive design queries
- `useWindowSize` - Track window dimensions
- `useInterval` - Safe interval management

```typescript
import { 
  useDebounce, 
  useForm, 
  useAsync,
  useToggle,
  useClickOutside 
} from '@/shared/hooks';
```

## Utilities

### Error Handling
```typescript
import { ErrorService, withRetry } from '@/shared/utils/errors';
```

### Validation
```typescript
import { 
  isEmail, 
  isURL, 
  validateForm 
} from '@/shared/utils/validation';
```

### Formatting
```typescript
import { 
  formatNumber, 
  formatCurrency,
  formatDate,
  formatRelativeTime 
} from '@/shared/utils/formatting';
```

### Caching
```typescript
import { 
  MemoryCache, 
  apiCache,
  userProfileKey 
} from '@/shared/utils/cache';
```

### Logging & Analytics
```typescript
import { logger } from '@/shared/utils/logger';
import { analytics } from '@/shared/utils/analytics';

logger.info('User logged in', { userId: '123' });
analytics.trackSearch('react hooks', 10);
```

### Performance Monitoring
```typescript
import { performanceMonitor } from '@/shared/utils/performance';

await performanceMonitor.measure('data-fetch', async () => {
  return await fetchData();
});
```

## Middleware

```typescript
import { 
  withErrorHandling,
  validateQueryParams,
  paginatedResponse,
  AppError
} from '@/shared/middleware';
```

## Contexts

```typescript
import { 
  ToastProvider, 
  useToastContext,
  ThemeProvider,
  useThemeContext
} from '@/shared/contexts';
```

## Usage Examples

### Form with Validation
```tsx
const { values, errors, handleChange, handleSubmit } = useForm({
  initialValues: { email: '', password: '' },
  onSubmit: async (values) => {
    await login(values);
  },
  validate: (values) => {
    const errors: any = {};
    if (!isEmail(values.email)) errors.email = 'Invalid email';
    if (values.password.length < 8) errors.password = 'Too short';
    return errors;
  }
});
```

### Async Data Fetching
```tsx
const { execute, data, isLoading, error } = useAsync(fetchUsers);

useEffect(() => {
  execute();
}, []);

if (isLoading) return <Spinner />;
if (error) return <ErrorDisplay message={error.message} />;
return <UserList users={data} />;
```

### Toast Notifications
```tsx
const { addToast } = useToastContext();

addToast({
  message: 'Profile updated successfully!',
  variant: 'success',
  duration: 3000
});
```

## Guidelines

1. **Components**: Only add truly reusable components
2. **Hooks**: Follow React hooks naming conventions (`use*`)
3. **Utils**: Pure functions with no side effects
4. **Types**: Use TypeScript for complete type safety
5. **Testing**: Write comprehensive tests for all shared code
6. **Documentation**: Document all public APIs with JSDoc comments
7. **Examples**: Provide usage examples for complex utilities

## Testing

All shared code should have corresponding unit tests:

```bash
npm test src/shared
```

## Migration

See [MIGRATION_GUIDE.md](/docs/MIGRATION_GUIDE.md) for guidance on migrating from legacy components to the new shared system.
