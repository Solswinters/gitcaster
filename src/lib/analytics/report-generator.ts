/**
 * Analytics report generator
 * Creates comprehensive reports in multiple formats
 */

import { DeveloperMetrics } from './metrics-calculator'
import { CareerTrajectory } from './career-progression'

export interface ReportSection {
  title: string
  content: string
  data?: any
  charts?: Array<{
    type: 'line' | 'bar' | 'pie' | 'radar'
    data: any
  }>
}

export interface AnalyticsReport {
  id: string
  userId: string
  userName: string
  generatedAt: Date
  period: {
    start: Date
    end: Date
  }
  sections: ReportSection[]
  summary: string
  highlights: string[]
  recommendations: string[]
  metadata: Record<string, any>
}

export type ReportFormat = 'json' | 'markdown' | 'html' | 'pdf'

export class ReportGenerator {
  /**
   * Generate comprehensive analytics report
   */
  static generateReport(
    userId: string,
    userName: string,
    metrics: DeveloperMetrics,
    trajectory: CareerTrajectory,
    options?: {
      period?: { start: Date; end: Date }
      includeCharts?: boolean
      includeRecommendations?: boolean
    }
  ): AnalyticsReport {
    const sections: ReportSection[] = []

    // Executive Summary
    sections.push(this.generateExecutiveSummary(metrics, trajectory))

    // Activity Metrics
    sections.push(this.generateActivitySection(metrics))

    // Quality & Collaboration
    sections.push(this.generateQualitySection(metrics))

    // Growth & Impact
    sections.push(this.generateGrowthSection(metrics, trajectory))

    // Career Progression
    sections.push(this.generateCareerSection(trajectory))

    // Skills Analysis
    sections.push(this.generateSkillsSection(metrics))

    const summary = this.generateSummary(metrics, trajectory)
    const highlights = this.generateHighlights(metrics, trajectory)
    const recommendations = options?.includeRecommendations
      ? this.generateRecommendations(metrics, trajectory)
      : []

    return {
      id: `report-${Date.now()}`,
      userId,
      userName,
      generatedAt: new Date(),
      period: options?.period || {
        start: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
        end: new Date(),
      },
      sections,
      summary,
      highlights,
      recommendations,
      metadata: {
        reportVersion: '1.0',
        includesCharts: options?.includeCharts || false,
      },
    }
  }

  /**
   * Export report to specified format
   */
  static exportReport(report: AnalyticsReport, format: ReportFormat): string {
    switch (format) {
      case 'json':
        return this.exportAsJSON(report)
      case 'markdown':
        return this.exportAsMarkdown(report)
      case 'html':
        return this.exportAsHTML(report)
      case 'pdf':
        return this.exportAsPDF(report)
      default:
        return this.exportAsJSON(report)
    }
  }

  /**
   * Generate report comparison between two periods
   */
  static generateComparisonReport(
    userId: string,
    userName: string,
    currentMetrics: DeveloperMetrics,
    previousMetrics: DeveloperMetrics,
    period: { start: Date; end: Date }
  ): AnalyticsReport {
    const sections: ReportSection[] = []

    sections.push({
      title: 'Period Comparison',
      content: this.generateComparisonSummary(currentMetrics, previousMetrics),
      data: {
        current: currentMetrics,
        previous: previousMetrics,
        changes: this.calculateChanges(currentMetrics, previousMetrics),
      },
    })

    return {
      id: `comparison-${Date.now()}`,
      userId,
      userName,
      generatedAt: new Date(),
      period,
      sections,
      summary: 'Period comparison report',
      highlights: [],
      recommendations: [],
      metadata: {
        reportType: 'comparison',
      },
    }
  }

