/**
 * Onboarding context provider
 */

'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useOnboarding } from '../hooks';
import type { OnboardingFlow, UserOnboardingProgress, OnboardingData } from '../types';

interface OnboardingContextValue {
  flow: OnboardingFlow | null;
  progress: UserOnboardingProgress | null;
  loading: boolean;
  completeStep: (stepId: string) => void;
  skipStep: (stepId: string) => void;
  saveData: (data: OnboardingData) => Promise<void>;
  isComplete: boolean;
}

const OnboardingContext = createContext<OnboardingContextValue | undefined>(undefined);

export function OnboardingProvider({ userId, children }: { userId?: string; children: ReactNode }) {
  const onboardingState = useOnboarding(userId);

  return (
    <OnboardingContext.Provider value={onboardingState}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboardingContext() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboardingContext must be used within OnboardingProvider');
  }
  return context;
}

