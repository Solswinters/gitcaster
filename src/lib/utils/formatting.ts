/**
 * Formatting utility functions
 * Provides reusable formatting logic for display purposes
 */

export class FormattingUtils {
  /**
   * Format number with commas (e.g., 1000 -> 1,000)
   */
  static formatNumber(num: number, decimals: number = 0): string {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  /**
   * Format currency (USD by default)
   */
  static formatCurrency(amount: number, currency: string = 'USD', decimals: number = 2): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount);
  }

  /**
   * Format percentage
   */
  static formatPercentage(value: number, decimals: number = 2): string {
    return `${value.toFixed(decimals)}%`;
  }

  /**
   * Format file size (bytes to human-readable)
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  /**
   * Format date (relative or absolute)
   */
  static formatDate(date: Date | string | number, relative: boolean = false): string {
    const d = new Date(date);

    if (relative) {
      return this.formatRelativeTime(d);
    }

    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  /**
   * Format time
   */
  static formatTime(date: Date | string | number): string {
    const d = new Date(date);

    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Format date and time
   */
  static formatDateTime(date: Date | string | number): string {
    const d = new Date(date);

    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Format relative time (e.g., "2 hours ago")
   */
  static formatRelativeTime(date: Date | string | number): string {
    const d = new Date(date);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 604800)} weeks ago`;
    if (seconds < 31536000) return `${Math.floor(seconds / 2592000)} months ago`;

    return `${Math.floor(seconds / 31536000)} years ago`;
  }

  /**
   * Format duration (seconds to human-readable)
   */
  static formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const parts: string[] = [];

    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

    return parts.join(' ');
  }

  /**
   * Format phone number (US)
   */
  static formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');

    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }

    if (cleaned.length === 11 && cleaned[0] === '1') {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }

    return phone;
  }

  /**
   * Format credit card number (with masking)
   */
  static formatCreditCard(cardNumber: string, maskDigits: boolean = true): string {
    const cleaned = cardNumber.replace(/\D/g, '');

    if (maskDigits && cleaned.length >= 4) {
      const lastFour = cleaned.slice(-4);
      const masked = '*'.repeat(cleaned.length - 4);
      return `${masked}${lastFour}`.replace(/(.{4})/g, '$1 ').trim();
    }

    return cleaned.replace(/(.{4})/g, '$1 ').trim();
  }

  /**
   * Format Ethereum address (shortened with ellipsis)
   */
  static formatEthereumAddress(address: string, startLength: number = 6, endLength: number = 4): string {
    if (address.length <= startLength + endLength) return address;

    return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
  }

  /**
   * Format hash (shortened)
   */
  static formatHash(hash: string, length: number = 8): string {
    if (hash.length <= length) return hash;
    return `${hash.slice(0, length)}...`;
  }

  /**
   * Truncate text with ellipsis
   */
  static truncate(text: string, maxLength: number, suffix: string = '...'): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - suffix.length) + suffix;
  }

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
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
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
    return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  }

  /**
   * Convert kebab-case to camelCase
   */
  static kebabToCamel(str: string): string {
    return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  /**
   * Format JSON (prettify)
   */
  static formatJSON(obj: any, indent: number = 2): string {
    return JSON.stringify(obj, null, indent);
  }

  /**
   * Format list (array to comma-separated string)
   */
  static formatList(items: string[], conjunction: string = 'and'): string {
    if (items.length === 0) return '';
    if (items.length === 1) return items[0];
    if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;

    const lastItem = items[items.length - 1];
    const rest = items.slice(0, -1).join(', ');

    return `${rest}, ${conjunction} ${lastItem}`;
  }

  /**
   * Format ordinal number (1st, 2nd, 3rd, etc.)
   */
  static formatOrdinal(num: number): string {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = num % 100;

    return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
  }

  /**
   * Pluralize word based on count
   */
  static pluralize(count: number, singular: string, plural?: string): string {
    if (count === 1) return singular;
    return plural || `${singular}s`;
  }

  /**
   * Format with count (e.g., "3 items")
   */
  static formatWithCount(count: number, singular: string, plural?: string): string {
    return `${count} ${this.pluralize(count, singular, plural)}`;
  }

  /**
   * Remove HTML tags
   */
  static stripHTML(html: string): string {
    return html.replace(/<[^>]*>/g, '');
  }

  /**
   * Format markdown to plain text (basic)
   */
  static markdownToPlainText(markdown: string): string {
    return markdown
      .replace(/(\*\*|__)(.*?)\1/g, '$2') // Bold
      .replace(/(\*|_)(.*?)\1/g, '$2') // Italic
      .replace(/~~(.*?)~~/g, '$1') // Strikethrough
      .replace(/`{1,3}[^`]*`{1,3}/g, '') // Code blocks
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
      .replace(/^#+\s/gm, '') // Headers
      .replace(/^\s*[-*+]\s/gm, '') // Lists
      .replace(/^\s*\d+\.\s/gm, ''); // Numbered lists
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
   * Format bytes to bits
   */
  static bytesToBits(bytes: number): string {
    const bits = bytes * 8;
    const k = 1000;
    const sizes = ['bits', 'Kbps', 'Mbps', 'Gbps', 'Tbps'];
    const i = Math.floor(Math.log(bits) / Math.log(k));

    return `${parseFloat((bits / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  /**
   * Format large numbers (1000 -> 1K, 1000000 -> 1M)
   */
  static formatLargeNumber(num: number): string {
    if (num < 1000) return num.toString();
    if (num < 1000000) return `${(num / 1000).toFixed(1)}K`;
    if (num < 1000000000) return `${(num / 1000000).toFixed(1)}M`;
    return `${(num / 1000000000).toFixed(1)}B`;
  }

  /**
   * Format latitude/longitude
   */
  static formatCoordinates(lat: number, lng: number, decimals: number = 6): string {
    return `${lat.toFixed(decimals)}, ${lng.toFixed(decimals)}`;
  }

  /**
   * Format hex color with alpha
   */
  static formatHexWithAlpha(hex: string, alpha: number): string {
    const alphaHex = Math.round(alpha * 255)
      .toString(16)
      .padStart(2, '0');
    return `${hex}${alphaHex}`;
  }

  /**
   * Format RGB to hex
   */
  static rgbToHex(r: number, g: number, b: number): string {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  /**
   * Format version number
   */
  static formatVersion(major: number, minor: number, patch: number): string {
    return `${major}.${minor}.${patch}`;
  }
}

