/**
 * Visual Regression Testing Configuration
 * 
 * Configuration for visual regression tests using Playwright.
 */

import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './tests/visual',
  testMatch: '**/*.visual.test.ts',
  
  // Screenshots configuration
  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  
  // Update snapshots with UPDATE_SNAPSHOTS=1
  updateSnapshots: process.env.UPDATE_SNAPSHOTS === '1' ? 'all' : 'missing',
  
  // Snapshot path template
  snapshotDir: './tests/visual/__snapshots__',
  
  // Max diff pixels threshold
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 100,
      threshold: 0.2,
    },
  },
};

export default config;

