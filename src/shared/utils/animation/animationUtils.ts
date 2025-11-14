/**
 * Animation Utilities
 *
 * Utilities for animations and transitions
 *
 * @module shared/utils/animation/animationUtils
 */

/**
 * Easing functions
 */
export const easings = {
  linear: (t: number) => t,
  easeIn: (t: number) => t * t,
  easeOut: (t: number) => t * (2 - t),
  easeInOut: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => --t * t * t + 1,
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInQuart: (t: number) => t * t * t * t,
  easeOutQuart: (t: number) => 1 - --t * t * t * t,
  easeInOutQuart: (t: number) =>
    t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
};

/**
 * Animate a value over time
 */
export function animate(
  from: number,
  to: number,
  duration: number,
  onUpdate: (value: number) => void,
  easing: (t: number) => number = easings.easeInOut
): () => void {
  const startTime = performance.now();
  let animationFrame: number;

  const step = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easing(progress);
    const value = from + (to - from) * easedProgress;

    onUpdate(value);

    if (progress < 1) {
      animationFrame = requestAnimationFrame(step);
    }
  };

  animationFrame = requestAnimationFrame(step);

  return () => cancelAnimationFrame(animationFrame);
}

/**
 * Smooth scroll to element
 */
export function smoothScrollTo(
  target: number | HTMLElement,
  duration: number = 500,
  offset: number = 0
): Promise<void> {
  return new Promise((resolve) => {
    const targetPosition =
      typeof target === 'number'
        ? target
        : target.getBoundingClientRect().top + window.pageYOffset;

    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition - offset;

    animate(startPosition, startPosition + distance, duration, (value) => {
      window.scrollTo(0, value);
    });

    setTimeout(resolve, duration);
  });
}

/**
 * Fade in element
 */
export function fadeIn(
  element: HTMLElement,
  duration: number = 300,
  display: string = 'block'
): void {
  element.style.opacity = '0';
  element.style.display = display;

  animate(0, 1, duration, (value) => {
    element.style.opacity = value.toString();
  });
}

/**
 * Fade out element
 */
export function fadeOut(element: HTMLElement, duration: number = 300): void {
  animate(1, 0, duration, (value) => {
    element.style.opacity = value.toString();
    if (value === 0) {
      element.style.display = 'none';
    }
  });
}

/**
 * Slide down element
 */
export function slideDown(element: HTMLElement, duration: number = 300): void {
  element.style.display = 'block';
  element.style.overflow = 'hidden';
  const height = element.scrollHeight;
  element.style.height = '0';

  animate(0, height, duration, (value) => {
    element.style.height = `${value}px`;
  });

  setTimeout(() => {
    element.style.height = '';
    element.style.overflow = '';
  }, duration);
}

/**
 * Slide up element
 */
export function slideUp(element: HTMLElement, duration: number = 300): void {
  const height = element.scrollHeight;
  element.style.overflow = 'hidden';
  element.style.height = `${height}px`;

  animate(height, 0, duration, (value) => {
    element.style.height = `${value}px`;
  });

  setTimeout(() => {
    element.style.display = 'none';
    element.style.height = '';
    element.style.overflow = '';
  }, duration);
}

/**
 * Request animation frame with fallback
 */
export const raf =
  typeof window !== 'undefined'
    ? window.requestAnimationFrame.bind(window)
    : (callback: FrameRequestCallback) => setTimeout(callback, 16);

/**
 * Cancel animation frame with fallback
 */
export const caf =
  typeof window !== 'undefined'
    ? window.cancelAnimationFrame.bind(window)
    : clearTimeout;

