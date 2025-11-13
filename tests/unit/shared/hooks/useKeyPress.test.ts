import { renderHook, act } from '@testing-library/react';
import { useKeyPress, useKeyCombo } from '@/shared/hooks/useKeyPress';

describe('useKeyPress', () => {
  it('returns false initially', () => {
    const { result } = renderHook(() => useKeyPress('Enter'));

    expect(result.current).toBe(false);
  });

  it('returns true when key is pressed', () => {
    const { result } = renderHook(() => useKeyPress('Enter'));

    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      window.dispatchEvent(event);
    });

    expect(result.current).toBe(true);
  });

  it('returns false when key is released', () => {
    const { result } = renderHook(() => useKeyPress('Enter'));

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    });

    expect(result.current).toBe(true);

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
    });

    expect(result.current).toBe(false);
  });

  it('ignores different keys', () => {
    const { result } = renderHook(() => useKeyPress('Enter'));

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });

    expect(result.current).toBe(false);
  });

  it('cleans up event listeners on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useKeyPress('Enter'));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keyup', expect.any(Function));
  });
});

describe('useKeyCombo', () => {
  it('returns false initially', () => {
    const { result } = renderHook(() => useKeyCombo(['Control', 's']));

    expect(result.current).toBe(false);
  });

  it('returns true when all keys are pressed', () => {
    const { result } = renderHook(() => useKeyCombo(['Control', 's']));

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Control' }));
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 's' }));
    });

    expect(result.current).toBe(true);
  });

  it('returns false when only some keys are pressed', () => {
    const { result } = renderHook(() => useKeyCombo(['Control', 'Shift', 's']));

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Control' }));
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 's' }));
    });

    expect(result.current).toBe(false);
  });

  it('returns false when keys are released', () => {
    const { result } = renderHook(() => useKeyCombo(['Control', 's']));

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Control' }));
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 's' }));
    });

    expect(result.current).toBe(true);

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keyup', { key: 'Control' }));
    });

    expect(result.current).toBe(false);
  });

  it('handles order-independent key combinations', () => {
    const { result } = renderHook(() => useKeyCombo(['Control', 'Shift', 's']));

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 's' }));
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Control' }));
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Shift' }));
    });

    expect(result.current).toBe(true);
  });
});

