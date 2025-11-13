# DevOps Guide

Complete guide to GitCaster DevOps infrastructure and operations.

## Overview

GitCaster uses a comprehensive DevOps strategy including:
- Automated CI/CD pipelines
- Container orchestration (Docker/K8s)
- Comprehensive monitoring and logging
- Automated backups and disaster recovery
- Security scanning and compliance

## Architecture

```
┌─────────────────────────────────────────────┐
│           GitHub Actions CI/CD              │
│  (Testing, Building, Security, Deployment)  │
└──────────────────┬──────────────────────────┘
                   │
       ┌───────────┴───────────┐
       │                       │
       ▼                       ▼
┌──────────────┐      ┌──────────────┐
│   Staging    │      │ Production   │
│   (Vercel)   │      │   (Vercel)   │
└──────┬───────┘      └──────┬───────┘
       │                     │
       ▼                     ▼
┌──────────────┐      ┌──────────────┐
│  PostgreSQL  │      │  PostgreSQL  │
│  (Railway)   │      │  (Railway)   │
└──────────────┘      └──────────────┘
```

## CI/CD Pipelines

### Test Pipeline
- **Trigger**: Push to any branch, PR
- **Steps**: Lint → Type Check → Unit Tests → E2E Tests
- **Coverage**: 70% minimum threshold
- **File**: `.github/workflows/test.yml`

### Lint Pipeline
- **Trigger**: Push/PR to main/develop
- **Steps**: ESLint → TypeScript → Prettier
- **File**: `.github/workflows/lint.yml`

### Security Pipeline
- **Trigger**: Push to main, daily at 2am UTC
- **Steps**: npm audit → Snyk → Secret detection
- **File**: `.github/workflows/security.yml`

### Docker Build Pipeline
- **Trigger**: Push to main, tags
- **Steps**: Build → Vulnerability Scan → Push to registry
- **File**: `.github/workflows/docker-build.yml`

### Deployment Pipelines
- **Staging**: Auto-deploy on push to `develop`
- **Production**: Auto-deploy on push to `main` or tag
- **Files**: `deploy-staging.yml`, `deploy-production.yml`

## Docker Setup

### Development
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

### Production
```bash
# Using production compose file
docker-compose -f docker-compose.prod.yml up -d

# Or use Makefile
make docker-prod
```

### Building Images
```bash
# Build locally
docker build -t gitcaster:latest .

# Build with cache
docker build --cache-from gitcaster:latest -t gitcaster:latest .

# Multi-arch build
docker buildx build --platform linux/amd64,linux/arm64 -t gitcaster:latest .
```

## Kubernetes Deployment

### Prerequisites
- Kubernetes cluster (GKE, EKS, AKS, or self-hosted)
- kubectl configured
- Secrets configured

### Deploy

1. **Create secrets**:
```bash
# Copy example and fill values
cp k8s/secrets.yaml.example k8s/secrets.yaml
# Edit k8s/secrets.yaml with base64-encoded values

# Apply secrets
kubectl apply -f k8s/secrets.yaml
```

2. **Configure app**:
```bash
# Edit k8s/configmap.yaml with your values
kubectl apply -f k8s/configmap.yaml
```

3. **Deploy application**:
```bash
# Apply deployment
kubectl apply -f k8s/deployment.yaml

# Check status
kubectl get pods
kubectl get services
kubectl get hpa
```

4. **Access application**:
```bash
# Get external IP
kubectl get service gitcaster-service

# Or port-forward for testing
kubectl port-forward service/gitcaster-service 3000:80
```

### Scaling

Horizontal Pod Autoscaler is configured:
- **Min replicas**: 2
- **Max replicas**: 10
- **CPU threshold**: 70%
- **Memory threshold**: 80%

Manual scaling:
```bash
kubectl scale deployment gitcaster --replicas=5
```

## Monitoring

### Application Monitoring
- **Sentry**: Error tracking and performance
- **Logs**: Structured logging with logger utility
- **Metrics**: Performance metrics tracked via monitoring library

### Infrastructure Monitoring
- **Health checks**: `/api/health` endpoint
- **Docker**: `docker stats`, `docker-compose logs`
- **Kubernetes**: kubectl metrics, Prometheus (optional)

### Alerts
Configure alerts for:
- Error rate > 5%
- Response time > 1s
- Memory usage > 90%
- CPU usage > 80%
- Failed deployments
- Database connection issues

## Logging

### Application Logs
```bash
# Docker
docker-compose logs -f app

# Kubernetes
kubectl logs -f deployment/gitcaster

# Production (Vercel)
vercel logs
```

### Log Levels
- **DEBUG**: Detailed diagnostic information
- **INFO**: General informational messages
- **WARN**: Warning messages for potential issues
- **ERROR**: Error messages for failures

## Backup & Recovery

### Automated Backups
- **Frequency**: Daily at 3am UTC
- **Retention**: 30 days
- **Location**: GitHub Artifacts, S3 (optional)
- **Workflow**: `.github/workflows/backup-database.yml`

### Manual Backup
```bash
# Create backup
npm run backup

# Or use script
./scripts/backup-database.sh
```

### Restore
```bash
# Restore from backup
gunzip -c backups/gitcaster_backup_TIMESTAMP.sql.gz | \
  psql $DATABASE_URL

# Or using Docker
gunzip -c backups/gitcaster_backup_TIMESTAMP.sql.gz | \
  docker-compose exec -T postgres psql -U gitcaster
```

## Security

### Secrets Management
- **Development**: `.env` file (gitignored)
- **CI/CD**: GitHub Secrets
- **Production**: Vercel Environment Variables
- **Kubernetes**: K8s Secrets (base64-encoded)

### Security Scanning
- **Dependencies**: npm audit, Snyk
- **Containers**: Trivy vulnerability scanner
- **Secrets**: TruffleHog secret detection
- **Code**: ESLint security rules

### Security Headers
Configured in middleware:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

## Performance

### Optimization Strategies
- **Caching**: Redis for frequently accessed data
- **CDN**: Static assets cached at edge
- **Database**: Connection pooling, indexed queries
- **Bundle**: Code splitting, tree shaking
- **Images**: Next.js Image optimization

### Load Testing
```bash
# Run load test
node scripts/load-test.js

# With custom settings
DURATION=120 CONCURRENCY=20 node scripts/load-test.js
```

### Performance Monitoring
- Lighthouse CI on every PR
- Bundle size tracking
- Response time tracking
- Database query performance

## Scripts

### Development
- `make dev` - Start development server
- `make test` - Run all tests
- `make lint` - Lint code
- `make format` - Format code

### Deployment
- `./scripts/deploy.sh staging` - Deploy to staging
- `./scripts/deploy.sh production` - Deploy to production

### Maintenance
- `./scripts/backup-database.sh` - Create database backup
- `./scripts/check-health.sh` - Run health checks
- `./scripts/setup-dev.sh` - Setup development environment

### Monitoring
- `node scripts/load-test.js` - Run load test
- `npm run validate-env` - Validate environment

## Troubleshooting

See [RUNBOOK.md](./RUNBOOK.md) for detailed troubleshooting procedures.

### Quick Checks
```bash
# Check application health
curl http://localhost:3000/api/health

# Check Docker services
docker-compose ps

# Check database
npx prisma db execute --stdin <<< "SELECT 1;"

# View logs
docker-compose logs app --tail=100

# Check resource usage
docker stats
```

## Resources

- [Deployment Guide](./DEPLOYMENT.md)
- [Operations Runbook](./RUNBOOK.md)
- [Testing Guide](./TESTING.md)
- [Contributing Guide](../CONTRIBUTING.md)

