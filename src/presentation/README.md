# Presentation Layer

The presentation layer is responsible for all UI-related concerns including components, pages, layouts, and styling.

## Structure

```
presentation/
├── app/         # Next.js App Router pages
├── components/  # UI components
├── layouts/     # Page layouts
└── styles/      # Global styles
```

## Responsibilities

- Rendering UI components
- Handling user interactions
- Managing component state
- Routing and navigation
- Styling and theming

## Dependencies

- Can depend on: Application layer
- Cannot depend on: Domain, Infrastructure layers directly

## Best Practices

1. Keep components focused and single-purpose
2. Use composition over inheritance
3. Prefer functional components with hooks
4. Extract business logic to Application layer
5. Use TypeScript for type safety
6. Follow accessibility guidelines

## Example Component

```tsx
import { useUserProfile } from '@/application/hooks';

export function ProfileCard({ userId }: { userId: string }) {
  const { profile, loading } = useUserProfile(userId);
  
  if (loading) return <LoadingSkeleton />;
  
  return (
    <div className="profile-card">
      <h2>{profile.displayName}</h2>
      <p>{profile.bio}</p>
    </div>
  );
}
```

