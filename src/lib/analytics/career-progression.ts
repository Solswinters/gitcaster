/**
 * Career progression tracker and analyzer
 * Tracks developer growth and career milestones
 */

export interface CareerMilestone {
  id: string
  type: 'skill' | 'achievement' | 'contribution' | 'recognition' | 'leadership'
  title: string
  description: string
  date: Date
  impact: 'low' | 'medium' | 'high' | 'critical'
  category: string
  metadata?: Record<string, any>
}

export interface SkillProgression {
  skill: string
  category: string
  milestones: Array<{
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
    achievedDate: Date
    evidence: string[]
  }>
  currentLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  proficiencyScore: number
  yearsOfExperience: number
  projectsCompleted: number
}

export interface CareerStage {
  stage: 'junior' | 'mid' | 'senior' | 'lead' | 'principal'
  startDate: Date
  endDate?: Date
  indicators: {
    technicalSkills: number // 0-100
    leadership: number // 0-100
    impact: number // 0-100
    communication: number // 0-100
  }
  achievements: CareerMilestone[]
}

export interface CareerTrajectory {
  stages: CareerStage[]
  currentStage: CareerStage
  projectedNextStage?: {
    stage: string
    estimatedDate: Date
    requirements: string[]
    progress: number
  }
  overallGrowthRate: number
  strengthAreas: string[]
  improvementAreas: string[]
}

export class CareerProgressionTracker {
  /**
   * Analyze career progression from historical data
   */
  static analyzeProgression(data: {
    commits: Array<{ date: Date; language: string }>
    prs: Array<{ date: Date; reviews: number }>
    repos: Array<{ created: Date; stars: number; role: string }>
    skills: Array<{ skill: string; firstUsed: Date; lastUsed: Date }>
  }): CareerTrajectory {
    const milestones = this.extractMilestones(data)
    const stages = this.identifyCareerStages(milestones, data)
    const currentStage = stages[stages.length - 1]
    const projectedNext = this.projectNextStage(currentStage, stages)
    const growthRate = this.calculateGrowthRate(stages)
    const { strengthAreas, improvementAreas } = this.analyzeStrengthsWeaknesses(
      currentStage
    )

    return {
      stages,
      currentStage,
      projectedNextStage: projectedNext,
      overallGrowthRate: growthRate,
      strengthAreas,
      improvementAreas,
    }
  }

  /**
   * Track skill progression over time
   */
  static trackSkillProgression(
    skill: string,
    activities: Array<{
      date: Date
      type: 'commit' | 'pr' | 'review' | 'project'
      complexity: number
    }>
  ): SkillProgression {
    const sortedActivities = activities.sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    )

    const firstUse = sortedActivities[0]?.date || new Date()
    const lastUse = sortedActivities[sortedActivities.length - 1]?.date || new Date()
    const yearsOfExperience =
      (lastUse.getTime() - firstUse.getTime()) / (1000 * 60 * 60 * 24 * 365)

    const milestones = this.identifySkillMilestones(sortedActivities)
    const currentLevel = milestones[milestones.length - 1]?.level || 'beginner'
    const proficiencyScore = this.calculateProficiencyScore(activities, yearsOfExperience)
    const projectsCompleted = new Set(
      activities.filter((a) => a.type === 'project').map((a) => a.date.toDateString())
    ).size

