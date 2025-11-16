/**
 * Onboarding hook
 */

import { useState, useEffect, useCallback } from 'react';
import type { OnboardingFlow, UserOnboardingProgress, OnboardingData } from '../types';
import { OnboardingService } from '../services';

export function useOnboarding(userId?: string) {
  const [flow, setFlow] = useState<OnboardingFlow | null>(null);
  const [progress, setProgress] = useState<UserOnboardingProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    // Load flow and progress
    const defaultFlow = OnboardingService.createDefaultFlow();
    setFlow(defaultFlow);

    const userProgress = OnboardingService.getUserProgress(userId);
    if (userProgress) {
      setProgress(userProgress);
    } else {
      // Create new progress
      const newProgress: UserOnboardingProgress = {
        userId,
        flowId: defaultFlow.id,
        completedSteps: [],
        currentStep: defaultFlow.steps[0].id,
        skippedSteps: [],
        startedAt: new Date(),
      };
      setProgress(newProgress);
      OnboardingService.saveUserProgress(newProgress);
    }

    setLoading(false);
  }, [userId]);

  const completeStep = useCallback((stepId: string) => {
    if (!progress) return;

    const updated = OnboardingService.completeStep(progress, stepId);
    setProgress(updated);
    OnboardingService.saveUserProgress(updated);

    // Check if onboarding is complete
    if (OnboardingService.isComplete(updated)) {
      const completed = { ...updated, completedAt: new Date() };
      setProgress(completed);
      OnboardingService.saveUserProgress(completed);
    }
  }, [progress]);

  const skipStep = useCallback((stepId: string) => {
    if (!progress) return;

    const updated = OnboardingService.skipStep(progress, stepId);
    setProgress(updated);
    OnboardingService.saveUserProgress(updated);
  }, [progress]);

  const saveData = useCallback(async (data: OnboardingData) => {
    if (!userId) return;
    await OnboardingService.saveData(userId, data);
  }, [userId]);

  return {
    flow,
    progress,
    loading,
    completeStep,
    skipStep,
    saveData,
    isComplete: progress ? OnboardingService.isComplete(progress) : false,
  };
}

