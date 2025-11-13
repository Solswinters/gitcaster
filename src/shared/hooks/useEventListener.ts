/**
 * useEventListener Hook
 *
 * Attach event listeners with automatic cleanup
 *
 * @module shared/hooks/useEventListener
 */

import { useEffect, useRef } from 'react';

/**
 * Attach an event listener to a target element
 *
 * @param eventName - Name of the event
 * @param handler - Event handler function
 * @param element - Target element (defaults to window)
 * @param options - Event listener options
 *
 * @example
 * ```tsx
 * useEventListener('keydown', (e) => {
 *   if (e.key === 'Escape') {
 *     closeModal();
 *   }
 * });
 *
 * // Listen to element ref
 * const ref = useRef<HTMLDivElement>(null);
 * useEventListener('scroll', handleScroll, ref);
 * ```
 */
export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: RefObject<HTMLElement> | HTMLElement | Window | null,
  options?: boolean | AddEventListenerOptions
): void;

export function useEventListener<
  K extends keyof HTMLElementEventMap,
  T extends HTMLElement = HTMLDivElement
>(
  eventName: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  element?: RefObject<T> | T | null,
  options?: boolean | AddEventListenerOptions
): void;

export function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (event: DocumentEventMap[K]) => void,
  element?: RefObject<Document> | Document | null,
  options?: boolean | AddEventListenerOptions
): void;

export function useEventListener(
  eventName: string,
  handler: (event: Event) => void,
  element?: RefObject<HTMLElement | Document | Window> | HTMLElement | Document | Window | null,
  options?: boolean | AddEventListenerOptions
): void {
  // Create a ref that stores handler
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    // Define the listening target
    const targetElement =
      element && 'current' in element
        ? element.current
        : element || (typeof window !== 'undefined' ? window : null);

    if (!targetElement?.addEventListener) {
      return;
    }

    // Create event listener that calls handler function stored in ref
    const eventListener = (event: Event) => savedHandler.current(event);

    targetElement.addEventListener(eventName, eventListener, options);

    // Remove event listener on cleanup
    return () => {
      targetElement.removeEventListener(eventName, eventListener, options);
    };
  }, [eventName, element, options]);
}

type RefObject<T> = { current: T | null };

