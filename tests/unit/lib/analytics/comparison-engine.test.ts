import { ComparisonEngine } from '@/lib/analytics/comparison-engine'
import { DeveloperMetrics } from '@/lib/analytics/metrics-calculator'

describe('ComparisonEngine', () => {
  const user1Metrics: DeveloperMetrics = {
    commitFrequency: 15,
    prVelocity: 10,
    issueResolutionRate: 85,
    codeReviewParticipation: 1.5,
    codeQualityScore: 80,
    testCoverageAverage: 75,
    documentationScore: 70,
    bugRate: 2.5,
    collaborationScore: 75,
    mentorshipActivity: 2,
    communityEngagement: 65,
    skillDiversity: 6,
    learningVelocity: 2,
    projectComplexity: 70,
    repoStars: 150,
    forks: 25,
    dependents: 10,
    downloads: 5000,
  }

  const user2Metrics: DeveloperMetrics = {
    commitFrequency: 12,
    prVelocity: 8,
    issueResolutionRate: 78,
    codeReviewParticipation: 1.2,
    codeQualityScore: 85,
    testCoverageAverage: 80,
    documentationScore: 75,
    bugRate: 2.0,
    collaborationScore: 80,
    mentorshipActivity: 3,
    communityEngagement: 70,
    skillDiversity: 5,
    learningVelocity: 1.5,
    projectComplexity: 75,
    repoStars: 200,
    forks: 30,
    dependents: 15,
    downloads: 8000,
  }

  describe('compareDevelopers', () => {
    it('should compare two developers', () => {
      const comparison = ComparisonEngine.compareDevelopers(
        { id: '1', name: 'User 1', metrics: user1Metrics },
        { id: '2', name: 'User 2', metrics: user2Metrics }
      )

      expect(comparison.user1.id).toBe('1')
      expect(comparison.user2.id).toBe('2')
      expect(comparison.comparisons).toBeInstanceOf(Array)
      expect(comparison.comparisons.length).toBeGreaterThan(0)
      expect(comparison.overallScore).toBeDefined()
    })

    it('should identify winners for each metric', () => {
      const comparison = ComparisonEngine.compareDevelopers(
        { id: '1', name: 'User 1', metrics: user1Metrics },
        { id: '2', name: 'User 2', metrics: user2Metrics }
      )

      const commitComparison = comparison.comparisons.find((c) =>
        c.metric.toLowerCase().includes('commit')
      )
      expect(commitComparison).toBeDefined()
      expect(commitComparison?.winner).toBe('user1') // 15 > 12
    })

    it('should calculate significance levels', () => {
      const comparison = ComparisonEngine.compareDevelopers(
        { id: '1', name: 'User 1', metrics: user1Metrics },
        { id: '2', name: 'User 2', metrics: user2Metrics }
      )

      comparison.comparisons.forEach((c) => {
        expect(['high', 'medium', 'low']).toContain(c.significance)
      })
    })

    it('should generate overall score', () => {
      const comparison = ComparisonEngine.compareDevelopers(
        { id: '1', name: 'User 1', metrics: user1Metrics },
        { id: '2', name: 'User 2', metrics: user2Metrics }
      )

      expect(comparison.overallScore.user1).toBeGreaterThanOrEqual(0)
      expect(comparison.overallScore.user1).toBeLessThanOrEqual(100)
      expect(comparison.overallScore.user2).toBeGreaterThanOrEqual(0)
      expect(comparison.overallScore.user2).toBeLessThanOrEqual(100)
    })

    it('should identify strengths', () => {
      const comparison = ComparisonEngine.compareDevelopers(
        { id: '1', name: 'User 1', metrics: user1Metrics },
        { id: '2', name: 'User 2', metrics: user2Metrics }
      )

      expect(comparison.strengths.user1).toBeInstanceOf(Array)
      expect(comparison.strengths.user2).toBeInstanceOf(Array)
    })
  })

  describe('rankDevelopers', () => {
    it('should rank multiple developers', () => {
      const developers = [
        { id: '1', name: 'User 1', metrics: user1Metrics },
        { id: '2', name: 'User 2', metrics: user2Metrics },
        {
          id: '3',
          name: 'User 3',
          metrics: { ...user1Metrics, repoStars: 300, commitFrequency: 20 },
        },
      ]

      const ranked = ComparisonEngine.rankDevelopers(developers)

      expect(ranked).toHaveLength(3)
      expect(ranked[0].rank).toBe(1)
      expect(ranked[1].rank).toBe(2)
      expect(ranked[2].rank).toBe(3)
      expect(ranked[0].score).toBeGreaterThanOrEqual(ranked[1].score)
      expect(ranked[1].score).toBeGreaterThanOrEqual(ranked[2].score)
    })
  })

  describe('findSimilarDevelopers', () => {
    it('should find similar developers', () => {
      const candidates = [
        { id: '2', name: 'User 2', metrics: user2Metrics },
        {
          id: '3',
          name: 'User 3',
          metrics: { ...user1Metrics, commitFrequency: 16, codeQualityScore: 82 },
        },
        {
          id: '4',
          name: 'User 4',
          metrics: { ...user2Metrics, commitFrequency: 5, codeQualityScore: 50 },
        },
      ]

      const similar = ComparisonEngine.findSimilarDevelopers(user1Metrics, candidates, 2)

      expect(similar).toHaveLength(2)
      expect(similar[0].similarity).toBeGreaterThan(0)
      expect(similar[0].matchingAreas).toBeInstanceOf(Array)
    })
  })

  describe('generateCompetitiveInsights', () => {
    it('should generate competitive insights', () => {
      const peerMetrics = [user2Metrics, { ...user1Metrics, commitFrequency: 18 }]

      const insights = ComparisonEngine.generateCompetitiveInsights(
        user1Metrics,
        peerMetrics
      )

      expect(insights.position).toBeDefined()
      expect(['top', 'above-average', 'average', 'below-average']).toContain(
        insights.position
      )
      expect(insights.percentile).toBeGreaterThanOrEqual(0)
      expect(insights.percentile).toBeLessThanOrEqual(100)
      expect(insights.outperformingAreas).toBeInstanceOf(Array)
      expect(insights.underperformingAreas).toBeInstanceOf(Array)
      expect(insights.actionableInsights).toBeInstanceOf(Array)
    })

    it('should identify top performers', () => {
      const peerMetrics = [
        { ...user1Metrics, commitFrequency: 5, codeQualityScore: 50 },
        { ...user1Metrics, commitFrequency: 8, codeQualityScore: 60 },
      ]

      const insights = ComparisonEngine.generateCompetitiveInsights(
        user1Metrics,
        peerMetrics
      )

      expect(insights.position).toBe('top')
      expect(insights.percentile).toBeGreaterThan(75)
    })
  })
})

