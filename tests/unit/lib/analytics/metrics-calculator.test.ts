import { MetricsCalculator } from '@/lib/analytics/metrics-calculator'

describe('MetricsCalculator', () => {
  describe('calculateDeveloperMetrics', () => {
    it('should calculate activity metrics correctly', () => {
      const data = {
        commits: 100,
        prs: 20,
        issues: 10,
        resolvedIssues: 8,
        reviews: 15,
        receivedReviews: 10,
        stars: 50,
        forks: 10,
        languages: ['TypeScript', 'Python', 'Go'],
        weeksActive: 10,
      }

      const metrics = MetricsCalculator.calculateDeveloperMetrics(data)

      expect(metrics.commitFrequency).toBe(10) // 100 / 10
      expect(metrics.prVelocity).toBeCloseTo(8.66, 1) // 20 / 10 * 4.33
      expect(metrics.issueResolutionRate).toBe(80) // 8 / 10 * 100
      expect(metrics.codeReviewParticipation).toBe(1.5) // 15 / 10
    })

    it('should handle zero weeks active', () => {
      const data = {
        commits: 100,
        prs: 20,
        issues: 10,
        resolvedIssues: 8,
        reviews: 15,
        receivedReviews: 10,
        stars: 50,
        forks: 10,
        languages: ['TypeScript'],
        weeksActive: 0,
      }

      const metrics = MetricsCalculator.calculateDeveloperMetrics(data)

      expect(metrics.commitFrequency).toBe(0)
      expect(metrics.prVelocity).toBe(0)
    })

    it('should calculate skill diversity', () => {
      const data = {
        commits: 100,
        prs: 20,
        issues: 10,
        resolvedIssues: 8,
        reviews: 15,
        receivedReviews: 10,
        stars: 50,
        forks: 10,
        languages: ['TypeScript', 'Python', 'Go', 'Rust', 'Java'],
        weeksActive: 10,
      }

      const metrics = MetricsCalculator.calculateDeveloperMetrics(data)

      expect(metrics.skillDiversity).toBe(5)
    })

    it('should calculate impact metrics', () => {
      const data = {
        commits: 100,
        prs: 20,
        issues: 10,
        resolvedIssues: 8,
        reviews: 15,
        receivedReviews: 10,
        stars: 500,
        forks: 100,
        languages: ['TypeScript'],
        weeksActive: 10,
      }

      const metrics = MetricsCalculator.calculateDeveloperMetrics(data)

      expect(metrics.repoStars).toBe(500)
      expect(metrics.forks).toBe(100)
    })
  })

  describe('calculateSkillTrends', () => {
    it('should calculate trends over time', () => {
      const skillHistory = [
        {
          skill: 'TypeScript',
          category: 'Language',
          usage: 50,
          date: new Date('2024-01-01'),
        },
        {
          skill: 'TypeScript',
          category: 'Language',
          usage: 75,
          date: new Date('2024-04-01'),
        },
        {
          skill: 'TypeScript',
          category: 'Language',
          usage: 90,
          date: new Date('2024-07-01'),
        },
      ]

      const trends = MetricsCalculator.calculateSkillTrends(skillHistory)

      expect(trends).toHaveLength(1)
      expect(trends[0].skill).toBe('TypeScript')
      expect(trends[0].category).toBe('Language')
      expect(trends[0].proficiencyGrowth).toBeGreaterThan(0)
    })

    it('should handle multiple skills', () => {
      const skillHistory = [
        {
          skill: 'TypeScript',
          category: 'Language',
          usage: 50,
          date: new Date('2024-01-01'),
        },
        {
          skill: 'Python',
          category: 'Language',
          usage: 30,
          date: new Date('2024-01-01'),
        },
        {
          skill: 'React',
          category: 'Framework',
          usage: 70,
          date: new Date('2024-01-01'),
        },
      ]

      const trends = MetricsCalculator.calculateSkillTrends(skillHistory)

      expect(trends).toHaveLength(3)
      expect(trends.map((t) => t.skill)).toContain('TypeScript')
      expect(trends.map((t) => t.skill)).toContain('Python')
      expect(trends.map((t) => t.skill)).toContain('React')
    })
  })

  describe('calculateBenchmarks', () => {
    it('should calculate percentiles correctly', () => {
      const userMetrics: any = {
        commitFrequency: 15,
        codeQualityScore: 85,
      }

      const peerMetrics: any[] = [
        { commitFrequency: 10, codeQualityScore: 70 },
        { commitFrequency: 12, codeQualityScore: 75 },
        { commitFrequency: 20, codeQualityScore: 90 },
        { commitFrequency: 5, codeQualityScore: 60 },
      ]

      const benchmarks = MetricsCalculator.calculateBenchmarks(
        userMetrics,
        peerMetrics
      )

      expect(benchmarks.commitFrequency.percentile).toBeGreaterThan(40)
      expect(benchmarks.commitFrequency.rank).toBeGreaterThan(0)
      expect(benchmarks.codeQualityScore.percentile).toBeGreaterThan(40)
    })

    it('should handle top performer', () => {
      const userMetrics: any = {
        commitFrequency: 50,
      }

      const peerMetrics: any[] = [
        { commitFrequency: 10 },
        { commitFrequency: 15 },
        { commitFrequency: 20 },
      ]

      const benchmarks = MetricsCalculator.calculateBenchmarks(
        userMetrics,
        peerMetrics
      )

      expect(benchmarks.commitFrequency.rank).toBe(1)
      expect(benchmarks.commitFrequency.percentile).toBeGreaterThan(75)
    })
  })

  describe('generateInsights', () => {
    it('should generate activity insights', () => {
      const metrics: any = {
        commitFrequency: 25,
        codeQualityScore: 85,
        codeReviewParticipation: 2.5,
        skillDiversity: 7,
        repoStars: 150,
      }

      const trends: any[] = [
        {
          skill: 'TypeScript',
          proficiencyGrowth: 30,
        },
      ]

      const insights = MetricsCalculator.generateInsights(metrics, trends)

      expect(insights.length).toBeGreaterThan(0)
      expect(insights.some((i) => i.includes('commit frequency'))).toBe(true)
      expect(insights.some((i) => i.includes('code quality'))).toBe(true)
      expect(insights.some((i) => i.includes('collaboration'))).toBe(true)
    })

    it('should generate improvement suggestions', () => {
      const metrics: any = {
        commitFrequency: 3,
        codeQualityScore: 50,
        codeReviewParticipation: 0.5,
        skillDiversity: 2,
        repoStars: 5,
      }

      const trends: any[] = []

      const insights = MetricsCalculator.generateInsights(metrics, trends)

      expect(insights.length).toBeGreaterThan(0)
      expect(
        insights.some((i) => i.toLowerCase().includes('consider') || i.includes('💡'))
      ).toBe(true)
    })

    it('should recognize rapid skill growth', () => {
      const metrics: any = {
        commitFrequency: 10,
        codeQualityScore: 70,
        codeReviewParticipation: 1,
        skillDiversity: 3,
        repoStars: 10,
      }

      const trends: any[] = [
        {
          skill: 'Rust',
          proficiencyGrowth: 50,
        },
        {
          skill: 'Go',
          proficiencyGrowth: 35,
        },
      ]

      const insights = MetricsCalculator.generateInsights(metrics, trends)

      expect(
        insights.some((i) => i.includes('Rapid growth') || i.includes('📈'))
      ).toBe(true)
    })
  })
})

