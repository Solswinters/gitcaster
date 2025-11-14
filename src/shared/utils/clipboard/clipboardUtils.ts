/**
 * Clipboard Utilities
 *
 * Utilities for clipboard operations
 *
 * @module shared/utils/clipboard/clipboardUtils
 */

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-999999px';
      textarea.style.top = '-999999px';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    }
  } catch {
    return false;
  }
}

/**
 * Read text from clipboard
 */
export async function readFromClipboard(): Promise<string | null> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      return await navigator.clipboard.readText();
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Check if clipboard API is available
 */
export function isClipboardAvailable(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.clipboard;
}

/**
 * Copy object as JSON to clipboard
 */
export async function copyJsonToClipboard(obj: any): Promise<boolean> {
  try {
    const json = JSON.stringify(obj, null, 2);
    return await copyToClipboard(json);
  } catch {
    return false;
  }
}

/**
 * Copy formatted code to clipboard
 */
export async function copyCodeToClipboard(code: string, language?: string): Promise<boolean> {
  const formattedCode = language ? `\`\`\`${language}\n${code}\n\`\`\`` : code;
  return await copyToClipboard(formattedCode);
}

