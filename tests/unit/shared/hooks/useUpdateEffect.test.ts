import { renderHook } from '@testing-library/react';
import { useUpdateEffect } from '@/shared/hooks/useUpdateEffect';

describe('useUpdateEffect', () => {
  it('does not run effect on initial mount', () => {
    const effect = jest.fn();

    renderHook(() => useUpdateEffect(effect));

    expect(effect).not.toHaveBeenCalled();
  });

  it('runs effect on subsequent updates', () => {
    const effect = jest.fn();

    const { rerender } = renderHook(
      ({ count }) => useUpdateEffect(effect, [count]),
      { initialProps: { count: 0 } }
    );

    expect(effect).not.toHaveBeenCalled();

    // Trigger update
    rerender({ count: 1 });

    expect(effect).toHaveBeenCalledTimes(1);
  });

  it('runs effect multiple times on multiple updates', () => {
    const effect = jest.fn();

    const { rerender } = renderHook(
      ({ count }) => useUpdateEffect(effect, [count]),
      { initialProps: { count: 0 } }
    );

    rerender({ count: 1 });
    rerender({ count: 2 });
    rerender({ count: 3 });

    expect(effect).toHaveBeenCalledTimes(3);
  });

  it('does not run effect when dependencies do not change', () => {
    const effect = jest.fn();

    const { rerender } = renderHook(
      ({ count }) => useUpdateEffect(effect, [count]),
      { initialProps: { count: 0 } }
    );

    rerender({ count: 0 });
    rerender({ count: 0 });

    expect(effect).not.toHaveBeenCalled();
  });

  it('calls cleanup function', () => {
    const cleanup = jest.fn();
    const effect = jest.fn(() => cleanup);

    const { rerender, unmount } = renderHook(
      ({ count }) => useUpdateEffect(effect, [count]),
      { initialProps: { count: 0 } }
    );

    rerender({ count: 1 });
    expect(cleanup).not.toHaveBeenCalled();

    rerender({ count: 2 });
    expect(cleanup).toHaveBeenCalledTimes(1);

    unmount();
    expect(cleanup).toHaveBeenCalledTimes(2);
  });
});

