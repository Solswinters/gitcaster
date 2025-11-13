import { AnomalyDetector } from '@/lib/analytics/anomaly-detector'

describe('AnomalyDetector', () => {
  describe('detectOutliers', () => {
    it('should detect outliers', () => {
      const data = [10, 12, 11, 13, 100, 14, 11] // 100 is an outlier

      const outliers = AnomalyDetector.detectOutliers(data)

      expect(outliers.length).toBeGreaterThan(0)
      expect(outliers[0].value).toBe(100)
      expect(outliers[0].score).toBeGreaterThan(2.5)
    })

    it('should not detect outliers in uniform data', () => {
      const data = [10, 11, 12, 11, 10, 12, 11]

      const outliers = AnomalyDetector.detectOutliers(data)

      expect(outliers).toHaveLength(0)
    })
  })

  describe('detectSuddenChanges', () => {
    it('should detect sudden changes', () => {
      const data = [10, 11, 12, 50, 12, 11] // 50 is a sudden change

      const changes = AnomalyDetector.detectSuddenChanges(data, 0.5)

      expect(changes.length).toBeGreaterThan(0)
      expect(changes[0].index).toBe(3)
    })
  })
})

