/**
 * useOnScreen Hook
 * 
 * Detect if element is visible on screen using Intersection Observer
 */

'use client';

import { useEffect, useState, RefObject } from 'react';

interface Options {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

export function useOnScreen<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  options: Options = {}
): boolean {
  const [isOnScreen, setIsOnScreen] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsOnScreen(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return isOnScreen;
}

