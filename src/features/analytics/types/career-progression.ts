/**
 * Career progression type definitions
 */

export interface CareerMilestone {
  id: string;
  type: 'skill' | 'achievement' | 'contribution' | 'recognition' | 'leadership';
  title: string;
  description: string;
  date: Date;
  impact: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  metadata?: Record<string, any>;
}

export interface SkillProgression {
  skill: string;
  category: string;
  milestones: Array<{
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    achievedDate: Date;
    evidence: string[];
  }>;
  currentLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  proficiencyScore: number;
  yearsOfExperience: number;
  projectsCompleted: number;
}

export interface CareerStage {
  stage: 'junior' | 'mid' | 'senior' | 'lead' | 'principal';
  startDate: Date;
  endDate?: Date;
  indicators: {
    technicalSkills: number; // 0-100
    leadership: number; // 0-100
    impact: number; // 0-100
    communication: number; // 0-100
  };
  achievements: CareerMilestone[];
}

export interface CareerTrajectory {
  stages: CareerStage[];
  currentStage: CareerStage;
  projectedNextStage?: {
    stage: string;
    estimatedDate: Date;
    requirements: string[];
    progress: number;
  };
  overallGrowthRate: number;
  strengthAreas: string[];
  improvementAreas: string[];
}

export interface ProgressionData {
  commits: Array<{ date: Date; language: string }>;
  prs: Array<{ date: Date; reviews: number }>;
  repos: Array<{ created: Date; stars: number; role: string }>;
  skills: Array<{ skill: string; firstUsed: Date; lastUsed: Date }>;
}

export interface ActivityRecord {
  date: Date;
  type: 'commit' | 'pr' | 'review' | 'project';
  complexity: number;
}

