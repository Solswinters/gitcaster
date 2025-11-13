#!/bin/bash

# Deployment script for GitCaster
# Handles deployment to staging or production

set -e

ENVIRONMENT=${1:-staging}

echo "🚀 Deploying GitCaster to $ENVIRONMENT..."
echo ""

# Validate environment
if [ "$ENVIRONMENT" != "staging" ] && [ "$ENVIRONMENT" != "production" ]; then
  echo "❌ Error: Environment must be 'staging' or 'production'"
  exit 1
fi

# Check if we're on the right branch
if [ "$ENVIRONMENT" = "production" ]; then
  BRANCH="main"
else
  BRANCH="develop"
fi

CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "$BRANCH" ]; then
  echo "❌ Error: Must be on $BRANCH branch for $ENVIRONMENT deployment"
  echo "Current branch: $CURRENT_BRANCH"
  exit 1
fi

# Pre-deployment checks
echo "📋 Running pre-deployment checks..."

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
  echo "❌ Error: There are uncommitted changes"
  exit 1
fi

# Run tests
echo "🧪 Running tests..."
npm run test:ci

# Run linter
echo "🔍 Running linter..."
npm run lint

# Type check
echo "📝 Running type check..."
npm run type-check

# Build
echo "🔨 Building application..."
npm run build

# Backup database (production only)
if [ "$ENVIRONMENT" = "production" ]; then
  echo "💾 Creating database backup..."
  npm run backup || echo "⚠️  Backup failed (continuing anyway)"
fi

# Deploy
echo "🚀 Deploying to $ENVIRONMENT..."

if [ "$ENVIRONMENT" = "production" ]; then
  # Production deployment
  vercel --prod --yes
else
  # Staging deployment
  vercel --yes
fi

# Run migrations
echo "🗄️  Running database migrations..."
if [ "$ENVIRONMENT" = "production" ]; then
  DATABASE_URL="$PRODUCTION_DATABASE_URL" npx prisma migrate deploy
else
  DATABASE_URL="$STAGING_DATABASE_URL" npx prisma migrate deploy
fi

# Health check
echo "🏥 Running health check..."
sleep 10 # Wait for deployment to be ready

if [ "$ENVIRONMENT" = "production" ]; then
  HEALTH_URL="$PRODUCTION_URL/api/health"
else
  HEALTH_URL="$STAGING_URL/api/health"
fi

if curl -f "$HEALTH_URL" &> /dev/null; then
  echo "✅ Health check passed!"
else
  echo "❌ Health check failed!"
  exit 1
fi

# Notify deployment
echo ""
echo "=" | tr '=' '='
echo "✅ Deployment to $ENVIRONMENT successful!"
echo "=" | tr '=' '='

# Display deployment info
if [ "$ENVIRONMENT" = "production" ]; then
  echo "URL: $PRODUCTION_URL"
else
  echo "URL: $STAGING_URL"
fi

echo ""
echo "Next steps:"
echo "1. Test the deployment manually"
echo "2. Monitor error tracking dashboard"
echo "3. Check performance metrics"

