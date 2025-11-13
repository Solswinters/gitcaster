# Deployment Guide

This guide covers deploying GitCaster to production.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Vercel Deployment](#vercel-deployment)
- [Docker Deployment](#docker-deployment)
- [Database Setup](#database-setup)
- [Post-Deployment](#post-deployment)

## Prerequisites

- Node.js 18+
- PostgreSQL database
- GitHub OAuth App
- Reown Project ID
- Domain name (optional)

## Environment Setup

### 1. Copy Environment Template

```bash
cp .env.example .env
```

### 2. Required Environment Variables

```bash
# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# Session Secret (generate with: openssl rand -base64 32)
SESSION_SECRET="your-32-character-secret"

# GitHub OAuth
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"

# Reown/WalletConnect
NEXT_PUBLIC_REOWN_PROJECT_ID="your_reown_project_id"

# App URL (your production domain)
NEXT_PUBLIC_APP_URL="https://yourdomain.com"

# Optional: Talent Protocol
TALENT_PROTOCOL_API_KEY="your_talent_protocol_api_key"

# Optional: Error Tracking
SENTRY_DSN="your_sentry_dsn"
```

### 3. Validate Environment

```bash
npm run validate-env
```

## Vercel Deployment

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Solswinters/gitcaster)

### Manual Deployment

1. **Install Vercel CLI**

```bash
npm i -g vercel
```

2. **Login to Vercel**

```bash
vercel login
```

3. **Deploy to Production**

```bash
vercel --prod
```

4. **Configure Environment Variables**

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add all required environment variables.

5. **Configure Domains**

- Go to Vercel Dashboard → Your Project → Settings → Domains
- Add your custom domain
- Update `NEXT_PUBLIC_APP_URL` environment variable

6. **Update GitHub OAuth Callback**

Add Vercel domain to GitHub OAuth app:
- Go to GitHub Settings → Developer settings → OAuth Apps
- Update callback URL: `https://yourdomain.vercel.app/api/github/callback`

## Docker Deployment

### Production with Docker Compose

1. **Clone Repository**

```bash
git clone https://github.com/Solswinters/gitcaster.git
cd gitcaster
```

2. **Configure Environment**

```bash
cp .env.example .env
# Edit .env with your production values
nano .env
```

3. **Build and Start**

```bash
docker-compose -f docker-compose.prod.yml up -d
```

4. **Run Migrations**

```bash
docker-compose -f docker-compose.prod.yml exec app npx prisma migrate deploy
```

5. **Check Status**

```bash
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs -f app
```

### Using Dockerfile Only

```bash
# Build image
docker build -t gitcaster:latest .

# Run container
docker run -d \
  -p 3000:3000 \
  --env-file .env \
  --name gitcaster \
  gitcaster:latest
```

## Database Setup

### Using Railway

1. **Create Project**
   - Go to [Railway](https://railway.app/)
   - Create new project
   - Add PostgreSQL database

2. **Get Connection String**
   - Copy `DATABASE_URL` from Railway dashboard
   - Add to your `.env` or Vercel environment variables

3. **Run Migrations**

```bash
DATABASE_URL="your_railway_url" npx prisma migrate deploy
```

### Using Other Providers

Compatible with:
- [Supabase](https://supabase.com/)
- [Neon](https://neon.tech/)
- [PlanetScale](https://planetscale.com/)
- [AWS RDS](https://aws.amazon.com/rds/)
- Self-hosted PostgreSQL

## Post-Deployment

### 1. Health Check

Visit: `https://yourdomain.com/api/health`

Expected response:
```json
{
  "status": "healthy",
  "checks": {
    "database": "healthy",
    "memory": "healthy"
  }
}
```

### 2. Test Authentication

- Test wallet connection
- Test GitHub OAuth flow
- Create test profile

### 3. Configure Monitoring

#### Sentry Setup

```bash
npm run setup:monitoring
```

#### Add Sentry to Environment

```bash
SENTRY_DSN="your_sentry_dsn"
SENTRY_AUTH_TOKEN="your_auth_token"
```

### 4. Set Up Backups

Daily automated backups via GitHub Actions:

- Configure AWS S3 credentials (optional)
- Backups run at 3am UTC
- Retention: 30 days

### 5. Enable Custom Domain

**Vercel:**
- Dashboard → Domains → Add Domain
- Update DNS records as shown

**Docker:**
- Configure nginx with SSL certificates
- Use Let's Encrypt for free SSL:

```bash
certbot --nginx -d yourdomain.com
```

## Scaling

### Horizontal Scaling (Vercel)

Vercel automatically scales based on traffic.

### Vertical Scaling (Docker)

```yaml
# docker-compose.prod.yml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 4G
```

## Monitoring

### Application Metrics

- Error rate: Sentry dashboard
- Performance: Vercel Analytics
- API response times: Middleware logs

### Database Monitoring

```bash
# Check database size
docker-compose exec postgres psql -U gitcaster -c "SELECT pg_size_pretty(pg_database_size('gitcaster'));"

# Active connections
docker-compose exec postgres psql -U gitcaster -c "SELECT count(*) FROM pg_stat_activity;"
```

## Troubleshooting

### Build Failures

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Database Connection Issues

```bash
# Test connection
npx prisma db pull

# Reset if needed (⚠️ destroys data)
npx prisma migrate reset
```

### Environment Variable Issues

```bash
# Validate all variables
npm run validate-env

# Check Vercel deployment logs
vercel logs
```

## Security Checklist

- [ ] Environment variables are set correctly
- [ ] Session secret is strong (32+ characters)
- [ ] Database has SSL enabled
- [ ] GitHub OAuth callback URLs are configured
- [ ] Sentry error tracking is enabled
- [ ] Backups are configured
- [ ] Rate limiting is enabled (nginx)
- [ ] HTTPS is enforced
- [ ] Security headers are set

## Maintenance

### Update Application

```bash
# Pull latest code
git pull origin main

# Install dependencies
npm install

# Run migrations
npx prisma migrate deploy

# Rebuild and restart
docker-compose -f docker-compose.prod.yml up -d --build
```

### Database Backups

```bash
# Manual backup
npm run backup

# Restore from backup
gunzip -c backups/gitcaster_backup_20240101_120000.sql.gz | \
  psql $DATABASE_URL
```

## Support

- 📖 [Documentation](https://github.com/Solswinters/gitcaster)
- 🐛 [Report Issues](https://github.com/Solswinters/gitcaster/issues)
- 💬 [Discussions](https://github.com/Solswinters/gitcaster/discussions)

