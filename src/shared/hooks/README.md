# Shared Hooks

A comprehensive collection of reusable React hooks for GitCaster.

## Overview

This directory contains custom React hooks that encapsulate common patterns and functionality. All hooks are fully tested, documented, and production-ready.

## Categories

### Value Hooks

Hooks for managing and transforming values.

#### useDebounce

Debounce a value, delaying updates until after a specified delay.

```tsx
import { useDebounce } from '@/shared/hooks';

const SearchComponent = () => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    // This only runs 500ms after user stops typing
    performSearch(debouncedSearch);
  }, [debouncedSearch]);

  return <input value={search} onChange={(e) => setSearch(e.target.value)} />;
};
```

#### useThrottle

Throttle a value, ensuring updates at most once per specified interval.

```tsx
import { useThrottle } from '@/shared/hooks';

const ScrollComponent = () => {
  const [scrollY, setScrollY] = useState(0);
  const throttledScroll = useThrottle(scrollY, 100);

  useEffect(() => {
    // This runs at most once per 100ms
    updateScrollIndicator(throttledScroll);
  }, [throttledScroll]);
};
```

#### usePrevious

Get the previous value of a state or prop.

```tsx
import { usePrevious } from '@/shared/hooks';

const Counter = ({ count }: { count: number }) => {
  const prevCount = usePrevious(count);

  return (
    <div>
      Current: {count}, Previous: {prevCount}
    </div>
  );
};
```

### State Hooks

Hooks for managing component state.

#### useLocalStorage

Persist state to localStorage with automatic serialization.

```tsx
import { useLocalStorage } from '@/shared/hooks';

const Settings = () => {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle Theme: {theme}
    </button>
  );
};
```

#### useToggle

Toggle boolean state with convenience methods.

```tsx
import { useToggle } from '@/shared/hooks';

const Modal = () => {
  const [isOpen, toggle, setOpen] = useToggle(false);

  return (
    <>
      <button onClick={toggle}>Toggle Modal</button>
      <button onClick={() => setOpen(true)}>Open Modal</button>
      {isOpen && <ModalContent onClose={() => setOpen(false)} />}
    </>
  );
};
```

### Effect Hooks

Hooks for managing side effects.

#### useEffectOnce

Run effect only once on mount.

```tsx
import { useEffectOnce } from '@/shared/hooks';

const Analytics = () => {
  useEffectOnce(() => {
    trackPageView();
  });

  return <div>Content</div>;
};
```

#### useUpdateEffect

Run effect only on updates, not on initial mount.

```tsx
import { useUpdateEffect } from '@/shared/hooks';

const Form = ({ values }: { values: FormValues }) => {
  useUpdateEffect(() => {
    // Only runs when values change, not on mount
    console.log('Form values changed:', values);
  }, [values]);
};
```

#### useInterval

Run callback at regular intervals.

```tsx
import { useInterval } from '@/shared/hooks';

const Timer = () => {
  const [count, setCount] = useState(0);

  useInterval(() => {
    setCount((c) => c + 1);
  }, 1000);

  return <div>Elapsed: {count}s</div>;
};
```

### Component Hooks

Hooks for component-level functionality.

#### useMountedState

Check if component is currently mounted.

```tsx
import { useMountedState } from '@/shared/hooks';

const DataFetcher = () => {
  const isMounted = useMountedState();
  const [data, setData] = useState(null);

  const fetchData = async () => {
    const result = await api.getData();
    if (isMounted()) {
      setData(result);
    }
  };
};
```

#### useMediaQuery

Respond to CSS media queries.

```tsx
import { useMediaQuery } from '@/shared/hooks';

const ResponsiveComponent = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');

  return <div>{isMobile ? <MobileView /> : <DesktopView />}</div>;
};
```

#### useClickOutside

Detect clicks outside an element.

```tsx
import { useClickOutside } from '@/shared/hooks';

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setIsOpen(false));

  return (
    <div ref={ref}>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
      {isOpen && <DropdownMenu />}
    </div>
  );
};
```

#### useOnScreen

Detect when element is visible on screen.

```tsx
import { useOnScreen } from '@/shared/hooks';

const LazyImage = ({ src }: { src: string }) => {
  const ref = useRef<HTMLImageElement>(null);
  const isVisible = useOnScreen(ref);

  return <img ref={ref} src={isVisible ? src : placeholder} />;
};
```

#### useWindowSize

Get current window dimensions.

```tsx
import { useWindowSize } from '@/shared/hooks';

const ResponsiveGrid = () => {
  const { width, height } = useWindowSize();
  const columns = width > 1024 ? 4 : width > 768 ? 3 : 2;

  return <Grid columns={columns}>...</Grid>;
};
```

#### useEventListener

Attach event listeners with automatic cleanup.

```tsx
import { useEventListener } from '@/shared/hooks';

const KeyboardShortcuts = () => {
  useEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
};
```

#### useKeyPress

Detect specific key presses.

