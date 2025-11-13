/**
 * useCopyToClipboard Hook
 * 
 * Copy text to clipboard with state management
 */

'use client';

import { useState, useCallback } from 'react';

export function useCopyToClipboard(timeout = 2000): [boolean, (text: string) => Promise<void>] {
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      if (!navigator?.clipboard) {
        console.warn('Clipboard not supported');
        return;
      }

      try {
        await navigator.clipboard.writeText(text);
        setIsCopied(true);

        setTimeout(() => {
          setIsCopied(false);
        }, timeout);
      } catch (error) {
        console.error('Failed to copy:', error);
        setIsCopied(false);
      }
    },
    [timeout]
  );

  return [isCopied, copy];
}

