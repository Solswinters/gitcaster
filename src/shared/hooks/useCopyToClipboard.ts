import { useState } from 'react';

export interface UseCopyToClipboardResult {
  copiedText: string | null;
  copy: (text: string) => Promise<boolean>;
  isCopied: boolean;
  error: Error | null;
}

/**
 * Custom hook for copying text to clipboard
 * Provides feedback on copy success/failure and tracks copied text
 *
 * @example
 * const { copy, isCopied, error } = useCopyToClipboard();
 *
 * const handleCopy = async () => {
 *   const success = await copy('Text to copy');
 *   if (success) {
 *     console.log('Copied!');
 *   }
 * };
 */
export function useCopyToClipboard(resetAfter: number = 2000): UseCopyToClipboardResult {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const copy = async (text: string): Promise<boolean> => {
    if (!navigator?.clipboard) {
      const error = new Error('Clipboard API not available');
      setError(error);
      console.warn(error);
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setIsCopied(true);
      setError(null);

      // Reset the copied state after specified time
      if (resetAfter > 0) {
        setTimeout(() => {
          setIsCopied(false);
        }, resetAfter);
      }

      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to copy to clipboard');
      setError(error);
      setCopiedText(null);
      setIsCopied(false);
      console.warn('Failed to copy:', error);
      return false;
    }
  };

  return { copiedText, copy, isCopied, error };
}
