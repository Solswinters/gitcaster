import { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingButtonContentProps {
  isLoading: boolean;
  loadingText?: string;
  children: ReactNode;
}

export function LoadingButtonContent({ 
  isLoading, 
  loadingText,
  children 
}: LoadingButtonContentProps) {
  if (isLoading) {
    return (
      <>
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        {loadingText || children}
      </>
    );
  }

  return <>{children}</>;
}

