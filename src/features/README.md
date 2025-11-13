# Features Module

This directory contains feature-based modules, each representing a distinct domain of functionality in the application.

## Structure

Each feature module follows a consistent structure:

```
feature-name/
├── types/           # Feature-specific TypeScript types
├── services/        # API services and business logic
├── hooks/           # React hooks for the feature
├── utils/           # Feature-specific utilities
├── components/      # Feature-specific components (optional)
└── index.ts         # Barrel export
```

## Available Features

### Auth (`/auth`)
Authentication and authorization functionality.

**Types:**
- `AuthUser`, `Session`, `Nonce`

**Services:**
- `authService` - Authentication operations (login, logout, verify)

**Hooks:**
- `useAuth` - Access authentication state and methods

**Usage:**
```typescript
import { useAuth, authService } from '@/features/auth';

const { user, isAuthenticated } = useAuth();
```

### GitHub (`/github`)
GitHub integration and data synchronization.

**Types:**
- `GitHubProfile`, `Repository`, `Contribution`

**Services:**
- `githubService` - GitHub API operations

**Hooks:**
- `useGitHubSync` - Sync GitHub data

**Usage:**
```typescript
import { useGitHubSync, githubService } from '@/features/github';

const { syncData, isSync ing } = useGitHubSync();
```

### Profile (`/profile`)
User profile management.

**Types:**
- `UserProfile`, `Education`, `WorkExperience`, `Skill`

**Services:**
- `profileService` - Profile CRUD operations

**Hooks:**
- `useProfile` - Manage user profiles

**Usage:**
```typescript
import { useProfile, profileService } from '@/features/profile';

const { profile, updateProfile, isLoading } = useProfile(userId);
```

### Search (`/search`)
Developer search and filtering.

**Types:**
- `SearchFilters`, `SearchResult`, `Pagination`

**Services:**
- `searchService` - Search operations

**Hooks:**
- `useSearch` - Execute searches with filters

**Usage:**
```typescript
import { useSearch, SearchFilters } from '@/features/search';

const { results, isSearching, search } = useSearch();
```

### Analytics (`/analytics`)
Analytics dashboard and insights.

**Types:**
- `DashboardData`, `MetricCard`, `TimeSeriesData`, `LanguageStats`

**Services:**
- `analyticsService` - Fetch analytics data

**Hooks:**
- `useDashboardData` - Load dashboard metrics
- `usePredictions` - Career predictions
- `useComparison` - Compare with other users

**Usage:**
```typescript
import { useDashboardData, analyticsService } from '@/features/analytics';

const { data, isLoading } = useDashboardData(userId);
```

### Collaboration (`/collaboration`)
Team collaboration and networking.

**Types:**
- `Team`, `TeamMember`, `NetworkConnection`

**Services:**
- `collaborationService` - Team and network operations

**Hooks:**
- `useUserTeams` - Fetch user teams
- `useTeamActions` - Create, invite, remove operations
- `useNetworkConnections` - Manage connections

**Usage:**
```typescript
import { useUserTeams, useTeamActions } from '@/features/collaboration';

const { data: teams } = useUserTeams();
const { createTeam, inviteMember } = useTeamActions();
```

### Notifications (`/notifications`)
Notification management and real-time updates.

**Types:**
- `Notification`, `NotificationPreferences`, `NotificationStats`

**Services:**
- `notificationsService` - Notification operations

**Hooks:**
- `useNotifications` - Fetch notifications
- `useNotificationStats` - Get unread count
- `useRealTimeNotifications` - Real-time polling
- `useNotificationActions` - Mark read, delete, etc.

**Usage:**
```typescript
import { useRealTimeNotifications, useNotificationActions } from '@/features/notifications';

const { notifications, unreadCount } = useRealTimeNotifications();
const { markAsRead, markAllAsRead } = useNotificationActions();
```

## Guidelines

### Creating a New Feature

1. **Create the directory structure:**
```bash
mkdir -p src/features/feature-name/{types,services,hooks,utils}
```

2. **Define types** (`types/feature-name.types.ts`):
```typescript
export interface FeatureData {
  id: string;
  // ...fields
}
```

3. **Create service** (`services/featureService.ts`):
```typescript
export class FeatureService {
  async getData(): Promise<FeatureData[]> {
    return await apiClient.get('/api/feature');
  }
}

export const featureService = new FeatureService();
```

4. **Create hooks** (`hooks/useFeature.ts`):
```typescript
export function useFeature() {
  return useAsync(
    async () => featureService.getData(),
    { immediate: true }
  );
}
```

5. **Export from index** (`index.ts`):
```typescript
export * from './types/feature-name.types';
export * from './services/featureService';
export * from './hooks/useFeature';
```

6. **Add to features index** (`features/index.ts`):
```typescript
export * from './feature-name';
```

### Best Practices

1. **Single Responsibility**: Each feature should handle one domain
2. **Self-Contained**: Features should minimize dependencies on other features
3. **Type Safety**: Use TypeScript for all types and interfaces
4. **Consistent Structure**: Follow the established folder structure
5. **Documentation**: Document complex logic and public APIs
6. **Testing**: Write tests for services and hooks
7. **Error Handling**: Use shared error utilities

## Import Patterns

### Direct Import
```typescript
import { useAuth } from '@/features/auth';
import { githubService } from '@/features/github';
```

### Barrel Import
```typescript
import { useAuth, useProfile, useSearch } from '@/features';
```

## Dependencies

Features can import from:
- `@/shared` - Shared utilities, components, hooks
- Other features (minimally, prefer shared utilities)

Features should NOT import from:
- `@/app` - Application routes and pages
- `@/components` - Legacy components (being migrated)
- `@/lib` - Legacy utilities (being migrated)

## Testing

Each feature should have corresponding tests:

```
tests/
├── unit/
│   └── features/
│       ├── auth/
│       ├── github/
│       └── profile/
└── integration/
    └── features/
        ├── auth-flow.test.ts
        └── profile-management.test.ts
```

## Migration

See [MIGRATION_GUIDE.md](/docs/MIGRATION_GUIDE.md) for guidance on migrating legacy code to the feature-based structure.
