/**
 * Analytics Repository Interface
 * 
 * Defines the contract for analytics data access operations.
 */

export interface AnalyticsEvent {
  userId: string;
  eventType: string;
  eventData: Record<string, any>;
  timestamp: Date;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface AnalyticsQuery {
  userId?: string;
  eventType?: string;
  startDate: Date;
  endDate: Date;
}

export interface IAnalyticsRepository {
  /**
   * Track an analytics event
   */
  trackEvent(event: AnalyticsEvent): Promise<void>;

  /**
   * Get analytics data for a query
   */
  getAnalytics(query: AnalyticsQuery): Promise<any[]>;

  /**
   * Get aggregated metrics
   */
  getMetrics(userId: string, metric: string): Promise<number>;

  /**
   * Get user activity timeline
   */
  getActivityTimeline(userId: string, days: number): Promise<any[]>;

  /**
   * Delete old analytics data
   */
  pruneOldData(beforeDate: Date): Promise<void>;
}

