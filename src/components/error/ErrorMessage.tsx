import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  title?: string;
}

export function ErrorMessage({ message, title = 'Error' }: ErrorMessageProps) {
  return (
    <div className="rounded-lg bg-red-50 border border-red-200 p-4">
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
        <div>
          <h3 className="text-sm font-semibold text-red-800">{title}</h3>
          <p className="text-sm text-red-700 mt-1">{message}</p>
        </div>
      </div>
    </div>
  );
}

