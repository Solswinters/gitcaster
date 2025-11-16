/**
 * Individual onboarding step component
 */

'use client';

import { ReactNode } from 'react';
import type { OnboardingStep as OnboardingStepType } from '../types';

interface OnboardingStepProps {
  step: OnboardingStepType;
  onComplete: () => void;
  onSkip?: () => void;
  children: ReactNode;
}

export function OnboardingStep({ step, onComplete, onSkip, children }: OnboardingStepProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{step.title}</h2>
        <p className="text-muted-foreground">{step.description}</p>
      </div>

      <div className="mb-6">{children}</div>

      <div className="flex gap-4 justify-end">
        {step.isOptional && onSkip && (
          <button
            onClick={onSkip}
            className="px-4 py-2 border rounded hover:bg-secondary"
          >
            Skip
          </button>
        )}
        <button
          onClick={onComplete}
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

