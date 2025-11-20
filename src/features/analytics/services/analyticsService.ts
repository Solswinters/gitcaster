/**
 * Analytics Service
 * 
 * Service for fetching and processing analytics data
 */

import { apiClient } from '@/shared/services/apiClient';
import type { 
  DashboardData, 
  AnalyticsFilter,
  PredictionData,
  ComparisonData 
} from '../types/analytics.types';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface MetricsSummary {
  totalCommits: number;
  totalPullRequests: number;
  totalIssues: number;
  totalRepositories: number;
  totalStars: number;
  totalForks: number;
  averageCommitsPerDay: number;
  mostActiveDay: string;
  longestStreak: number;
  currentStreak: number;
}

interface SkillMetrics {
  language: string;
  linesOfCode: number;
  repositories: number;
  proficiencyScore: number;
  trend: 'up' | 'down' | 'stable';
}

interface ActivityTrend {
  date: string;
  commits: number;
  pullRequests: number;
  issues: number;
  reviews: number;
}

export class AnalyticsService {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  /**
   * Get cached data or fetch from API
   */
  private async getCachedOrFetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    useCache: boolean = true,
  ): Promise<T> {
    if (useCache) {
      const cached = this.cache.get(key);
      const now = Date.now();

      if (cached && cached.expiresAt > now) {
        return cached.data as T;
      }
    }

    const data = await fetcher();
    const now = Date.now();

    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + this.CACHE_DURATION,
    });

    return data;
  }

  /**
   * Clear cache for specific key or all cache
   */
  clearCache(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Fetch dashboard data
   */
  async getDashboardData(
    userId: string,
    filter?: AnalyticsFilter,
    useCache: boolean = true,
  ): Promise<DashboardData> {
    const params = new URLSearchParams();
    
    if (filter) {
      if (filter.dateRange) {
        params.set('startDate', filter.dateRange.start.toString());
        params.set('endDate', filter.dateRange.end.toString());
      }
      if (filter.groupBy) {
        params.set('groupBy', filter.groupBy);
      }
      if (filter.includePrivate !== undefined) {
        params.set('includePrivate', filter.includePrivate.toString());
      }
    }

    const queryString = params.toString();
    const url = `/api/analytics/metrics?${queryString}`;
    const cacheKey = `dashboard:${userId}:${queryString}`;

    return this.getCachedOrFetch(
      cacheKey,
      () => apiClient.get<DashboardData>(url),
      useCache,
    );
  }

  /**
   * Fetch career predictions
   */
  async getPredictions(userId: string): Promise<PredictionData[]> {
    return await apiClient.get<PredictionData[]>(`/api/analytics/predict`);
  }

  /**
   * Fetch comparison data
   */
  async getComparison(userId: string, compareWith: string[]): Promise<ComparisonData[]> {
    const params = new URLSearchParams();
    compareWith.forEach(id => params.append('users', id));

    return await apiClient.get<ComparisonData[]>(`/api/analytics/compare?${params.toString()}`);
  }

  /**
   * Export analytics data
   */
  async exportData(userId: string, format: 'json' | 'csv' | 'pdf'): Promise<Blob> {
    const response = await fetch(`/api/analytics/export?format=${format}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    return await response.blob();
  }

  /**
   * Get career timeline
   */
  async getCareerTimeline(userId: string) {
    return await apiClient.get(`/api/analytics/career`);
  }

  /**
   * Get activity heatmap data
   */
  async getActivityHeatmap(userId: string, year: number, useCache: boolean = true) {
    const cacheKey = `heatmap:${userId}:${year}`;
    return this.getCachedOrFetch(
      cacheKey,
      () => apiClient.get(`/api/analytics/activity?year=${year}`),
      useCache,
    );
  }

  /**
   * Get metrics summary
   */
  async getMetricsSummary(userId: string): Promise<MetricsSummary> {
    const cacheKey = `metrics-summary:${userId}`;
    return this.getCachedOrFetch(
      cacheKey,
      () => apiClient.get<MetricsSummary>(`/api/analytics/summary`),
    );
  }

  /**
   * Get skill metrics
   */
  async getSkillMetrics(userId: string): Promise<SkillMetrics[]> {
    const cacheKey = `skill-metrics:${userId}`;
    return this.getCachedOrFetch(
      cacheKey,
      () => apiClient.get<SkillMetrics[]>(`/api/analytics/skills`),
    );
  }

  /**
   * Get activity trends
   */
  async getActivityTrends(
    userId: string,
    days: number = 30,
  ): Promise<ActivityTrend[]> {
    const cacheKey = `activity-trends:${userId}:${days}`;
    return this.getCachedOrFetch(
      cacheKey,
      () => apiClient.get<ActivityTrend[]>(`/api/analytics/trends?days=${days}`),
    );
  }

  /**
   * Calculate growth rate for a metric
   */
  calculateGrowthRate(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  }

  /**
   * Calculate percentile rank
   */
  calculatePercentile(value: number, dataset: number[]): number {
    if (dataset.length === 0) return 0;

    const sorted = [...dataset].sort((a, b) => a - b);
    const index = sorted.findIndex((v) => v >= value);

    if (index === -1) return 100;
    return (index / sorted.length) * 100;
  }

  /**
   * Aggregate data by time period
   */
  aggregateByPeriod(
    data: ActivityTrend[],
    period: 'day' | 'week' | 'month',
  ): ActivityTrend[] {
    const aggregated = new Map<string, ActivityTrend>();

    data.forEach((item) => {
      const date = new Date(item.date);
      let key: string;

      switch (period) {
        case 'week': {
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = weekStart.toISOString().split('T')[0] as string;
          break;
        }
        case 'month':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        default:
          key = item.date;
      }

      const existing = aggregated.get(key);
      if (existing) {
        existing.commits += item.commits;
        existing.pullRequests += item.pullRequests;
        existing.issues += item.issues;
        existing.reviews += item.reviews;
      } else {
        aggregated.set(key, { ...item, date: key });
      }
    });

    return Array.from(aggregated.values()).sort((a, b) =>
      a.date.localeCompare(b.date),
    );
  }

  /**
   * Calculate moving average
   */
  calculateMovingAverage(data: number[], windowSize: number): number[] {
    const result: number[] = [];

    for (let i = 0; i < data.length; i++) {
      const start = Math.max(0, i - windowSize + 1);
      const window = data.slice(start, i + 1);
      const avg = window.reduce((sum, val) => sum + val, 0) / window.length;
      result.push(avg);
    }

    return result;
  }

  /**
   * Detect anomalies in data
   */
  detectAnomalies(data: number[], threshold: number = 2): number[] {
    if (data.length < 3) return [];

    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    const variance =
      data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
    const stdDev = Math.sqrt(variance);

    const anomalies: number[] = [];
    data.forEach((value, index) => {
      const zScore = Math.abs((value - mean) / stdDev);
      if (zScore > threshold) {
        anomalies.push(index);
      }
    });

    return anomalies;
  }

  /**
   * Get contribution score
   */
  calculateContributionScore(summary: MetricsSummary): number {
    // Weighted scoring system
    const weights = {
      commits: 1,
      pullRequests: 3,
      issues: 2,
      stars: 5,
      forks: 4,
      streak: 2,
    };

    let score = 0;
    score += summary.totalCommits * weights.commits;
    score += summary.totalPullRequests * weights.pullRequests;
    score += summary.totalIssues * weights.issues;
    score += summary.totalStars * weights.stars;
    score += summary.totalForks * weights.forks;
    score += summary.currentStreak * weights.streak;

    return Math.round(score);
  }

  /**
   * Get engagement level
   */
  getEngagementLevel(
    averageCommitsPerDay: number,
  ): 'low' | 'medium' | 'high' | 'very_high' {
    if (averageCommitsPerDay < 1) return 'low';
    if (averageCommitsPerDay < 3) return 'medium';
    if (averageCommitsPerDay < 10) return 'high';
    return 'very_high';
  }

  /**
   * Refresh all cached data for user
   */
  async refreshUserData(userId: string): Promise<void> {
    // Clear all cache entries for this user
    for (const key of this.cache.keys()) {
      if (key.includes(userId)) {
        this.cache.delete(key);
      }
    }

    // Fetch fresh data
    await Promise.all([
      this.getDashboardData(userId, undefined, false),
      this.getMetricsSummary(userId),
      this.getSkillMetrics(userId),
      this.getActivityTrends(userId),
    ]);
  }
}

export const analyticsService = new AnalyticsService();

