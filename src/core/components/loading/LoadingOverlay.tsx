/**
 * Loading overlay component
 */

'use client';

import { Spinner } from './Spinner';

interface LoadingOverlayProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingOverlay({ message, fullScreen = true }: LoadingOverlayProps) {
  const containerClass = fullScreen
    ? 'fixed inset-0 z-50'
    : 'absolute inset-0';

  return (
    <div
      className={`${containerClass} flex items-center justify-center bg-background/80 backdrop-blur-sm`}
      role="alert"
      aria-busy="true"
      aria-label="Loading"
    >
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        {message && (
          <p className="text-sm text-muted-foreground">{message}</p>
        )}
      </div>
    </div>
  );
}

