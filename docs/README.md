# GitCaster Documentation

Complete documentation for GitCaster developer reputation platform.

## Getting Started

- **[Main README](../README.md)** - Project overview and quick start
- **[Contributing Guide](../CONTRIBUTING.md)** - How to contribute
- **[Changelog](../CHANGELOG.md)** - Version history and changes

## Development

- **[Testing Guide](./TESTING.md)** - Testing strategy and guidelines
- **[Development Setup](../scripts/setup-dev.sh)** - Automated setup script

## Operations

- **[Deployment Guide](./DEPLOYMENT.md)** - How to deploy GitCaster
- **[DevOps Guide](./DEVOPS.md)** - Infrastructure and CI/CD
- **[Operations Runbook](./RUNBOOK.md)** - Incident response and maintenance

## Quick Links

### For Developers

1. **Setup Development Environment**
   ```bash
   git clone https://github.com/Solswinters/gitcaster.git
   cd gitcaster
   ./scripts/setup-dev.sh
   ```

2. **Run Tests**
   ```bash
   npm test              # Unit tests
   npm run test:e2e      # E2E tests
   npm run test:coverage # Coverage report
   ```

3. **Deploy**
   ```bash
   npm run deploy:staging    # Deploy to staging
   npm run deploy:prod       # Deploy to production
   ```

### For Operators

1. **Health Check**
   ```bash
   npm run health-check
   ```

2. **Backup Database**
   ```bash
   npm run backup
   ```

3. **View Logs**
   ```bash
   docker-compose logs -f app
   ```

### For Contributors

1. Read [Contributing Guidelines](../CONTRIBUTING.md)
2. Check [Open Issues](https://github.com/Solswinters/gitcaster/issues)
3. Join [Discussions](https://github.com/Solswinters/gitcaster/discussions)

## Architecture

```
┌─────────────────────────────────────────┐
│           Frontend (Next.js)            │
│  - React Components                     │
│  - Server Components                    │
│  - Client Components                    │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│           API Routes                    │
│  - Authentication                       │
│  - GitHub Integration                   │
│  - Profile Management                   │
└───────────────┬─────────────────────────┘
                │
      ┌─────────┴─────────┐
      │                   │
┌─────▼──────┐   ┌───────▼────────┐
│ PostgreSQL │   │  External APIs  │
│  Database  │   │  - GitHub       │
│            │   │  - Talent Proto │
└────────────┘   └────────────────┘
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (NativeWind)
- **Database**: PostgreSQL (Prisma ORM)
- **Authentication**: Reown AppKit, SIWE
- **Testing**: Jest, React Testing Library, Playwright
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel
- **Monitoring**: Sentry
- **Containers**: Docker, Kubernetes

## File Structure

```
gitcaster/
├── src/
│   ├── app/              # Next.js pages and API routes
│   ├── components/       # React components
│   ├── lib/             # Utilities and integrations
│   ├── hooks/           # Custom React hooks
│   └── types/           # TypeScript types
├── tests/              # Test files
├── docs/               # Documentation
├── scripts/            # Utility scripts
├── k8s/                # Kubernetes manifests
└── .github/            # GitHub Actions workflows
```

## Environment Variables

Required:
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Session encryption key
- `GITHUB_CLIENT_ID` - GitHub OAuth app ID
- `GITHUB_CLIENT_SECRET` - GitHub OAuth app secret
- `NEXT_PUBLIC_REOWN_PROJECT_ID` - Reown project ID
- `NEXT_PUBLIC_APP_URL` - Application URL

Optional:
- `TALENT_PROTOCOL_API_KEY` - Talent Protocol API key
- `SENTRY_DSN` - Sentry error tracking
- `REDIS_URL` - Redis cache URL

## Support

- 📖 [Documentation](https://github.com/Solswinters/gitcaster/tree/main/docs)
- 🐛 [Report Bug](https://github.com/Solswinters/gitcaster/issues/new)
- 💬 [Ask Question](https://github.com/Solswinters/gitcaster/discussions/new)
- 📧 Email: support@gitcaster.dev

## License

MIT License - See [LICENSE](../LICENSE) for details.

