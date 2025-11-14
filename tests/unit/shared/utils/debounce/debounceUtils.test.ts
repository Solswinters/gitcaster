import { debounce, throttle } from '@/shared/utils/debounce/debounceUtils';

jest.useFakeTimers();

describe('Debounce Utils', () => {
  describe('debounce', () => {
    it('debounces function calls', () => {
      const func = jest.fn();
      const debounced = debounce(func, 100);

      debounced();
      debounced();
      debounced();

      expect(func).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);

      expect(func).toHaveBeenCalledTimes(1);
    });

    it('passes arguments correctly', () => {
      const func = jest.fn();
      const debounced = debounce(func, 100);

      debounced('test', 123);

      jest.advanceTimersByTime(100);

      expect(func).toHaveBeenCalledWith('test', 123);
    });

    it('cancels pending invocation', () => {
      const func = jest.fn();
      const debounced = debounce(func, 100);

      debounced();
      debounced.cancel();

      jest.advanceTimersByTime(100);

      expect(func).not.toHaveBeenCalled();
    });

    it('flushes pending invocation', () => {
      const func = jest.fn();
      const debounced = debounce(func, 100);

      debounced();
      debounced.flush();

      expect(func).toHaveBeenCalledTimes(1);
    });

    it('supports leading edge', () => {
      const func = jest.fn();
      const debounced = debounce(func, 100, { leading: true, trailing: false });

      debounced();

      expect(func).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(100);

      expect(func).toHaveBeenCalledTimes(1);
    });

    it('supports maxWait option', () => {
      const func = jest.fn();
      const debounced = debounce(func, 100, { maxWait: 200 });

      debounced();
      jest.advanceTimersByTime(50);
      debounced();
      jest.advanceTimersByTime(50);
      debounced();
      jest.advanceTimersByTime(50);
      debounced();
      jest.advanceTimersByTime(50);

      // Should have been called due to maxWait
      expect(func).toHaveBeenCalledTimes(1);
    });
  });

  describe('throttle', () => {
    it('throttles function calls', () => {
      const func = jest.fn();
      const throttled = throttle(func, 100);

      throttled();
      throttled();
      throttled();

      expect(func).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(100);

      expect(func).toHaveBeenCalledTimes(2);
    });

    it('supports leading edge', () => {
      const func = jest.fn();
      const throttled = throttle(func, 100, { leading: true });

      throttled();

      expect(func).toHaveBeenCalledTimes(1);
    });

    it('cancels pending invocation', () => {
      const func = jest.fn();
      const throttled = throttle(func, 100);

      throttled();
      throttled.cancel();

      jest.advanceTimersByTime(100);

      expect(func).toHaveBeenCalledTimes(1);
    });
  });
});