```tsx
import { useKeyPress, useKeyCombo } from '@/shared/hooks';

const Editor = () => {
  const enterPressed = useKeyPress('Enter');
  const ctrlS = useKeyCombo(['Control', 's']);

  useEffect(() => {
    if (enterPressed) {
      submitForm();
    }
    if (ctrlS) {
      saveDocument();
    }
  }, [enterPressed, ctrlS]);
};
```

### Utility Hooks

General-purpose utility hooks.

#### useCopyToClipboard

Copy text to clipboard.

```tsx
import { useCopyToClipboard } from '@/shared/hooks';

const ShareButton = ({ url }: { url: string }) => {
  const { copy, copied } = useCopyToClipboard();

  return (
    <button onClick={() => copy(url)}>
      {copied ? 'Copied!' : 'Copy Link'}
    </button>
  );
};
```

#### useToast

Show toast notifications.

```tsx
import { useToast } from '@/shared/hooks';

const Form = () => {
  const { showToast } = useToast();

  const handleSubmit = async () => {
    try {
      await saveData();
      showToast('Saved successfully!', 'success');
    } catch (error) {
      showToast('Failed to save', 'error');
    }
  };
};
```

### Form Hooks

Hooks for form management.

#### useForm

Manage form state and validation.

```tsx
import { useForm } from '@/shared/hooks';

const LoginForm = () => {
  const { values, errors, handleChange, handleSubmit, isSubmitting } = useForm({
    initialValues: { email: '', password: '' },
    validate: (values) => {
      const errors: Record<string, string> = {};
      if (!values.email) errors.email = 'Required';
      if (!values.password) errors.password = 'Required';
      return errors;
    },
    onSubmit: async (values) => {
      await login(values);
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        value={values.email}
        onChange={handleChange}
      />
      {errors.email && <span>{errors.email}</span>}
      {/* ... */}
    </form>
  );
};
```

### Async Hooks

Hooks for managing asynchronous operations.

#### useAsync

Manage async operations with loading and error states.

```tsx
import { useAsync } from '@/shared/hooks';

const UserProfile = ({ userId }: { userId: string }) => {
  const { data, loading, error, execute } = useAsync(
    () => fetchUser(userId),
    [userId]
  );

  if (loading) return <Loader />;
  if (error) return <Error message={error.message} />;
  if (!data) return null;

  return <Profile user={data} />;
};
```

## Best Practices

### 1. Use Appropriate Hook for the Use Case

```tsx
// ✅ Good: Use debounce for search
const debouncedSearch = useDebounce(search, 500);

// ✅ Good: Use throttle for scroll
const throttledScroll = useThrottle(scrollY, 100);

// ❌ Bad: Using wrong hook for use case
const throttledSearch = useThrottle(search, 500); // Should use debounce
```

### 2. Provide Meaningful Default Values

```tsx
// ✅ Good: Clear default
const [theme, setTheme] = useLocalStorage('theme', 'light');

// ❌ Bad: Unclear default
const [value, setValue] = useLocalStorage('key', null);
```

### 3. Handle Cleanup Properly

```tsx
// ✅ Good: Hook handles cleanup
useEventListener('scroll', handleScroll);

// ❌ Bad: Manual cleanup prone to errors
useEffect(() => {
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

### 4. Combine Hooks for Complex Logic

```tsx
// ✅ Good: Combine multiple hooks
const SearchWithHistory = () => {
  const [search, setSearch] = useState('');
  const [history, setHistory] = useLocalStorage<string[]>('search-history', []);
  const debouncedSearch = useDebounce(search, 500);

  useUpdateEffect(() => {
    if (debouncedSearch) {
      setHistory([...history, debouncedSearch]);
      performSearch(debouncedSearch);
    }
  }, [debouncedSearch]);
};
```

### 5. Use TypeScript for Type Safety

```tsx
// ✅ Good: Typed hook usage
const [user, setUser] = useLocalStorage<User>('user', null);

// ❌ Bad: No types
const [user, setUser] = useLocalStorage('user', null);
```

## Testing

All hooks include comprehensive test coverage. Run tests with:

```bash
npm test -- src/shared/hooks
```

## Architecture

Hooks follow a consistent structure:

1. **Clear Purpose**: Each hook does one thing well
2. **Composable**: Hooks can be combined
3. **Documented**: JSDoc comments and examples
4. **Tested**: Comprehensive test coverage
5. **Type-Safe**: Full TypeScript support
6. **Clean**: Proper cleanup and memory management

## Contributing

When adding new hooks:

1. Create hook file in `src/shared/hooks/`
2. Add comprehensive JSDoc documentation
3. Export from `index.ts` in appropriate category
4. Create test file in `tests/unit/shared/hooks/`
5. Update this README with usage examples
6. Ensure TypeScript types are correct

## Related

- [Shared Components](../components/README.md)
- [Shared Utilities](../utils/README.md)
- [Feature Hooks](../../features/README.md)

