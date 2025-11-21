import { useState, useCallback } from 'react';

export type CopyStatus = 'idle' | 'copied' | 'error';

/**
 * Custom hook for copying text to clipboard
 *
 * @example
 * const [copiedText, copyToClipboard, status] = useCopyToClipboard();
 *
 * @returns Tuple of [copiedText, copyFunction, status]
 */
export function useCopyToClipboard(): [string | null, (text: string) => Promise<boolean>, CopyStatus] {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [status, setStatus] = useState<CopyStatus>('idle');

  const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      setStatus('error');
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setStatus('copied');

      // Reset status after 2 seconds
      setTimeout(() => setStatus('idle'), 2000);

      return true;
    } catch (error) {
      console.error('Failed to copy:', error);
      setStatus('error');

      // Reset status after 2 seconds
      setTimeout(() => setStatus('idle'), 2000);

      return false;
    }
  }, []);

  return [copiedText, copyToClipboard, status];
}

/**
 * Hook that returns a simple copy function
 */
export function useCopy(): (text: string) => Promise<boolean> {
  const [, copyToClipboard] = useCopyToClipboard();
  return copyToClipboard;
}
