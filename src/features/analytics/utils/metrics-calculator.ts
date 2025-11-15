/**
 * Advanced metrics calculator for developer insights
 * Calculates various performance and growth metrics
 */

export interface DeveloperMetrics {
  // Activity Metrics
  commitFrequency: number // commits per week
  prVelocity: number // PRs per month
  issueResolutionRate: number // resolved issues / total issues
  codeReviewParticipation: number // reviews given / reviews received
  
  // Quality Metrics
  codeQualityScore: number // 0-100
  testCoverageAverage: number // average test coverage %
  documentationScore: number // 0-100
  bugRate: number // bugs per 1000 lines
  
  // Collaboration Metrics
  collaborationScore: number // 0-100
  mentorshipActivity: number // mentees + mentors
  communityEngagement: number // contributions to org repos
  
  // Growth Metrics
  skillDiversity: number // number of unique languages/technologies
  learningVelocity: number // new skills per quarter
  projectComplexity: number // avg complexity of projects
  
  // Impact Metrics
  repoStars: number // total stars received
  forks: number // total forks
  dependents: number // projects depending on user's code
  downloads: number // npm/package downloads
}

export interface TrendData {
  period: string // '2024-Q1', '2024-01', etc
  value: number
  change: number // percentage change from previous period
  percentile: number // ranking among peers
}

export interface SkillTrend {
  skill: string
  category: string
  usageOverTime: TrendData[]
  proficiencyGrowth: number // percentage improvement
  marketDemand: number // 0-100 based on job postings
  futureProjection: number // predicted growth
}

export class MetricsCalculator {
  /**
   * Calculate comprehensive developer metrics
   */
  static calculateDeveloperMetrics(data: {
    commits: number
    prs: number
    issues: number
    resolvedIssues: number
    reviews: number
    receivedReviews: number
    stars: number
    forks: number
    languages: string[]
    weeksActive: number
  }): DeveloperMetrics {
    const {
      commits,
      prs,
      issues,
      resolvedIssues,
      reviews,
      receivedReviews,
      stars,
      forks,
      languages,
      weeksActive,
    } = data

    return {
      // Activity
      commitFrequency: weeksActive > 0 ? commits / weeksActive : 0,
      prVelocity: weeksActive > 0 ? (prs / weeksActive) * 4.33 : 0, // monthly
      issueResolutionRate: issues > 0 ? (resolvedIssues / issues) * 100 : 100,
      codeReviewParticipation:
        receivedReviews > 0 ? reviews / receivedReviews : 0,

      // Quality (simplified calculations - would use real data in production)
      codeQualityScore: this.calculateQualityScore({
        commits,
        prs,
        reviews,
      }),
      testCoverageAverage: 75, // Would come from actual test data
      documentationScore: this.calculateDocScore(data),
      bugRate: 2.5, // bugs per 1000 lines - would be from issue tracking

      // Collaboration
      collaborationScore: this.calculateCollaborationScore({
        reviews,
        prs,
        issues,
      }),
      mentorshipActivity: 0, // Would come from mentorship data
      communityEngagement: this.calculateCommunityScore(data),

      // Growth
      skillDiversity: languages.length,
      learningVelocity: 0, // Would track new skills over time
      projectComplexity: this.calculateComplexityScore(data),

      // Impact
      repoStars: stars,
      forks: forks,
      dependents: 0, // Would come from dependency data
      downloads: 0, // Would come from npm/package data
    }
  }

  /**
   * Calculate skill trends over time
   */
  static calculateSkillTrends(
    skillHistory: Array<{
      skill: string
      category: string
      usage: number
      date: Date
    }>
  ): SkillTrend[] {
    const skillMap = new Map<string, any>()

    skillHistory.forEach(({ skill, category, usage, date }) => {
      if (!skillMap.has(skill)) {
        skillMap.set(skill, {
          skill,
          category,
          usageData: [],
        })
      }
      skillMap.get(skill).usageData.push({ usage, date })
    })

    return Array.from(skillMap.values()).map((skillData) => {
      const trends = this.calculateTrendData(skillData.usageData)
      const growth = this.calculateGrowthRate(skillData.usageData)

      return {
        skill: skillData.skill,
        category: skillData.category,
        usageOverTime: trends,
        proficiencyGrowth: growth,
        marketDemand: this.estimateMarketDemand(skillData.skill),
        futureProjection: this.projectFutureGrowth(growth),
      }
    })
  }

  /**
   * Calculate competitive benchmarking
   */
  static calculateBenchmarks(
    userMetrics: DeveloperMetrics,
    peerMetrics: DeveloperMetrics[]
  ): Record<keyof DeveloperMetrics, { percentile: number; rank: number }> {
    const benchmarks: any = {}

    Object.keys(userMetrics).forEach((key) => {
      const metricKey = key as keyof DeveloperMetrics
      const userValue = userMetrics[metricKey]
      const peerValues = peerMetrics.map((m) => m[metricKey])
      const sortedValues = [...peerValues, userValue].sort((a, b) => b - a)
      const rank = sortedValues.indexOf(userValue) + 1
      const percentile = ((sortedValues.length - rank) / sortedValues.length) * 100

      benchmarks[metricKey] = {
        percentile: Math.round(percentile),
        rank,
      }
    })

    return benchmarks
  }

