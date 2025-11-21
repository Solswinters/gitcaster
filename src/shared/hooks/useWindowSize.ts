import { useState, useEffect } from 'react';

export interface WindowSize {
  width: number;
  height: number;
}

/**
 * Custom hook to track window size
 * Updates on window resize
 *
 * @example
 * const { width, height } = useWindowSize();
 * 
 * @returns WindowSize object with width and height
 */
export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Call handler immediately to set initial size
    handleResize();

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

/**
 * Hook to track if window width is below a breakpoint
 */
export function useIsBelowBreakpoint(breakpoint: number): boolean {
  const { width } = useWindowSize();
  return width < breakpoint;
}

/**
 * Hook to track if window width is above a breakpoint
 */
export function useIsAboveBreakpoint(breakpoint: number): boolean {
  const { width } = useWindowSize();
  return width >= breakpoint;
}

/**
 * Hook to get the current breakpoint name
 */
export function useBreakpoint(): 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' {
  const { width } = useWindowSize();

  if (width < 640) return 'xs';
  if (width < 768) return 'sm';
  if (width < 1024) return 'md';
  if (width < 1280) return 'lg';
  if (width < 1536) return 'xl';
  return '2xl';
}
