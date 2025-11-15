/**
 * Application Layer Testing Utilities
 * 
 * Utilities for testing services, hooks, and application logic.
 */

import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

/**
 * Render a hook with common providers
 */
export function renderHookWithProviders<TProps, TResult>(
  hook: (props: TProps) => TResult,
  options?: {
    initialProps?: TProps;
    wrapper?: React.ComponentType<{ children: ReactNode }>;
  }
) {
  return renderHook(hook, options);
}

/**
 * Wait for hook to settle (all async operations complete)
 */
export async function waitForHookToSettle() {
  await waitFor(
    () => {
      // Wait a tick for all promises to resolve
    },
    { timeout: 3000 }
  );
}

/**
 * Create mock service for testing
 */
export function createMockService<T extends object>(
  serviceName: string,
  methods: Partial<T>
): jest.Mocked<T> {
  return methods as jest.Mocked<T>;
}

/**
 * Spy on service method
 */
export function spyOnService<T extends object, K extends keyof T>(
  service: T,
  methodName: K
): jest.SpyInstance {
  return jest.spyOn(service, methodName as any);
}

