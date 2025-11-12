import { AlertCircle, X } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
  title?: string;
  onClose?: () => void;
  variant?: 'error' | 'warning';
}

export function ErrorAlert({ 
  message, 
  title,
  onClose,
  variant = 'error'
}: ErrorAlertProps) {
  const styles = {
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  };

  const iconColors = {
    error: 'text-red-600',
    warning: 'text-yellow-600',
  };

  return (
    <div className={`rounded-lg border p-4 ${styles[variant]}`} role="alert">
      <div className="flex items-start gap-3">
        <AlertCircle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${iconColors[variant]}`} />
        <div className="flex-1">
          {title && <h4 className="font-semibold mb-1">{title}</h4>}
          <p className="text-sm">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 hover:opacity-70 transition-opacity"
            aria-label="Close alert"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

