# GitCaster Operations Runbook

This runbook provides procedures for common operational tasks and incident response.

## Table of Contents

- [System Overview](#system-overview)
- [Monitoring](#monitoring)
- [Common Issues](#common-issues)
- [Incident Response](#incident-response)
- [Maintenance Tasks](#maintenance-tasks)
- [Rollback Procedures](#rollback-procedures)

## System Overview

### Architecture

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│   Nginx     │────▶│   Next.js    │────▶│  PostgreSQL  │
│ (Reverse    │     │   App        │     │   Database   │
│  Proxy)     │     │              │     │              │
└─────────────┘     └──────────────┘     └──────────────┘
                           │
                           │
                    ┌──────▼──────┐
                    │    Redis    │
                    │   (Cache)   │
                    └─────────────┘
```

### Key Services

- **Next.js Application**: Port 3000
- **PostgreSQL Database**: Port 5432
- **Redis Cache**: Port 6379
- **Nginx**: Ports 80/443

### Health Endpoints

- `/api/health` - Full health check
- `/` - Application availability

## Monitoring

### Key Metrics

#### Application Metrics
- Response time < 200ms (P95)
- Error rate < 1%
- Uptime > 99.9%

#### Database Metrics
- Connection pool < 80% utilization
- Query time < 50ms (P95)
- Database size monitoring

#### System Metrics
- CPU < 70%
- Memory < 80%
- Disk space > 20% free

### Monitoring Tools

- **Sentry**: Error tracking and performance monitoring
- **Vercel Analytics**: Real-time traffic and performance
- **GitHub Actions**: CI/CD pipeline status
- **Docker logs**: `docker-compose logs -f`

### Alerts

Configure alerts for:
- High error rate (> 5%)
- Slow response time (> 1s)
- Database connection failures
- High memory usage (> 90%)
- Failed deployments

## Common Issues

### Issue: High Response Times

**Symptoms**: API responses taking > 1 second

**Diagnosis**:
```bash
# Check application logs
docker-compose logs app | grep "slow query"

# Check database connections
docker-compose exec postgres psql -U gitcaster -c "SELECT count(*) FROM pg_stat_activity;"

# Check Redis
docker-compose exec redis redis-cli ping
```

**Resolution**:
1. Check for slow database queries
2. Verify Redis cache is working
3. Scale application horizontally
4. Optimize database queries

**Prevention**:
- Add database indexes
- Implement query caching
- Use Redis for frequently accessed data

---

### Issue: Database Connection Pool Exhausted

**Symptoms**: "too many clients" error

**Diagnosis**:
```bash
# Check active connections
docker-compose exec postgres psql -U gitcaster -c \
  "SELECT count(*) FROM pg_stat_activity WHERE datname='gitcaster';"
```

**Resolution**:
```bash
# Kill idle connections
docker-compose exec postgres psql -U gitcaster -c \
  "SELECT pg_terminate_backend(pid) FROM pg_stat_activity 
   WHERE state = 'idle' AND state_change < now() - interval '5 minutes';"

# Restart application
docker-compose restart app
```

**Prevention**:
- Configure connection pool limits
- Implement connection timeout
- Monitor connection usage

---

### Issue: Memory Leak

**Symptoms**: Application memory continuously growing

**Diagnosis**:
```bash
# Check memory usage
docker stats gitcaster-app

# Check Node.js heap
docker-compose exec app node -e "console.log(process.memoryUsage())"
```

**Resolution**:
```bash
# Restart application
docker-compose restart app

# If persistent, investigate with profiler
npm run profile
```

**Prevention**:
- Regular restarts (daily)
- Memory profiling in staging
- Proper cleanup of event listeners

---

### Issue: Failed Deployment

**Symptoms**: Deployment pipeline fails

**Diagnosis**:
1. Check GitHub Actions logs
2. Review build errors
3. Verify environment variables

**Resolution**:
```bash
# Rollback to previous version
git revert HEAD
git push

# Or deploy specific version
vercel --prod --force
```

**Prevention**:
- Run tests before deploying
- Use staging environment
- Implement gradual rollouts

---

### Issue: GitHub OAuth Failure

**Symptoms**: Users cannot connect GitHub

**Diagnosis**:
```bash
# Check callback URL
echo $NEXT_PUBLIC_APP_URL/api/github/callback

# Test OAuth flow manually
```

**Resolution**:
1. Verify GitHub OAuth app settings
2. Check callback URL matches
3. Verify client ID/secret are correct
4. Check rate limits

## Incident Response

### Severity Levels

- **P0 (Critical)**: Complete service outage
- **P1 (High)**: Major feature broken
- **P2 (Medium)**: Minor feature degraded
- **P3 (Low)**: Cosmetic issue

### P0 Response Procedure

1. **Acknowledge** (Within 5 minutes)
   - Update status page
   - Notify team

2. **Assess** (Within 15 minutes)
   - Check health endpoints
   - Review error logs
   - Identify root cause

3. **Mitigate** (Within 30 minutes)
   - Rollback if necessary
   - Apply hotfix if possible
   - Scale resources if needed

4. **Resolve** (Within 2 hours)
   - Deploy fix
   - Verify resolution
   - Monitor for regression

5. **Post-Mortem** (Within 24 hours)
   - Document incident
   - Identify improvements
   - Implement preventions

### Emergency Contacts

- On-call engineer: [Contact info]
- Database admin: [Contact info]
- Infrastructure team: [Contact info]

## Maintenance Tasks

### Daily

```bash
# Check service health
curl https://yourdomain.com/api/health

# Review error logs
docker-compose logs app --tail=100 | grep ERROR

# Check disk space
df -h
```

### Weekly

```bash
# Database backup verification
ls -lh backups/ | head -5

# Review performance metrics
# (Check Sentry/Vercel dashboard)

# Update dependencies
npm audit
```

### Monthly

```bash
# Security audit
npm audit --production

# Database maintenance
docker-compose exec postgres vacuumdb -U gitcaster -d gitcaster -z

# Review and rotate logs
find logs/ -name "*.log" -mtime +30 -delete

# Update Docker images
docker-compose pull
docker-compose up -d
```

## Rollback Procedures

### Vercel Rollback

```bash
# List recent deployments
vercel list

# Rollback to previous
vercel rollback [deployment-url]
```

### Docker Rollback

```bash
# Pull specific version
docker pull ghcr.io/solswinters/gitcaster:v1.0.0

# Update docker-compose.yml with specific tag
# Then restart
docker-compose up -d
```

### Database Rollback

```bash
# Restore from backup
gunzip -c backups/gitcaster_backup_TIMESTAMP.sql.gz | \
  docker-compose exec -T postgres psql -U gitcaster

# Or use migration rollback
npx prisma migrate resolve --rolled-back MIGRATION_NAME
```

### Emergency Rollback

If all else fails:

```bash
# Stop services
docker-compose down

# Restore last known good backup
./scripts/restore-backup.sh TIMESTAMP

# Start services
docker-compose up -d

# Verify health
curl http://localhost:3000/api/health
```

## Contact Information

- **Primary On-Call**: [Your contact]
- **Secondary On-Call**: [Backup contact]
- **Escalation**: [Manager contact]
- **Vendor Support**: 
  - Vercel: support@vercel.com
  - Railway: support@railway.app
  - GitHub: support@github.com

## Additional Resources

- [Deployment Guide](./DEPLOYMENT.md)
- [Testing Guide](./TESTING.md)
- [Architecture Docs](../README.md)
- [API Documentation](./API.md)

