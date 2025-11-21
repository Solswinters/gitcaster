/**
 * String manipulation utility functions
 * Provides reusable string operations
 */

export class StringUtils {
  /**
   * Truncate string to specified length with ellipsis
   */
  static truncate(str: string, length: number, suffix: string = '...'): string {
    if (str.length <= length) return str;
    return str.slice(0, length - suffix.length) + suffix;
  }

  /**
   * Capitalize first letter of string
   */
  static capitalize(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  /**
   * Capitalize first letter of each word
   */
  static capitalizeWords(str: string): string {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  /**
   * Convert to title case
   */
  static toTitleCase(str: string): string {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Convert camelCase to snake_case
   */
  static camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`).replace(/^_/, '');
  }

  /**
   * Convert snake_case to camelCase
   */
  static snakeToCamel(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  /**
   * Convert camelCase to kebab-case
   */
  static camelToKebab(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`).replace(/^-/, '');
  }

  /**
   * Convert kebab-case to camelCase
   */
  static kebabToCamel(str: string): string {
    return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  /**
   * Convert string to slug (URL-friendly)
   */
  static slugify(str: string): string {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Remove HTML tags from string
   */
  static stripHTML(html: string): string {
    return html.replace(/<[^>]*>/g, '');
  }

  /**
   * Escape HTML special characters
   */
  static escapeHTML(str: string): string {
    const htmlEscapes: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;',
    };

    return str.replace(/[&<>"'/]/g, (char) => htmlEscapes[char]);
  }

  /**
   * Unescape HTML special characters
   */
  static unescapeHTML(str: string): string {
    const htmlUnescapes: Record<string, string> = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#x27;': "'",
      '&#x2F;': '/',
    };

    return str.replace(/&(?:amp|lt|gt|quot|#x27|#x2F);/g, (entity) => htmlUnescapes[entity]);
  }

  /**
   * Escape regular expression special characters
   */
  static escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Reverse a string
   */
  static reverse(str: string): string {
    return str.split('').reverse().join('');
  }

  /**
   * Check if string is palindrome
   */
  static isPalindrome(str: string): boolean {
    const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleaned === this.reverse(cleaned);
  }

  /**
   * Count occurrences of substring
   */
  static countOccurrences(str: string, substr: string): number {
    if (!substr) return 0;
    return (str.match(new RegExp(this.escapeRegex(substr), 'g')) || []).length;
  }

  /**
   * Replace all occurrences of search string
   */
  static replaceAll(str: string, search: string, replacement: string): string {
    return str.split(search).join(replacement);
  }

  /**
   * Pad string to specified length
   */
  static pad(str: string, length: number, padChar: string = ' ', right: boolean = false): string {
    const padding = padChar.repeat(Math.max(0, length - str.length));
    return right ? str + padding : padding + str;
  }

  /**
   * Wrap string to specified width
   */
  static wordWrap(str: string, width: number): string {
    const words = str.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      if (currentLine.length + word.length + 1 <= width) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }

    if (currentLine) lines.push(currentLine);
    return lines.join('\n');
  }

  /**
   * Extract all URLs from string
   */
  static extractURLs(str: string): string[] {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return str.match(urlRegex) || [];
  }

  /**
   * Extract all email addresses from string
   */
  static extractEmails(str: string): string[] {
    const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
    return str.match(emailRegex) || [];
  }

  /**
   * Remove extra whitespace
   */
  static normalizeWhitespace(str: string): string {
    return str.replace(/\s+/g, ' ').trim();
  }

  /**
   * Remove all whitespace
   */
  static removeWhitespace(str: string): string {
    return str.replace(/\s/g, '');
  }

  /**
   * Get initials from name
   */
  static getInitials(name: string, maxLength: number = 2): string {
    return name
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, maxLength)
      .join('');
  }

  /**
   * Mask string (for sensitive data)
   */
  static mask(str: string, visibleStart: number = 0, visibleEnd: number = 4, maskChar: string = '*'): string {
    if (str.length <= visibleStart + visibleEnd) return str;

    const start = str.slice(0, visibleStart);
    const end = str.slice(-visibleEnd);
    const masked = maskChar.repeat(str.length - visibleStart - visibleEnd);

    return start + masked + end;
  }

  /**
   * Convert string to boolean
   */
  static toBoolean(str: string): boolean {
    const normalized = str.toLowerCase().trim();
    return ['true', '1', 'yes', 'on'].includes(normalized);
  }

  /**
   * Check if string contains only digits
   */
  static isNumeric(str: string): boolean {
    return /^\d+$/.test(str);
  }

  /**
   * Check if string contains only letters
   */
  static isAlpha(str: string): boolean {
    return /^[a-zA-Z]+$/.test(str);
  }

  /**
   * Check if string contains only alphanumeric characters
   */
  static isAlphanumeric(str: string): boolean {
    return /^[a-zA-Z0-9]+$/.test(str);
  }

  /**
   * Generate random string
   */
  static random(length: number = 10, charset: string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'): string {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
  }

  /**
   * Generate UUID v4
   */
  static generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * Hash string (simple hash for non-cryptographic purposes)
   */
  static simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Compare strings (case-insensitive)
   */
  static equalsIgnoreCase(str1: string, str2: string): boolean {
    return str1.toLowerCase() === str2.toLowerCase();
  }

  /**
   * Levenshtein distance (edit distance between two strings)
   */
  static levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1, // deletion
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  /**
   * Calculate similarity between two strings (0-1)
   */
  static similarity(str1: string, str2: string): number {
    const maxLength = Math.max(str1.length, str2.length);
    if (maxLength === 0) return 1;

    const distance = this.levenshteinDistance(str1, str2);
    return 1 - distance / maxLength;
  }

  /**
   * Find longest common substring
   */
  static longestCommonSubstring(str1: string, str2: string): string {
    const matrix: number[][] = Array(str1.length + 1)
      .fill(null)
      .map(() => Array(str2.length + 1).fill(0));

    let maxLength = 0;
    let endIndex = 0;

    for (let i = 1; i <= str1.length; i++) {
      for (let j = 1; j <= str2.length; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1] + 1;

          if (matrix[i][j] > maxLength) {
            maxLength = matrix[i][j];
            endIndex = i;
          }
        }
      }
    }

    return str1.substring(endIndex - maxLength, endIndex);
  }
}

