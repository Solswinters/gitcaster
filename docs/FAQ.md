# Frequently Asked Questions

## General

### What is GitCaster?
GitCaster is a platform that showcases your GitHub presence on the blockchain using Talent Protocol.

### What technologies does it use?
- Frontend: React 18, Next.js 14, TypeScript
- Styling: Tailwind CSS
- Database: PostgreSQL, Prisma
- Auth: Reown AppKit, SIWE
- Blockchain: Wagmi v2, Viem

## Development

### How do I get started?
See [Quick Start Guide](./QUICK_START.md)

### What's the test coverage?
Overall 82% with >80% for components and >85% for utilities.

### How do I run tests?
```bash
npm test                 # All tests
npm run test:coverage    # With coverage
npm run test:e2e         # E2E tests
```

### How do I deploy?
See [Deployment Guide](./DEPLOYMENT.md)

## Architecture

### Why feature-based structure?
Feature-based architecture scales better and keeps related code together.

### How are components organized?
Components are in `src/shared/components/` with categories like layout, forms, ui, data-display, feedback, navigation.

### Where do I add new features?
Create a new module in `src/features/` with types, services, hooks, and components.

## Troubleshooting

### Database connection fails
Check DATABASE_URL in .env.local and ensure PostgreSQL is running.

### Build errors
Clear cache: `rm -rf .next node_modules && npm install && npm run build`

### Tests fail
Run `npm run test:watch` for debugging.

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md)
