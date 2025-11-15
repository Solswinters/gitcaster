/**
 * Data aggregation utilities for analytics
 * Aggregates and processes raw data for analysis
 */

export type AggregationPeriod = 'day' | 'week' | 'month' | 'quarter' | 'year'

export interface AggregatedData {
  period: string
  startDate: Date
  endDate: Date
  metrics: Record<string, number>
  count: number
}

export class DataAggregator {
  /**
   * Aggregate time series data by period
   */
  static aggregateByPeriod(
    data: Array<{ timestamp: Date; values: Record<string, number> }>,
    period: AggregationPeriod,
    aggregationType: 'sum' | 'average' | 'max' | 'min' = 'sum'
  ): AggregatedData[] {
    const grouped = this.groupByPeriod(data, period)
    return this.computeAggregation(grouped, aggregationType)
  }

  /**
   * Calculate rolling average
   */
  static rollingAverage(
    data: Array<{ timestamp: Date; value: number }>,
    windowSize: number
  ): Array<{ timestamp: Date; value: number; average: number }> {
    const sorted = [...data].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    
    return sorted.map((item, index) => {
      const start = Math.max(0, index - windowSize + 1)
      const window = sorted.slice(start, index + 1)
      const sum = window.reduce((acc, d) => acc + d.value, 0)
      const average = sum / window.length

      return {
        ...item,
        average: Math.round(average * 100) / 100,
      }
    })
  }

  /**
   * Calculate growth rate between periods
   */
  static calculateGrowthRate(
    current: Record<string, number>,
    previous: Record<string, number>
  ): Record<string, { absolute: number; percentage: number }> {
    const growth: Record<string, any> = {}

    Object.keys(current).forEach((key) => {
      const currentValue = current[key]
      const previousValue = previous[key] || 0
      const absolute = currentValue - previousValue
      const percentage = previousValue !== 0 ? (absolute / previousValue) * 100 : 0

      growth[key] = {
        absolute: Math.round(absolute * 100) / 100,
        percentage: Math.round(percentage * 10) / 10,
      }
    })

    return growth
  }

  /**
   * Calculate percentiles for metrics
   */
  static calculatePercentiles(
    values: number[],
    percentiles: number[] = [25, 50, 75, 90, 95, 99]
  ): Record<number, number> {
    if (values.length === 0) return {}

    const sorted = [...values].sort((a, b) => a - b)
    const result: Record<number, number> = {}

    percentiles.forEach((p) => {
      const index = Math.ceil((p / 100) * sorted.length) - 1
      result[p] = sorted[Math.max(0, index)]
    })

    return result
  }

  /**
   * Detect anomalies in time series data
   */
  static detectAnomalies(
    data: Array<{ timestamp: Date; value: number }>,
    threshold: number = 2
  ): Array<{
    timestamp: Date
    value: number
    isAnomaly: boolean
    zScore: number
  }> {
    const values = data.map((d) => d.value)
    const mean = values.reduce((a, b) => a + b, 0) / values.length
    const stdDev = Math.sqrt(
      values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / values.length
    )

    return data.map((item) => {
      const zScore = stdDev !== 0 ? (item.value - mean) / stdDev : 0
      const isAnomaly = Math.abs(zScore) > threshold

      return {
        ...item,
        isAnomaly,
        zScore: Math.round(zScore * 100) / 100,
      }
    })
  }

  /**
   * Calculate correlation between two metrics
   */
  static calculateCorrelation(
    series1: number[],
    series2: number[]
  ): {
    coefficient: number
    strength: 'strong' | 'moderate' | 'weak' | 'none'
    direction: 'positive' | 'negative' | 'none'
  } {
    if (series1.length !== series2.length || series1.length < 2) {
      return { coefficient: 0, strength: 'none', direction: 'none' }
    }

    const n = series1.length
    const mean1 = series1.reduce((a, b) => a + b, 0) / n
    const mean2 = series2.reduce((a, b) => a + b, 0) / n

    let numerator = 0
    let sumSq1 = 0
    let sumSq2 = 0

    for (let i = 0; i < n; i++) {
      const diff1 = series1[i] - mean1
      const diff2 = series2[i] - mean2
      numerator += diff1 * diff2
      sumSq1 += diff1 * diff1
      sumSq2 += diff2 * diff2
    }

    const denominator = Math.sqrt(sumSq1 * sumSq2)
    const coefficient = denominator !== 0 ? numerator / denominator : 0

    let strength: 'strong' | 'moderate' | 'weak' | 'none'
    const absCoeff = Math.abs(coefficient)
    if (absCoeff >= 0.7) strength = 'strong'
    else if (absCoeff >= 0.4) strength = 'moderate'
    else if (absCoeff >= 0.2) strength = 'weak'
    else strength = 'none'

    let direction: 'positive' | 'negative' | 'none'
    if (coefficient > 0.1) direction = 'positive'
    else if (coefficient < -0.1) direction = 'negative'
    else direction = 'none'

    return {
      coefficient: Math.round(coefficient * 100) / 100,
      strength,
      direction,
    }
  }

