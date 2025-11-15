/**
 * Presentation Layer Testing Utilities
 * 
 * Utilities for testing React components and UI.
 */

import { render, RenderOptions } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';

/**
 * Custom render with all providers
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return <>{children}</>;
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

/**
 * Create mock router
 */
export function createMockRouter(overrides?: any) {
  return {
    pathname: '/',
    route: '/',
    query: {},
    asPath: '/',
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
    beforePopState: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    isFallback: false,
    isLocaleDomain: false,
    isReady: true,
    isPreview: false,
    ...overrides,
  };
}

/**
 * Wait for element to be removed
 */
export async function waitForLoadingToFinish(container: HTMLElement) {
  const { findByTestId, queryByTestId } = { findByTestId: jest.fn(), queryByTestId: jest.fn() };
  // Implementation depends on your loading indicator
}

/**
 * Simulate user interaction delay
 */
export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check accessibility violations
 */
export async function checkA11y(container: HTMLElement) {
  // Placeholder for axe-core integration
  // await axe(container);
}

