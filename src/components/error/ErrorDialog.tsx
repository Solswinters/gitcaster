import { X, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ErrorIcon } from './ErrorIcon';

interface ErrorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  onRetry?: () => void;
  type?: 'error' | 'warning' | 'critical';
}

export function ErrorDialog({
  isOpen,
  onClose,
  title,
  message,
  onRetry,
  type = 'error',
}: ErrorDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-start gap-4 mb-4">
          <ErrorIcon type={type} size={28} />
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-600">{message}</p>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          {onRetry && (
            <Button onClick={onRetry} size="sm" variant="secondary">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          )}
          <Button onClick={onClose} size="sm">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

