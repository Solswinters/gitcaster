/**
 * Analytics type definitions
 */

export interface AnalyticsEvent {
  userId: string
  eventType: string
  eventData: Record<string, any>
  timestamp: Date
}

export interface MetricsHistory {
  userId: string
  date: Date
  metrics: Record<string, number>
}

export interface BenchmarkData {
  metric: string
  value: number
  percentile: number
  rank: number
  peerCount: number
}

export interface TimeSeriesDataPoint {
  timestamp: Date
  value: number
  metadata?: Record<string, any>
}

export interface AggregationOptions {
  period: 'day' | 'week' | 'month' | 'quarter' | 'year'
  method: 'sum' | 'average' | 'max' | 'min'
  fillGaps?: boolean
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'radar' | 'heatmap'
  title: string
  xAxisLabel?: string
  yAxisLabel?: string
  colors?: string[]
  showLegend?: boolean
  showGrid?: boolean
}

