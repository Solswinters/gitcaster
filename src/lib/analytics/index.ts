/**
 * Analytics module exports
 * Central export point for all analytics functionality
 */

export { MetricsCalculator } from './metrics-calculator'
export type { DeveloperMetrics, TrendData, SkillTrend } from './metrics-calculator'

export { CareerProgressionTracker } from './career-progression'
export type {
  CareerMilestone,
  SkillProgression,
  CareerStage,
  CareerTrajectory,
} from './career-progression'

export { ChartDataFormatter } from './chart-data-formatter'
export type {
  ChartDataPoint,
  TimeSeriesPoint,
  MultiSeriesData,
} from './chart-data-formatter'

export { ComparisonEngine } from './comparison-engine'
export type {
  ComparisonResult,
  DeveloperComparison,
} from './comparison-engine'

export { ReportGenerator } from './report-generator'
export type {
  ReportSection,
  AnalyticsReport,
  ReportFormat,
} from './report-generator'

export { PredictiveAnalytics } from './predictive-analytics'
export type {
  GrowthPrediction,
  CareerPrediction,
} from './predictive-analytics'

export { DataAggregator } from './data-aggregator'
export type {
  AggregationPeriod,
  AggregatedData,
} from './data-aggregator'

