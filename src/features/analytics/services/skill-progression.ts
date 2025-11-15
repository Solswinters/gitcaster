/**
 * Skill progression tracking service
 */

import type { SkillProgression, ActivityRecord } from '../types';

export class SkillProgressionService {
  /**
   * Track skill progression over time
   */
  static trackSkillProgression(
    skill: string,
    activities: ActivityRecord[]
  ): SkillProgression {
    const sortedActivities = activities.sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );

    const firstActivity = sortedActivities[0];
    const lastActivity = sortedActivities[sortedActivities.length - 1];
    
    const yearsOfExperience = this.calculateYearsOfExperience(
      firstActivity.date,
      lastActivity.date
    );

    const currentLevel = this.determineSkillLevel(activities.length, yearsOfExperience);
    const proficiencyScore = this.calculateProficiencyScore(activities);
    const milestones = this.identifySkillMilestones(sortedActivities);

    return {
      skill,
      category: this.categorizeSkill(skill),
      milestones,
      currentLevel,
      proficiencyScore,
      yearsOfExperience,
      projectsCompleted: this.countProjects(activities),
    };
  }

  /**
   * Calculate years of experience with a skill
   */
  private static calculateYearsOfExperience(startDate: Date, endDate: Date): number {
    const diff = endDate.getTime() - startDate.getTime();
    return Math.max(0, diff / (1000 * 60 * 60 * 24 * 365));
  }

  /**
   * Determine current skill level
   */
  private static determineSkillLevel(
    activityCount: number,
    yearsOfExperience: number
  ): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
    const score = activityCount * 0.3 + yearsOfExperience * 20;

    if (score >= 100) return 'expert';
    if (score >= 50) return 'advanced';
    if (score >= 20) return 'intermediate';
    return 'beginner';
  }

  /**
   * Calculate proficiency score (0-100)
   */
  private static calculateProficiencyScore(activities: ActivityRecord[]): number {
    if (activities.length === 0) return 0;

    const avgComplexity = activities.reduce((sum, a) => sum + a.complexity, 0) / activities.length;
    const activityScore = Math.min(100, activities.length * 2);
    const complexityScore = avgComplexity * 10;

    return Math.min(100, (activityScore + complexityScore) / 2);
  }

  /**
   * Identify skill progression milestones
   */
  private static identifySkillMilestones(activities: ActivityRecord[]) {
    const milestones: SkillProgression['milestones'] = [];
    const checkpoints = [0, 10, 50, 100];

    checkpoints.forEach((checkpoint) => {
      if (activities.length > checkpoint) {
        const activity = activities[checkpoint];
        milestones.push({
          level: this.determineSkillLevel(checkpoint, 0),
          achievedDate: activity.date,
          evidence: [`${checkpoint} activities completed`],
        });
      }
    });

    return milestones;
  }

  /**
   * Count unique projects
   */
  private static countProjects(activities: ActivityRecord[]): number {
    return activities.filter((a) => a.type === 'project').length;
  }

  /**
   * Categorize skill by domain
   */
  private static categorizeSkill(skill: string): string {
    const categories: Record<string, string[]> = {
      frontend: ['react', 'vue', 'angular', 'svelte', 'html', 'css', 'tailwind'],
      backend: ['node', 'python', 'java', 'go', 'rust', 'php'],
      database: ['sql', 'postgres', 'mysql', 'mongodb', 'redis'],
      devops: ['docker', 'kubernetes', 'aws', 'terraform', 'ci/cd'],
      mobile: ['react-native', 'flutter', 'swift', 'kotlin'],
    };

    for (const [category, skills] of Object.entries(categories)) {
      if (skills.some((s) => skill.toLowerCase().includes(s))) {
        return category;
      }
    }

    return 'other';
  }
}

