import { ReactNode } from 'react';

import { Loader2 } from 'lucide-react';

interface LoadingContainerProps {
  isLoading: boolean;
  children: ReactNode;
  loadingText?: string;
  minHeight?: string;
}

/**
 * LoadingContainer utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of LoadingContainer.
 */
export function LoadingContainer({ 
  isLoading, 
  children, 
  loadingText,
  minHeight = '200px'
}: LoadingContainerProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8" style={{ minHeight }}>
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-3" />
        {loadingText && <p className="text-gray-600">{loadingText}</p>}
      </div>
    );
  }

  return <>{children}</>;
}

