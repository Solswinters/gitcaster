# Features Module

This directory contains feature-specific functionality organized by domain.

## Structure

Each feature module follows a consistent structure:

```
feature/
├── components/     # Feature-specific React components
├── hooks/          # Feature-specific React hooks
├── services/       # API clients and business logic
├── types/          # TypeScript types for this feature
├── utils/          # Helper functions for this feature
└── index.ts        # Barrel export
```

## Available Features

### Authentication (`auth/`)
Handles user authentication and session management.

**Services:**
- `authService` - Authentication API calls
- `getNonce`, `verifySignature`, `getSession`, `logout`

**Hooks:**
- `useAuth` - Authentication state and operations

**Types:**
- `Session`, `AuthState`, `LoginCredentials`

### GitHub Integration (`github/`)
Manages GitHub data synchronization and display.

**Services:**
- `githubService` - GitHub API integration
- `syncGitHubData`, `checkConnection`

**Hooks:**
- `useGitHubSync` - GitHub synchronization management

**Utils:**
- Repository and commit helpers
- Language statistics calculations

**Types:**
- `GitHubUser`, `GitHubRepo`, `GitHubStats`

### Profile (`profile/`)
User profile management and display.

**Services:**
- `profileService` - Profile CRUD operations
- `getProfile`, `updateProfile`, `trackView`

**Hooks:**
- `useProfile` - Profile data and updates

**Utils:**
- Profile helpers (completion, scoring, formatting)

**Types:**
- `UserProfile`, `ProfileState`, `ProfileUpdateRequest`

### Search (`search/`)
Developer search and discovery.

**Services:**
- `searchService` - Search API and caching
- `search`, `saveSearch`, `getSuggestions`

**Hooks:**
- `useSearch` - Search state and operations

**Utils:**
- Search helpers (filtering, sorting, highlighting)

**Types:**
- `SearchQuery`, `SearchResult`, `SearchFilters`

## Usage

Import features directly:

```typescript
import { useAuth, authService } from '@/features/auth';
import { useProfile, profileService } from '@/features/profile';
import { useGitHubSync, githubService } from '@/features/github';
import { useSearch, searchService } from '@/features/search';
```

Or import from the features barrel:

```typescript
import {
  useAuth,
  useProfile,
  useGitHubSync,
  useSearch
} from '@/features';
```

## Adding New Features

1. Create feature directory with structure above
2. Implement types, services, and hooks
3. Add barrel export (index.ts)
4. Export from `/features/index.ts`
5. Document in this README

