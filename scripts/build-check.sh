#!/bin/bash

# Pre-deployment build check script

echo "🔍 Running pre-deployment checks..."

# Type check
echo "1️⃣ Type checking..."
npm run type-check
if [ $? -ne 0 ]; then
    echo "❌ Type check failed"
    exit 1
fi

# Lint
echo "2️⃣ Linting..."
npm run lint
if [ $? -ne 0 ]; then
    echo "❌ Lint check failed"
    exit 1
fi

# Tests
echo "3️⃣ Running tests..."
npm test
if [ $? -ne 0 ]; then
    echo "❌ Tests failed"
    exit 1
fi

# Build
echo "4️⃣ Building..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ All checks passed! Ready for deployment."

