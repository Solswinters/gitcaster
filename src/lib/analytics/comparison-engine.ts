/**
 * Developer comparison and benchmarking engine
 * Compares developers across multiple dimensions
 */

import { DeveloperMetrics } from './metrics-calculator'

export interface ComparisonResult {
  metric: string
  user1Value: number
  user2Value: number
  difference: number
  percentageDiff: number
  winner: 'user1' | 'user2' | 'tie'
  significance: 'high' | 'medium' | 'low'
}

export interface DeveloperComparison {
  user1: {
    id: string
    name: string
    metrics: DeveloperMetrics
  }
  user2: {
    id: string
    name: string
    metrics: DeveloperMetrics
  }
  comparisons: ComparisonResult[]
  overallScore: {
    user1: number
    user2: number
    winner: 'user1' | 'user2' | 'tie'
  }
  strengths: {
    user1: string[]
    user2: string[]
  }
  recommendations: string[]
}

export class ComparisonEngine {
  /**
   * Compare two developers across all metrics
   */
  static compareDevelopers(
    user1: { id: string; name: string; metrics: DeveloperMetrics },
    user2: { id: string; name: string; metrics: DeveloperMetrics }
  ): DeveloperComparison {
    const comparisons = this.compareMetrics(user1.metrics, user2.metrics)
    const overallScore = this.calculateOverallScore(comparisons)
    const strengths = this.identifyStrengths(comparisons)
    const recommendations = this.generateRecommendations(comparisons, user1, user2)

    return {
      user1,
      user2,
      comparisons,
      overallScore,
      strengths,
      recommendations,
    }
  }

  /**
   * Compare multiple developers and rank them
   */
  static rankDevelopers(
    developers: Array<{ id: string; name: string; metrics: DeveloperMetrics }>
  ): Array<{
    rank: number
    developer: { id: string; name: string }
    score: number
    metrics: DeveloperMetrics
  }> {
    const scored = developers.map((dev) => ({
      developer: { id: dev.id, name: dev.name },
      score: this.calculateCompositeScore(dev.metrics),
      metrics: dev.metrics,
    }))

    return scored
      .sort((a, b) => b.score - a.score)
      .map((item, index) => ({
        rank: index + 1,
        ...item,
      }))
  }

  /**
   * Find similar developers based on skill profile
   */
  static findSimilarDevelopers(
    targetMetrics: DeveloperMetrics,
    candidates: Array<{ id: string; name: string; metrics: DeveloperMetrics }>,
    limit: number = 5
  ): Array<{
    developer: { id: string; name: string }
    similarity: number
    matchingAreas: string[]
  }> {
    const similarities = candidates.map((candidate) => {
      const similarity = this.calculateSimilarity(targetMetrics, candidate.metrics)
      const matchingAreas = this.findMatchingAreas(targetMetrics, candidate.metrics)

      return {
        developer: { id: candidate.id, name: candidate.name },
        similarity,
        matchingAreas,
      }
    })

    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
  }

  /**
   * Generate competitive insights
   */
  static generateCompetitiveInsights(
    userMetrics: DeveloperMetrics,
    peerMetrics: DeveloperMetrics[]
  ): {
    position: 'top' | 'above-average' | 'average' | 'below-average'
    percentile: number
    outperformingAreas: string[]
    underperformingAreas: string[]
    actionableInsights: string[]
  } {
    const metricKeys = Object.keys(userMetrics) as Array<keyof DeveloperMetrics>
    const percentiles: Record<string, number> = {}

    metricKeys.forEach((key) => {
      const userValue = userMetrics[key]
      const peerValues = peerMetrics.map((m) => m[key])
      const sortedValues = [...peerValues, userValue].sort((a, b) => b - a)
      const rank = sortedValues.indexOf(userValue) + 1
      const percentile = ((sortedValues.length - rank) / sortedValues.length) * 100
      percentiles[key] = percentile
    })

    const avgPercentile =
      Object.values(percentiles).reduce((a, b) => a + b, 0) / Object.keys(percentiles).length

    let position: 'top' | 'above-average' | 'average' | 'below-average'
    if (avgPercentile >= 75) position = 'top'
    else if (avgPercentile >= 60) position = 'above-average'
    else if (avgPercentile >= 40) position = 'average'
    else position = 'below-average'

    const outperformingAreas = Object.entries(percentiles)
      .filter(([_, p]) => p >= 70)
      .map(([key]) => this.formatMetricName(key))

    const underperformingAreas = Object.entries(percentiles)
      .filter(([_, p]) => p < 40)
      .map(([key]) => this.formatMetricName(key))

    const actionableInsights = this.generateActionableInsights(
      underperformingAreas,
      outperformingAreas
    )

    return {
      position,
      percentile: Math.round(avgPercentile),
      outperformingAreas,
      underperformingAreas,
      actionableInsights,
    }
  }

  // Private helper methods
  private static compareMetrics(
    metrics1: DeveloperMetrics,
    metrics2: DeveloperMetrics
  ): ComparisonResult[] {
    const results: ComparisonResult[] = []
    const keys = Object.keys(metrics1) as Array<keyof DeveloperMetrics>

    keys.forEach((key) => {
      const value1 = metrics1[key]
      const value2 = metrics2[key]
      const difference = value1 - value2
      const percentageDiff =
        value2 !== 0 ? (difference / value2) * 100 : value1 > 0 ? 100 : 0

      let winner: 'user1' | 'user2' | 'tie'
      if (Math.abs(difference) < 0.01) winner = 'tie'
      else winner = value1 > value2 ? 'user1' : 'user2'

      let significance: 'high' | 'medium' | 'low'
      if (Math.abs(percentageDiff) >= 50) significance = 'high'
      else if (Math.abs(percentageDiff) >= 20) significance = 'medium'
      else significance = 'low'

      results.push({
        metric: this.formatMetricName(key),
        user1Value: value1,
        user2Value: value2,
        difference,
        percentageDiff,
        winner,
        significance,
      })
    })

    return results
  }