  // Private helper methods
  private static generateExecutiveSummary(
    metrics: DeveloperMetrics,
    trajectory: CareerTrajectory
  ): ReportSection {
    const content = `
**Career Stage**: ${trajectory.currentStage.stage.toUpperCase()}

**Overall Performance**: ${this.getPerformanceLevel(metrics)}

**Key Statistics**:
- Commit Frequency: ${metrics.commitFrequency.toFixed(1)}/week
- Code Quality Score: ${metrics.codeQualityScore}/100
- Collaboration Score: ${metrics.collaborationScore}/100
- Impact: ${metrics.repoStars} stars, ${metrics.forks} forks

**Growth Rate**: ${trajectory.overallGrowthRate.toFixed(1)} points/year
    `.trim()

    return {
      title: 'Executive Summary',
      content,
      data: { metrics, trajectory },
    }
  }

  private static generateActivitySection(metrics: DeveloperMetrics): ReportSection {
    const content = `
**Contribution Activity**

- Commit Frequency: ${metrics.commitFrequency.toFixed(1)} per week
- PR Velocity: ${metrics.prVelocity.toFixed(1)} per month
- Issue Resolution Rate: ${metrics.issueResolutionRate.toFixed(1)}%
- Code Review Participation: ${metrics.codeReviewParticipation.toFixed(2)}x ratio

**Analysis**: ${this.getActivityAnalysis(metrics)}
    `.trim()

    return {
      title: 'Activity Metrics',
      content,
      data: {
        commitFrequency: metrics.commitFrequency,
        prVelocity: metrics.prVelocity,
        issueResolutionRate: metrics.issueResolutionRate,
      },
    }
  }

  private static generateQualitySection(metrics: DeveloperMetrics): ReportSection {
    const content = `
**Code Quality**

- Quality Score: ${metrics.codeQualityScore}/100
- Test Coverage: ${metrics.testCoverageAverage}%
- Documentation Score: ${metrics.documentationScore}/100
- Bug Rate: ${metrics.bugRate} per 1000 lines

**Collaboration**

- Collaboration Score: ${metrics.collaborationScore}/100
- Community Engagement: ${metrics.communityEngagement}/100
- Mentorship Activity: ${metrics.mentorshipActivity}

**Analysis**: ${this.getQualityAnalysis(metrics)}
    `.trim()

    return {
      title: 'Quality & Collaboration',
      content,
      data: {
        codeQuality: metrics.codeQualityScore,
        collaboration: metrics.collaborationScore,
      },
    }
  }

  private static generateGrowthSection(
    metrics: DeveloperMetrics,
    trajectory: CareerTrajectory
  ): ReportSection {
    const content = `
**Skill Development**

- Skill Diversity: ${metrics.skillDiversity} languages/technologies
- Learning Velocity: ${metrics.learningVelocity} new skills/quarter
- Project Complexity: ${metrics.projectComplexity}/100

**Impact Metrics**

- Repository Stars: ${metrics.repoStars}
- Forks: ${metrics.forks}
- Dependents: ${metrics.dependents}
- Downloads: ${metrics.downloads}

**Growth Trajectory**: ${trajectory.overallGrowthRate.toFixed(1)} points/year average
    `.trim()

    return {
      title: 'Growth & Impact',
      content,
      data: {
        skillDiversity: metrics.skillDiversity,
        impact: {
          stars: metrics.repoStars,
          forks: metrics.forks,
        },
      },
    }
  }

  private static generateCareerSection(trajectory: CareerTrajectory): ReportSection {
    const content = `
**Current Stage**: ${trajectory.currentStage.stage.toUpperCase()}

**Stage Indicators**:
- Technical Skills: ${trajectory.currentStage.indicators.technicalSkills}/100
- Leadership: ${trajectory.currentStage.indicators.leadership}/100
- Impact: ${trajectory.currentStage.indicators.impact}/100
- Communication: ${trajectory.currentStage.indicators.communication}/100

**Strengths**: ${trajectory.strengthAreas.join(', ')}

**Growth Areas**: ${trajectory.improvementAreas.join(', ')}

${
  trajectory.projectedNextStage
    ? `**Next Stage**: ${trajectory.projectedNextStage.stage} (estimated ${new Date(trajectory.projectedNextStage.estimatedDate).toLocaleDateString()})`
    : ''
}
    `.trim()

    return {
      title: 'Career Progression',
      content,
      data: trajectory,
    }
  }

