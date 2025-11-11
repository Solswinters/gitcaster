// Input sanitization utilities for security

/**
 * Sanitize user input by removing potentially dangerous characters
 * @param input - User input string
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .trim();
}

/**
 * Sanitize HTML by escaping special characters
 * @param html - HTML string
 * @returns Escaped HTML string
 */
export function escapeHtml(html: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return html.replace(/[&<>"']/g, (char) => map[char]);
}

