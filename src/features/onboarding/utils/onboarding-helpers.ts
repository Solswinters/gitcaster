/**
 * Onboarding utility helpers
 */

import type { OnboardingFlow, UserOnboardingProgress } from '../types';

export function calculateProgress(
  flow: OnboardingFlow,
  progress: UserOnboardingProgress
): number {
  const totalSteps = flow.steps.filter(s => !s.isOptional).length;
  const completedCount = progress.completedSteps.filter(id =>
    flow.steps.find(s => s.id === id && !s.isOptional)
  ).length;

  return Math.round((completedCount / totalSteps) * 100);
}

export function getNextIncompleteStep(
  flow: OnboardingFlow,
  progress: UserOnboardingProgress
): string | null {
  const incompleteStep = flow.steps.find(
    s => !progress.completedSteps.includes(s.id) &&
         !progress.skippedSteps.includes(s.id)
  );

  return incompleteStep?.id || null;
}

export function isStepRequired(flow: OnboardingFlow, stepId: string): boolean {
  const step = flow.steps.find(s => s.id === stepId);
  return step ? !step.isOptional : false;
}

export function canSkipStep(flow: OnboardingFlow, stepId: string): boolean {
  const step = flow.steps.find(s => s.id === stepId);
  return step?.isOptional || false;
}

export function getStepNumber(flow: OnboardingFlow, stepId: string): number {
  const index = flow.steps.findIndex(s => s.id === stepId);
  return index + 1;
}

