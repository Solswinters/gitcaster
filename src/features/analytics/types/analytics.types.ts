/**
 * Analytics Feature Types
 */

export interface MetricCard {
  id: string;
  title: string;
  value: number | string;
  change?: number;
  changeType?: 'increase' | 'decrease';
  icon?: string;
  trend?: number[];
}

export interface TimeSeriesData {
  timestamp: Date | string;
  value: number;
  label?: string;
}

export interface LanguageStats {
  language: string;
  percentage: number;
  linesOfCode: number;
  color?: string;
}

export interface ContributionActivity {
  date: Date | string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface SkillData {
  name: string;
  proficiency: number;
  yearsExperience?: number;
  projectCount?: number;
}

export interface CareerMilestone {
  id: string;
  date: Date | string;
  title: string;
  description: string;
  type: 'education' | 'work' | 'project' | 'achievement';
  icon?: string;
}

export interface PredictionData {
  metric: string;
  currentValue: number;
  predictedValue: number;
  confidence: number;
  timeframe: string;
}

export interface ComparisonData {
  userId: string;
  username: string;
  metrics: Record<string, number>;
  rank?: number;
}

export interface DashboardData {
  metrics: MetricCard[];
  activity: ContributionActivity[];
  languages: LanguageStats[];
  skills: SkillData[];
  timeline: CareerMilestone[];
  predictions?: PredictionData[];
}

export interface AnalyticsFilter {
  dateRange: {
    start: Date | string;
    end: Date | string;
  };
  groupBy?: 'day' | 'week' | 'month' | 'year';
  includePrivate?: boolean;
}

export interface ExportOptions {
  format: 'json' | 'csv' | 'pdf';
  sections: string[];
  includeCharts?: boolean;
}

