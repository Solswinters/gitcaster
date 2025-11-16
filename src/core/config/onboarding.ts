/**
 * Onboarding configuration
 */

export const onboardingConfig = {
  enableOnboarding: process.env.ENABLE_ONBOARDING !== 'false',
  defaultFlow: process.env.DEFAULT_ONBOARDING_FLOW || 'default',
  autoStart: process.env.AUTO_START_ONBOARDING !== 'false',
  allowSkip: process.env.ALLOW_SKIP_ONBOARDING !== 'false',
  redirectAfterComplete: process.env.ONBOARDING_REDIRECT_URL || '/dashboard',
} as const;

