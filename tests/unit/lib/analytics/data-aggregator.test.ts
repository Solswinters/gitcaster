import { DataAggregator } from '@/lib/analytics/data-aggregator'

describe('DataAggregator', () => {
  describe('aggregateByPeriod', () => {
    it('should aggregate data by day', () => {
      const data = [
        { timestamp: new Date('2024-01-01'), values: { commits: 5, prs: 2 } },
        { timestamp: new Date('2024-01-01'), values: { commits: 3, prs: 1 } },
        { timestamp: new Date('2024-01-02'), values: { commits: 4, prs: 1 } },
      ]

      const aggregated = DataAggregator.aggregateByPeriod(data, 'day', 'sum')

      expect(aggregated).toHaveLength(2)
      expect(aggregated[0].metrics.commits).toBe(8) // 5 + 3
      expect(aggregated[0].metrics.prs).toBe(3) // 2 + 1
      expect(aggregated[1].metrics.commits).toBe(4)
    })

    it('should calculate average', () => {
      const data = [
        { timestamp: new Date('2024-01-01'), values: { score: 80 } },
        { timestamp: new Date('2024-01-01'), values: { score: 90 } },
      ]

      const aggregated = DataAggregator.aggregateByPeriod(data, 'day', 'average')

      expect(aggregated).toHaveLength(1)
      expect(aggregated[0].metrics.score).toBe(85) // (80 + 90) / 2
    })
  })

  describe('rollingAverage', () => {
    it('should calculate rolling average', () => {
      const data = [
        { timestamp: new Date('2024-01-01'), value: 10 },
        { timestamp: new Date('2024-01-02'), value: 20 },
        { timestamp: new Date('2024-01-03'), value: 30 },
      ]

      const result = DataAggregator.rollingAverage(data, 2)

      expect(result).toHaveLength(3)
      expect(result[0].average).toBe(10) // [10]
      expect(result[1].average).toBe(15) // (10 + 20) / 2
      expect(result[2].average).toBe(25) // (20 + 30) / 2
    })
  })

  describe('calculateGrowthRate', () => {
    it('should calculate growth rates', () => {
      const current = { commits: 120, stars: 150 }
      const previous = { commits: 100, stars: 100 }

      const growth = DataAggregator.calculateGrowthRate(current, previous)

      expect(growth.commits.absolute).toBe(20)
      expect(growth.commits.percentage).toBe(20)
      expect(growth.stars.absolute).toBe(50)
      expect(growth.stars.percentage).toBe(50)
    })

    it('should handle zero previous values', () => {
      const current = { commits: 100 }
      const previous = { commits: 0 }

      const growth = DataAggregator.calculateGrowthRate(current, previous)

      expect(growth.commits.absolute).toBe(100)
      expect(growth.commits.percentage).toBe(0)
    })
  })

  describe('calculatePercentiles', () => {
    it('should calculate percentiles', () => {
      const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

      const percentiles = DataAggregator.calculatePercentiles(values, [25, 50, 75, 100])

      expect(percentiles[25]).toBeLessThanOrEqual(percentiles[50])
      expect(percentiles[50]).toBeLessThanOrEqual(percentiles[75])
      expect(percentiles[75]).toBeLessThanOrEqual(percentiles[100])
    })
  })

  describe('detectAnomalies', () => {
    it('should detect anomalies', () => {
      const data = [
        { timestamp: new Date('2024-01-01'), value: 10 },
        { timestamp: new Date('2024-01-02'), value: 12 },
        { timestamp: new Date('2024-01-03'), value: 11 },
        { timestamp: new Date('2024-01-04'), value: 100 }, // Anomaly
        { timestamp: new Date('2024-01-05'), value: 13 },
      ]

      const result = DataAggregator.detectAnomalies(data, 2)

      expect(result).toHaveLength(5)
      expect(result[3].isAnomaly).toBe(true)
      expect(result[3].zScore).toBeGreaterThan(2)
    })
  })

  describe('calculateCorrelation', () => {
    it('should calculate positive correlation', () => {
      const series1 = [1, 2, 3, 4, 5]
      const series2 = [2, 4, 6, 8, 10]

      const result = DataAggregator.calculateCorrelation(series1, series2)

      expect(result.coefficient).toBeCloseTo(1, 1)
      expect(result.direction).toBe('positive')
      expect(result.strength).toBe('strong')
    })

    it('should calculate negative correlation', () => {
      const series1 = [1, 2, 3, 4, 5]
      const series2 = [10, 8, 6, 4, 2]

      const result = DataAggregator.calculateCorrelation(series1, series2)

      expect(result.coefficient).toBeLessThan(0)
      expect(result.direction).toBe('negative')
    })
  })

  describe('calculateDistribution', () => {
    it('should calculate distribution statistics', () => {
      const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

      const dist = DataAggregator.calculateDistribution(values)

      expect(dist.mean).toBe(5.5)
      expect(dist.median).toBe(5.5)
      expect(dist.range.min).toBe(1)
      expect(dist.range.max).toBe(10)
      expect(dist.stdDev).toBeGreaterThan(0)
      expect(dist.quartiles.q2).toBe(dist.median)
    })

    it('should handle empty array', () => {
      const dist = DataAggregator.calculateDistribution([])

      expect(dist.mean).toBe(0)
      expect(dist.median).toBe(0)
    })
  })
})

