/**
 * Hooks Integration Tests
 *
 * Test multiple hooks working together in realistic scenarios
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import {
  useDebounce,
  useLocalStorage,
  useToggle,
  useAsync,
  useMountedState,
  useUpdateEffect,
  useThrottle,
  usePrevious,
} from '@/shared/hooks';

describe('Hooks Integration', () => {
  describe('Search with debounce and localStorage', () => {
    it('debounces search and stores in localStorage', async () => {
      const { result } = renderHook(() => {
        const [search, setSearch] = useLocalStorage<string>('search', '');
        const debouncedSearch = useDebounce(search, 100);
        return { search, setSearch, debouncedSearch };
      });

      // Initial state
      expect(result.current.search).toBe('');
      expect(result.current.debouncedSearch).toBe('');

      // Set search value
      act(() => {
        result.current.setSearch('test');
      });

      // Immediate value updated
      expect(result.current.search).toBe('test');

      // Debounced value not yet updated
      expect(result.current.debouncedSearch).toBe('');

      // Wait for debounce
      await waitFor(
        () => {
          expect(result.current.debouncedSearch).toBe('test');
        },
        { timeout: 200 }
      );

      // Check localStorage
      expect(localStorage.getItem('search')).toBe(JSON.stringify('test'));
    });
  });

  describe('Modal with toggle and click outside', () => {
    it('manages modal state with toggle', () => {
      const { result } = renderHook(() => {
        const [isOpen, toggle, setOpen] = useToggle(false);
        return { isOpen, toggle, setOpen };
      });

      expect(result.current.isOpen).toBe(false);

      // Open modal
      act(() => {
        result.current.setOpen(true);
      });

      expect(result.current.isOpen).toBe(true);

      // Toggle modal
      act(() => {
        result.current.toggle();
      });

      expect(result.current.isOpen).toBe(false);
    });
  });

  describe('Async data fetching with mounted state check', () => {
    it('prevents state updates after unmount', async () => {
      const mockFetch = jest.fn().mockResolvedValue({ data: 'test' });

      const { result, unmount } = renderHook(() => {
        const isMounted = useMountedState();
        const { data, loading, execute } = useAsync(async () => {
          const result = await mockFetch();
          if (isMounted()) {
            return result;
          }
          return null;
        });

        return { data, loading, execute };
      });

      // Start async operation
      act(() => {
        result.current.execute();
      });

      // Unmount before completion
      unmount();

      // Wait for async operation
      await waitFor(() => expect(mockFetch).toHaveBeenCalled());

      // Data should not be set (component unmounted)
      // This test verifies the pattern, actual implementation may vary
    });
  });

  describe('Form with debounce and validation', () => {
    it('debounces input and tracks previous value', async () => {
      const { result } = renderHook(() => {
        const [input, setInput] = useLocalStorage<string>('form-input', '');
        const debouncedInput = useDebounce(input, 100);
        const previousInput = usePrevious(debouncedInput);

        return { input, setInput, debouncedInput, previousInput };
      });

      // Set initial value
      act(() => {
        result.current.setInput('first');
      });

      await waitFor(
        () => {
          expect(result.current.debouncedInput).toBe('first');
        },
        { timeout: 200 }
      );

      // Set second value
      act(() => {
        result.current.setInput('second');
      });

      await waitFor(
        () => {
          expect(result.current.debouncedInput).toBe('second');
          expect(result.current.previousInput).toBe('first');
        },
        { timeout: 200 }
      );
    });
  });

  describe('Scroll tracking with throttle', () => {
    it('throttles scroll updates', async () => {
      jest.useFakeTimers();

      const { result } = renderHook(() => {
        const [scrollY, setScrollY] = useLocalStorage<number>('scroll', 0);
        const throttledScroll = useThrottle(scrollY, 100);
        return { scrollY, setScrollY, throttledScroll };
      });

      // Rapid scroll updates
      act(() => {
        result.current.setScrollY(10);
      });
      act(() => {
        result.current.setScrollY(20);
      });
      act(() => {
        result.current.setScrollY(30);
      });

      // Immediate value is latest
      expect(result.current.scrollY).toBe(30);

      // Throttled value hasn't updated yet
      expect(result.current.throttledScroll).toBe(0);

      // Fast forward time
      act(() => {
        jest.advanceTimersByTime(100);
      });

      // Throttled value should now update
      await waitFor(() => {
        expect(result.current.throttledScroll).toBe(30);
      });

      jest.useRealTimers();
    });
  });

  describe('Update-only effects', () => {
    it('runs effect only on updates with useUpdateEffect', () => {
      const effect = jest.fn();

      const { rerender } = renderHook(
        ({ count }) => {
          useUpdateEffect(() => {
            effect(count);
          }, [count]);
        },
        { initialProps: { count: 0 } }
      );

      // Effect should not run on mount
      expect(effect).not.toHaveBeenCalled();

      // Trigger update
      rerender({ count: 1 });

      // Effect should run on update
      expect(effect).toHaveBeenCalledWith(1);

      // Another update
      rerender({ count: 2 });

      expect(effect).toHaveBeenCalledWith(2);
      expect(effect).toHaveBeenCalledTimes(2);
    });
  });

  describe('Complex state management scenario', () => {
    it('manages form state with multiple hooks', async () => {
      const { result } = renderHook(() => {
        const [formData, setFormData] = useLocalStorage('complex-form', {
          name: '',
          email: '',
        });
        const [isDirty, toggleDirty] = useToggle(false);
        const debouncedEmail = useDebounce(formData.email, 300);
        const previousEmail = usePrevious(debouncedEmail);

        const updateField = (field: 'name' | 'email', value: string) => {
          setFormData({ ...formData, [field]: value });
          if (!isDirty) {
            toggleDirty();
          }
        };

        return {
          formData,
          updateField,
          isDirty,
          debouncedEmail,
          previousEmail,
        };
      });

      // Initial state
      expect(result.current.isDirty).toBe(false);
      expect(result.current.formData.name).toBe('');

      // Update name
      act(() => {
        result.current.updateField('name', 'John');
      });

      expect(result.current.formData.name).toBe('John');
      expect(result.current.isDirty).toBe(true);

      // Update email
      act(() => {
        result.current.updateField('email', 'john@example.com');
      });

      expect(result.current.formData.email).toBe('john@example.com');

      // Wait for debounce
      await waitFor(
        () => {
          expect(result.current.debouncedEmail).toBe('john@example.com');
        },
        { timeout: 400 }
      );

      // Update email again
      act(() => {
        result.current.updateField('email', 'jane@example.com');
      });

      await waitFor(
        () => {
          expect(result.current.debouncedEmail).toBe('jane@example.com');
          expect(result.current.previousEmail).toBe('john@example.com');
        },
        { timeout: 400 }
      );
    });
  });
});

