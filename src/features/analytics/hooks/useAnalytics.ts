/**
 * Analytics Hooks
 */

import { useAsync } from '@/shared/hooks/useAsync';
import { analyticsService } from '../services/analyticsService';
import type { AnalyticsFilter } from '../types/analytics.types';

/**
 * Hook for dashboard data
 */
export function useDashboardData(userId: string, filter?: AnalyticsFilter) {
  return useAsync(
    async () => analyticsService.getDashboardData(userId, filter),
    {
      immediate: true,
      onError: (error) => {
        console.error('Failed to load dashboard data:', error);
      },
    }
  );
}

/**
 * Hook for career predictions
 */
export function usePredictions(userId: string) {
  return useAsync(
    async () => analyticsService.getPredictions(userId),
    {
      immediate: true,
    }
  );
}

/**
 * Hook for comparison data
 */
export function useComparison(userId: string, compareWith: string[]) {
  return useAsync(
    async () => analyticsService.getComparison(userId, compareWith),
    {
      immediate: compareWith.length > 0,
    }
  );
}

/**
 * Hook for career timeline
 */
export function useCareerTimeline(userId: string) {
  return useAsync(
    async () => analyticsService.getCareerTimeline(userId),
    {
      immediate: true,
    }
  );
}

/**
 * Hook for activity heatmap
 */
export function useActivityHeatmap(userId: string, year: number) {
  return useAsync(
    async () => analyticsService.getActivityHeatmap(userId, year),
    {
      immediate: true,
    }
  );
}

