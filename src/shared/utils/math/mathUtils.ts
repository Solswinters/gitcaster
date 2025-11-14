/**
 * Math Utilities
 *
 * Advanced mathematical operations and calculations
 *
 * @module shared/utils/math/mathUtils
 */

/**
 * Calculate mean (average)
 */
export function mean(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
}

/**
 * Calculate variance
 */
export function variance(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const avg = mean(numbers);
  return mean(numbers.map((n) => Math.pow(n - avg, 2)));
}

/**
 * Calculate standard deviation
 */
export function standardDeviation(numbers: number[]): number {
  return Math.sqrt(variance(numbers));
}

/**
 * Calculate percentile
 */
export function percentile(numbers: number[], p: number): number {
  if (numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const index = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index % 1;

  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

/**
 * Calculate correlation coefficient
 */
export function correlation(x: number[], y: number[]): number {
  if (x.length !== y.length || x.length === 0) return 0;

  const n = x.length;
  const meanX = mean(x);
  const meanY = mean(y);

  let numerator = 0;
  let denomX = 0;
  let denomY = 0;

  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    numerator += dx * dy;
    denomX += dx * dx;
    denomY += dy * dy;
  }

  return numerator / Math.sqrt(denomX * denomY);
}

/**
 * Linear regression
 */
export function linearRegression(
  x: number[],
  y: number[]
): { slope: number; intercept: number; r2: number } {
  if (x.length !== y.length || x.length === 0) {
    return { slope: 0, intercept: 0, r2: 0 };
  }

  const n = x.length;
  const meanX = mean(x);
  const meanY = mean(y);

  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < n; i++) {
    numerator += (x[i] - meanX) * (y[i] - meanY);
    denominator += Math.pow(x[i] - meanX, 2);
  }

  const slope = numerator / denominator;
  const intercept = meanY - slope * meanX;
  const r = correlation(x, y);
  const r2 = r * r;

  return { slope, intercept, r2 };
}

/**
 * Calculate moving average
 */
export function movingAverage(numbers: number[], window: number): number[] {
  const result: number[] = [];

  for (let i = 0; i < numbers.length; i++) {
    const start = Math.max(0, i - window + 1);
    const windowValues = numbers.slice(start, i + 1);
    result.push(mean(windowValues));
  }

  return result;
}

/**
 * Normalize values to 0-1 range
 */
export function normalize(numbers: number[]): number[] {
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);
  const range = max - min;

  if (range === 0) return numbers.map(() => 0);

  return numbers.map((n) => (n - min) / range);
}

/**
 * Exponential smoothing
 */
export function exponentialSmoothing(
  numbers: number[],
  alpha: number = 0.3
): number[] {
  if (numbers.length === 0) return [];

  const result: number[] = [numbers[0]];

  for (let i = 1; i < numbers.length; i++) {
    result.push(alpha * numbers[i] + (1 - alpha) * result[i - 1]);
  }

  return result;
}

