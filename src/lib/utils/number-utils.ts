/**
 * Number manipulation utility functions
 * Provides reusable number operations
 */

export class NumberUtils {
  /**
   * Clamp number between min and max
   */
  static clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * Check if number is between min and max (inclusive)
   */
  static inRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  }

  /**
   * Round to specified decimal places
   */
  static round(value: number, decimals: number = 0): number {
    const multiplier = Math.pow(10, decimals);
    return Math.round(value * multiplier) / multiplier;
  }

  /**
   * Floor to specified decimal places
   */
  static floor(value: number, decimals: number = 0): number {
    const multiplier = Math.pow(10, decimals);
    return Math.floor(value * multiplier) / multiplier;
  }

  /**
   * Ceil to specified decimal places
   */
  static ceil(value: number, decimals: number = 0): number {
    const multiplier = Math.pow(10, decimals);
    return Math.ceil(value * multiplier) / multiplier;
  }

  /**
   * Linear interpolation
   */
  static lerp(start: number, end: number, t: number): number {
    return start + (end - start) * t;
  }

  /**
   * Inverse linear interpolation
   */
  static inverseLerp(start: number, end: number, value: number): number {
    return (value - start) / (end - start);
  }

  /**
   * Map value from one range to another
   */
  static map(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  }

  /**
   * Get percentage
   */
  static percentage(value: number, total: number): number {
    return (value / total) * 100;
  }

  /**
   * Calculate value from percentage
   */
  static fromPercentage(percentage: number, total: number): number {
    return (percentage / 100) * total;
  }

  /**
   * Check if number is even
   */
  static isEven(value: number): boolean {
    return value % 2 === 0;
  }

  /**
   * Check if number is odd
   */
  static isOdd(value: number): boolean {
    return value % 2 !== 0;
  }

  /**
   * Check if number is prime
   */
  static isPrime(value: number): boolean {
    if (value <= 1) return false;
    if (value <= 3) return true;
    if (value % 2 === 0 || value % 3 === 0) return false;

    for (let i = 5; i * i <= value; i += 6) {
      if (value % i === 0 || value % (i + 2) === 0) return false;
    }

    return true;
  }

  /**
   * Get greatest common divisor
   */
  static gcd(a: number, b: number): number {
    a = Math.abs(a);
    b = Math.abs(b);

    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }

    return a;
  }

  /**
   * Get least common multiple
   */
  static lcm(a: number, b: number): number {
    return Math.abs(a * b) / this.gcd(a, b);
  }

  /**
   * Factorial
   */
  static factorial(n: number): number {
    if (n < 0) throw new Error('Factorial is not defined for negative numbers');
    if (n === 0 || n === 1) return 1;

    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }

    return result;
  }

  /**
   * Fibonacci sequence
   */
  static fibonacci(n: number): number {
    if (n < 0) throw new Error('Fibonacci is not defined for negative numbers');
    if (n === 0) return 0;
    if (n === 1) return 1;

    let a = 0;
    let b = 1;

    for (let i = 2; i <= n; i++) {
      const temp = a + b;
      a = b;
      b = temp;
    }

    return b;
  }

  /**
   * Power (base^exponent)
   */
  static pow(base: number, exponent: number): number {
    return Math.pow(base, exponent);
  }

  /**
   * Square root
   */
  static sqrt(value: number): number {
    return Math.sqrt(value);
  }

  /**
   * Cube root
   */
  static cbrt(value: number): number {
    return Math.cbrt(value);
  }

  /**
   * Absolute value
   */
  static abs(value: number): number {
    return Math.abs(value);
  }

  /**
   * Sign of number (-1, 0, 1)
   */
  static sign(value: number): number {
    return Math.sign(value);
  }

  /**
   * Convert degrees to radians
   */
  static degToRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  /**
   * Convert radians to degrees
   */
  static radToDeg(radians: number): number {
    return (radians * 180) / Math.PI;
  }

  /**
   * Random integer between min and max (inclusive)
   */
  static randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Random float between min and max
   */
  static randomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  /**
   * Sum of array
   */
  static sum(numbers: number[]): number {
    return numbers.reduce((acc, val) => acc + val, 0);
  }

  /**
   * Average of array
   */
  static average(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    return this.sum(numbers) / numbers.length;
  }

  /**
   * Median of array
   */
  static median(numbers: number[]): number {
    if (numbers.length === 0) return 0;

    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);

    return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  }

  /**
   * Mode (most frequent value)
   */
  static mode(numbers: number[]): number | null {
    if (numbers.length === 0) return null;

    const frequency: Record<number, number> = {};
    let maxFreq = 0;
    let mode: number | null = null;

    for (const num of numbers) {
      frequency[num] = (frequency[num] || 0) + 1;

      if (frequency[num] > maxFreq) {
        maxFreq = frequency[num];
        mode = num;
      }
    }

    return mode;
  }

  /**
   * Standard deviation
   */
  static standardDeviation(numbers: number[]): number {
    if (numbers.length === 0) return 0;

    const avg = this.average(numbers);
    const squareDiffs = numbers.map((value) => Math.pow(value - avg, 2));
    const avgSquareDiff = this.average(squareDiffs);

    return Math.sqrt(avgSquareDiff);
  }

  /**
   * Variance
   */
  static variance(numbers: number[]): number {
    if (numbers.length === 0) return 0;

    const avg = this.average(numbers);
    const squareDiffs = numbers.map((value) => Math.pow(value - avg, 2));

    return this.average(squareDiffs);
  }

  /**
   * Distance between two points (2D)
   */
  static distance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  /**
   * Distance between two points (3D)
   */
  static distance3D(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): number {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2));
  }

  /**
   * Format number with commas
   */
  static formatWithCommas(value: number): string {
    return value.toLocaleString();
  }

  /**
   * Format as currency
   */
  static formatCurrency(value: number, currency: string = 'USD', locale: string = 'en-US'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(value);
  }

  /**
   * Format as percentage
   */
  static formatPercentage(value: number, decimals: number = 2): string {
    return `${value.toFixed(decimals)}%`;
  }

  /**
   * Parse number from string
   */
  static parse(value: string): number | null {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? null : parsed;
  }

  /**
   * Check if value is number
   */
  static isNumber(value: any): value is number {
    return typeof value === 'number' && !isNaN(value);
  }

  /**
   * Check if value is integer
   */
  static isInteger(value: any): boolean {
    return Number.isInteger(value);
  }

  /**
   * Check if value is finite
   */
  static isFinite(value: any): boolean {
    return Number.isFinite(value);
  }

  /**
   * Check if value is safe integer
   */
  static isSafeInteger(value: any): boolean {
    return Number.isSafeInteger(value);
  }

  /**
   * Get min from array
   */
  static min(numbers: number[]): number {
    return Math.min(...numbers);
  }

  /**
   * Get max from array
   */
  static max(numbers: number[]): number {
    return Math.max(...numbers);
  }

  /**
   * Normalize value to 0-1 range
   */
  static normalize(value: number, min: number, max: number): number {
    return (value - min) / (max - min);
  }

  /**
   * Denormalize value from 0-1 range
   */
  static denormalize(value: number, min: number, max: number): number {
    return value * (max - min) + min;
  }

  /**
   * Smooth step (cubic interpolation)
   */
  static smoothStep(edge0: number, edge1: number, x: number): number {
    const t = this.clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  /**
   * Smoother step (quintic interpolation)
   */
  static smootherStep(edge0: number, edge1: number, x: number): number {
    const t = this.clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return t * t * t * (t * (t * 6 - 15) + 10);
  }
}

