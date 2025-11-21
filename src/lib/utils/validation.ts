/**
 * Validation utility functions
 * Provides reusable validation logic for forms and data
 */

export class ValidationUtils {
  /**
   * Validate email address
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate URL
   */
  static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate Ethereum address
   */
  static isValidEthereumAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  /**
   * Validate username (alphanumeric, dashes, underscores, 3-20 chars)
   */
  static isValidUsername(username: string): boolean {
    return /^[a-zA-Z0-9_-]{3,20}$/.test(username);
  }

  /**
   * Validate GitHub username
   */
  static isValidGitHubUsername(username: string): boolean {
    // GitHub usernames can contain alphanumeric characters and hyphens
    // Cannot start or end with a hyphen
    // Maximum 39 characters
    return /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(username);
  }

  /**
   * Validate password strength
   */
  static validatePassword(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate required field
   */
  static isRequired(value: any): boolean {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return true;
  }

  /**
   * Validate minimum length
   */
  static minLength(value: string, min: number): boolean {
    return value.length >= min;
  }

  /**
   * Validate maximum length
   */
  static maxLength(value: string, max: number): boolean {
    return value.length <= max;
  }

  /**
   * Validate number range
   */
  static isInRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  }

  /**
   * Validate phone number (basic)
   */
  static isValidPhoneNumber(phone: string): boolean {
    // Remove all non-digit characters
    const digitsOnly = phone.replace(/\D/g, '');
    // Check if it has 10-15 digits
    return digitsOnly.length >= 10 && digitsOnly.length <= 15;
  }

  /**
   * Validate date (YYYY-MM-DD)
   */
  static isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }

  /**
   * Validate future date
   */
  static isFutureDate(dateString: string): boolean {
    const date = new Date(dateString);
    return date > new Date();
  }

  /**
   * Validate past date
   */
  static isPastDate(dateString: string): boolean {
    const date = new Date(dateString);
    return date < new Date();
  }

  /**
   * Validate hex color
   */
  static isValidHexColor(color: string): boolean {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
  }

  /**
   * Validate credit card number (Luhn algorithm)
   */
  static isValidCreditCard(cardNumber: string): boolean {
    const digits = cardNumber.replace(/\D/g, '');

    if (digits.length < 13 || digits.length > 19) {
      return false;
    }

    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i], 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  /**
   * Validate JSON string
   */
  static isValidJSON(str: string): boolean {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate integer
   */
  static isInteger(value: any): boolean {
    return Number.isInteger(Number(value));
  }

  /**
   * Validate positive number
   */
  static isPositive(value: number): boolean {
    return value > 0;
  }

  /**
   * Validate non-negative number
   */
  static isNonNegative(value: number): boolean {
    return value >= 0;
  }

  /**
   * Validate UUID
   */
  static isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  /**
   * Validate MongoDB ObjectId
   */
  static isValidObjectId(id: string): boolean {
    return /^[0-9a-fA-F]{24}$/.test(id);
  }

  /**
   * Validate file extension
   */
  static hasValidExtension(filename: string, allowedExtensions: string[]): boolean {
    const ext = filename.split('.').pop()?.toLowerCase();
    return ext ? allowedExtensions.includes(ext) : false;
  }

  /**
   * Validate file size (in bytes)
   */
  static isValidFileSize(size: number, maxSizeInMB: number): boolean {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    return size <= maxSizeInBytes;
  }

  /**
   * Validate image dimensions
   */
  static async validateImageDimensions(
    file: File,
    maxWidth: number,
    maxHeight: number,
  ): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img.width <= maxWidth && img.height <= maxHeight);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(false);
      };

      img.src = url;
    });
  }

  /**
   * Sanitize string (remove HTML tags)
   */
  static sanitizeString(str: string): string {
    return str.replace(/<[^>]*>/g, '');
  }

  /**
   * Validate against regex pattern
   */
  static matchesPattern(value: string, pattern: RegExp): boolean {
    return pattern.test(value);
  }

  /**
   * Validate array contains value
   */
  static contains<T>(array: T[], value: T): boolean {
    return array.includes(value);
  }

  /**
   * Validate unique array values
   */
  static hasUniqueValues<T>(array: T[]): boolean {
    return new Set(array).size === array.length;
  }

  /**
   * Validate object has required keys
   */
  static hasRequiredKeys(obj: Record<string, any>, keys: string[]): boolean {
    return keys.every((key) => key in obj);
  }

  /**
   * Validate two values are equal
   */
  static areEqual(value1: any, value2: any): boolean {
    return value1 === value2;
  }

  /**
   * Validate IP address (v4)
   */
  static isValidIPv4(ip: string): boolean {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipv4Regex.test(ip)) return false;

    const parts = ip.split('.');
    return parts.every((part) => {
      const num = parseInt(part, 10);
      return num >= 0 && num <= 255;
    });
  }

  /**
   * Validate IP address (v6)
   */
  static isValidIPv6(ip: string): boolean {
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    return ipv6Regex.test(ip);
  }

  /**
   * Validate MAC address
   */
  static isValidMACAddress(mac: string): boolean {
    return /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(mac);
  }

  /**
   * Validate port number
   */
  static isValidPort(port: number): boolean {
    return Number.isInteger(port) && port >= 0 && port <= 65535;
  }

  /**
   * Validate social security number (US)
   */
  static isValidSSN(ssn: string): boolean {
    return /^\d{3}-\d{2}-\d{4}$/.test(ssn);
  }

  /**
   * Validate postal code (US ZIP)
   */
  static isValidUSZip(zip: string): boolean {
    return /^\d{5}(-\d{4})?$/.test(zip);
  }

  /**
   * Validate IBAN (International Bank Account Number)
   */
  static isValidIBAN(iban: string): boolean {
    // Remove spaces and convert to uppercase
    const cleanIban = iban.replace(/\s/g, '').toUpperCase();

    // Check length (15-34 characters)
    if (cleanIban.length < 15 || cleanIban.length > 34) {
      return false;
    }

    // Check format (2 letters, 2 digits, then alphanumeric)
    return /^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(cleanIban);
  }

  /**
   * Validate slug (URL-friendly string)
   */
  static isValidSlug(slug: string): boolean {
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
  }

  /**
   * Create slug from string
   */
  static createSlug(str: string): string {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}

