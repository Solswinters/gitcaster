import { Loader2 } from 'lucide-react';

interface SpinnerOverlayProps {
  message?: string;
  transparent?: boolean;
}

export function SpinnerOverlay({ message, transparent = false }: SpinnerOverlayProps) {
  return (
    <div className={`absolute inset-0 z-40 flex items-center justify-center ${transparent ? 'bg-white/60' : 'bg-white/90'} backdrop-blur-sm`}>
      <div className="text-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto mb-3" />
        {message && <p className="text-sm text-gray-600 font-medium">{message}</p>}
      </div>
    </div>
  );
}

