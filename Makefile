.PHONY: help install dev build test lint format clean docker-up docker-down migrate backup

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	npm install
	npx prisma generate

dev: ## Start development server
	npm run dev

build: ## Build for production
	npm run build

test: ## Run all tests
	npm run test:ci
	npm run test:e2e

lint: ## Run linter and type check
	npm run lint
	npm run type-check

format: ## Format code with Prettier
	npx prettier --write "src/**/*.{ts,tsx,js,jsx,json,css}"

clean: ## Clean build artifacts
	rm -rf .next
	rm -rf node_modules
	rm -rf coverage
	rm -rf playwright-report

docker-up: ## Start Docker containers
	docker-compose up -d

docker-down: ## Stop Docker containers
	docker-compose down

docker-logs: ## View Docker logs
	docker-compose logs -f

docker-build: ## Build Docker image
	docker build -t gitcaster:latest .

migrate: ## Run database migrations
	npx prisma migrate deploy

migrate-dev: ## Run database migrations (dev)
	npx prisma migrate dev

backup: ## Create database backup
	./scripts/backup-database.sh

validate-env: ## Validate environment variables
	npm run validate-env

setup: ## Complete development setup
	npm install
	npx prisma generate
	npx prisma migrate dev
	npm run validate-env

prod-setup: ## Production setup
	npm ci
	npx prisma generate
	npx prisma migrate deploy

k8s-apply: ## Apply Kubernetes manifests
	kubectl apply -f k8s/configmap.yaml
	kubectl apply -f k8s/secrets.yaml
	kubectl apply -f k8s/deployment.yaml

k8s-delete: ## Delete Kubernetes resources
	kubectl delete -f k8s/deployment.yaml
	kubectl delete -f k8s/secrets.yaml
	kubectl delete -f k8s/configmap.yaml

deploy-staging: ## Deploy to staging
	vercel --prod

deploy-production: ## Deploy to production
	vercel --prod

health-check: ## Check application health
	curl -f http://localhost:3000/api/health || exit 1

