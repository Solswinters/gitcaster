/**
 * Error message component
 */

'use client';

interface ErrorMessageProps {
  message: string;
  title?: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, title = 'Error', onRetry }: ErrorMessageProps) {
  return (
    <div className="p-4 border border-destructive rounded-lg bg-destructive/10">
      <h3 className="font-semibold text-destructive mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-3">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:opacity-90"
        >
          Retry
        </button>
      )}
    </div>
  );
}

