import { AlertCircle } from 'lucide-react';

interface Error {
  id: string;
  message: string;
}

interface ErrorListProps {
  errors: Error[];
  onDismiss?: (id: string) => void;
}

/**
 * ErrorList utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of ErrorList.
 */
export function ErrorList({ errors, onDismiss }: ErrorListProps) {
  if (errors.length === 0) return null;

  return (
    <div className="space-y-2">
      {errors.map(error => (
        <div 
          key={error.id}
          className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-3"
        >
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800 flex-1">{error.message}</p>
          {onDismiss && (
            <button
              onClick={() => onDismiss(error.id)}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Dismiss
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

