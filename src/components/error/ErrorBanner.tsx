import { X, AlertTriangle } from 'lucide-react';

interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
  persistent?: boolean;
}

/**
 * ErrorBanner utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of ErrorBanner.
 */
export function ErrorBanner({ message, onDismiss, persistent = false }: ErrorBannerProps) {
  return (
    <div className="bg-red-50 border-l-4 border-red-600 p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start flex-1">
          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
          <p className="text-sm text-red-800">{message}</p>
        </div>
        {!persistent && onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-3 text-red-600 hover:text-red-800 transition-colors flex-shrink-0"
            aria-label="Dismiss error"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}

