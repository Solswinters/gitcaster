import { renderHook, act } from '@testing-library/react';
import { useThrottle } from '@/shared/hooks/useThrottle';

describe('useThrottle', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useThrottle('initial', 500));

    expect(result.current).toBe('initial');
  });

  it('throttles value updates', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useThrottle(value, 500),
      { initialProps: { value: 'first' } }
    );

    expect(result.current).toBe('first');

    // Change value
    rerender({ value: 'second' });

    // Value shouldn't change immediately
    expect(result.current).toBe('first');

    // Fast forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Now value should be updated
    expect(result.current).toBe('second');
  });

  it('ignores rapid updates', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useThrottle(value, 500),
      { initialProps: { value: 'first' } }
    );

    // Rapid updates
    rerender({ value: 'second' });
    rerender({ value: 'third' });
    rerender({ value: 'fourth' });

    // Still showing first value
    expect(result.current).toBe('first');

    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Should show last value
    expect(result.current).toBe('fourth');
  });

  it('handles different delay values', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useThrottle(value, 1000),
      { initialProps: { value: 'first' } }
    );

    rerender({ value: 'second' });

    // After 500ms, still old value
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBe('first');

    // After 1000ms, new value
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBe('second');
  });
});

