/**
 * Onboarding flow domain model
 */

import type { OnboardingFlow, OnboardingStep } from '../types';

export class OnboardingFlowModel {
  constructor(private flow: OnboardingFlow) {}

  get id(): string {
    return this.flow.id;
  }

  get totalSteps(): number {
    return this.flow.steps.length;
  }

  get requiredSteps(): OnboardingStep[] {
    return this.flow.steps.filter(s => !s.isOptional);
  }

  get optionalSteps(): OnboardingStep[] {
    return this.flow.steps.filter(s => s.isOptional);
  }

  getCurrentStep(): OnboardingStep | null {
    return this.flow.steps[this.flow.currentStepIndex] || null;
  }

  getNextStep(): OnboardingStep | null {
    return this.flow.steps[this.flow.currentStepIndex + 1] || null;
  }

  getPreviousStep(): OnboardingStep | null {
    return this.flow.steps[this.flow.currentStepIndex - 1] || null;
  }

  canGoBack(): boolean {
    return this.flow.currentStepIndex > 0;
  }

  canGoForward(): boolean {
    return this.flow.currentStepIndex < this.flow.steps.length - 1;
  }

  isLastStep(): boolean {
    return this.flow.currentStepIndex === this.flow.steps.length - 1;
  }

  toJSON(): OnboardingFlow {
    return this.flow;
  }
}