  private static calculateOverallScore(comparisons: ComparisonResult[]): {
    user1: number
    user2: number
    winner: 'user1' | 'user2' | 'tie'
  } {
    const user1Wins = comparisons.filter((c) => c.winner === 'user1').length
    const user2Wins = comparisons.filter((c) => c.winner === 'user2').length

    const user1Score = (user1Wins / comparisons.length) * 100
    const user2Score = (user2Wins / comparisons.length) * 100

    let winner: 'user1' | 'user2' | 'tie'
    if (Math.abs(user1Score - user2Score) < 5) winner = 'tie'
    else winner = user1Score > user2Score ? 'user1' : 'user2'

    return {
      user1: Math.round(user1Score),
      user2: Math.round(user2Score),
      winner,
    }
  }

  private static identifyStrengths(comparisons: ComparisonResult[]): {
    user1: string[]
    user2: string[]
  } {
    const user1Strengths = comparisons
      .filter((c) => c.winner === 'user1' && c.significance !== 'low')
      .map((c) => c.metric)
      .slice(0, 3)

    const user2Strengths = comparisons
      .filter((c) => c.winner === 'user2' && c.significance !== 'low')
      .map((c) => c.metric)
      .slice(0, 3)

    return {
      user1: user1Strengths,
      user2: user2Strengths,
    }
  }

  private static generateRecommendations(
    comparisons: ComparisonResult[],
    user1: any,
    user2: any
  ): string[] {
    const recommendations: string[] = []

    const significantDifferences = comparisons.filter(
      (c) => c.significance === 'high'
    )

    if (significantDifferences.length > 0) {
      recommendations.push(
        `Focus on ${significantDifferences[0].metric.toLowerCase()} to improve competitiveness`
      )
    }

    const collaborationComparison = comparisons.find((c) =>
      c.metric.toLowerCase().includes('collaboration')
    )
    if (collaborationComparison && collaborationComparison.winner === 'user2') {
      recommendations.push(
        'Increase code review participation and community engagement'
      )
    }

    const qualityComparison = comparisons.find((c) =>
      c.metric.toLowerCase().includes('quality')
    )
    if (qualityComparison && qualityComparison.winner === 'user2') {
      recommendations.push('Focus on code quality and testing practices')
    }

    return recommendations.slice(0, 5)
  }

  private static calculateCompositeScore(metrics: DeveloperMetrics): number {
    const weights = {
      commitFrequency: 0.1,
      prVelocity: 0.1,
      codeQualityScore: 0.15,
      collaborationScore: 0.15,
      skillDiversity: 0.1,
      repoStars: 0.15,
      communityEngagement: 0.1,
      issueResolutionRate: 0.15,
    }

    let score = 0
    Object.entries(weights).forEach(([key, weight]) => {
      const value = metrics[key as keyof DeveloperMetrics] as number
      score += value * weight
    })

    return Math.round(score)
  }

  private static calculateSimilarity(
    metrics1: DeveloperMetrics,
    metrics2: DeveloperMetrics
  ): number {
    const keys = Object.keys(metrics1) as Array<keyof DeveloperMetrics>
    let totalDiff = 0

    keys.forEach((key) => {
      const value1 = metrics1[key]
      const value2 = metrics2[key]
      const maxValue = Math.max(value1, value2, 1)
      const diff = Math.abs(value1 - value2) / maxValue
      totalDiff += diff
    })

    const avgDiff = totalDiff / keys.length
    return Math.round((1 - avgDiff) * 100)
  }

  private static findMatchingAreas(
    metrics1: DeveloperMetrics,
    metrics2: DeveloperMetrics
  ): string[] {
    const matching: string[] = []
    const keys = Object.keys(metrics1) as Array<keyof DeveloperMetrics>

    keys.forEach((key) => {
      const value1 = metrics1[key]
      const value2 = metrics2[key]
      const diff = Math.abs(value1 - value2)
      const avgValue = (value1 + value2) / 2

      if (diff / avgValue < 0.2) {
        matching.push(this.formatMetricName(key))
      }
    })

    return matching.slice(0, 5)
  }

  private static formatMetricName(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim()
  }

  private static generateActionableInsights(
    underperforming: string[],
    outperforming: string[]
  ): string[] {
    const insights: string[] = []

    if (underperforming.includes('Commit Frequency')) {
      insights.push('Increase daily coding activity and maintain consistency')
    }

    if (underperforming.includes('Code Quality Score')) {
      insights.push('Focus on code reviews and testing to improve quality')
    }

    if (underperforming.includes('Collaboration Score')) {
      insights.push('Participate more in code reviews and team discussions')
    }

    if (outperforming.includes('Skill Diversity')) {
      insights.push('Leverage your polyglot expertise in diverse projects')
    }

    if (outperforming.includes('Repo Stars')) {
      insights.push('Build on your OSS success with more community projects')
    }

    if (insights.length === 0) {
      insights.push('Maintain current momentum and explore new technologies')
    }

    return insights.slice(0, 5)
  }
}

