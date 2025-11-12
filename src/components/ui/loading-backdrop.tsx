import { Loader2 } from 'lucide-react';

interface LoadingBackdropProps {
  message?: string;
  transparent?: boolean;
}

export function LoadingBackdrop({ message, transparent = false }: LoadingBackdropProps) {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        transparent ? 'bg-black/20' : 'bg-white/90'
      }`}
    >
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
        {message && <p className="text-gray-700 font-medium">{message}</p>}
      </div>
    </div>
  );
}

