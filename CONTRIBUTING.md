# Contributing to GitCaster

Thank you for your interest in contributing to GitCaster! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please:

- Be respectful and considerate
- Welcome newcomers and help them get started
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

1. Fork the repository
2. Clone your fork
3. Create a new branch for your feature or bugfix
4. Make your changes
5. Test your changes
6. Submit a pull request

## Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/gitcaster.git

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run development server
npm run dev

# Run tests
npm test

# Run linter
npm run lint

# Build for production
npm run build
```

## Project Structure

```
gitcaster/
├── src/
│   ├── app/                 # Next.js app directory
│   ├── shared/             # Shared code
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   ├── services/       # API clients and services
│   │   └── types/          # TypeScript types
│   ├── features/           # Feature modules
│   │   ├── auth/           # Authentication
│   │   ├── github/         # GitHub integration
│   │   ├── profile/        # User profiles
│   │   └── search/         # Search functionality
│   └── lib/               # Legacy library code
├── tests/                  # Test files
│   ├── unit/              # Unit tests
│   ├── integration/       # Integration tests
│   └── e2e/              # End-to-end tests
├── public/               # Static assets
└── docs/                # Documentation
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Provide proper type annotations
- Avoid `any` types when possible
- Use interfaces for object shapes
- Use type aliases for unions and primitives

```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
  email: string;
}

// ❌ Bad
const user: any = { ... };
```

### React

- Use functional components with hooks
- Keep components small and focused
- Extract complex logic into custom hooks
- Use proper prop types

```typescript
// ✅ Good
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

export function Button({ onClick, children, disabled = false }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
```

### File Organization

- One component per file
- Co-locate related files
- Use index.ts for barrel exports
- Group by feature, not by type

```
// ✅ Good
src/features/auth/
├── components/
│   ├── LoginForm.tsx
│   └── SignupForm.tsx
├── hooks/
│   └── useAuth.ts
├── services/
│   └── authService.ts
└── index.ts

// ❌ Bad
src/
├── components/
│   ├── LoginForm.tsx
│   └── SignupForm.tsx
├── hooks/
│   └── useAuth.ts
└── services/
    └── authService.ts
```

### Naming Conventions

- **Components**: PascalCase (`Button.tsx`, `UserProfile.tsx`)
- **Hooks**: camelCase with `use` prefix (`useAuth.ts`, `useDebounce.ts`)
- **Utilities**: camelCase (`formatDate.ts`, `validateEmail.ts`)
- **Types**: PascalCase (`User.ts`, `ApiResponse.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_URL`, `MAX_RETRIES`)

### Documentation

- Add JSDoc comments for public APIs
- Include examples in documentation
- Keep comments up-to-date
- Document complex logic

```typescript
/**
 * Format a date relative to now
 *
 * @param date - Date to format
 * @returns Relative time string (e.g., "2 hours ago")
 *
 * @example
 * ```typescript
 * const relative = formatRelativeTime(new Date());
 * console.log(relative); // "just now"
 * ```
 */
export function formatRelativeTime(date: Date): string {
  // Implementation
}
```

## Testing

### Writing Tests

- Test user behavior, not implementation
- Use descriptive test names
- Follow Arrange-Act-Assert pattern
- Test edge cases and error conditions

```typescript
describe('Button', () => {
  it('calls onClick when clicked', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button onClick={jest.fn()} disabled>Click me</Button>);

    expect(screen.getByText('Click me')).toBeDisabled();
  });
});
```

### Test Coverage

- Aim for 80%+ code coverage
- Test critical paths thoroughly
- Don't test third-party code
- Focus on business logic

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- Button.test.tsx
```

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```bash
# Feature
git commit -m "feat(auth): add social login support"

# Bug fix
git commit -m "fix(api): handle network timeout errors"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Refactoring
git commit -m "refactor(utils): extract date formatting logic"
```

### Commit Message Guidelines

- Use imperative mood ("Add feature" not "Added feature")
- Keep subject line under 50 characters
- Capitalize subject line
- Don't end subject with period
- Separate subject from body with blank line
- Wrap body at 72 characters
- Explain what and why, not how

## Pull Request Process

### Before Submitting

1. Update documentation
2. Add tests for new features
3. Ensure all tests pass
4. Run linter and fix issues
5. Update CHANGELOG.md if applicable

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Description of testing done

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Linter passed
- [ ] All tests passing
```

### Review Process

1. Automated checks must pass
2. At least one approval required
3. Address review feedback
4. Squash commits if needed
5. Rebase on main before merging

### After Merge

- Delete your branch
- Update your local main branch
- Close related issues

## Getting Help

- Check [documentation](./docs/)
- Search [existing issues](https://github.com/username/gitcaster/issues)
- Join our [Discord](https://discord.gg/gitcaster)
- Ask in [Discussions](https://github.com/username/gitcaster/discussions)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
