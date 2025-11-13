/**
 * Chart data formatters for analytics visualizations
 * Formats metrics data for various chart types
 */

export interface ChartDataPoint {
  label: string
  value: number
  color?: string
  metadata?: Record<string, any>
}

export interface TimeSeriesPoint {
  timestamp: Date
  value: number
  label?: string
}

export interface MultiSeriesData {
  series: string
  data: TimeSeriesPoint[]
  color?: string
}

export class ChartDataFormatter {
  /**
   * Format data for line charts (time series)
   */
  static formatLineChart(
    data: TimeSeriesPoint[],
    options?: {
      fillGaps?: boolean
      smoothing?: boolean
      aggregation?: 'day' | 'week' | 'month'
    }
  ): {
    labels: string[]
    data: number[]
    timestamps: Date[]
  } {
    let processedData = [...data].sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
    )

    if (options?.aggregation) {
      processedData = this.aggregateByPeriod(processedData, options.aggregation)
    }

    if (options?.fillGaps) {
      processedData = this.fillTimeGaps(processedData, options.aggregation)
    }

    return {
      labels: processedData.map((d) => this.formatDateLabel(d.timestamp, options?.aggregation)),
      data: processedData.map((d) => d.value),
      timestamps: processedData.map((d) => d.timestamp),
    }
  }

  /**
   * Format data for bar charts
   */
  static formatBarChart(
    data: ChartDataPoint[],
    options?: {
      sortBy?: 'value' | 'label'
      limit?: number
      showPercentages?: boolean
    }
  ): {
    labels: string[]
    data: number[]
    colors?: string[]
    percentages?: number[]
  } {
    let processedData = [...data]

    if (options?.sortBy === 'value') {
      processedData.sort((a, b) => b.value - a.value)
    } else if (options?.sortBy === 'label') {
      processedData.sort((a, b) => a.label.localeCompare(b.label))
    }

    if (options?.limit && processedData.length > options.limit) {
      const limited = processedData.slice(0, options.limit)
      const others = processedData.slice(options.limit)
      const othersSum = others.reduce((sum, d) => sum + d.value, 0)
      
      if (othersSum > 0) {
        limited.push({
          label: 'Others',
          value: othersSum,
          color: '#9CA3AF',
        })
      }
      processedData = limited
    }

    const total = processedData.reduce((sum, d) => sum + d.value, 0)
    const percentages = options?.showPercentages
      ? processedData.map((d) => (d.value / total) * 100)
      : undefined

    return {
      labels: processedData.map((d) => d.label),
      data: processedData.map((d) => d.value),
      colors: processedData.map((d) => d.color),
      percentages,
    }
  }

  /**
   * Format data for pie/donut charts
   */
  static formatPieChart(
    data: ChartDataPoint[],
    options?: {
      minPercentage?: number
      colors?: string[]
    }
  ): {
    labels: string[]
    data: number[]
    colors: string[]
    percentages: number[]
  } {
    const total = data.reduce((sum, d) => sum + d.value, 0)
    let processedData = data.map((d) => ({
      ...d,
      percentage: (d.value / total) * 100,
    }))

    if (options?.minPercentage) {
      const filtered = processedData.filter(
        (d) => d.percentage >= options.minPercentage!
      )
      const others = processedData.filter(
        (d) => d.percentage < options.minPercentage!
      )
      const othersSum = others.reduce((sum, d) => sum + d.value, 0)
      const othersPercentage = others.reduce((sum, d) => sum + d.percentage, 0)

      if (othersSum > 0) {
        filtered.push({
          label: 'Others',
          value: othersSum,
          color: '#9CA3AF',
          percentage: othersPercentage,
        })
      }
      processedData = filtered
    }

    const defaultColors = this.generateColorPalette(processedData.length)

    return {
      labels: processedData.map((d) => d.label),
      data: processedData.map((d) => d.value),
      colors: processedData.map((d, i) => 
        d.color || options?.colors?.[i] || defaultColors[i]
      ),
      percentages: processedData.map((d) => d.percentage),
    }
  }

  /**
   * Format data for radar charts (skill profiles)
   */
  static formatRadarChart(
    data: ChartDataPoint[],
    options?: {
      maxValue?: number
      normalize?: boolean
    }
  ): {
    labels: string[]
    data: number[]
    maxValue: number
  } {
    let processedData = [...data]
    let maxValue = options?.maxValue || 100

    if (options?.normalize) {
      const max = Math.max(...processedData.map((d) => d.value))
      processedData = processedData.map((d) => ({
        ...d,
        value: (d.value / max) * 100,
      }))
      maxValue = 100
    }

    return {
      labels: processedData.map((d) => d.label),
      data: processedData.map((d) => d.value),
      maxValue,
    }
  }

  /**
   * Format data for multi-series line charts
   */
  static formatMultiSeriesChart(
    data: MultiSeriesData[],
    options?: {
      alignTimestamps?: boolean
      fillGaps?: boolean
    }
  ): {
    labels: string[]
    datasets: Array<{
      label: string
      data: number[]
      color?: string
    }>
    timestamps: Date[]
  } {
    // Find all unique timestamps
    const allTimestamps = new Set<number>()
    data.forEach((series) => {
      series.data.forEach((point) => {
        allTimestamps.add(point.timestamp.getTime())
      })
    })

    const sortedTimestamps = Array.from(allTimestamps)
      .sort()
      .map((ts) => new Date(ts))

    // Create datasets for each series
    const datasets = data.map((series) => {
      const dataMap = new Map<number, number>()
      series.data.forEach((point) => {
        dataMap.set(point.timestamp.getTime(), point.value)
      })

      const alignedData = sortedTimestamps.map((ts) => {
        const value = dataMap.get(ts.getTime())
        if (value !== undefined) return value
        if (options?.fillGaps) {
          // Simple forward-fill
          return this.getLastKnownValue(dataMap, ts.getTime())
        }
        return 0
      })

      return {
        label: series.series,
        data: alignedData,
        color: series.color,
      }
    })

    return {
      labels: sortedTimestamps.map((ts) => this.formatDateLabel(ts)),
      datasets,
      timestamps: sortedTimestamps,
    }
  }

  /**
   * Format data for heatmap (contribution calendar style)
   */
  static formatHeatmap(
    data: TimeSeriesPoint[],
    options?: {
      startDate?: Date
      endDate?: Date
      fillEmptyDays?: boolean
    }
  ): {
    data: Array<{ date: Date; value: number; intensity: number }>
    maxValue: number
  } {
    const dataMap = new Map<string, number>()
    data.forEach((point) => {
      const dateKey = this.getDateKey(point.timestamp)
      dataMap.set(dateKey, (dataMap.get(dateKey) || 0) + point.value)
    })

    const start = options?.startDate || new Date(Math.min(...data.map(d => d.timestamp.getTime())))
    const end = options?.endDate || new Date()
    
    const result: Array<{ date: Date; value: number; intensity: number }> = []
    const maxValue = Math.max(...Array.from(dataMap.values()), 1)

    for (
      let date = new Date(start);
      date <= end;
      date.setDate(date.getDate() + 1)
    ) {
      const dateKey = this.getDateKey(date)
      const value = dataMap.get(dateKey) || 0
      
      if (value > 0 || options?.fillEmptyDays) {
        result.push({
          date: new Date(date),
          value,
          intensity: (value / maxValue) * 100,
        })
      }
    }

    return { data: result, maxValue }
  }

  // Private helper methods
  private static aggregateByPeriod(
    data: TimeSeriesPoint[],
    period: 'day' | 'week' | 'month'
  ): TimeSeriesPoint[] {
    const aggregated = new Map<string, { sum: number; count: number }>()

    data.forEach((point) => {
      const key = this.getPeriodKey(point.timestamp, period)
      const existing = aggregated.get(key) || { sum: 0, count: 0 }
      aggregated.set(key, {
        sum: existing.sum + point.value,
        count: existing.count + 1,
      })
    })

    return Array.from(aggregated.entries()).map(([key, { sum, count }]) => ({
      timestamp: this.parsePerio dKey(key, period),
      value: sum / count,
    }))
  }

  private static fillTimeGaps(
    data: TimeSeriesPoint[],
    period?: 'day' | 'week' | 'month'
  ): TimeSeriesPoint[] {
    if (data.length < 2) return data

    const filled: TimeSeriesPoint[] = [data[0]]
    const increment = period === 'week' ? 7 : period === 'month' ? 30 : 1

    for (let i = 1; i < data.length; i++) {
      const prev = filled[filled.length - 1]
      const current = data[i]
      const daysDiff = Math.floor(
        (current.timestamp.getTime() - prev.timestamp.getTime()) / (1000 * 60 * 60 * 24)
      )

      if (daysDiff > increment) {
        // Fill gaps with interpolated values
        const steps = Math.floor(daysDiff / increment)
        for (let j = 1; j < steps; j++) {
          const newDate = new Date(prev.timestamp)
          newDate.setDate(newDate.getDate() + j * increment)
          filled.push({
            timestamp: newDate,
            value: prev.value + ((current.value - prev.value) * j) / steps,
          })
        }
      }

      filled.push(current)
    }

    return filled
  }

  private static formatDateLabel(
    date: Date,
    aggregation?: 'day' | 'week' | 'month'
  ): string {
    if (aggregation === 'month') {
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
    }
    if (aggregation === 'week') {
      return `Week ${this.getWeekNumber(date)}`
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  private static getPeriodKey(date: Date, period: 'day' | 'week' | 'month'): string {
    if (period === 'month') {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    }
    if (period === 'week') {
      return `${date.getFullYear()}-W${String(this.getWeekNumber(date)).padStart(2, '0')}`
    }
    return this.getDateKey(date)
  }

  private static parsePeriodKey(key: string, period: 'day' | 'week' | 'month'): Date {
    if (period === 'month') {
      const [year, month] = key.split('-')
      return new Date(parseInt(year), parseInt(month) - 1, 1)
    }
    if (period === 'week') {
      const [year, week] = key.split('-W')
      return this.getDateFromWeek(parseInt(year), parseInt(week))
    }
    return new Date(key)
  }

  private static getDateKey(date: Date): string {
    return date.toISOString().split('T')[0]
  }

  private static getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    const dayNum = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  }

  private static getDateFromWeek(year: number, week: number): Date {
    const simple = new Date(year, 0, 1 + (week - 1) * 7)
    const dow = simple.getDay()
    const ISOweekStart = simple
    if (dow <= 4) ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1)
    else ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay())
    return ISOweekStart
  }

  private static getLastKnownValue(
    dataMap: Map<number, number>,
    timestamp: number
  ): number {
    const sortedKeys = Array.from(dataMap.keys()).sort()
    for (let i = sortedKeys.length - 1; i >= 0; i--) {
      if (sortedKeys[i] < timestamp) {
        return dataMap.get(sortedKeys[i])!
      }
    }
    return 0
  }

  private static generateColorPalette(count: number): string[] {
    const baseColors = [
      '#3B82F6', // blue
      '#10B981', // green
      '#F59E0B', // amber
      '#EF4444', // red
      '#8B5CF6', // purple
      '#EC4899', // pink
      '#14B8A6', // teal
      '#F97316', // orange
    ]

    if (count <= baseColors.length) {
      return baseColors.slice(0, count)
    }

    // Generate more colors by adjusting lightness
    const colors = [...baseColors]
    while (colors.length < count) {
      const baseIndex = colors.length % baseColors.length
      colors.push(this.adjustColorLightness(baseColors[baseIndex], 20))
    }

    return colors
  }

  private static adjustColorLightness(hex: string, percent: number): string {
    const num = parseInt(hex.slice(1), 16)
    const r = Math.min(255, Math.max(0, (num >> 16) + percent))
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + percent))
    const b = Math.min(255, Math.max(0, (num & 0x0000ff) + percent))
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
  }
}

