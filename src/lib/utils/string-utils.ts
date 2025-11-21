/**
 * String manipulation utility functions
 * Provides reusable string operations
 */

export class StringUtils {
  /**
   * Capitalize first letter
   */
  static capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Capitalize all words
   */
  static capitalizeWords(str: string): string {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  /**
   * Convert to camelCase
   */
  static toCamelCase(str: string): string {
    return str
      .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
      .replace(/^[A-Z]/, (char) => char.toLowerCase());
  }

  /**
   * Convert to PascalCase
   */
  static toPascalCase(str: string): string {
    const camel = this.toCamelCase(str);
    return camel.charAt(0).toUpperCase() + camel.slice(1);
  }

  /**
   * Convert to snake_case
   */
  static toSnakeCase(str: string): string {
    return str
      .replace(/([A-Z])/g, '_$1')
      .toLowerCase()
      .replace(/^_/, '');
  }

  /**
   * Convert to kebab-case
   */
  static toKebabCase(str: string): string {
    return str
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .replace(/^-/, '');
  }

  /**
   * Truncate string with ellipsis
   */
  static truncate(str: string, maxLength: number, suffix: string = '...'): string {
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength - suffix.length) + suffix;
  }

  /**
   * Truncate string at word boundary
   */
  static truncateWords(str: string, maxWords: number, suffix: string = '...'): string {
    const words = str.split(/\s+/);
    if (words.length <= maxWords) return str;
    return words.slice(0, maxWords).join(' ') + suffix;
  }

  /**
   * Trim and collapse whitespace
   */
  static normalizeWhitespace(str: string): string {
    return str.replace(/\s+/g, ' ').trim();
  }

  /**
   * Remove HTML tags
   */
  static stripHtml(str: string): string {
    return str.replace(/<[^>]*>/g, '');
  }

  /**
   * Escape HTML entities
   */
  static escapeHtml(str: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return str.replace(/[&<>"']/g, (char) => map[char]);
  }

  /**
   * Unescape HTML entities
   */
  static unescapeHtml(str: string): string {
    const map: Record<string, string> = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'",
    };
    return str.replace(/&(?:amp|lt|gt|quot|#39);/g, (entity) => map[entity]);
  }

  /**
   * Convert string to slug
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
   * Reverse string
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
  static countOccurrences(str: string, substring: string): number {
    if (!substring) return 0;
    return str.split(substring).length - 1;
  }

  /**
   * Replace all occurrences
   */
  static replaceAll(str: string, search: string, replacement: string): string {
    return str.split(search).join(replacement);
  }

  /**
   * Insert string at position
   */
  static insertAt(str: string, index: number, insertion: string): string {
    return str.substring(0, index) + insertion + str.substring(index);
  }

  /**
   * Remove substring
   */
  static remove(str: string, substring: string): string {
    return str.split(substring).join('');
  }

  /**
   * Check if string contains
   */
  static contains(str: string, substring: string, caseSensitive: boolean = true): boolean {
    if (caseSensitive) {
      return str.includes(substring);
    }
    return str.toLowerCase().includes(substring.toLowerCase());
  }

  /**
   * Check if string starts with
   */
  static startsWith(str: string, prefix: string, caseSensitive: boolean = true): boolean {
    if (caseSensitive) {
      return str.startsWith(prefix);
    }
    return str.toLowerCase().startsWith(prefix.toLowerCase());
  }

  /**
   * Check if string ends with
   */
  static endsWith(str: string, suffix: string, caseSensitive: boolean = true): boolean {
    if (caseSensitive) {
      return str.endsWith(suffix);
    }
    return str.toLowerCase().endsWith(suffix.toLowerCase());
  }

  /**
   * Pad string to length
   */
  static pad(str: string, length: number, char: string = ' ', right: boolean = false): string {
    const padLength = Math.max(0, length - str.length);
    const padding = char.repeat(padLength);
    return right ? str + padding : padding + str;
  }

  /**
   * Repeat string n times
   */
  static repeat(str: string, count: number): string {
    return str.repeat(count);
  }

  /**
   * Wrap text to max width
   */
  static wrap(str: string, maxWidth: number): string[] {
    const words = str.split(/\s+/);
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      if ((currentLine + word).length > maxWidth) {
        if (currentLine) lines.push(currentLine.trim());
        currentLine = word + ' ';
      } else {
        currentLine += word + ' ';
      }
    }

    if (currentLine) lines.push(currentLine.trim());
    return lines;
  }

  /**
   * Extract numbers from string
   */
  static extractNumbers(str: string): number[] {
    const matches = str.match(/-?\d+\.?\d*/g);
    return matches ? matches.map(Number) : [];
  }

  /**
   * Extract emails from string
   */
  static extractEmails(str: string): string[] {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    return str.match(emailRegex) || [];
  }

  /**
   * Extract URLs from string
   */
  static extractUrls(str: string): string[] {
    const urlRegex = /https?:\/\/[^\s]+/g;
    return str.match(urlRegex) || [];
  }

  /**
   * Mask string (e.g., for sensitive data)
   */
  static mask(str: string, visibleChars: number = 4, maskChar: string = '*'): string {
    if (str.length <= visibleChars) return str;
    const visible = str.slice(-visibleChars);
    const masked = maskChar.repeat(str.length - visibleChars);
    return masked + visible;
  }

  /**
   * Generate random string
   */
  static random(length: number, chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'): string {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Calculate Levenshtein distance
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
            matrix[i - 1][j] + 1 // deletion
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  /**
   * Check similarity (0-1)
   */
  static similarity(str1: string, str2: string): number {
    const distance = this.levenshteinDistance(str1, str2);
    const maxLength = Math.max(str1.length, str2.length);
    return maxLength === 0 ? 1 : 1 - distance / maxLength;
  }

  /**
   * Parse template string
   */
  static template(template: string, data: Record<string, any>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] !== undefined ? String(data[key]) : match;
    });
  }

  /**
   * Format file size
   */
  static formatBytes(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
  }

  /**
   * Format duration (milliseconds to human readable)
   */
  static formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }

  /**
   * Pluralize word
   */
  static pluralize(word: string, count: number): string {
    if (count === 1) return word;

    const irregular: Record<string, string> = {
      person: 'people',
      child: 'children',
      man: 'men',
      woman: 'women',
      tooth: 'teeth',
      foot: 'feet',
      mouse: 'mice',
    };

    if (irregular[word.toLowerCase()]) {
      return irregular[word.toLowerCase()];
    }

    if (word.endsWith('y') && !/[aeiou]y$/i.test(word)) {
      return word.slice(0, -1) + 'ies';
    }

    if (/[sxz]$|[cs]h$/i.test(word)) {
      return word + 'es';
    }

    return word + 's';
  }

  /**
   * Abbreviate number with suffix
   */
  static abbreviateNumber(num: number): string {
    if (num < 1000) return num.toString();
    if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
    if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
    return (num / 1000000000).toFixed(1) + 'B';
  }

  /**
   * Check if string is empty
   */
  static isEmpty(str: string | null | undefined): boolean {
    return !str || str.trim().length === 0;
  }

  /**
   * Check if string is not empty
   */
  static isNotEmpty(str: string | null | undefined): boolean {
    return !this.isEmpty(str);
  }
}
