import { ReactNode } from 'react';

interface LoadingFadeProps {
  isLoading: boolean;
  children: ReactNode;
}

export function LoadingFade({ isLoading, children }: LoadingFadeProps) {
  return (
    <div
      className={`transition-opacity duration-300 ${
        isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'
      }`}
    >
      {children}
    </div>
  );
}