    return {
      skill,
      category: this.categorizeSkill(skill),
      milestones,
      currentLevel,
      proficiencyScore,
      yearsOfExperience,
      projectsCompleted,
    }
  }

  /**
   * Identify career milestones automatically
   */
  static extractMilestones(data: {
    commits: Array<{ date: Date; language: string }>
    prs: Array<{ date: Date; reviews: number }>
    repos: Array<{ created: Date; stars: number; role: string }>
    skills: Array<{ skill: string; firstUsed: Date; lastUsed: Date }>
  }): CareerMilestone[] {
    const milestones: CareerMilestone[] = []

    // First commit
    if (data.commits.length > 0) {
      const firstCommit = data.commits.sort(
        (a, b) => a.date.getTime() - b.date.getTime()
      )[0]
      milestones.push({
        id: 'first-commit',
        type: 'contribution',
        title: 'First Contribution',
        description: 'Made first commit to version control',
        date: firstCommit.date,
        impact: 'low',
        category: 'Getting Started',
      })
    }

    // 100th commit
    if (data.commits.length >= 100) {
      const commit100 = data.commits[99]
      milestones.push({
        id: 'commits-100',
        type: 'achievement',
        title: '100 Commits',
        description: 'Reached 100 commits milestone',
        date: commit100.date,
        impact: 'medium',
        category: 'Consistency',
      })
    }

    // First repository with stars
    const starredRepos = data.repos.filter((r) => r.stars > 0)
    if (starredRepos.length > 0) {
      const first = starredRepos.sort(
        (a, b) => a.created.getTime() - b.created.getTime()
      )[0]
      milestones.push({
        id: 'first-star',
        type: 'recognition',
        title: 'First GitHub Star',
        description: 'Created first repository that received community recognition',
        date: first.created,
        impact: 'medium',
        category: 'Impact',
      })
    }

    // High-impact repository (100+ stars)
    const popularRepos = data.repos.filter((r) => r.stars >= 100)
    if (popularRepos.length > 0) {
      const mostPopular = popularRepos.sort((a, b) => b.stars - a.stars)[0]
      milestones.push({
        id: 'popular-repo',
        type: 'recognition',
        title: 'Popular Open Source Project',
        description: `Created repository with ${mostPopular.stars}+ stars`,
        date: mostPopular.created,
        impact: 'high',
        category: 'Community Impact',
      })
    }

    // First code review
    const reviewedPRs = data.prs.filter((pr) => pr.reviews > 0)
    if (reviewedPRs.length > 0) {
      const first = reviewedPRs.sort(
        (a, b) => a.date.getTime() - b.date.getTime()
      )[0]
      milestones.push({
        id: 'first-review',
        type: 'leadership',
        title: 'First Code Review',
        description: 'Started contributing to code reviews',
        date: first.date,
        impact: 'medium',
        category: 'Collaboration',
      })
    }

    // Maintainer role
    const maintainerRepos = data.repos.filter((r) => r.role === 'maintainer')
    if (maintainerRepos.length > 0) {
      const first = maintainerRepos.sort(
        (a, b) => a.created.getTime() - b.created.getTime()
      )[0]
      milestones.push({
        id: 'first-maintainer',
        type: 'leadership',
        title: 'Repository Maintainer',
        description: 'Became maintainer of an open source project',
        date: first.created,
        impact: 'high',
        category: 'Leadership',
      })
    }

    // Multi-language proficiency
    const languages = new Set(data.commits.map((c) => c.language))
    if (languages.size >= 5) {
      const recentCommit = data.commits[data.commits.length - 1]
      milestones.push({
        id: 'polyglot',
        type: 'skill',
        title: 'Polyglot Developer',
        description: `Proficient in ${languages.size} programming languages`,
        date: recentCommit?.date || new Date(),
        impact: 'high',
        category: 'Technical Skills',
      })
    }

    return milestones.sort((a, b) => a.date.getTime() - b.date.getTime())
  }

  /**
   * Identify career stages based on milestones and metrics
   */
  private static identifyCareerStages(
    milestones: CareerMilestone[],
    data: any
  ): CareerStage[] {
    const stages: CareerStage[] = []
    const startDate = milestones[0]?.date || new Date()

    // Junior stage (0-2 years, basic contributions)
    const juniorEnd = new Date(startDate)
    juniorEnd.setFullYear(juniorEnd.getFullYear() + 2)
    
    stages.push({
      stage: 'junior',
      startDate,
      endDate: juniorEnd,
      indicators: {
        technicalSkills: 40,
        leadership: 20,
        impact: 30,
        communication: 35,
      },
      achievements: milestones.filter(
        (m) => m.date >= startDate && m.date <= juniorEnd
      ),
    })

    // Determine current stage based on indicators
    const totalCommits = data.commits.length
    const totalReviews = data.prs.reduce((sum: number, pr: any) => sum + pr.reviews, 0)
    const maintainerCount = data.repos.filter((r: any) => r.role === 'maintainer').length
    const totalStars = data.repos.reduce((sum: number, r: any) => sum + r.stars, 0)

    if (totalCommits > 500 && totalReviews > 50) {
      const midStart = new Date(juniorEnd)
      midStart.setDate(midStart.getDate() + 1)
      
      stages.push({
        stage: 'mid',
        startDate: midStart,
        indicators: {
          technicalSkills: 70,
          leadership: 50,
          impact: 60,
          communication: 65,
        },
        achievements: milestones.filter((m) => m.date >= midStart),
      })
    }

    if (maintainerCount > 0 && totalStars > 100) {
      const seniorStart = stages.length > 1 ? new Date() : new Date(juniorEnd)
      
      stages.push({
        stage: 'senior',
        startDate: seniorStart,
        indicators: {
          technicalSkills: 85,
          leadership: 75,
          impact: 80,
          communication: 80,
        },
        achievements: milestones.filter((m) => m.date >= seniorStart),
      })
    }

    return stages
  }

  /**
   * Project next career stage
   */
  private static projectNextStage(
    currentStage: CareerStage,
    allStages: CareerStage[]
  ): CareerTrajectory['projectedNextStage'] {
    const stageOrder = ['junior', 'mid', 'senior', 'lead', 'principal']
    const currentIndex = stageOrder.indexOf(currentStage.stage)
    
    if (currentIndex === -1 || currentIndex >= stageOrder.length - 1) {
      return undefined
    }

    const nextStage = stageOrder[currentIndex + 1]
    const avgStageLength = this.calculateAverageStageLength(allStages)
    const estimatedDate = new Date(currentStage.startDate)
    estimatedDate.setFullYear(estimatedDate.getFullYear() + avgStageLength)

    const requirements = this.getStageRequirements(nextStage as any)
    const progress = this.calculateProgressToNextStage(currentStage, requirements)

    return {
      stage: nextStage,
      estimatedDate,
      requirements,
      progress,
    }
  }

  /**
   * Calculate overall growth rate
   */
  private static calculateGrowthRate(stages: CareerStage[]): number {
    if (stages.length < 2) return 0

    const totalGrowth = stages.reduce((sum, stage, idx) => {
      if (idx === 0) return 0
      const prevStage = stages[idx - 1]
      const improvement =
        (Object.values(stage.indicators).reduce((a, b) => a + b, 0) -
          Object.values(prevStage.indicators).reduce((a, b) => a + b, 0)) /
        4
      return sum + improvement
    }, 0)

    return totalGrowth / (stages.length - 1)
  }

  /**
   * Analyze strengths and improvement areas
   */
  private static analyzeStrengthsWeaknesses(stage: CareerStage): {
    strengthAreas: string[]
    improvementAreas: string[]
  } {
    const indicators = Object.entries(stage.indicators).map(([key, value]) => ({
      area: key,
      score: value,
    }))

    const sorted = indicators.sort((a, b) => b.score - a.score)
    const strengthAreas = sorted.slice(0, 2).map((i) => i.area)
    const improvementAreas = sorted.slice(-2).map((i) => i.area)

    return { strengthAreas, improvementAreas }
  }

  /**
   * Identify skill progression milestones
   */
  private static identifySkillMilestones(
    activities: Array<{ date: Date; type: string; complexity: number }>
  ): Array<{
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
    achievedDate: Date
    evidence: string[]
  }> {
    const milestones: any[] = []

    // Beginner: First use
    if (activities.length > 0) {
      milestones.push({
        level: 'beginner',
        achievedDate: activities[0].date,
        evidence: ['First use of skill'],
      })
    }

    // Intermediate: 10+ activities
    if (activities.length >= 10) {
      milestones.push({
        level: 'intermediate',
        achievedDate: activities[9].date,
        evidence: ['10+ contributions', 'Consistent usage'],
      })
    }

    // Advanced: 50+ activities with complexity
    const complexActivities = activities.filter((a) => a.complexity > 5)
    if (activities.length >= 50 && complexActivities.length >= 10) {
      milestones.push({
        level: 'advanced',
        achievedDate: activities[49].date,
        evidence: [
          '50+ contributions',
          'Complex projects completed',
          'Code reviews provided',
        ],
      })
    }

    // Expert: 100+ activities, high complexity
    const expertActivities = activities.filter((a) => a.complexity > 7)
    if (activities.length >= 100 && expertActivities.length >= 20) {
      milestones.push({
        level: 'expert',
        achievedDate: activities[99].date,
        evidence: [
          '100+ contributions',
          'High-complexity projects',
          'Mentorship activity',
          'Community recognition',
        ],
      })
    }

    return milestones
  }

  /**
   * Calculate proficiency score
   */
  private static calculateProficiencyScore(
    activities: Array<{ type: string; complexity: number }>,
    yearsOfExperience: number
  ): number {
    const activityScore = Math.min(50, activities.length / 2)
    const complexityScore =
      Math.min(30, activities.reduce((sum, a) => sum + a.complexity, 0) / activities.length)
    const experienceScore = Math.min(20, yearsOfExperience * 5)

    return Math.round(activityScore + complexityScore + experienceScore)
  }

  /**
   * Categorize skill
   */
  private static categorizeSkill(skill: string): string {
    const categories: Record<string, string[]> = {
      Language: [
        'javascript',
        'typescript',
        'python',
        'java',
        'go',
        'rust',
        'c++',
      ],
      Framework: ['react', 'vue', 'angular', 'nextjs', 'express', 'django'],
      Database: ['postgresql', 'mongodb', 'redis', 'mysql'],
      DevOps: ['docker', 'kubernetes', 'aws', 'azure', 'gcp'],
      Testing: ['jest', 'cypress', 'playwright', 'junit'],
    }

    for (const [category, skills] of Object.entries(categories)) {
      if (skills.some((s) => skill.toLowerCase().includes(s))) {
        return category
      }
    }

    return 'Other'
  }

  /**
   * Calculate average stage length
   */
  private static calculateAverageStageLength(stages: CareerStage[]): number {
    if (stages.length < 2) return 2 // default 2 years

    const lengths = stages.slice(0, -1).map((stage, idx) => {
      const next = stages[idx + 1]
      const years =
        (next.startDate.getTime() - stage.startDate.getTime()) /
        (1000 * 60 * 60 * 24 * 365)
      return years
    })

    return lengths.reduce((sum, len) => sum + len, 0) / lengths.length
  }

  /**
   * Get requirements for next stage
   */
  private static getStageRequirements(
    stage: 'mid' | 'senior' | 'lead' | 'principal'
  ): string[] {
    const requirements: Record<string, string[]> = {
      mid: [
        'Technical Skills: 70+',
        'Leadership: 50+',
        'Impact: 60+',
        '500+ commits',
        '50+ code reviews',
      ],
      senior: [
        'Technical Skills: 85+',
        'Leadership: 75+',
        'Impact: 80+',
        'Maintainer of projects',
        '100+ GitHub stars',
        'Mentorship activity',
      ],
      lead: [
        'Technical Skills: 90+',
        'Leadership: 85+',
        'Impact: 90+',
        'Multiple popular projects',
        'Team leadership experience',
        'Technical writing/speaking',
      ],
      principal: [
        'Technical Skills: 95+',
        'Leadership: 95+',
        'Impact: 95+',
        'Industry recognition',
        'Significant OSS contributions',
        'Strategic technical vision',
      ],
    }

    return requirements[stage] || []
  }

  /**
   * Calculate progress to next stage
   */
  private static calculateProgressToNextStage(
    currentStage: CareerStage,
    requirements: string[]
  ): number {
    // Simple calculation based on current indicators
    const avgScore =
      Object.values(currentStage.indicators).reduce((a, b) => a + b, 0) / 4
    return Math.min(100, Math.round(avgScore))
  }
}

