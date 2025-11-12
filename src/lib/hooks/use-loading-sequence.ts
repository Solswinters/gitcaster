import { useState, useCallback } from 'react';

interface LoadingStep {
  id: string;
  label: string;
  duration?: number;
}

/**
 * Hook for managing multi-step loading sequences
 */
export function useLoadingSequence(steps: LoadingStep[]) {
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [isComplete, setIsComplete] = useState(false);

  const start = useCallback(async () => {
    setCurrentStep(0);
    setIsComplete(false);

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      if (steps[i].duration) {
        await new Promise(resolve => setTimeout(resolve, steps[i].duration));
      }
    }

    setIsComplete(true);
    setCurrentStep(-1);
  }, [steps]);

  const reset = useCallback(() => {
    setCurrentStep(-1);
    setIsComplete(false);
  }, []);

  return {
    currentStep,
    currentStepData: currentStep >= 0 ? steps[currentStep] : null,
    isLoading: currentStep >= 0,
    isComplete,
    progress: currentStep >= 0 ? ((currentStep + 1) / steps.length) * 100 : 0,
    start,
    reset,
  };
}

