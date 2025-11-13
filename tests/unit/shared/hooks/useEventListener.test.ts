import { renderHook } from '@testing-library/react';
import { useEventListener } from '@/shared/hooks/useEventListener';
import { useRef } from 'react';

describe('useEventListener', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('attaches event listener to window by default', () => {
    const handler = jest.fn();
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

    renderHook(() => useEventListener('click', handler));

    expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function), undefined);
  });

  it('calls handler when event is triggered', () => {
    const handler = jest.fn();

    renderHook(() => useEventListener('click', handler));

    const event = new MouseEvent('click');
    window.dispatchEvent(event);

    expect(handler).toHaveBeenCalledWith(event);
  });

  it('removes event listener on unmount', () => {
    const handler = jest.fn();
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useEventListener('click', handler));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'click',
      expect.any(Function),
      undefined
    );
  });

  it('updates handler without re-attaching listener', () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

    const { rerender } = renderHook(
      ({ handler }) => useEventListener('click', handler),
      { initialProps: { handler: handler1 } }
    );

    const callCount = addEventListenerSpy.mock.calls.length;

    // Update handler
    rerender({ handler: handler2 });

    // addEventListener should not be called again
    expect(addEventListenerSpy).toHaveBeenCalledTimes(callCount);

    // New handler should be used
    window.dispatchEvent(new MouseEvent('click'));
    expect(handler1).not.toHaveBeenCalled();
    expect(handler2).toHaveBeenCalled();
  });

  it('passes options to addEventListener', () => {
    const handler = jest.fn();
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const options = { passive: true, capture: true };

    renderHook(() => useEventListener('scroll', handler, window, options));

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
      options
    );
  });
});

