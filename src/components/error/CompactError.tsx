import { AlertCircle } from 'lucide-react';

interface CompactErrorProps {
  message: string;
}

export function CompactError({ message }: CompactErrorProps) {
  return (
    <div className="flex items-center gap-2 text-red-600 text-sm py-2 px-3 bg-red-50 rounded-md border border-red-200">
      <AlertCircle className="h-4 w-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}

