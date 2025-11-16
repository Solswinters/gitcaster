/**
 * Onboarding service
 */

import type { OnboardingFlow, UserOnboardingProgress, OnboardingStep, OnboardingData } from '../types';

export class OnboardingService {
  /**
   * Get onboarding flow
   */
  static getFlow(flowId: string): OnboardingFlow | null {
    // TODO: Fetch from database or config
    return null;
  }

  /**
   * Create default onboarding flow
   */
  static createDefaultFlow(): OnboardingFlow {
    return {
      id: 'default',
      name: 'Get Started',
      steps: [
        {
          id: 'connect-wallet',
          title: 'Connect Wallet',
          description: 'Connect your crypto wallet to get started',
          component: 'ConnectWalletStep',
          isComplete: false,
          isOptional: false,
          order: 1,
        },
        {
          id: 'github-profile',
          title: 'Connect GitHub',
          description: 'Link your GitHub account',
          component: 'GitHubStep',
          isComplete: false,
          isOptional: false,
          order: 2,
        },
        {
          id: 'complete-profile',
          title: 'Complete Profile',
          description: 'Add your details and skills',
          component: 'ProfileStep',
          isComplete: false,
          isOptional: true,
          order: 3,
        },
      ],
      currentStepIndex: 0,
      isComplete: false,
    };
  }

  /**
   * Get user progress
   */
  static getUserProgress(userId: string): UserOnboardingProgress | null {
    const stored = localStorage.getItem(`onboarding-progress-${userId}`);
    return stored ? JSON.parse(stored) : null;
  }

  /**
   * Save user progress
   */
  static saveUserProgress(progress: UserOnboardingProgress): void {
    localStorage.setItem(
      `onboarding-progress-${progress.userId}`,
      JSON.stringify(progress)
    );
  }

  /**
   * Complete step
   */
  static completeStep(progress: UserOnboardingProgress, stepId: string): UserOnboardingProgress {
    return {
      ...progress,
      completedSteps: [...progress.completedSteps, stepId],
      currentStep: this.getNextStep(progress, stepId),
    };
  }

  /**
   * Skip step
   */
  static skipStep(progress: UserOnboardingProgress, stepId: string): UserOnboardingProgress {
    return {
      ...progress,
      skippedSteps: [...progress.skippedSteps, stepId],
      currentStep: this.getNextStep(progress, stepId),
    };
  }

  /**
   * Get next step
   */
  private static getNextStep(progress: UserOnboardingProgress, currentStepId: string): string {
    const flow = this.getFlow(progress.flowId) || this.createDefaultFlow();
    const currentIndex = flow.steps.findIndex(s => s.id === currentStepId);
    const nextStep = flow.steps[currentIndex + 1];
    return nextStep?.id || currentStepId;
  }

  /**
   * Check if onboarding is complete
   */
  static isComplete(progress: UserOnboardingProgress): boolean {
    const flow = this.getFlow(progress.flowId) || this.createDefaultFlow();
    const requiredSteps = flow.steps.filter(s => !s.isOptional);
    return requiredSteps.every(s => progress.completedSteps.includes(s.id));
  }

  /**
   * Save onboarding data
   */
  static async saveData(userId: string, data: OnboardingData): Promise<void> {
    // TODO: Save to database
    localStorage.setItem(`onboarding-data-${userId}`, JSON.stringify(data));
  }
}

