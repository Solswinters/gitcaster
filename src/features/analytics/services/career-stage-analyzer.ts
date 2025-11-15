/**
 * Career stage analysis service
 */

import type { CareerStage, CareerMilestone, ProgressionData } from '../types';

export class CareerStageAnalyzer {
  /**
   * Identify career stages from milestones and data
   */
  static identifyCareerStages(
    milestones: CareerMilestone[],
    data: ProgressionData
  ): CareerStage[] {
    const stages: CareerStage[] = [];
    const sortedMilestones = [...milestones].sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );

    let currentStageStart = sortedMilestones[0]?.date || new Date();
    let currentMilestones: CareerMilestone[] = [];
    let previousStage: CareerStage['stage'] = 'junior';

    for (let i = 0; i < sortedMilestones.length; i++) {
      const milestone = sortedMilestones[i];
      currentMilestones.push(milestone);

      // Check if we should create a new stage
      const indicators = this.calculateIndicators(currentMilestones, data);
      const suggestedStage = this.determineStage(indicators);

      if (suggestedStage !== previousStage || i === sortedMilestones.length - 1) {
        stages.push({
          stage: previousStage,
          startDate: currentStageStart,
          endDate: i < sortedMilestones.length - 1 ? milestone.date : undefined,
          indicators,
          achievements: [...currentMilestones],
        });

        currentStageStart = milestone.date;
        currentMilestones = [];
        previousStage = suggestedStage;
      }
    }

    return stages;
  }

  /**
   * Calculate career indicators
   */
  private static calculateIndicators(
    milestones: CareerMilestone[],
    data: ProgressionData
  ): CareerStage['indicators'] {
    const technicalSkills = this.calculateTechnicalScore(data);
    const leadership = this.calculateLeadershipScore(milestones);
    const impact = this.calculateImpactScore(milestones, data);
    const communication = this.calculateCommunicationScore(data);

    return {
      technicalSkills: Math.min(100, technicalSkills),
      leadership: Math.min(100, leadership),
      impact: Math.min(100, impact),
      communication: Math.min(100, communication),
    };
  }

  /**
   * Determine career stage from indicators
   */
  private static determineStage(
    indicators: CareerStage['indicators']
  ): CareerStage['stage'] {
    const avgScore =
      (indicators.technicalSkills +
        indicators.leadership +
        indicators.impact +
        indicators.communication) /
      4;

    if (avgScore >= 80) return 'principal';
    if (avgScore >= 65) return 'lead';
    if (avgScore >= 50) return 'senior';
    if (avgScore >= 30) return 'mid';
    return 'junior';
  }

  /**
   * Calculate technical skills score
   */
  private static calculateTechnicalScore(data: ProgressionData): number {
    const skillCount = data.skills.length;
    const commitCount = data.commits.length;
    const repoCount = data.repos.length;

    return (skillCount * 5 + Math.min(commitCount / 10, 50) + repoCount * 2);
  }

  /**
   * Calculate leadership score
   */
  private static calculateLeadershipScore(milestones: CareerMilestone[]): number {
    const leadershipMilestones = milestones.filter((m) => m.type === 'leadership');
    const recognitionMilestones = milestones.filter((m) => m.type === 'recognition');

    return leadershipMilestones.length * 15 + recognitionMilestones.length * 10;
  }

  /**
   * Calculate impact score
   */
  private static calculateImpactScore(
    milestones: CareerMilestone[],
    data: ProgressionData
  ): number {
    const impactScores = {
      low: 1,
      medium: 2,
      high: 3,
      critical: 5,
    };

    const milestoneImpact = milestones.reduce(
      (sum, m) => sum + impactScores[m.impact],
      0
    );

    const repoStars = data.repos.reduce((sum, r) => sum + r.stars, 0);
    return milestoneImpact * 2 + Math.min(repoStars / 10, 50);
  }

  /**
   * Calculate communication score
   */
  private static calculateCommunicationScore(data: ProgressionData): number {
    const prReviews = data.prs.reduce((sum, pr) => sum + pr.reviews, 0);
    return Math.min(prReviews * 2, 100);
  }

  /**
   * Analyze strengths and weaknesses
   */
  static analyzeStrengthsWeaknesses(stage: CareerStage): {
    strengthAreas: string[];
    improvementAreas: string[];
  } {
    const indicators = stage.indicators;
    const threshold = 60;

    const strengthAreas: string[] = [];
    const improvementAreas: string[] = [];

    if (indicators.technicalSkills >= threshold) {
      strengthAreas.push('Technical Skills');
    } else {
      improvementAreas.push('Technical Skills');
    }

    if (indicators.leadership >= threshold) {
      strengthAreas.push('Leadership');
    } else {
      improvementAreas.push('Leadership');
    }

    if (indicators.impact >= threshold) {
      strengthAreas.push('Impact & Influence');
    } else {
      improvementAreas.push('Impact & Influence');
    }

    if (indicators.communication >= threshold) {
      strengthAreas.push('Communication');
    } else {
      improvementAreas.push('Communication');
    }

    return { strengthAreas, improvementAreas };
  }
}

