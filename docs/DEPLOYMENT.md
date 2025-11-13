# Deployment Guide

Complete guide for deploying GitCaster to production.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Vercel Deployment](#vercel-deployment)
- [Docker Deployment](#docker-deployment)
- [Database Setup](#database-setup)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js 18+
- PostgreSQL database
- GitHub OAuth App
- Reown (formerly WalletConnect) Project ID
- Talent Protocol API key (optional)

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/gitcaster

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Reown (WalletConnect)
NEXT_PUBLIC_REOWN_PROJECT_ID=your-project-id

# Talent Protocol (optional)
NEXT_PUBLIC_TALENT_API_KEY=your-api-key
NEXT_PUBLIC_TALENT_API_URL=https://api.talentprotocol.com

# Other
NEXT_PUBLIC_API_URL=/api
```

## Vercel Deployment

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Deploy

```bash
# Preview deployment
vercel

# Production deployment
vercel --prod
```

### 4. Configure Environment Variables

In Vercel Dashboard:
1. Go to Project Settings
2. Navigate to Environment Variables
3. Add all required variables
4. Redeploy the project

### 5. Database Setup

```bash
# Push schema to database
npx prisma db push

# Generate Prisma client
npx prisma generate
```

## Docker Deployment

### 1. Create Dockerfile

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
```

### 2. Create docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/gitcaster
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=gitcaster
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### 3. Deploy

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## Database Setup

### 1. Install PostgreSQL

```bash
# macOS
brew install postgresql

# Ubuntu
sudo apt-get install postgresql

# Start service
sudo service postgresql start
```

### 2. Create Database

```bash
psql -U postgres

CREATE DATABASE gitcaster;
CREATE USER gitcaster_user WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE gitcaster TO gitcaster_user;
```

### 3. Run Migrations

```bash
npx prisma migrate deploy
```

### 4. Seed Database (Optional)

```bash
npx prisma db seed
```

## Monitoring

### Application Monitoring

- **Vercel Analytics**: Built-in analytics
- **Sentry**: Error tracking
- **LogRocket**: Session replay

### Database Monitoring

```bash
# Check database connections
SELECT * FROM pg_stat_activity;

# Check table sizes
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Performance Monitoring

```bash
# Check Next.js build
npm run build

# Analyze bundle size
npm run analyze
```

## Troubleshooting

### Database Connection Issues

```bash
# Test connection
psql $DATABASE_URL

# Reset database
npx prisma migrate reset

# Generate client
npx prisma generate
```

### Build Failures

```bash
# Clear Next.js cache
rm -rf .next

# Clear node modules
rm -rf node_modules
npm install

# Rebuild
npm run build
```

### Environment Variable Issues

```bash
# Check if variables are loaded
node -e "console.log(process.env.DATABASE_URL)"

# Reload environment
source .env.local
```

### OAuth Issues

1. Check redirect URIs match
2. Verify client ID and secret
3. Check OAuth app settings
4. Review CORS settings

## Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates installed
- [ ] DNS configured
- [ ] Monitoring setup
- [ ] Backup strategy implemented
- [ ] Error tracking enabled
- [ ] Performance testing completed
- [ ] Security audit performed
- [ ] Documentation updated

## Security Best Practices

1. Use strong secrets
2. Enable HTTPS
3. Set up rate limiting
4. Configure CORS properly
5. Use security headers
6. Enable CSP
7. Regular security updates
8. Database backups
9. Monitor for suspicious activity
10. Use environment variables for secrets

## Scaling

### Horizontal Scaling

- Deploy multiple instances
- Use load balancer
- Configure session storage
- Implement caching

### Database Scaling

- Read replicas
- Connection pooling
- Query optimization
- Indexing strategy

### Caching

- Redis for session storage
- CDN for static assets
- API response caching
- Database query caching

## Backup and Recovery

### Database Backups

```bash
# Backup
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

### Automated Backups

```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d)
pg_dump $DATABASE_URL > backup_$DATE.sql
```

## Support

For deployment issues:
- Check [documentation](../README.md)
- Search [issues](https://github.com/username/gitcaster/issues)
- Join [Discord](https://discord.gg/gitcaster)

