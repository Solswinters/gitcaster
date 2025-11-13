import { renderHook } from '@testing-library/react';
import { useMountedState } from '@/shared/hooks/useMountedState';

describe('useMountedState', () => {
  it('returns true when component is mounted', () => {
    const { result } = renderHook(() => useMountedState());
    const isMounted = result.current;

    expect(isMounted()).toBe(true);
  });

  it('returns false after component unmounts', () => {
    const { result, unmount } = renderHook(() => useMountedState());
    const isMounted = result.current;

    expect(isMounted()).toBe(true);

    unmount();

    expect(isMounted()).toBe(false);
  });

  it('can be used to prevent state updates after unmount', async () => {
    let setState: ((value: string) => void) | null = null;
    const mockSetState = jest.fn((value: string) => value);

    const { result, unmount } = renderHook(() => {
      const isMounted = useMountedState();

      setState = (value: string) => {
        if (isMounted()) {
          mockSetState(value);
        }
      };

      return isMounted;
    });

    // Call setState while mounted
    setState?.('value1');
    expect(mockSetState).toHaveBeenCalledWith('value1');

    unmount();

    // Call setState after unmount
    setState?.('value2');
    // mockSetState should not be called again
    expect(mockSetState).toHaveBeenCalledTimes(1);
  });

  it('returns consistent function reference', () => {
    const { result, rerender } = renderHook(() => useMountedState());
    const firstRef = result.current;

    rerender();
    const secondRef = result.current;

    expect(firstRef).toBe(secondRef);
  });
});

