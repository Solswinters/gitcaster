#!/bin/bash

# Pre-commit hook for GitCaster
# Runs linting and type checking before commit

set -e

echo "🔍 Running pre-commit checks..."

# Lint staged files
echo "Linting..."
npm run lint --quiet

# Type check
echo "Type checking..."
npm run type-check

# Run unit tests
echo "Running tests..."
npm run test --silent

echo "✅ All pre-commit checks passed!"