  private static generateSkillsSection(metrics: DeveloperMetrics): ReportSection {
    const content = `
**Skills Overview**

- Total Skills: ${metrics.skillDiversity}
- Proficiency: Demonstrated across ${metrics.skillDiversity} technologies
- Versatility Score: ${this.calculateVersatilityScore(metrics)}/100

**Recommendation**: ${metrics.skillDiversity < 3 ? 'Expand your technology stack' : metrics.skillDiversity > 7 ? 'Excellent polyglot expertise!' : 'Good skill diversity'}
    `.trim()

    return {
      title: 'Skills Analysis',
      content,
      data: {
        diversity: metrics.skillDiversity,
      },
    }
  }

  private static generateSummary(
    metrics: DeveloperMetrics,
    trajectory: CareerTrajectory
  ): string {
    return `${trajectory.currentStage.stage.toUpperCase()} developer with ${metrics.commitFrequency.toFixed(1)} commits/week, code quality score of ${metrics.codeQualityScore}/100, and ${metrics.repoStars} GitHub stars. Growing at ${trajectory.overallGrowthRate.toFixed(1)} points/year.`
  }

  private static generateHighlights(
    metrics: DeveloperMetrics,
    trajectory: CareerTrajectory
  ): string[] {
    const highlights: string[] = []

    if (metrics.commitFrequency > 15) {
      highlights.push('🔥 Exceptional contribution frequency')
    }

    if (metrics.codeQualityScore > 80) {
      highlights.push('⭐ High code quality standards')
    }

    if (metrics.repoStars > 100) {
      highlights.push('🌟 Strong community impact')
    }

    if (metrics.skillDiversity > 5) {
      highlights.push('🎯 Polyglot developer')
    }

    if (trajectory.overallGrowthRate > 10) {
      highlights.push('📈 Rapid skill growth')
    }

    return highlights
  }

  private static generateRecommendations(
    metrics: DeveloperMetrics,
    trajectory: CareerTrajectory
  ): string[] {
    const recommendations: string[] = []

    if (metrics.commitFrequency < 5) {
      recommendations.push('Increase coding frequency for better visibility')
    }

    if (metrics.codeQualityScore < 70) {
      recommendations.push('Focus on code quality through testing and reviews')
    }

    if (metrics.collaborationScore < 60) {
      recommendations.push('Participate more in team collaboration and reviews')
    }

    if (metrics.skillDiversity < 3) {
      recommendations.push('Learn new technologies to expand versatility')
    }

    if (trajectory.projectedNextStage) {
      recommendations.push(
        `Work towards ${trajectory.projectedNextStage.stage} level by focusing on ${trajectory.improvementAreas.join(', ')}`
      )
    }

    return recommendations
  }

  private static getPerformanceLevel(metrics: DeveloperMetrics): string {
    const avgScore =
      (metrics.codeQualityScore + metrics.collaborationScore + metrics.communityEngagement) / 3
    if (avgScore > 80) return 'EXCELLENT'
    if (avgScore > 60) return 'GOOD'
    if (avgScore > 40) return 'AVERAGE'
    return 'DEVELOPING'
  }

  private static getActivityAnalysis(metrics: DeveloperMetrics): string {
    if (metrics.commitFrequency > 15 && metrics.prVelocity > 8) {
      return 'Highly active contributor with strong PR engagement'
    }
    if (metrics.commitFrequency > 10) {
      return 'Consistent contributor with regular activity'
    }
    if (metrics.commitFrequency > 5) {
      return 'Moderate activity level, room for growth'
    }
    return 'Consider increasing contribution frequency'
  }

