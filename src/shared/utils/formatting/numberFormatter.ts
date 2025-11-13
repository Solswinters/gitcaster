/**
 * Number Formatting Utilities
 * 
 * Functions for formatting numbers, currency, and percentages
 */

/**
 * Format number with thousands separator
 */
export function formatNumber(num: number, decimals = 0): string {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format number as currency
 */
export function formatCurrency(
  amount: number,
  currency = 'USD',
  locale = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Format number as percentage
 */
export function formatPercent(value: number, decimals = 0): string {
  return `${formatNumber(value * 100, decimals)}%`;
}

/**
 * Format number as compact notation (K, M, B)
 */
export function formatCompact(num: number): string {
  const formatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  });
  return formatter.format(num);
}

/**
 * Format bytes to human readable format
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return (
    parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i]
  );
}

/**
 * Format large number with suffix (1K, 1M, 1B)
 */
export function formatLargeNumber(num: number, decimals = 1): string {
  if (num < 1000) return num.toString();

  const units = ['', 'K', 'M', 'B', 'T'];
  const order = Math.floor(Math.log10(Math.abs(num)) / 3);
  const unitName = units[order];
  const value = num / Math.pow(1000, order);

  return value.toFixed(decimals) + unitName;
}

/**
 * Format number as ordinal (1st, 2nd, 3rd)
 */
export function formatOrdinal(num: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = num % 100;
  return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

/**
 * Format phone number
 */
export function formatPhoneNumber(phone: string): string {
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
 * Format credit card number
 */
export function formatCreditCard(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\D/g, '');
  const groups = cleaned.match(/.{1,4}/g) || [];
  return groups.join(' ');
}

/**
 * Format SSN
 */
export function formatSSN(ssn: string): string {
  const cleaned = ssn.replace(/\D/g, '');
  
  if (cleaned.length === 9) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(5)}`;
  }
  
  return ssn;
}

/**
 * Format number with leading zeros
 */
export function padNumber(num: number, length: number): string {
  return num.toString().padStart(length, '0');
}

/**
 * Format decimal places
 */
export function toFixed(num: number, decimals: number): string {
  return num.toFixed(decimals);
}

/**
 * Round number to nearest multiple
 */
export function roundToNearest(num: number, multiple: number): number {
  return Math.round(num / multiple) * multiple;
}

/**
 * Clamp number between min and max
 */
export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}

/**
 * Calculate percentage change
 */
export function calculatePercentageChange(
  oldValue: number,
  newValue: number
): number {
  if (oldValue === 0) return newValue > 0 ? 100 : 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Format range
 */
export function formatRange(min: number, max: number): string {
  return `${formatNumber(min)} - ${formatNumber(max)}`;
}

/**
 * Format score with rating
 */
export function formatScore(
  score: number,
  maxScore = 100
): { formatted: string; percentage: number; rating: string } {
  const percentage = (score / maxScore) * 100;
  let rating: string;

  if (percentage >= 90) rating = 'Excellent';
  else if (percentage >= 75) rating = 'Good';
  else if (percentage >= 60) rating = 'Fair';
  else if (percentage >= 40) rating = 'Poor';
  else rating = 'Very Poor';

  return {
    formatted: `${formatNumber(score)} / ${formatNumber(maxScore)}`,
    percentage,
    rating,
  };
}

/**
 * Parse formatted number back to number
 */
export function parseFormattedNumber(formatted: string): number {
  return parseFloat(formatted.replace(/[^0-9.-]+/g, ''));
}

/**
 * Format duration in milliseconds to human readable
 */
export function formatDuration(ms: number): string {
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
 * Format file size with unit
 */
export function formatFileSize(bytes: number): string {
  return formatBytes(bytes, 2);
}

/**
 * Generate number range array
 */
export function range(start: number, end: number, step = 1): number[] {
  const result: number[] = [];
  for (let i = start; i <= end; i += step) {
    result.push(i);
  }
  return result;
}

/**
 * Average of numbers
 */
export function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
}

/**
 * Median of numbers
 */
export function median(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  
  const sorted = [...numbers].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }
  
  return sorted[middle];
}

/**
 * Sum of numbers
 */
export function sum(numbers: number[]): number {
  return numbers.reduce((acc, num) => acc + num, 0);
}

/**
 * Product of numbers
 */
export function product(numbers: number[]): number {
  return numbers.reduce((acc, num) => acc * num, 1);
}

