/**
 * AI-powered insights generator
 * Generates actionable insights from analytics data
 */

export interface Insight {
  id: string
  category: 'strength' | 'opportunity' | 'warning' | 'suggestion'
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  actionItems: string[]
  estimatedImpact: 'high' | 'medium' | 'low'
  timeframe: string
}

export class InsightsGenerator {
  /**
   * Generate insights from metrics
   */
  static generateInsights(metrics: Record<string, number>): Insight[] {
    const insights: Insight[] = []

    // Activity insights
    insights.push(...this.analyzeActivity(metrics))

    // Quality insights
    insights.push(...this.analyzeQuality(metrics))

    // Growth insights
    insights.push(...this.analyzeGrowth(metrics))

    // Impact insights
    insights.push(...this.analyzeImpact(metrics))

    return insights.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
  }

  private static analyzeActivity(metrics: Record<string, number>): Insight[] {
    const insights: Insight[] = []

    if (metrics.commitFrequency < 5) {
      insights.push({
        id: 'low-commit-frequency',
        category: 'opportunity',
        priority: 'high',
        title: 'Increase Commit Frequency',
        description:
          'Your commit frequency is below average. Regular commits improve visibility and career opportunities.',
        actionItems: [
          'Set a goal to commit at least once per day',
          'Break down large tasks into smaller commits',
          'Use GitHub streaks for motivation',
        ],
        estimatedImpact: 'high',
        timeframe: '1-2 months',
      })
    } else if (metrics.commitFrequency > 15) {
      insights.push({
        id: 'high-commit-activity',
        category: 'strength',
        priority: 'medium',
        title: 'Excellent Activity Level',
        description: 'Your commit frequency is in the top 10% of developers.',
        actionItems: ['Maintain current momentum', 'Share your workflow tips'],
        estimatedImpact: 'high',
        timeframe: 'ongoing',
      })
    }

    return insights
  }

  private static analyzeQuality(metrics: Record<string, number>): Insight[] {
    const insights: Insight[] = []

    if (metrics.codeQualityScore < 60) {
      insights.push({
        id: 'improve-code-quality',
        category: 'warning',
        priority: 'high',
        title: 'Code Quality Needs Attention',
        description: 'Your code quality score suggests room for improvement.',
        actionItems: [
          'Increase code review participation',
          'Add more unit tests',
          'Follow style guides consistently',
          'Use linting tools',
        ],
        estimatedImpact: 'high',
        timeframe: '2-3 months',
      })
    }

    if (metrics.collaborationScore < 50) {
      insights.push({
        id: 'increase-collaboration',
        category: 'opportunity',
        priority: 'medium',
        title: 'Boost Team Collaboration',
        description: 'More collaboration can accelerate your growth.',
        actionItems: [
          'Review more pull requests',
          'Participate in code discussions',
          'Mentor junior developers',
        ],
        estimatedImpact: 'medium',
        timeframe: '1-2 months',
      })
    }

    return insights
  }

  private static analyzeGrowth(metrics: Record<string, number>): Insight[] {
    const insights: Insight[] = []

    if (metrics.skillDiversity < 3) {
      insights.push({
        id: 'expand-skills',
        category: 'suggestion',
        priority: 'medium',
        title: 'Diversify Your Skills',
        description: 'Learning new technologies increases marketability.',
        actionItems: [
          'Pick one new language to learn',
          'Contribute to projects in different stacks',
          'Complete online courses',
        ],
        estimatedImpact: 'high',
        timeframe: '3-6 months',
      })
    } else if (metrics.skillDiversity > 7) {
      insights.push({
        id: 'polyglot-expertise',
        category: 'strength',
        priority: 'low',
        title: 'Impressive Polyglot Skills',
        description: 'Your diverse skill set is a major strength.',
        actionItems: [
          'Leverage this in job applications',
          'Write about your cross-stack experience',
        ],
        estimatedImpact: 'medium',
        timeframe: 'ongoing',
      })
    }

    return insights
  }

  private static analyzeImpact(metrics: Record<string, number>): Insight[] {
    const insights: Insight[] = []

    if (metrics.repoStars < 50) {
      insights.push({
        id: 'build-open-source',
        category: 'suggestion',
        priority: 'low',
        title: 'Build Open Source Presence',
        description: 'Open source contributions enhance your reputation.',
        actionItems: [
          'Create utility libraries',
          'Contribute to popular projects',
          'Document your projects well',
          'Promote on social media',
        ],
        estimatedImpact: 'medium',
        timeframe: '6-12 months',
      })
    } else if (metrics.repoStars > 100) {
      insights.push({
        id: 'strong-oss-impact',
        category: 'strength',
        priority: 'low',
        title: 'Strong Open Source Impact',
        description: 'Your projects have gained community recognition.',
        actionItems: [
          'Continue maintaining popular projects',
          'Engage with contributors',
        ],
        estimatedImpact: 'high',
        timeframe: 'ongoing',
      })
    }

    return insights
  }
}

