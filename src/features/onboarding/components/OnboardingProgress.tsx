/**
 * Onboarding progress component
 */

'use client';

import type { OnboardingFlow } from '../types';

interface OnboardingProgressProps {
  flow: OnboardingFlow;
  currentStepIndex: number;
}

export function OnboardingProgress({ flow, currentStepIndex }: OnboardingProgressProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      {flow.steps.map((step, index) => (
        <div key={step.id} className="flex items-center flex-1">
          <div className="flex flex-col items-center flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index <= currentStepIndex
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {step.isComplete ? '✓' : index + 1}
            </div>
            <span className="text-xs mt-2 text-center">{step.title}</span>
          </div>
          {index < flow.steps.length - 1 && (
            <div
              className={`h-1 flex-1 ${
                index < currentStepIndex ? 'bg-primary' : 'bg-secondary'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

