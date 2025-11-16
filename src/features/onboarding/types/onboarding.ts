/**
 * Onboarding feature type definitions
 */

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: string;
  isComplete: boolean;
  isOptional: boolean;
  order: number;
}

export interface OnboardingFlow {
  id: string;
  name: string;
  steps: OnboardingStep[];
  currentStepIndex: number;
  isComplete: boolean;
  completedAt?: Date;
}

export interface UserOnboardingProgress {
  userId: string;
  flowId: string;
  completedSteps: string[];
  currentStep: string;
  skippedSteps: string[];
  startedAt: Date;
  completedAt?: Date;
}

export interface OnboardingData {
  profile?: {
    displayName?: string;
    bio?: string;
    location?: string;
    skills?: string[];
  };
  preferences?: {
    theme?: string;
    notifications?: boolean;
  };
  connections?: {
    githubUsername?: string;
    linkedinUrl?: string;
  };
}

