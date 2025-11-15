/**
 * Chart data formatting helpers for analytics
 */

export interface ChartDataPoint {
  x: string | number | Date;
  y: number;
  label?: string;
}

export interface ChartSeries {
  name: string;
  data: ChartDataPoint[];
  color?: string;
}

/**
 * Format data for line charts
 */
export function formatLineChartData(
  data: Array<{ date: Date; value: number }>,
  seriesName: string
): ChartSeries {
  return {
    name: seriesName,
    data: data.map((d) => ({
      x: d.date,
      y: d.value,
    })),
  };
}

/**
 * Format data for bar charts
 */
export function formatBarChartData(
  data: Record<string, number>,
  seriesName: string
): ChartSeries {
  return {
    name: seriesName,
    data: Object.entries(data).map(([label, value]) => ({
      x: label,
      y: value,
      label,
    })),
  };
}

/**
 * Aggregate data by time period
 */
export function aggregateByPeriod(
  data: Array<{ date: Date; value: number }>,
  period: 'day' | 'week' | 'month' | 'year'
): Array<{ date: Date; value: number }> {
  const groups = new Map<string, number[]>();

  data.forEach((item) => {
    const key = getPerio dKey(item.date, period);
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(item.value);
  });

  return Array.from(groups.entries()).map(([key, values]) => ({
    date: parsePeriodKey(key, period),
    value: values.reduce((sum, v) => sum + v, 0),
  }));
}

/**
 * Get period key for grouping
 */
function getPeriodKey(date: Date, period: 'day' | 'week' | 'month' | 'year'): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  switch (period) {
    case 'day':
      return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    case 'week':
      const week = getWeekNumber(date);
      return `${year}-W${week}`;
    case 'month':
      return `${year}-${month.toString().padStart(2, '0')}`;
    case 'year':
      return `${year}`;
  }
}

/**
 * Parse period key back to date
 */
function parsePeriodKey(key: string, period: 'day' | 'week' | 'month' | 'year'): Date {
  const parts = key.split('-');
  
  switch (period) {
    case 'day':
      return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    case 'week':
      const [year, weekStr] = parts;
      const week = parseInt(weekStr.substring(1));
      return getDateFromWeek(parseInt(year), week);
    case 'month':
      return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, 1);
    case 'year':
      return new Date(parseInt(parts[0]), 0, 1);
  }
}

/**
 * Get week number of year
 */
function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

/**
 * Get date from week number
 */
function getDateFromWeek(year: number, week: number): Date {
  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const dow = simple.getDay();
  const isoWeekStart = simple;
  if (dow <= 4) {
    isoWeekStart.setDate(simple.getDate() - simple.getDay() + 1);
  } else {
    isoWeekStart.setDate(simple.getDate() + 8 - simple.getDay());
  }
  return isoWeekStart;
}

/**
 * Calculate moving average
 */
export function calculateMovingAverage(
  data: number[],
  windowSize: number
): number[] {
  const result: number[] = [];

  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - windowSize + 1);
    const window = data.slice(start, i + 1);
    const avg = window.reduce((sum, v) => sum + v, 0) / window.length;
    result.push(avg);
  }

  return result;
}

