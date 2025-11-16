/**
 * Tests for loading state hooks
 */

import { renderHook, act } from '@testing-library/react';
import { useLoadingState } from '../useLoadingState';
import { useMultipleLoading } from '../useMultipleLoading';

describe('Loading Hooks', () => {
  describe('useLoadingState', () => {
    it('initializes with default false state', () => {
      const { result } = renderHook(() => useLoadingState());
      expect(result.current.isLoading).toBe(false);
    });

    it('initializes with custom initial state', () => {
      const { result } = renderHook(() => useLoadingState(true));
      expect(result.current.isLoading).toBe(true);
    });

    it('starts loading', () => {
      const { result } = renderHook(() => useLoadingState());
      act(() => {
        result.current.startLoading();
      });
      expect(result.current.isLoading).toBe(true);
    });

    it('stops loading', () => {
      const { result } = renderHook(() => useLoadingState(true));
      act(() => {
        result.current.stopLoading();
      });
      expect(result.current.isLoading).toBe(false);
    });

    it('toggles loading', () => {
      const { result } = renderHook(() => useLoadingState());
      act(() => {
        result.current.toggleLoading();
      });
      expect(result.current.isLoading).toBe(true);
      act(() => {
        result.current.toggleLoading();
      });
      expect(result.current.isLoading).toBe(false);
    });

    it('wraps async function with loading state', async () => {
      const { result } = renderHook(() => useLoadingState());
      const asyncFn = jest.fn().mockResolvedValue('success');

      await act(async () => {
        await result.current.withLoading(asyncFn);
      });

      expect(asyncFn).toHaveBeenCalled();
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('useMultipleLoading', () => {
    it('initializes with empty states', () => {
      const { result } = renderHook(() => useMultipleLoading());
      expect(result.current.loadingStates).toEqual({});
      expect(result.current.isAnyLoading).toBe(false);
    });

    it('initializes with custom states', () => {
      const initialStates = { key1: true, key2: false };
      const { result } = renderHook(() => useMultipleLoading(initialStates));
      expect(result.current.loadingStates).toEqual(initialStates);
      expect(result.current.isAnyLoading).toBe(true);
    });

    it('checks loading state for specific key', () => {
      const { result } = renderHook(() => useMultipleLoading());
      expect(result.current.isLoading('test')).toBe(false);
    });

    it('starts loading for specific key', () => {
      const { result } = renderHook(() => useMultipleLoading());
      act(() => {
        result.current.startLoading('test');
      });
      expect(result.current.isLoading('test')).toBe(true);
      expect(result.current.isAnyLoading).toBe(true);
    });

    it('stops loading for specific key', () => {
      const { result } = renderHook(() => useMultipleLoading({ test: true }));
      act(() => {
        result.current.stopLoading('test');
      });
      expect(result.current.isLoading('test')).toBe(false);
      expect(result.current.isAnyLoading).toBe(false);
    });

    it('toggles loading for specific key', () => {
      const { result } = renderHook(() => useMultipleLoading());
      act(() => {
        result.current.toggleLoading('test');
      });
      expect(result.current.isLoading('test')).toBe(true);
      act(() => {
        result.current.toggleLoading('test');
      });
      expect(result.current.isLoading('test')).toBe(false);
    });

    it('resets all loading states', () => {
      const { result } = renderHook(() =>
        useMultipleLoading({ key1: true, key2: true })
      );
      act(() => {
        result.current.reset();
      });
      expect(result.current.loadingStates).toEqual({});
      expect(result.current.isAnyLoading).toBe(false);
    });

    it('detects when any key is loading', () => {
      const { result } = renderHook(() => useMultipleLoading());
      expect(result.current.isAnyLoading).toBe(false);
      act(() => {
        result.current.startLoading('test1');
      });
      expect(result.current.isAnyLoading).toBe(true);
      act(() => {
        result.current.startLoading('test2');
      });
      expect(result.current.isAnyLoading).toBe(true);
      act(() => {
        result.current.stopLoading('test1');
      });
      expect(result.current.isAnyLoading).toBe(true);
      act(() => {
        result.current.stopLoading('test2');
      });
      expect(result.current.isAnyLoading).toBe(false);
    });
  });
});

