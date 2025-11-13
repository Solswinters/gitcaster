/**
 * Analytics Service
 * 
 * Service for fetching analytics data
 */

import { apiClient } from '@/shared/services/apiClient';
import type { 
  DashboardData, 
  AnalyticsFilter,
  PredictionData,
  ComparisonData 
} from '../types/analytics.types';

export class AnalyticsService {
  /**
   * Fetch dashboard data
   */
  async getDashboardData(userId: string, filter?: AnalyticsFilter): Promise<DashboardData> {
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

    return await apiClient.get<DashboardData>(url);
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
  async getActivityHeatmap(userId: string, year: number) {
    return await apiClient.get(`/api/analytics/activity?year=${year}`);
  }
}

export const analyticsService = new AnalyticsService();

