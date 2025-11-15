/**
 * Main career progression tracking service
 */

import type { CareerTrajectory, CareerStage, ProgressionData } from '../types';
import { MilestoneTracker } from './milestone-tracker';
import { CareerStageAnalyzer } from './career-stage-analyzer';

export class CareerProgressionTracker {
  /**
   * Analyze career progression from historical data
   */
  static analyzeProgression(data: ProgressionData): CareerTrajectory {
    const milestones = MilestoneTracker.extractMilestones(data);
    const stages = CareerStageAnalyzer.identifyCareerStages(milestones, data);
    const currentStage = stages[stages.length - 1];
    const projectedNext = this.projectNextStage(currentStage, stages);
    const growthRate = this.calculateGrowthRate(stages);
    const { strengthAreas, improvementAreas } =
      CareerStageAnalyzer.analyzeStrengthsWeaknesses(currentStage);

    return {
      stages,
      currentStage,
      projectedNextStage: projectedNext,
      overallGrowthRate: growthRate,
      strengthAreas,
      improvementAreas,
    };
  }

  /**
   * Project next career stage
   */
  private static projectNextStage(
    currentStage: CareerStage,
    allStages: CareerStage[]
  ): CareerTrajectory['projectedNextStage'] {
    const stageOrder: CareerStage['stage'][] = ['junior', 'mid', 'senior', 'lead', 'principal'];
    const currentIndex = stageOrder.indexOf(currentStage.stage);

    if (currentIndex === stageOrder.length - 1) {
      return undefined; // Already at highest stage
    }

    const nextStage = stageOrder[currentIndex + 1];
    const avgStageDuration = this.calculateAverageStageDuration(allStages);
    const stageStartDate = currentStage.startDate;
    const estimatedDate = new Date(stageStartDate);
    estimatedDate.setFullYear(estimatedDate.getFullYear() + avgStageDuration);

    const requirements = this.getStageRequirements(nextStage);
    const progress = this.calculateProgressToNextStage(currentStage, nextStage);

    return {
      stage: nextStage,
      estimatedDate,
      requirements,
      progress,
    };
  }

  /**
   * Calculate average time spent in each stage
   */
  private static calculateAverageStageDuration(stages: CareerStage[]): number {
    if (stages.length <= 1) return 2; // Default 2 years

    const completedStages = stages.filter((s) => s.endDate);
    if (completedStages.length === 0) return 2;

    const durations = completedStages.map((stage) => {
      const start = stage.startDate.getTime();
      const end = stage.endDate!.getTime();
      return (end - start) / (1000 * 60 * 60 * 24 * 365); // Convert to years
    });

    return durations.reduce((sum, d) => sum + d, 0) / durations.length;
  }

  /**
   * Get requirements for next stage
   */
  private static getStageRequirements(stage: CareerStage['stage']): string[] {
    const requirements: Record<CareerStage['stage'], string[]> = {
      junior: ['Basic programming skills', 'Team collaboration', 'Code review participation'],
      mid: [
        'Advanced technical skills',
        'Project ownership',
        'Mentoring juniors',
        'System design basics',
      ],
      senior: [
        'Expert in core technologies',
        'Lead projects end-to-end',
        'Mentor team members',
        'System architecture design',
      ],
      lead: [
        'Technical leadership',
        'Team management',
        'Strategic planning',
        'Cross-team collaboration',
      ],
      principal: [
        'Organization-wide impact',
        'Technical strategy',
        'Industry recognition',
        'Thought leadership',
      ],
    };

    return requirements[stage] || [];
  }

  /**
   * Calculate progress towards next stage (0-100)
   */
  private static calculateProgressToNextStage(
    current: CareerStage,
    nextStage: CareerStage['stage']
  ): number {
    const requirements = this.getStageRequirements(nextStage);
    const targetScores: Record<CareerStage['stage'], number> = {
      junior: 30,
      mid: 50,
      senior: 65,
      lead: 80,
      principal: 95,
    };

    const avgIndicator =
      (current.indicators.technicalSkills +
        current.indicators.leadership +
        current.indicators.impact +
        current.indicators.communication) /
      4;

    const targetScore = targetScores[nextStage] || 50;
    return Math.min(100, (avgIndicator / targetScore) * 100);
  }

  /**
   * Calculate overall growth rate
   */
  private static calculateGrowthRate(stages: CareerStage[]): number {
    if (stages.length <= 1) return 0;

    const firstStage = stages[0];
    const lastStage = stages[stages.length - 1];

    const timeSpan =
      (lastStage.startDate.getTime() - firstStage.startDate.getTime()) /
      (1000 * 60 * 60 * 24 * 365); // Years

    const stageProgression = stages.length;
    const indicatorGrowth =
      this.getAverageIndicators(lastStage) - this.getAverageIndicators(firstStage);

    return ((stageProgression + indicatorGrowth / 20) / Math.max(timeSpan, 1)) * 10;
  }

  /**
   * Get average of all indicators
   */
  private static getAverageIndicators(stage: CareerStage): number {
    return (
      (stage.indicators.technicalSkills +
        stage.indicators.leadership +
        stage.indicators.impact +
        stage.indicators.communication) /
      4
    );
  }
}

