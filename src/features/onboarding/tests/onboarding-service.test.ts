/**
 * Onboarding service tests
 */

import { describe, it, expect } from '@jest/globals';
import { OnboardingService } from '../services/onboarding-service';

describe('OnboardingService', () => {
  it('should create default flow', () => {
    const flow = OnboardingService.createDefaultFlow();
    expect(flow).toBeDefined();
    expect(flow.steps.length).toBeGreaterThan(0);
  });

  it('should complete step', () => {
    const progress = {
      userId: 'test',
      flowId: 'default',
      completedSteps: [],
      currentStep: 'step1',
      skippedSteps: [],
      startedAt: new Date(),
    };

    const updated = OnboardingService.completeStep(progress, 'step1');
    expect(updated.completedSteps).toContain('step1');
  });
});

