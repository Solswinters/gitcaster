/**
 * Predictive analytics for developer growth forecasting
 * Uses trend analysis to predict future performance
 */

export interface GrowthPrediction {
  metric: string
  currentValue: number
  predicted3Months: number
  predicted6Months: number
  predicted12Months: number
  confidence: number // 0-100
  trend: 'increasing' | 'decreasing' | 'stable'
  factors: string[]
}

export interface CareerPrediction {
  nextMilestone: {
    title: string
    estimatedDate: Date
    probability: number
  }
  skillRecommendations: Array<{
    skill: string
    priority: 'high' | 'medium' | 'low'
    marketDemand: number
    learningPath: string[]
  }>
  careerPath: Array<{
    stage: string
    estimatedDate: Date
    requirements: string[]
  }>
}

export class PredictiveAnalytics {
  /**
   * Predict growth trajectory for metrics
   */
  static predictGrowth(
    historicalData: Array<{
      date: Date
      metrics: Record<string, number>
    }>,
    metricNames: string[]
  ): GrowthPrediction[] {
    return metricNames.map((metric) => {
      const values = historicalData.map((d) => d.metrics[metric] || 0)
      const dates = historicalData.map((d) => d.date)

      const trend = this.calculateTrend(values)
      const { slope, intercept } = this.linearRegression(dates, values)
      
      const now = new Date().getTime()
      const month = 30 * 24 * 60 * 60 * 1000

      const predict3M = this.predictValue(slope, intercept, now + 3 * month)
      const predict6M = this.predictValue(slope, intercept, now + 6 * month)
      const predict12M = this.predictValue(slope, intercept, now + 12 * month)

      const confidence = this.calculateConfidence(values, slope, intercept, dates)

      return {
        metric,
        currentValue: values[values.length - 1] || 0,
        predicted3Months: Math.max(0, predict3M),
        predicted6Months: Math.max(0, predict6M),
        predicted12Months: Math.max(0, predict12M),
        confidence: Math.round(confidence),
        trend,
        factors: this.identifyGrowthFactors(metric, trend),
      }
    })
  }

  /**
   * Predict career milestones
   */
  static predictCareerMilestones(
    currentMetrics: Record<string, number>,
    historicalTrend: number,
    currentStage: string
  ): CareerPrediction {
    const nextMilestone = this.predictNextMilestone(
      currentMetrics,
      historicalTrend,
      currentStage
    )

    const skillRecommendations = this.recommendSkills(currentMetrics)
    const careerPath = this.projectCareerPath(currentStage, historicalTrend)

    return {
      nextMilestone,
      skillRecommendations,
      careerPath,
    }
  }

  /**
   * Predict skill market demand
   */
  static predictSkillDemand(
    skill: string,
    historicalUsage: Array<{ date: Date; value: number }>
  ): {
    currentDemand: number
    predictedDemand: number
    trendDirection: 'rising' | 'falling' | 'stable'
    recommendation: string
  } {
    const values = historicalUsage.map((d) => d.value)
    const trend = this.calculateTrend(values)
    
    const currentDemand = this.getMarketDemand(skill)
    const growthRate = values.length > 1 
      ? (values[values.length - 1] - values[0]) / values[0]
      : 0

    const predictedDemand = Math.min(100, currentDemand * (1 + growthRate))

    let trendDirection: 'rising' | 'falling' | 'stable'
    if (trend === 'increasing') trendDirection = 'rising'
    else if (trend === 'decreasing') trendDirection = 'falling'
    else trendDirection = 'stable'

    const recommendation = this.generateSkillRecommendation(
      skill,
      currentDemand,
      trendDirection
    )

    return {
      currentDemand,
      predictedDemand: Math.round(predictedDemand),
      trendDirection,
      recommendation,
    }
  }

  /**
   * Predict optimal job matches
   */
  static predictJobMatches(
    userMetrics: Record<string, number>,
    userSkills: string[],
    jobRequirements: Array<{
      id: string
      title: string
      requiredSkills: string[]
      experienceLevel: string
    }>
  ): Array<{
    jobId: string
    matchScore: number
    skillMatch: number
    experienceMatch: number
    growthPotential: number
    recommendation: string
  }> {
    return jobRequirements.map((job) => {
      const skillMatch = this.calculateSkillMatch(userSkills, job.requiredSkills)
      const experienceMatch = this.calculateExperienceMatch(
        userMetrics,
        job.experienceLevel
      )
      const growthPotential = this.calculateGrowthPotential(userSkills, job.requiredSkills)
      
      const matchScore = (skillMatch * 0.5 + experienceMatch * 0.3 + growthPotential * 0.2)

      return {
        jobId: job.id,
        matchScore: Math.round(matchScore),
        skillMatch: Math.round(skillMatch),
        experienceMatch: Math.round(experienceMatch),
        growthPotential: Math.round(growthPotential),
        recommendation: this.generateJobRecommendation(matchScore, skillMatch),
      }
    }).sort((a, b) => b.matchScore - a.matchScore)
  }

