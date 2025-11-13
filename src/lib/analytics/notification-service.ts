/**
 * Analytics notification service
 */

export interface AnalyticsNotification {
  id: string
  type: 'milestone' | 'insight' | 'warning' | 'achievement'
  title: string
  message: string
  priority: 'high' | 'medium' | 'low'
  createdAt: Date
  read: boolean
}

export class AnalyticsNotificationService {
  static createMilestoneNotification(milestone: string): AnalyticsNotification {
    return {
      id: `milestone-${Date.now()}`,
      type: 'milestone',
      title: 'Milestone Reached!',
      message: milestone,
      priority: 'high',
      createdAt: new Date(),
      read: false,
    }
  }

  static createInsightNotification(insight: string): AnalyticsNotification {
    return {
      id: `insight-${Date.now()}`,
      type: 'insight',
      title: 'New Insight',
      message: insight,
      priority: 'medium',
      createdAt: new Date(),
      read: false,
    }
  }

  static createWarningNotification(warning: string): AnalyticsNotification {
    return {
      id: `warning-${Date.now()}`,
      type: 'warning',
      title: 'Attention Needed',
      message: warning,
      priority: 'high',
      createdAt: new Date(),
      read: false,
    }
  }
}

