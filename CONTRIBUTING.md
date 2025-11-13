# Contributing to GitCaster

Thank you for your interest in contributing to GitCaster! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)

## Code of Conduct

Be respectful, inclusive, and professional. We're all here to build something great together.

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- Git
- Docker (optional)

### Setup

1. Fork the repository
2. Clone your fork:
```bash
git clone https://github.com/YOUR_USERNAME/gitcaster.git
cd gitcaster
```

3. Add upstream remote:
```bash
git remote add upstream https://github.com/Solswinters/gitcaster.git
```

4. Run setup script:
```bash
./scripts/setup-dev.sh
```

Or manually:
```bash
npm install
cp .env.example .env
# Edit .env with your values
npx prisma generate
npx prisma migrate dev
```

5. Start development server:
```bash
npm run dev
```

## Development Process

### Branching Strategy

- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates

### Workflow

1. Create a branch from `develop`:
```bash
git checkout develop
git pull upstream develop
git checkout -b feature/your-feature-name
```

2. Make your changes
3. Test your changes:
```bash
npm run lint
npm run type-check
npm run test
```

4. Commit with conventional commits
5. Push to your fork
6. Open a Pull Request to `develop`

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Avoid `any` types when possible
- Use interfaces for object types
- Document complex functions with JSDoc comments

### React/Next.js

- Use functional components with hooks
- Use NativeWind (Tailwind) for styling
- Keep components under 500 lines
- Extract reusable logic into custom hooks
- Use server components by default, client components when needed

### File Organization

- Keep files under 500 lines
- One component per file
- Group related files in feature directories
- Use barrel exports (index.ts) for public APIs

### Naming Conventions

- **Files**: `kebab-case.tsx`
- **Components**: `PascalCase`
- **Functions**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Types/Interfaces**: `PascalCase`

### Code Style

```typescript
// Good
export function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0)
}

// Use descriptive names
const isUserAuthenticated = user?.isLoggedIn ?? false

// Prefer early returns
function processUser(user: User) {
  if (!user) return null
  if (!user.isActive) return null
  
  return user.data
}
```

## Commit Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `ci`: CI/CD changes
- `build`: Build system changes

### Examples

```
feat(profile): add GitHub contribution graph
fix(auth): resolve wallet connection timeout
docs(api): update authentication documentation
test(github): add unit tests for GitHub client
```

### Commit Message Guidelines

- Use present tense ("add feature" not "added feature")
- Use imperative mood ("move cursor to..." not "moves cursor to...")
- Keep first line under 72 characters
- Reference issues: "fixes #123" or "closes #456"

## Pull Request Process

### Before Submitting

- [ ] Tests pass locally
- [ ] Code follows style guidelines
- [ ] Documentation is updated
- [ ] Commit messages follow conventions
- [ ] PR description explains changes

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
How to test these changes

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Tests pass
- [ ] Linting passes
- [ ] Documentation updated
- [ ] Self-reviewed code
```

### Review Process

1. Automated checks must pass
2. At least one approval required
3. Address review comments
4. Squash commits if needed
5. Merge to `develop`

## Testing

### Unit Tests

```typescript
// tests/unit/lib/example.test.ts
import { myFunction } from '@/lib/example'

describe('myFunction', () => {
  it('should return expected result', () => {
    expect(myFunction('input')).toBe('output')
  })
})
```

### Component Tests

```typescript
// tests/unit/components/example.test.tsx
import { render, screen } from '../../../utils/test-helpers'
import MyComponent from '@/components/MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

### E2E Tests

```typescript
// tests/e2e/example.spec.ts
import { test, expect } from '@playwright/test'

test('should complete user flow', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/GitCaster/)
})
```

### Running Tests

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage

# Specific test
npm test -- tests/unit/lib/example.test.ts
```

## Documentation

- Update README.md for user-facing changes
- Update API documentation for new endpoints
- Add JSDoc comments for public APIs
- Update CHANGELOG.md (automated)

## Questions?

- 💬 [Discussions](https://github.com/Solswinters/gitcaster/discussions)
- 🐛 [Issues](https://github.com/Solswinters/gitcaster/issues)
- 📧 Email: support@gitcaster.dev

Thank you for contributing! 🎉

