# Import Order Guidelines

This document defines the standard import order for TypeScript/JavaScript files in the GitCaster project.

## Order Rules

Imports should be organized in the following order with blank lines between groups:

### 1. External Dependencies
Import statements from node_modules (third-party libraries).

```typescript
import React from 'react';
import { useRouter } from 'next/router';
import { z } from 'zod';
```

### 2. Internal Layer Imports (Absolute)
Import from project layers using path aliases, in order:
- Domain layer (`@/domain/*`)
- Infrastructure layer (`@/infrastructure/*`)
- Application layer (`@/application/*`)
- Presentation layer (`@/presentation/*`)
- Shared utilities (`@/shared/*`)

```typescript
import { UserProfile } from '@/domain/entities';
import { container, SERVICE_KEYS } from '@/infrastructure/di';
import { UserService } from '@/application/services';
import { Button } from '@/presentation/components';
import { formatDate } from '@/shared/utils';
```

### 3. Feature Imports
Import from feature modules if applicable.

```typescript
import { authService } from '@/features/auth';
import { profileService } from '@/features/profile';
```

### 4. Relative Imports
Import from relative paths (sibling files and subdirectories).

```typescript
import { helper } from '../utils';
import { LocalComponent } from './components';
import { config } from './config';
```

### 5. Type Imports
Separate type-only imports (when using `import type`).

```typescript
import type { ComponentProps } from 'react';
import type { NextPage } from 'next';
import type { IUserRepository } from '@/domain/repositories';
```

### 6. Style Imports
Import CSS/SCSS modules and stylesheets last.

```typescript
import styles from './Component.module.css';
import './global.css';
```

## Complete Example

```typescript
// 1. External dependencies
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { format } from 'date-fns';

// 2. Internal layer imports
import { UserProfile, validateUserProfile } from '@/domain/entities';
import { PrismaUserRepository } from '@/infrastructure/database';
import { UserService } from '@/application/services';
import { useAuth } from '@/application/hooks';
import { Button, Card } from '@/shared/components/ui';
import { formatDate, debounce } from '@/shared/utils';

// 3. Feature imports
import { authService } from '@/features/auth';

// 4. Relative imports
import { calculateScore } from '../utils/scoring';
import { ProfileHeader } from './components/ProfileHeader';

// 5. Type imports
import type { FC } from 'react';
import type { IUserRepository } from '@/domain/repositories';

// 6. Style imports
import styles from './UserProfile.module.css';
```

## ESLint Configuration

The project uses ESLint's `sort-imports` rule with specific configuration:

```javascript
'sort-imports': ['error', {
  ignoreCase: true,
  ignoreDeclarationSort: true, // We handle this manually
  ignoreMemberSort: false,
}]
```

## Named Imports Sorting

Within each import statement, named imports should be alphabetically sorted:

```typescript
// ✅ Good
import { Button, Card, Input, Modal } from '@/shared/components/ui';

// ❌ Bad
import { Modal, Button, Input, Card } from '@/shared/components/ui';
```

## Default vs Named Imports

Place default imports before named imports when from the same module:

```typescript
// ✅ Good
import React, { useState, useEffect } from 'react';

// ❌ Bad
import { useState, useEffect }, React from 'react';
```

## Side Effect Imports

Imports with side effects (no bindings) should go last in their category:

```typescript
import './polyfills';
import './init-monitoring';
```

## Dynamic Imports

Dynamic imports (for code splitting) should be used inline where needed:

```typescript
const DynamicComponent = dynamic(() => import('./HeavyComponent'));
```

## Common Mistakes to Avoid

### ❌ Mixing External and Internal
```typescript
import React from 'react';
import { Button } from '@/shared/components/ui';
import { useRouter } from 'next/router'; // Wrong: should be with React
```

### ❌ Not Grouping by Layer
```typescript
import { formatDate } from '@/shared/utils';
import { UserProfile } from '@/domain/entities';
import { Button } from '@/shared/components/ui'; // Wrong: separate shared imports
```

### ❌ Relative Before Absolute
```typescript
import { helper } from '../utils';
import { Button } from '@/shared/components/ui'; // Wrong: absolute should come first
```

## Automated Sorting

Use the following command to automatically sort imports:

```bash
npm run format
```

This will run Prettier which respects the import order configuration.

## IDE Configuration

### VS Code

Add to `.vscode/settings.json`:

```json
{
  "editor.codeActionsOnSave": {
    "source.organizeImports": true
  }
}
```

### WebStorm

1. Go to Preferences → Editor → Code Style → TypeScript
2. Go to Imports tab
3. Configure import sorting order

## Benefits

- **Consistency**: Same import order across the codebase
- **Readability**: Easy to scan and find imports
- **Merge Conflicts**: Fewer conflicts with organized imports
- **Dependencies**: Clear separation of external vs internal
- **Architecture**: Layer dependencies visible at a glance

