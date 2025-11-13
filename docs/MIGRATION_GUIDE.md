# Component Migration Guide

This document tracks the migration from legacy components to the new shared component library.

## Migration Status

### Phase 1: Shared Component Foundation ✅
- Created `src/shared/components` with reusable UI components
- Established consistent patterns and APIs
- Added comprehensive TypeScript types

### Phase 2: Component Consolidation (In Progress)

#### UI Components
- [ ] Migrate `src/components/ui/*` → `src/shared/components/ui/*`
- [ ] Update all import paths
- [ ] Remove legacy UI components

#### Error Components
**Current:** 25+ separate error components in `src/components/error/`
**Target:** Consolidate into 3-5 reusable error components

Legacy Components:
- `ErrorAlert` → Use `Alert` with variant="error"
- `ErrorBanner` → Use `Alert` with variant="error"
- `ErrorCard` → Use `Card` + `Alert`
- `ErrorModal` → Use `Modal` + `Alert`
- `ErrorToast` → Use `Toast` with variant="error"
- `InlineError` → Use `Alert` variant="error" size="sm"

Consolidation Plan:
1. Create `ErrorDisplay` wrapper component
2. Update all error imports to use new component
3. Remove 20+ redundant error components

#### Loading Components
**Current:** 25+ loading indicators in `src/components/ui/` and `src/components/loading/`
**Target:** Use consolidated loading system from `src/shared/components/loading/`

Legacy Components:
- `loading-dots.tsx` → `LoadingDots` from shared
- `spinner.tsx` → `Spinner` from shared
- `skeleton.tsx` → `Skeleton` from shared
- `skeleton-text.tsx` → `SkeletonText` from shared
- `loading-ring.tsx` → `LoadingRing` from shared
- All other variants → Map to shared loading components

#### Analytics Components
- [ ] Move to `src/features/analytics/components/`
- [ ] Update imports to use feature-based structure

#### Profile Components
- [ ] Move to `src/features/profile/components/`
- [ ] Update imports to use feature-based structure

#### Search Components
- [ ] Move to `src/features/search/components/`
- [ ] Update imports to use feature-based structure

#### GitHub Components
- [ ] Move to `src/features/github/components/`
- [ ] Update imports to use feature-based structure

## Import Path Updates

### Before
```typescript
import { Button } from '@/components/ui/button';
import { ErrorAlert } from '@/components/error/ErrorAlert';
import { Spinner } from '@/components/ui/spinner';
```

### After
```typescript
import { Button, Alert, Spinner } from '@/shared/components';
// or more specifically:
import { Button } from '@/shared/components/ui';
import { Alert } from '@/shared/components/ui';
import { Spinner } from '@/shared/components/loading';
```

## Breaking Changes

### Button Component
- `loading` prop renamed to `isLoading`
- Added `fullWidth` prop
- Added `danger` variant

### Alert Component
- New unified API for all alert types
- `onClose` replaces various dismiss handlers
- Supports `title` prop for better structure

### Loading Components
- Consolidated into single `Loader` module
- Consistent size props: `sm`, `md`, `lg`
- Standardized color props

## Migration Steps

1. **Install Dependencies** (if any new ones added)
   ```bash
   npm install
   ```

2. **Update Imports**
   - Use find-and-replace for common patterns
   - Test each page after updates

3. **Test Functionality**
   - Verify all error states work
   - Check loading indicators
   - Validate form components

4. **Remove Legacy Code**
   - Only after all migrations complete
   - Create backup branch first

## Timeline

- Phase 1: ✅ Complete (Commits 1-48)
- Phase 2: 🚧 In Progress (Commits 49-100)
- Phase 3: 📅 Planned (Commits 101-150)
- Phase 4: 📅 Planned (Commits 151-200)

## Questions or Issues?

Document any migration challenges or breaking changes here.

