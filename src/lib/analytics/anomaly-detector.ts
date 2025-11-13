/**
 * Anomaly detection for analytics data
 */

export class AnomalyDetector {
  static detectOutliers(
    data: number[],
    threshold: number = 2.5
  ): { value: number; index: number; score: number }[] {
    const mean = data.reduce((a, b) => a + b, 0) / data.length
    const stdDev = Math.sqrt(
      data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length
    )

    return data
      .map((value, index) => ({
        value,
        index,
        score: Math.abs((value - mean) / stdDev),
      }))
      .filter((item) => item.score > threshold)
  }

  static detectSuddenChanges(
    data: number[],
    changeThreshold: number = 0.5
  ): { index: number; changePercent: number }[] {
    const changes: { index: number; changePercent: number }[] = []

    for (let i = 1; i < data.length; i++) {
      const prev = data[i - 1]
      const curr = data[i]
      if (prev !== 0) {
        const changePercent = Math.abs((curr - prev) / prev)
        if (changePercent > changeThreshold) {
          changes.push({ index: i, changePercent })
        }
      }
    }

    return changes
  }
}

