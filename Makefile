.PHONY: help install dev build start test lint format clean db-push db-generate

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	npm install

dev: ## Start development server
	npm run dev

build: ## Build for production
	npm run build

start: ## Start production server
	npm start

test: ## Run tests
	npm test

test-watch: ## Run tests in watch mode
	npm run test:watch

test-coverage: ## Generate test coverage
	npm run test:coverage

test-e2e: ## Run E2E tests
	npm run test:e2e

lint: ## Run linter
	npm run lint

format: ## Format code
	npm run format

type-check: ## Run TypeScript type checking
	npm run type-check

clean: ## Clean build artifacts
	rm -rf .next
	rm -rf node_modules
	rm -rf coverage

db-push: ## Push database schema
	npm run db:push

db-generate: ## Generate Prisma client
	npm run db:generate

db-studio: ## Open Prisma Studio
	npm run db:studio