  /**
   * Segment data by ranges
   */
  static segmentByRange<T extends Record<string, any>>(
    data: T[],
    metricKey: string,
    ranges: Array<{ min: number; max: number; label: string }>
  ): Record<string, T[]> {
    const segments: Record<string, T[]> = {}
    ranges.forEach((range) => {
      segments[range.label] = []
    })

    data.forEach((item) => {
      const value = item[metricKey]
      for (const range of ranges) {
        if (value >= range.min && value < range.max) {
          segments[range.label].push(item)
          break
        }
      }
    })

    return segments
  }

  /**
   * Calculate distribution statistics
   */
  static calculateDistribution(values: number[]): {
    mean: number
    median: number
    mode: number
    stdDev: number
    variance: number
    range: { min: number; max: number }
    quartiles: { q1: number; q2: number; q3: number }
  } {
    if (values.length === 0) {
      return {
        mean: 0,
        median: 0,
        mode: 0,
        stdDev: 0,
        variance: 0,
        range: { min: 0, max: 0 },
        quartiles: { q1: 0, q2: 0, q3: 0 },
      }
    }

    const sorted = [...values].sort((a, b) => a - b)
    const n = sorted.length

    // Mean
    const mean = sorted.reduce((a, b) => a + b, 0) / n

    // Median
    const median = n % 2 === 0
      ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
      : sorted[Math.floor(n / 2)]

    // Mode
    const frequency: Record<number, number> = {}
    sorted.forEach((v) => {
      frequency[v] = (frequency[v] || 0) + 1
    })
    const mode = Number(
      Object.entries(frequency).reduce((a, b) => (b[1] > a[1] ? b : a))[0]
    )

    // Variance and Standard Deviation
    const variance = sorted.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / n
    const stdDev = Math.sqrt(variance)

    // Range
    const range = { min: sorted[0], max: sorted[n - 1] }

    // Quartiles
    const q1Index = Math.floor(n * 0.25)
    const q2Index = Math.floor(n * 0.50)
    const q3Index = Math.floor(n * 0.75)

    const quartiles = {
      q1: sorted[q1Index],
      q2: sorted[q2Index],
      q3: sorted[q3Index],
    }

    return {
      mean: Math.round(mean * 100) / 100,
      median: Math.round(median * 100) / 100,
      mode,
      stdDev: Math.round(stdDev * 100) / 100,
      variance: Math.round(variance * 100) / 100,
      range,
      quartiles,
    }
  }

  // Private helper methods
  private static groupByPeriod(
    data: Array<{ timestamp: Date; values: Record<string, number> }>,
    period: AggregationPeriod
  ): Map<string, Array<{ timestamp: Date; values: Record<string, number> }>> {
    const groups = new Map<string, typeof data>()

    data.forEach((item) => {
      const key = this.getPeriodKey(item.timestamp, period)
      if (!groups.has(key)) {
        groups.set(key, [])
      }
      groups.get(key)!.push(item)
    })

    return groups
  }

  private static getPeriodKey(date: Date, period: AggregationPeriod): string {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    switch (period) {
      case 'day':
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      case 'week':
        return `${year}-W${this.getWeekNumber(date)}`
      case 'month':
        return `${year}-${String(month).padStart(2, '0')}`
      case 'quarter':
        return `${year}-Q${Math.ceil(month / 3)}`
      case 'year':
        return `${year}`
    }
  }

  private static getWeekNumber(date: Date): string {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    const dayNum = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
    return String(weekNo).padStart(2, '0')
  }

  private static computeAggregation(
    groups: Map<string, Array<{ timestamp: Date; values: Record<string, number> }>>,
    aggregationType: 'sum' | 'average' | 'max' | 'min'
  ): AggregatedData[] {
    const results: AggregatedData[] = []

    groups.forEach((items, period) => {
      const timestamps = items.map((i) => i.timestamp)
      const startDate = new Date(Math.min(...timestamps.map((t) => t.getTime())))
      const endDate = new Date(Math.max(...timestamps.map((t) => t.getTime())))

      const metricKeys = new Set<string>()
      items.forEach((item) => {
        Object.keys(item.values).forEach((key) => metricKeys.add(key))
      })

      const metrics: Record<string, number> = {}
      metricKeys.forEach((key) => {
        const values = items
          .map((item) => item.values[key])
          .filter((v) => v !== undefined)

        if (values.length > 0) {
          switch (aggregationType) {
            case 'sum':
              metrics[key] = values.reduce((a, b) => a + b, 0)
              break
            case 'average':
              metrics[key] = values.reduce((a, b) => a + b, 0) / values.length
              break
            case 'max':
              metrics[key] = Math.max(...values)
              break
            case 'min':
              metrics[key] = Math.min(...values)
              break
          }
        }
      })

      results.push({
        period,
        startDate,
        endDate,
        metrics,
        count: items.length,
      })
    })

    return results.sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
  }
}

