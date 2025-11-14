# Quick Start Guide

## Get Started in 5 Minutes

### Prerequisites

- Node.js 18.17.0 or higher
- PostgreSQL database
- Git

### Step 1: Clone and Install

```bash
# Clone the repository
git clone https://github.com/yourusername/gitcaster.git
cd gitcaster

# Install dependencies
npm install

# Or use the setup script
./scripts/setup.sh
```

### Step 2: Configure Environment

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your values
DATABASE_URL="postgresql://user:password@localhost:5432/gitcaster"
NEXTAUTH_SECRET="your-secret-key"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
NEXT_PUBLIC_PROJECT_ID="your-project-id"
```

### Step 3: Setup Database

```bash
# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Or run migrations
npm run db:migrate
```

### Step 4: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema changes
npm run db:studio        # Open Prisma Studio

# Testing
npm test                 # Run tests
npm run test:watch       # Watch mode
npm run test:coverage    # With coverage
npm run test:e2e         # E2E tests

# Code Quality
npm run lint             # Run linter
npm run format           # Format code
npm run type-check       # TypeScript check

# Utility Scripts
./scripts/setup.sh       # Initial setup
./scripts/test-coverage.sh   # Generate coverage
./scripts/build-check.sh     # Pre-deployment checks
```

## Project Structure

```
gitcaster/
├── src/
│   ├── app/              # Next.js app router
│   ├── features/         # Feature modules
│   ├── shared/           # Shared code
│   ├── lib/              # Core library
│   └── types/            # Type definitions
├── tests/               # Test suites
├── docs/                # Documentation
├── prisma/              # Database schema
└── public/              # Static assets
```

## Key Features

### Authentication
```typescript
import { useAuth } from '@/features/auth';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  // Use auth state
}
```

### Components
```typescript
import { Button, Card, Modal } from '@/shared/components';

function MyPage() {
  return (
    <Card>
      <Button onClick={() => {}}>Click me</Button>
    </Card>
  );
}
```

### Utilities
```typescript
import { formatDate, debounce } from '@/shared/utils';

const formattedDate = formatDate(new Date());
const debouncedFn = debounce(() => {}, 300);
```

## Next Steps

1. **Read the docs** - Check `/docs` for comprehensive guides
2. **Explore components** - See `COMPONENT_LIBRARY.md`
3. **Review architecture** - Read `ARCHITECTURE.md`
4. **Write tests** - Follow `TESTING.md`
5. **Deploy** - See `DEPLOYMENT.md`

## Getting Help

- **Documentation**: `/docs` directory
- **Examples**: `/docs/EXAMPLES.md`
- **Issues**: GitHub Issues
- **Contributing**: `CONTRIBUTING.md`

## Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
pg_isready

# Verify DATABASE_URL in .env.local
```

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Test Failures
```bash
# Run tests in watch mode for debugging
npm run test:watch
```

## Learn More

- [Architecture Guide](/ARCHITECTURE.md)
- [Component Library](/docs/COMPONENT_LIBRARY.md)
- [API Documentation](/docs/API.md)
- [Testing Guide](/docs/TESTING.md)
- [Code Examples](/docs/EXAMPLES.md)

---

**Happy coding! 🚀**

