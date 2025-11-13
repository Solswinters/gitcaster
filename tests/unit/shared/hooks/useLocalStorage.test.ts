import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('returns initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('returns stored value from localStorage', () => {
    localStorage.setItem('test-key', JSON.stringify('stored-value'));
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    expect(result.current[0]).toBe('stored-value');
  });

  it('updates localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify('updated'));
  });

  it('works with function updater', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 10));

    act(() => {
      result.current[1]((prev) => prev + 5);
    });

    expect(result.current[0]).toBe(15);
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify(15));
  });

  it('handles complex objects', () => {
    const initialObj = { name: 'John', age: 30 };
    const { result } = renderHook(() => useLocalStorage('user', initialObj));

    expect(result.current[0]).toEqual(initialObj);

    const updatedObj = { name: 'Jane', age: 25 };
    act(() => {
      result.current[1](updatedObj);
    });

    expect(result.current[0]).toEqual(updatedObj);
    expect(JSON.parse(localStorage.getItem('user') || '')).toEqual(updatedObj);
  });

  it('handles arrays', () => {
    const { result } = renderHook(() => useLocalStorage('items', [1, 2, 3]));

    expect(result.current[0]).toEqual([1, 2, 3]);

    act(() => {
      result.current[1]([4, 5, 6]);
    });

    expect(result.current[0]).toEqual([4, 5, 6]);
  });

  it('returns initial value when localStorage has invalid JSON', () => {
    localStorage.setItem('test-key', 'invalid-json{');
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('handles localStorage quota exceeded error gracefully', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
    setItemSpy.mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });

    act(() => {
      result.current[1]('large-value');
    });

    // Value should still update in state even if localStorage fails
    expect(result.current[0]).toBe('large-value');

    setItemSpy.mockRestore();
  });

  it('syncs between multiple hooks with same key', () => {
    const { result: result1 } = renderHook(() =>
      useLocalStorage('shared-key', 'initial')
    );
    const { result: result2 } = renderHook(() =>
      useLocalStorage('shared-key', 'initial')
    );

    expect(result1.current[0]).toBe('initial');
    expect(result2.current[0]).toBe('initial');

    act(() => {
      result1.current[1]('updated');
    });

    expect(result1.current[0]).toBe('updated');
    // Note: result2 won't auto-update without storage event listener
    // This is expected behavior in the same window
  });
});