  private static getQualityAnalysis(metrics: DeveloperMetrics): string {
    if (metrics.codeQualityScore > 80 && metrics.collaborationScore > 70) {
      return 'Excellent quality standards with strong collaboration'
    }
    if (metrics.codeQualityScore > 60) {
      return 'Good quality practices, continue improving'
    }
    return 'Focus on quality improvement through testing and reviews'
  }

  private static calculateVersatilityScore(metrics: DeveloperMetrics): number {
    return Math.min(100, metrics.skillDiversity * 10 + 20)
  }

  private static calculateChanges(
    current: DeveloperMetrics,
    previous: DeveloperMetrics
  ): Record<string, { value: number; change: number; percentage: number }> {
    const changes: Record<string, any> = {}
    const keys = Object.keys(current) as Array<keyof DeveloperMetrics>

    keys.forEach((key) => {
      const currentValue = current[key]
      const previousValue = previous[key]
      const change = currentValue - previousValue
      const percentage = previousValue !== 0 ? (change / previousValue) * 100 : 0

      changes[key] = {
        value: currentValue,
        change,
        percentage: Math.round(percentage * 10) / 10,
      }
    })

    return changes
  }

  private static generateComparisonSummary(
    current: DeveloperMetrics,
    previous: DeveloperMetrics
  ): string {
    const changes = this.calculateChanges(current, previous)
    const improvements = Object.entries(changes)
      .filter(([_, data]) => data.change > 0)
      .map(([key, data]) => `${key}: +${data.percentage}%`)
      .slice(0, 3)

    return `Period comparison showing improvements in: ${improvements.join(', ')}`
  }

  private static exportAsJSON(report: AnalyticsReport): string {
    return JSON.stringify(report, null, 2)
  }

  private static exportAsMarkdown(report: AnalyticsReport): string {
    let md = `# Analytics Report - ${report.userName}\n\n`
    md += `Generated: ${report.generatedAt.toLocaleDateString()}\n\n`
    md += `## Summary\n\n${report.summary}\n\n`

    if (report.highlights.length > 0) {
      md += `## Highlights\n\n`
      report.highlights.forEach((h) => {
        md += `- ${h}\n`
      })
      md += `\n`
    }

    report.sections.forEach((section) => {
      md += `## ${section.title}\n\n${section.content}\n\n`
    })

    if (report.recommendations.length > 0) {
      md += `## Recommendations\n\n`
      report.recommendations.forEach((r) => {
        md += `- ${r}\n`
      })
    }

    return md
  }

  private static exportAsHTML(report: AnalyticsReport): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <title>Analytics Report - ${report.userName}</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #2563eb; }
    h2 { color: #1e40af; margin-top: 2em; }
    .summary { background: #f3f4f6; padding: 1em; border-radius: 8px; }
    .highlights { list-style: none; padding: 0; }
    .highlights li { background: #dbeafe; padding: 0.5em; margin: 0.5em 0; border-radius: 4px; }
  </style>
</head>
<body>
  <h1>Analytics Report - ${report.userName}</h1>
  <p><em>Generated: ${report.generatedAt.toLocaleDateString()}</em></p>
  
  <div class="summary">
    <h2>Summary</h2>
    <p>${report.summary}</p>
  </div>

  ${report.highlights.length > 0 ? `
  <h2>Highlights</h2>
  <ul class="highlights">
    ${report.highlights.map((h) => `<li>${h}</li>`).join('')}
  </ul>
  ` : ''}

  ${report.sections.map((s) => `
  <h2>${s.title}</h2>
  <pre>${s.content}</pre>
  `).join('')}

  ${report.recommendations.length > 0 ? `
  <h2>Recommendations</h2>
  <ul>
    ${report.recommendations.map((r) => `<li>${r}</li>`).join('')}
  </ul>
  ` : ''}
</body>
</html>
    `.trim()
  }

  private static exportAsPDF(report: AnalyticsReport): string {
    // This would integrate with a PDF library in production
    // For now, return HTML that can be converted to PDF
    return this.exportAsHTML(report)
  }
}

