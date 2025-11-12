'use client';

import { useEffect, useState, ReactNode } from 'react';

interface LiveRegionProps {
  message?: string;
  children?: ReactNode;
  politeness?: 'polite' | 'assertive';
  atomic?: boolean;
}

/**
 * ARIA live region for dynamic content announcements
 */
export function LiveRegion({ 
  message, 
  children, 
  politeness = 'polite',
  atomic = true 
}: LiveRegionProps) {
  const [content, setContent] = useState(message || children);

  useEffect(() => {
    setContent(message || children);
  }, [message, children]);

  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic={atomic}
      className="sr-only"
    >
      {content}
    </div>
  );
}

