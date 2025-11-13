/**
 * Search Performance Monitoring
 */

import { performanceMonitor } from '@/shared/utils/performance';
import { analytics } from '@/shared/utils/analytics';

export interface SearchPerformanceMetrics {
  searchTime: number;
  resultsCount: number;
  filterCount: number;
  cacheHit: boolean;
}

/**
 * Track search performance
 */
export function trackSearchPerformance(metrics: SearchPerformanceMetrics): void {
  performanceMonitor.performance('search-execution', metrics.searchTime);

  analytics.track('search_performance', {
    searchTime: metrics.searchTime,
    resultsCount: metrics.resultsCount,
    filterCount: metrics.filterCount,
    cacheHit: metrics.cacheHit,
  });

  // Log slow searches
  if (metrics.searchTime > 2000) {
    console.warn('Slow search detected:', metrics);
  }
}

/**
 * Measure search execution time
 */
export async function measureSearchTime<T>(
  searchFn: () => Promise<T>
): Promise<{ result: T; duration: number }> {
  const startTime = performance.now();
  const result = await searchFn();
  const duration = performance.now() - startTime;

  return { result, duration };
}

/**
 * Debounce search input
 */
export function createSearchDebouncer(delay: number = 300) {
  let timeoutId: NodeJS.Timeout;

  return (callback: () => void) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(callback, delay);
  };
}

/**
 * Calculate search quality score
 */
export function calculateSearchQuality(metrics: {
  resultsCount: number;
  clickThroughRate: number;
  timeToFirstClick: number;
}): number {
  let score = 0;

  // Results count (0-30 points)
  if (metrics.resultsCount > 0) score += Math.min(30, metrics.resultsCount * 3);

  // Click-through rate (0-40 points)
  score += metrics.clickThroughRate * 40;

  // Time to first click (0-30 points)
  if (metrics.timeToFirstClick < 5000) {
    score += 30 - (metrics.timeToFirstClick / 5000) * 30;
  }

  return Math.round(score);
}

