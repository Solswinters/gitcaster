# Code Style Guide

## Overview

This guide defines coding standards and best practices for the GitCaster project.

## General Principles

1. **Clarity over cleverness** - Write code that's easy to understand
2. **Consistency** - Follow established patterns
3. **Simplicity** - Keep it simple and maintainable
4. **Testing** - Write testable code
5. **Documentation** - Document complex logic

## TypeScript

### Naming Conventions

```typescript
// PascalCase for types, interfaces, classes, components
type UserProfile = {};
interface IUser {}
class UserService {}
const MyComponent = () => {};

// camelCase for variables, functions, methods
const userName = 'John';
function getUserData() {}
const handleClick = () => {};

// UPPER_SNAKE_CASE for constants
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_ATTEMPTS = 3;

// Prefix interfaces with descriptive names
interface ButtonProps {}
interface UserData {}
```

### Type Annotations

```typescript
// Explicitly type function parameters and return values
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// Use type inference for simple cases
const count = 5; // type inferred as number
const items = ['a', 'b']; // type inferred as string[]

// Avoid 'any' - use 'unknown' when type is truly unknown
function processData(data: unknown) {
  if (typeof data === 'string') {
    return data.toUpperCase();
  }
}
```

### Interfaces vs Types

```typescript
// Use interfaces for object shapes (can be extended)
interface User {
  id: string;
  name: string;
}

interface AdminUser extends User {
  role: 'admin';
}

// Use types for unions, intersections, primitives
type Status = 'pending' | 'approved' | 'rejected';
type ID = string | number;
type UserWithRole = User & { role: string };
```

## React

### Component Structure

```typescript
// Functional components with TypeScript
interface ComponentProps {
  title: string;
  onAction?: () => void;
  children?: React.ReactNode;
}

export function Component({
  title,
  onAction,
  children,
}: ComponentProps) {
  // Hooks first
  const [state, setState] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  // Event handlers
  const handleClick = () => {
    setState(true);
    onAction?.();
  };
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, []);
  
  // Render helpers (optional)
  const renderContent = () => {
    return <div>{children}</div>;
  };
  
  // Return JSX
  return (
    <div ref={ref} onClick={handleClick}>
      <h1>{title}</h1>
      {renderContent()}
    </div>
  );
}
```

### Hooks

```typescript
// Custom hooks start with 'use'
function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return size;
}
```

### Props

```typescript
// Destructure props
function Button({ label, onClick, disabled = false }: ButtonProps) {
  return <button onClick={onClick} disabled={disabled}>{label}</button>;
}

// Use children prop properly
interface CardProps {
  title: string;
  children: React.ReactNode;
}

function Card({ title, children }: CardProps) {
  return (
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  );
}
```

## File Organization

```
component/
├── Component.tsx           # Main component
├── Component.test.tsx     # Tests
├── Component.styles.ts    # Styles (if needed)
├── types.ts              # Component-specific types
└── index.ts              # Barrel export
```

## Comments

```typescript
// Good: Explain WHY, not WHAT
// Calculate total with discount to match pricing rules
const total = basePrice * (1 - discount);

// Avoid: Obvious comments
// Set x to 5
const x = 5;

/**
 * Multi-line comments for complex logic
 * 
 * @param userId - The user's unique identifier
 * @returns User profile data or null if not found
 */
async function getUserProfile(userId: string): Promise<UserProfile | null> {
  // Implementation
}
```

## Error Handling

```typescript
// Use try-catch for async operations
async function fetchData() {
  try {
    const response = await api.get('/data');
    return response.data;
  } catch (error) {
    logger.error('Failed to fetch data', error);
    throw new Error('Data fetch failed');
  }
}

// Use custom error classes
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
```

## Formatting

- **Indentation**: 2 spaces
- **Line Length**: Max 100 characters
- **Semicolons**: Required
- **Quotes**: Single quotes for strings
- **Trailing Commas**: Always in objects/arrays

```typescript
// Good
const user = {
  name: 'John',
  age: 30,
};

// Format with Prettier
npm run format
```

## Imports

```typescript
// Group imports
import React, { useState, useEffect } from 'react'; // React imports
import { useRouter } from 'next/router'; // Next.js imports

import { Button, Card } from '@/shared/components'; // Internal imports
import { formatDate } from '@/shared/utils';

import type { User, Profile } from '@/types'; // Type imports

// Order: External → Internal → Types
```

## Best Practices

1. **Keep functions small** - Single responsibility
2. **Avoid magic numbers** - Use named constants
3. **DRY principle** - Don't repeat yourself
4. **SOLID principles** - Object-oriented design
5. **Composition over inheritance** - Favor composition
6. **Immutability** - Avoid mutating state
7. **Pure functions** - No side effects when possible
8. **Early returns** - Reduce nesting

## Linting

```bash
# Run linter
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Type check
npm run type-check
```

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)

