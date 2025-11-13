#!/bin/bash

# Post-deployment verification script

set -e

DEPLOY_URL="${1:-http://localhost:3000}"

echo "🔍 Running post-deployment checks..."
echo "Target: $DEPLOY_URL"

# Check health endpoint
echo "Checking health endpoint..."
if curl -f -s "$DEPLOY_URL/api/health" > /dev/null; then
    echo "✅ Health check passed"
else
    echo "❌ Health check failed"
    exit 1
fi

# Check main pages
for page in "/" "/search" "/discover"; do
    echo "Checking $page..."
    if curl -f -s "$DEPLOY_URL$page" > /dev/null; then
        echo "✅ $page is accessible"
    else
        echo "❌ $page is not accessible"
        exit 1
    fi
done

echo "✅ All post-deployment checks passed!"

