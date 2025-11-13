# Shared Utilities

Comprehensive utility functions for GitCaster.

## Overview

The utilities library provides production-ready, tested functions for common operations across the application.

## Categories

### Error Handling (`errors/`)

Robust error handling system with recovery strategies, monitoring, and reporting.

[View Error Handling Documentation](./errors/README.md)

```typescript
import { AppError, ErrorCode, retry, withTimeout } from '@/shared/utils/errors';

const data = await retry(() => fetchData(), { maxAttempts: 3 });
```

### Validation (`validation/`)

Form and data validation utilities.

```typescript
import { isEmail, isURL, validateForm } from '@/shared/utils/validation';

const errors = validateForm(values, schema);
```

### String Utilities (`string/`)

String manipulation and transformation.

```typescript
import { capitalize, truncate, slugify } from '@/shared/utils/string';

const slug = slugify('Hello World!'); // 'hello-world'
```

### Number Utilities (`number/`)

Number manipulation and mathematical operations.

```typescript
import { clamp, roundTo, percentage, formatBytes } from '@/shared/utils/number';

const value = clamp(150, 0, 100); // 100
const size = formatBytes(1536); // '1.5 KB'
```

### Date Utilities (`date/`)

Date manipulation, formatting, and parsing.

```typescript
import { getRelativeTime, addDays, formatDateRange } from '@/shared/utils/date';

const relative = getRelativeTime(new Date()); // 'just now'
const future = addDays(new Date(), 7);
```

### Color Utilities (`color/`)

Color manipulation and conversion.

```typescript
import { hexToRgb, lighten, getContrastColor } from '@/shared/utils/color';

const rgb = hexToRgb('#FF0000');
const lighter = lighten('#FF0000', 20);
const textColor = getContrastColor('#FF0000'); // '#FFFFFF'
```

### DOM Utilities (`dom/`)

DOM manipulation and queries.

```typescript
import { querySelector, isInViewport, copyToClipboard } from '@/shared/utils/dom';

const element = querySelector('.my-element');
const isVisible = isInViewport(element);
await copyToClipboard('Hello World');
```

### Array Utilities (`array/`)

Array manipulation and operations.

```typescript
import { unique, groupBy, chunk, shuffle } from '@/shared/utils/array';

const items = unique([1, 2, 2, 3]); // [1, 2, 3]
const groups = groupBy(users, 'role');
```

### Object Utilities (`object/`)

Object manipulation and utilities.

```typescript
import { pick, omit, deepMerge, isEqual } from '@/shared/utils/object';

const subset = pick(user, ['name', 'email']);
const merged = deepMerge(defaults, overrides);
```

### Async Utilities (`async/`)

Asynchronous operation helpers.

```typescript
import { sleep, poll, timeout } from '@/shared/utils/async';

await sleep(1000);
const result = await poll(() => checkStatus(), { interval: 500 });
```

### Format Utilities (`formatting/`)

Data formatting utilities.

```typescript
import { formatNumber, formatDate, formatCurrency } from '@/shared/utils/formatting';

const formatted = formatNumber(1234567); // '1,234,567'
const price = formatCurrency(99.99, 'USD'); // '$99.99'
```

### URL Utilities (`url/`)

URL parsing and manipulation.

```typescript
import { buildURL, parseQueryString, updateQueryParams } from '@/shared/utils/url';

const url = buildURL('/api/users', { page: 1, limit: 10 });
const params = parseQueryString(window.location.search);
```

### Environment Utilities (`env/`)

Safe environment variable access.

```typescript
import { getEnv, requireEnv, isProduction } from '@/shared/utils/env';

const apiKey = requireEnv('NEXT_PUBLIC_API_KEY');
if (isProduction()) {
  // Production logic
}
```

### Logger (`logger/`)

Centralized logging.

```typescript
import { logger } from '@/shared/utils/logger';

logger.info('User logged in', { userId: '123' });
logger.error('API failed', error);
```

### Analytics (`analytics/`)

Analytics tracking.

```typescript
import { trackEvent, trackPageView } from '@/shared/utils/analytics';

trackEvent('button_click', { button: 'signup' });
trackPageView('/dashboard');
```

### Cache (`cache/`)

Memory caching with TTL.

```typescript
import { memoryCache } from '@/shared/utils/cache';

memoryCache.set('key', value, 60000); // 1 minute TTL
const cached = memoryCache.get('key');
```

### Performance (`performance/`)

Performance monitoring.

```typescript
import { performanceMonitor } from '@/shared/utils/performance';

performanceMonitor.mark('start');
// ... operation
performanceMonitor.measure('operation', 'start');
```

### Storage (`storage/`)

Browser storage utilities.

```typescript
import { getItem, setItem, removeItem } from '@/shared/utils/storage';

setItem('key', { data: 'value' });
const data = getItem<{ data: string }>('key');
```

## Best Practices

### 1. Import from Main Barrel

```typescript
// ✅ Good: Import from main utils
import { capitalize, formatNumber } from '@/shared/utils';

// ❌ Bad: Direct imports (harder to refactor)
import { capitalize } from '@/shared/utils/string/stringUtils';
```

### 2. Use TypeScript Types

```typescript
// ✅ Good: Type-safe usage
const value: number = clamp(150, 0, 100);

// ❌ Bad: No types
const value = clamp(150, 0, 100);
```

### 3. Handle Edge Cases

```typescript
// ✅ Good: Safe division
const ratio = safeDivide(a, b); // Returns 0 if b is 0

// ❌ Bad: Can cause division by zero
const ratio = a / b;
```

### 4. Use Error Recovery

```typescript
// ✅ Good: With retry
const data = await retry(() => fetchData(), { maxAttempts: 3 });

// ❌ Bad: No retry logic
const data = await fetchData();
```

### 5. Validate Input

```typescript
// ✅ Good: Validate before processing
if (isEmail(input)) {
  sendEmail(input);
}

// ❌ Bad: No validation
sendEmail(input);
```

## Testing

All utilities are thoroughly tested:

```bash
# Test all utilities
npm test -- src/shared/utils

# Test specific category
npm test -- src/shared/utils/string

# Test with coverage
npm test -- src/shared/utils --coverage
```

## Architecture

Utilities follow a consistent structure:

```
utils/
├── category/
│   ├── utilityName.ts      # Implementation
│   ├── index.ts            # Barrel export
│   └── README.md           # Category docs
├── index.ts                # Main barrel export
└── README.md               # This file
```

## Performance Considerations

- **Pure Functions**: Most utilities are pure functions (no side effects)
- **Memoization**: Expensive operations can be memoized
- **Tree Shaking**: Barrel exports support tree shaking
- **Type Safety**: Full TypeScript support prevents runtime errors

## Contributing

When adding new utilities:

1. Create utility file in appropriate category
2. Add comprehensive JSDoc documentation
3. Export from category `index.ts`
4. Export from main `index.ts`
5. Create test file
6. Update category README
7. Add usage examples

## Related

- [Shared Hooks](../hooks/README.md)
- [Shared Components](../components/README.md)
- [Feature Modules](../../features/README.md)

