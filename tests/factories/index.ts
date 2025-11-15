/**
 * Mock Factories
 * 
 * Centralized exports for all mock factory functions.
 */

export * from './user.factory';
export * from './github.factory';
export * from './api.factory';

/**
 * Reset all factories
 */
export function resetAllFactories() {
  const { resetUserFactory } = require('./user.factory');
  const { resetGitHubFactory } = require('./github.factory');
  
  resetUserFactory();
  resetGitHubFactory();
}

