/**
 * Service Keys
 * 
 * Constants for service registration and resolution.
 */

export const SERVICE_KEYS = {
  // Repositories
  USER_REPOSITORY: 'IUserRepository',
  GITHUB_REPOSITORY: 'IGitHubRepository',
  ANALYTICS_REPOSITORY: 'IAnalyticsRepository',
  
  // Services
  AUTH_SERVICE: 'AuthService',
  USER_SERVICE: 'UserService',
  GITHUB_SERVICE: 'GitHubService',
  ANALYTICS_SERVICE: 'AnalyticsService',
  SEARCH_SERVICE: 'SearchService',
  
  // Infrastructure
  DATABASE: 'Database',
  CACHE: 'Cache',
  LOGGER: 'Logger',
  
  // External APIs
  GITHUB_API: 'GitHubAPI',
  TALENT_PROTOCOL_API: 'TalentProtocolAPI',
} as const;

export type ServiceKey = typeof SERVICE_KEYS[keyof typeof SERVICE_KEYS];

