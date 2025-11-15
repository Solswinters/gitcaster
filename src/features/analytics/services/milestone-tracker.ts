/**
 * Career milestone tracking service
 */

import type { CareerMilestone, ProgressionData } from '../types';

export class MilestoneTracker {
  /**
   * Extract career milestones from activity data
   */
  static extractMilestones(data: ProgressionData): CareerMilestone[] {
    const milestones: CareerMilestone[] = [];

    // Extract skill milestones
    data.skills.forEach((skill) => {
      milestones.push({
        id: `skill-${skill.skill}`,
        type: 'skill',
        title: `Learned ${skill.skill}`,
        description: `Started working with ${skill.skill}`,
        date: skill.firstUsed,
        impact: 'medium',
        category: 'skill-acquisition',
      });
    });

    // Extract repository milestones
    data.repos.forEach((repo) => {
      if (repo.stars > 100) {
        milestones.push({
          id: `repo-${repo.created.getTime()}`,
          type: 'achievement',
          title: 'Popular Repository',
          description: `Created repository with ${repo.stars} stars`,
          date: repo.created,
          impact: repo.stars > 1000 ? 'critical' : 'high',
          category: 'open-source',
        });
      }
    });

    // Extract contribution milestones
    const commitCount = data.commits.length;
    if (commitCount >= 1000) {
      milestones.push({
        id: 'commits-1000',
        type: 'achievement',
        title: '1000+ Commits',
        description: 'Reached 1000 commits milestone',
        date: data.commits[999].date,
        impact: 'high',
        category: 'contribution',
      });
    }

    return milestones.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  /**
   * Categorize milestones by type
   */
  static categorizeMilestones(milestones: CareerMilestone[]): Record<string, CareerMilestone[]> {
    return milestones.reduce((acc, milestone) => {
      const key = milestone.type;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(milestone);
      return acc;
    }, {} as Record<string, CareerMilestone[]>);
  }

  /**
   * Get milestones for a specific time period
   */
  static getMilestonesInPeriod(
    milestones: CareerMilestone[],
    startDate: Date,
    endDate: Date
  ): CareerMilestone[] {
    return milestones.filter((milestone) => {
      const date = milestone.date.getTime();
      return date >= startDate.getTime() && date <= endDate.getTime();
    });
  }

  /**
   * Calculate milestone impact score
   */
  static calculateMilestoneScore(milestone: CareerMilestone): number {
    const impactScores = {
      low: 1,
      medium: 2,
      high: 3,
      critical: 5,
    };

    const typeMultipliers = {
      skill: 1,
      achievement: 1.5,
      contribution: 1.2,
      recognition: 2,
      leadership: 2.5,
    };

    return impactScores[milestone.impact] * typeMultipliers[milestone.type];
  }
}