  // Private helper methods
  private static calculateTrend(values: number[]): 'increasing' | 'decreasing' | 'stable' {
    if (values.length < 2) return 'stable'
    
    const { slope } = this.simpleLinearRegression(values)
    
    if (slope > 0.05) return 'increasing'
    if (slope < -0.05) return 'decreasing'
    return 'stable'
  }

  private static linearRegression(
    dates: Date[],
    values: number[]
  ): { slope: number; intercept: number } {
    const n = dates.length
    if (n < 2) return { slope: 0, intercept: values[0] || 0 }

    const x = dates.map((d) => d.getTime())
    const y = values

    const sumX = x.reduce((a, b) => a + b, 0)
    const sumY = y.reduce((a, b) => a + b, 0)
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0)
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0)

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
    const intercept = (sumY - slope * sumX) / n

    return { slope, intercept }
  }

  private static simpleLinearRegression(values: number[]): { slope: number; intercept: number } {
    const n = values.length
    if (n < 2) return { slope: 0, intercept: values[0] || 0 }

    const x = values.map((_, i) => i)
    const y = values

    const sumX = x.reduce((a, b) => a + b, 0)
    const sumY = y.reduce((a, b) => a + b, 0)
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0)
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0)

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
    const intercept = (sumY - slope * sumX) / n

    return { slope, intercept }
  }

  private static predictValue(slope: number, intercept: number, timestamp: number): number {
    return slope * timestamp + intercept
  }

  private static calculateConfidence(
    values: number[],
    slope: number,
    intercept: number,
    dates: Date[]
  ): number {
    if (values.length < 3) return 50

    const predictions = dates.map((d) => this.predictValue(slope, intercept, d.getTime()))
    const errors = values.map((v, i) => Math.abs(v - predictions[i]))
    const avgError = errors.reduce((a, b) => a + b, 0) / errors.length
    const avgValue = values.reduce((a, b) => a + b, 0) / values.length

    const accuracy = avgValue > 0 ? (1 - avgError / avgValue) * 100 : 50
    return Math.max(0, Math.min(100, accuracy))
  }

  private static identifyGrowthFactors(
    metric: string,
    trend: 'increasing' | 'decreasing' | 'stable'
  ): string[] {
    const factors: Record<string, string[]> = {
      commitFrequency: [
        'Consistent coding practice',
        'Project complexity',
        'Available time',
      ],
      codeQualityScore: [
        'Code review participation',
        'Testing practices',
        'Experience level',
      ],
      collaborationScore: [
        'Team size',
        'Communication skills',
        'Community engagement',
      ],
    }

    return factors[metric] || ['General experience', 'Learning curve', 'Motivation']
  }

  private static predictNextMilestone(
    currentMetrics: Record<string, number>,
    historicalTrend: number,
    currentStage: string
  ): {
    title: string
    estimatedDate: Date
    probability: number
  } {
    const milestones = [
      { stage: 'junior', title: '100 Commits', threshold: 100, metric: 'commits' },
      { stage: 'mid', title: '500 Commits', threshold: 500, metric: 'commits' },
      { stage: 'mid', title: 'First Popular Repo (50 stars)', threshold: 50, metric: 'stars' },
      { stage: 'senior', title: '1000 Commits', threshold: 1000, metric: 'commits' },
      { stage: 'senior', title: 'Major OSS Contribution (100 stars)', threshold: 100, metric: 'stars' },
    ]

    const nextMilestone = milestones.find((m) => {
      const currentValue = currentMetrics[m.metric] || 0
      return currentValue < m.threshold
    }) || milestones[milestones.length - 1]

    const currentValue = currentMetrics[nextMilestone.metric] || 0
    const remaining = nextMilestone.threshold - currentValue
    const monthsToMilestone = historicalTrend > 0 ? remaining / historicalTrend : 12

    const estimatedDate = new Date()
    estimatedDate.setMonth(estimatedDate.getMonth() + Math.ceil(monthsToMilestone))

    const probability = Math.min(95, 60 + historicalTrend * 5)

    return {
      title: nextMilestone.title,
      estimatedDate,
      probability: Math.round(probability),
    }
  }

  private static recommendSkills(currentMetrics: Record<string, number>): Array<{
    skill: string
    priority: 'high' | 'medium' | 'low'
    marketDemand: number
    learningPath: string[]
  }> {
    const recommendations = [
      {
        skill: 'TypeScript',
        priority: 'high' as const,
        marketDemand: 90,
        learningPath: ['JavaScript Fundamentals', 'TypeScript Basics', 'Advanced Types'],
      },
      {
        skill: 'React',
        priority: 'high' as const,
        marketDemand: 95,
        learningPath: ['Component Basics', 'Hooks', 'State Management', 'Performance'],
      },
      {
        skill: 'Node.js',
        priority: 'medium' as const,
        marketDemand: 85,
        learningPath: ['Server Basics', 'Express.js', 'Database Integration'],
      },
      {
        skill: 'Docker',
        priority: 'medium' as const,
        marketDemand: 80,
        learningPath: ['Containerization Basics', 'Docker Compose', 'Kubernetes Intro'],
      },
      {
        skill: 'AWS',
        priority: 'low' as const,
        marketDemand: 88,
        learningPath: ['Cloud Fundamentals', 'EC2', 'S3', 'Lambda'],
      },
    ]

    return recommendations.slice(0, 3)
  }

  private static projectCareerPath(
    currentStage: string,
    historicalTrend: number
  ): Array<{
    stage: string
    estimatedDate: Date
    requirements: string[]
  }> {
    const stages = ['junior', 'mid', 'senior', 'lead', 'principal']
    const currentIndex = stages.indexOf(currentStage.toLowerCase())
    
    if (currentIndex === -1) return []

    const path: Array<{
      stage: string
      estimatedDate: Date
      requirements: string[]
    }> = []

    const yearsPerStage = historicalTrend > 5 ? 2 : 3

    for (let i = currentIndex + 1; i < Math.min(currentIndex + 3, stages.length); i++) {
      const date = new Date()
      date.setFullYear(date.getFullYear() + yearsPerStage * (i - currentIndex))
      
      path.push({
        stage: stages[i],
        estimatedDate: date,
        requirements: this.getStageRequirements(stages[i]),
      })
    }

    return path
  }

  private static getStageRequirements(stage: string): string[] {
    const requirements: Record<string, string[]> = {
      mid: ['500+ commits', '50+ code reviews', 'Team collaboration'],
      senior: ['1000+ commits', 'Project leadership', '100+ stars'],
      lead: ['Technical mentorship', 'Architecture decisions', 'Team management'],
      principal: ['Strategic vision', 'Industry recognition', 'Major OSS impact'],
    }

    return requirements[stage] || []
  }

  private static getMarketDemand(skill: string): number {
    const demands: Record<string, number> = {
      typescript: 90,
      react: 95,
      python: 92,
      nodejs: 85,
      docker: 80,
      kubernetes: 78,
      aws: 88,
      go: 75,
    }

    return demands[skill.toLowerCase()] || 60
  }

  private static generateSkillRecommendation(
    skill: string,
    demand: number,
    trend: 'rising' | 'falling' | 'stable'
  ): string {
    if (demand > 80 && trend === 'rising') {
      return `High priority: ${skill} is in high demand and growing`
    }
    if (demand > 70) {
      return `Good investment: ${skill} has strong market presence`
    }
    if (trend === 'falling') {
      return `Consider alternatives: ${skill} demand is declining`
    }
    return `Monitor: ${skill} has moderate demand`
  }

  private static calculateSkillMatch(userSkills: string[], required: string[]): number {
    const matches = required.filter((r) =>
      userSkills.some((u) => u.toLowerCase() === r.toLowerCase())
    )
    return (matches.length / required.length) * 100
  }

  private static calculateExperienceMatch(
    metrics: Record<string, number>,
    level: string
  ): number {
    const commits = metrics.commits || 0
    const thresholds: Record<string, number> = {
      junior: 100,
      mid: 500,
      senior: 1000,
      lead: 2000,
    }

    const threshold = thresholds[level.toLowerCase()] || 500
    return Math.min(100, (commits / threshold) * 100)
  }

  private static calculateGrowthPotential(userSkills: string[], required: string[]): number {
    const newSkills = required.filter(
      (r) => !userSkills.some((u) => u.toLowerCase() === r.toLowerCase())
    )
    return Math.min(100, (newSkills.length / required.length) * 100)
  }

  private static generateJobRecommendation(matchScore: number, skillMatch: number): string {
    if (matchScore >= 80) {
      return 'Excellent match! Apply with confidence'
    }
    if (matchScore >= 60) {
      return 'Good fit! Consider applying'
    }
    if (skillMatch >= 70) {
      return 'Skills match but need more experience'
    }
    return 'Consider building more relevant experience first'
  }
}

