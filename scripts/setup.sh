#!/bin/bash

# Setup script for GitCaster development environment

echo "🚀 Setting up GitCaster development environment..."

# Check Node.js version
NODE_VERSION=$(node -v)
echo "✓ Node.js version: $NODE_VERSION"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run db:generate

# Copy environment file if it doesn't exist
if [ ! -f .env.local ]; then
    if [ -f .env.example ]; then
        echo "📝 Creating .env.local from .env.example..."
        cp .env.example .env.local
        echo "⚠️  Please update .env.local with your actual values"
    fi
fi

# Setup Git hooks
echo "🔗 Setting up Git hooks..."
npx husky install

echo "✅ Setup complete! Run 'npm run dev' to start the development server."

