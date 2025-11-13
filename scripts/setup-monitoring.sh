#!/bin/bash

# Monitoring setup script for GitCaster
# Sets up error tracking, performance monitoring, and logging

set -e

echo "🔧 Setting up monitoring for GitCaster..."

# Check if required environment variables are set
if [ -z "$SENTRY_DSN" ]; then
  echo "⚠️  Warning: SENTRY_DSN not set. Error tracking will be disabled."
fi

# Install Sentry SDK for Next.js
echo "📦 Installing Sentry..."
npm install --save @sentry/nextjs

# Initialize Sentry
echo "🎯 Initializing Sentry..."
npx @sentry/wizard@latest -i nextjs

echo "✅ Monitoring setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure Sentry in sentry.client.config.ts and sentry.server.config.ts"
echo "2. Add SENTRY_DSN to your .env file"
echo "3. Add SENTRY_AUTH_TOKEN for release tracking"
echo "4. Deploy and monitor errors at https://sentry.io"

