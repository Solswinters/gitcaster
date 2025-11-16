/**
 * Fallback component for React Suspense
 */

'use client';

import { Spinner } from './Spinner';

interface SuspenseFallbackProps {
  message?: string;
  fullScreen?: boolean;
}

export function SuspenseFallback({
  message = 'Loading...',
  fullScreen = false,
}: SuspenseFallbackProps) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="md" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

