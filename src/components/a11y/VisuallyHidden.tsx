import { ReactNode } from 'react';

interface VisuallyHiddenProps {
  children: ReactNode;
}

/**
 * Hides content visually but keeps it accessible to screen readers
 */
export function VisuallyHidden({ children }: VisuallyHiddenProps) {
  return (
    <span className="sr-only">
      {children}
    </span>
  );
}

