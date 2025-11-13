/**
 * Number Utilities
 *
 * Advanced number manipulation and math utilities
 *
 * @module shared/utils/number/numberUtils
 */

/**
 * Clamp number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Round to specific decimal places
 */
export function roundTo(value: number, decimals: number = 0): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

/**
 * Calculate percentage
 */
export function percentage(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}

/**
 * Calculate percentage change
 */
export function percentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return newValue === 0 ? 0 : 100;
  return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Linear interpolation
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Map value from one range to another
 */
export function map(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * Check if number is in range (inclusive)
 */
export function inRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Generate random integer between min and max (inclusive)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate random float between min and max
 */
export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Sum array of numbers
 */
export function sum(numbers: number[]): number {
  return numbers.reduce((acc, n) => acc + n, 0);
}

/**
 * Calculate average of numbers
 */
export function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return sum(numbers) / numbers.length;
}

/**
 * Calculate median of numbers
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
 * Find minimum value in array
 */
export function min(numbers: number[]): number {
  return Math.min(...numbers);
}

/**
 * Find maximum value in array
 */
export function max(numbers: number[]): number {
  return Math.max(...numbers);
}

/**
 * Calculate standard deviation
 */
export function standardDeviation(numbers: number[]): number {
  if (numbers.length === 0) return 0;

  const avg = average(numbers);
  const squaredDiffs = numbers.map((n) => Math.pow(n - avg, 2));
  const avgSquaredDiff = average(squaredDiffs);

  return Math.sqrt(avgSquaredDiff);
}

/**
 * Check if number is even
 */
export function isEven(n: number): boolean {
  return n % 2 === 0;
}

/**
 * Check if number is odd
 */
export function isOdd(n: number): boolean {
  return n % 2 !== 0;
}

/**
 * Check if number is prime
 */
export function isPrime(n: number): boolean {
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;

  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }

  return true;
}

/**
 * Calculate factorial
 */
export function factorial(n: number): number {
  if (n < 0) throw new Error('Factorial not defined for negative numbers');
  if (n === 0 || n === 1) return 1;
  return n * factorial(n - 1);
}

/**
 * Calculate greatest common divisor
 */
export function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/**
 * Calculate least common multiple
 */
export function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

/**
 * Parse bytes from string
 */
export function parseBytes(str: string): number {
  const units: Record<string, number> = {
    B: 1,
    KB: 1024,
    MB: 1024 ** 2,
    GB: 1024 ** 3,
    TB: 1024 ** 4,
    PB: 1024 ** 5,
  };

  const match = str.match(/^(\d+(?:\.\d+)?)\s*([A-Z]+)$/i);
  if (!match) return 0;

  const [, value, unit] = match;
  return parseFloat(value) * (units[unit.toUpperCase()] || 1);
}

/**
 * Check if value is numeric
 */
export function isNumeric(value: unknown): boolean {
  return !isNaN(parseFloat(String(value))) && isFinite(Number(value));
}

/**
 * Safe division (returns 0 if divisor is 0)
 */
export function safeDivide(a: number, b: number): number {
  return b === 0 ? 0 : a / b;
}

/**
 * Format number with ordinal suffix (1st, 2nd, 3rd, etc.)
 */
export function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

