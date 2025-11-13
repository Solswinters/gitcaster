/**
 * DOM Utilities
 *
 * Utilities for DOM manipulation and queries
 *
 * @module shared/utils/dom/domUtils
 */

/**
 * Check if code is running in browser
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * Get element by ID safely
 */
export function getElementById(id: string): HTMLElement | null {
  if (!isBrowser()) return null;
  return document.getElementById(id);
}

/**
 * Query selector safely
 */
export function querySelector<T extends Element = Element>(
  selector: string
): T | null {
  if (!isBrowser()) return null;
  return document.querySelector<T>(selector);
}

/**
 * Query selector all safely
 */
export function querySelectorAll<T extends Element = Element>(
  selector: string
): T[] {
  if (!isBrowser()) return [];
  return Array.from(document.querySelectorAll<T>(selector));
}

/**
 * Add class to element
 */
export function addClass(element: HTMLElement | null, className: string): void {
  element?.classList.add(className);
}

/**
 * Remove class from element
 */
export function removeClass(element: HTMLElement | null, className: string): void {
  element?.classList.remove(className);
}

/**
 * Toggle class on element
 */
export function toggleClass(element: HTMLElement | null, className: string): void {
  element?.classList.toggle(className);
}

/**
 * Check if element has class
 */
export function hasClass(element: HTMLElement | null, className: string): boolean {
  return element?.classList.contains(className) ?? false;
}

/**
 * Get element's offset position
 */
export function getOffset(element: HTMLElement): { top: number; left: number } {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
  };
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
 * Scroll to element smoothly
 */
export function scrollToElement(
  element: HTMLElement,
  options?: ScrollIntoViewOptions
): void {
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
    ...options,
  });
}

/**
 * Get computed style property
 */
export function getStyle(element: HTMLElement, property: string): string {
  return window.getComputedStyle(element).getPropertyValue(property);
}

/**
 * Set multiple styles
 */
export function setStyles(
  element: HTMLElement,
  styles: Partial<CSSStyleDeclaration>
): void {
  Object.assign(element.style, styles);
}

/**
 * Create element with attributes
 */
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attributes?: Record<string, string>,
  children?: (HTMLElement | string)[]
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);

  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }

  if (children) {
    children.forEach((child) => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child);
      }
    });
  }

  return element;
}

/**
 * Remove element from DOM
 */
export function removeElement(element: HTMLElement | null): void {
  element?.remove();
}

/**
 * Get parent element by selector
 */
export function getParent(
  element: HTMLElement,
  selector: string
): HTMLElement | null {
  let parent = element.parentElement;

  while (parent) {
    if (parent.matches(selector)) {
      return parent;
    }
    parent = parent.parentElement;
  }

  return null;
}

/**
 * Get siblings of element
 */
export function getSiblings(element: HTMLElement): HTMLElement[] {
  return Array.from(element.parentElement?.children || []).filter(
    (child) => child !== element
  ) as HTMLElement[];
}

/**
 * Check if element is visible
 */
export function isVisible(element: HTMLElement): boolean {
  return !!(
    element.offsetWidth ||
    element.offsetHeight ||
    element.getClientRects().length
  );
}

/**
 * Get element's dimensions
 */
export function getDimensions(element: HTMLElement): {
  width: number;
  height: number;
} {
  return {
    width: element.offsetWidth,
    height: element.offsetHeight,
  };
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!isBrowser()) return false;

  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  } catch {
    return false;
  }
}

/**
 * Download content as file
 */
export function downloadFile(
  content: string,
  filename: string,
  mimeType: string = 'text/plain'
): void {
  if (!isBrowser()) return;

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Trigger custom event
 */
export function triggerEvent(
  element: HTMLElement,
  eventName: string,
  detail?: any
): void {
  const event = new CustomEvent(eventName, { detail });
  element.dispatchEvent(event);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

