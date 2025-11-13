#!/bin/bash

# Development environment setup script
# Run this script to set up GitCaster for local development

set -e

echo "🚀 Setting up GitCaster development environment..."
echo ""

# Check Node.js version
echo "📋 Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "❌ Error: Node.js 18+ is required (current: v$NODE_VERSION)"
  exit 1
fi
echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Check for .env file
echo ""
if [ ! -f .env ]; then
  echo "⚠️  No .env file found. Creating from .env.example..."
  if [ -f .env.example ]; then
    cp .env.example .env
    echo "✅ Created .env file"
    echo "⚠️  Please edit .env and fill in your values"
  else
    echo "❌ .env.example not found. Please create .env manually"
  fi
else
  echo "✅ .env file exists"
fi

# Validate environment
echo ""
echo "🔍 Validating environment variables..."
npm run validate-env

# Setup database
echo ""
echo "🗄️  Setting up database..."
read -p "Do you want to start PostgreSQL with Docker? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  docker-compose up -d postgres
  echo "⏳ Waiting for PostgreSQL to be ready..."
  sleep 5
  echo "✅ PostgreSQL is running"
fi

# Generate Prisma client
echo ""
echo "🔧 Generating Prisma client..."
npx prisma generate

# Run migrations
echo ""
read -p "Do you want to run database migrations? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  npx prisma migrate dev
  echo "✅ Database migrations complete"
fi

# Install Playwright browsers
echo ""
read -p "Do you want to install Playwright browsers for E2E testing? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  npx playwright install --with-deps
  echo "✅ Playwright browsers installed"
fi

# Setup Git hooks
echo ""
echo "🪝 Setting up Git hooks..."
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
# Pre-commit hook: Run linter and type check

echo "🔍 Running pre-commit checks..."

# Run linter
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ Linting failed. Please fix errors before committing."
  exit 1
fi

# Run type check
npm run type-check
if [ $? -ne 0 ]; then
  echo "❌ Type check failed. Please fix errors before committing."
  exit 1
fi

echo "✅ Pre-commit checks passed!"
EOF
chmod +x .git/hooks/pre-commit
echo "✅ Git hooks configured"

# Final summary
echo ""
echo "=" | tr '=' '='
echo "🎉 Development environment setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env and add your configuration values"
echo "2. Start the development server: npm run dev"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "Useful commands:"
echo "  make dev          - Start development server"
echo "  make test         - Run all tests"
echo "  make docker-up    - Start all services with Docker"
echo ""
echo "For more information, see README.md"

