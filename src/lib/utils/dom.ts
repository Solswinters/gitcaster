// DOM manipulation utilities

/**
 * Scroll to top of page
 */
export function scrollToTop(behavior: ScrollBehavior = 'smooth'): void {
  window.scrollTo({ top: 0, behavior });
}

/**
 * Scroll to element
 */
export function scrollToElement(
  element: HTMLElement | string,
  behavior: ScrollBehavior = 'smooth'
): void {
  const el = typeof element === 'string' 
    ? document.querySelector(element) 
    : element;
    
  el?.scrollIntoView({ behavior, block: 'start' });
}

/**
 * Check if element is in viewport
 */
export function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Get scroll position
 */
export function getScrollPosition(): { x: number; y: number } {
  return {
    x: window.pageXOffset || document.documentElement.scrollLeft,
    y: window.pageYOffset || document.documentElement.scrollTop,
  };
}

/**
 * Lock body scroll
 */
export function lockScroll(): void {
  document.body.style.overflow = 'hidden';
}

/**
 * Unlock body scroll
 */
export function unlockScroll(): void {
  document.body.style.overflow = '';
}