  /**
   * Generate AI-powered insights
   */
  static generateInsights(
    metrics: DeveloperMetrics,
    trends: SkillTrend[]
  ): string[] {
    const insights: string[] = []

    // Activity insights
    if (metrics.commitFrequency > 20) {
      insights.push(
        '🔥 Exceptional commit frequency! You\'re in the top 10% of active developers.'
      )
    } else if (metrics.commitFrequency < 5) {
      insights.push(
        '💡 Consider increasing your commit frequency for better visibility.'
      )
    }

    // Quality insights
    if (metrics.codeQualityScore > 80) {
      insights.push(
        '⭐ Outstanding code quality! Your PR review rate suggests high standards.'
      )
    }

    // Collaboration insights
    if (metrics.codeReviewParticipation > 2) {
      insights.push(
        '🤝 Great collaboration! You actively contribute to team code reviews.'
      )
    }

    // Growth insights
    if (metrics.skillDiversity > 5) {
      insights.push(
        '🎯 Impressive skill diversity! You\'re proficient in multiple technologies.'
      )
    }

    // Impact insights
    if (metrics.repoStars > 100) {
      insights.push(
        '🌟 Strong community impact! Your projects have significant traction.'
      )
    }

    // Trend insights
    const growingSkills = trends.filter((t) => t.proficiencyGrowth > 20)
    if (growingSkills.length > 0) {
      insights.push(
        `📈 Rapid growth in ${growingSkills.map((s) => s.skill).join(', ')}!`
      )
    }

    return insights
  }

  // Private helper methods
  private static calculateQualityScore(data: {
    commits: number
    prs: number
    reviews: number
  }): number {
    const { commits, prs, reviews } = data
    const prRatio = commits > 0 ? prs / commits : 0
    const reviewRatio = prs > 0 ? reviews / prs : 0
    return Math.min(100, Math.round((prRatio * 30 + reviewRatio * 40 + 30)))
  }

  private static calculateDocScore(data: any): number {
    // Simplified - would analyze README, comments, etc
    return 70
  }

  private static calculateCollaborationScore(data: {
    reviews: number
    prs: number
    issues: number
  }): number {
    const { reviews, prs, issues } = data
    const totalActivity = reviews + prs + issues
    if (totalActivity === 0) return 0
    return Math.min(
      100,
      Math.round((reviews / totalActivity) * 50 + (prs / totalActivity) * 30 + 20)
    )
  }

  private static calculateCommunityScore(data: any): number {
    const { stars, forks } = data
    return Math.min(100, Math.round((stars / 10 + forks / 5) * 10))
  }

  private static calculateComplexityScore(data: any): number {
    const { languages } = data
    return Math.min(100, languages.length * 10 + 20)
  }

  private static calculateTrendData(
    usageData: Array<{ usage: number; date: Date }>
  ): TrendData[] {
    // Group by quarter
    const quarters = new Map<string, number[]>()

    usageData.forEach(({ usage, date }) => {
      const quarter = `${date.getFullYear()}-Q${Math.ceil((date.getMonth() + 1) / 3)}`
      if (!quarters.has(quarter)) {
        quarters.set(quarter, [])
      }
      quarters.get(quarter)!.push(usage)
    })

    const trends: TrendData[] = []
    let previousValue = 0

    Array.from(quarters.entries())
      .sort()
      .forEach(([period, values]) => {
        const value = values.reduce((a, b) => a + b, 0) / values.length
        const change = previousValue > 0 ? ((value - previousValue) / previousValue) * 100 : 0
        trends.push({
          period,
          value: Math.round(value),
          change: Math.round(change),
          percentile: 50, // Would calculate from peer data
        })
        previousValue = value
      })

    return trends
  }

  private static calculateGrowthRate(
    usageData: Array<{ usage: number; date: Date }>
  ): number {
    if (usageData.length < 2) return 0
    const sorted = [...usageData].sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    )
    const first = sorted[0].usage
    const last = sorted[sorted.length - 1].usage
    return first > 0 ? ((last - first) / first) * 100 : 0
  }

  private static estimateMarketDemand(skill: string): number {
    // Simplified - would query job posting APIs
    const highDemandSkills = [
      'typescript',
      'react',
      'python',
      'kubernetes',
      'aws',
    ]
    return highDemandSkills.includes(skill.toLowerCase()) ? 85 : 60
  }

  private static projectFutureGrowth(currentGrowth: number): number {
    // Simple projection - would use ML model in production
    return Math.max(0, Math.min(100, currentGrowth * 1.2))
  }
}

