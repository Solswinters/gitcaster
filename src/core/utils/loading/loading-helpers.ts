/**
 * Utility functions for loading states
 */

export function createLoadingKey(prefix: string, id: string | number): string {
  return `${prefix}-${id}`;
}

export function getLoadingMessage(context: string): string {
  const messages: Record<string, string> = {
    profile: 'Loading profile...',
    search: 'Searching...',
    analytics: 'Loading analytics...',
    github: 'Fetching GitHub data...',
    auth: 'Authenticating...',
    collaboration: 'Loading team data...',
    default: 'Loading...',
  };

  return messages[context] || messages.default;
}

export function isLoadingState(value: unknown): value is { isLoading: boolean } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'isLoading' in value &&
    typeof (value as { isLoading: unknown }).isLoading === 'boolean'
  );
}

export interface LoadingOptions {
  minDuration?: number;
  maxDuration?: number;
  onTimeout?: () => void;
}

export async function withMinLoadingTime<T>(
  promise: Promise<T>,
  options: LoadingOptions = {}
): Promise<T> {
  const { minDuration = 300, maxDuration = 30000, onTimeout } = options;
  
  const timeoutPromise = new Promise<T>((_, reject) => {
    setTimeout(() => {
      if (onTimeout) {
        onTimeout();
      }
      reject(new Error('Request timeout'));
    }, maxDuration);
  });

  const minTimePromise = new Promise<void>((resolve) => {
    setTimeout(resolve, minDuration);
  });

  const [result] = await Promise.all([
    Promise.race([promise, timeoutPromise]),
    minTimePromise,
  ]);

  return result;
}

