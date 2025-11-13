#!/bin/bash

# Health check script for GitCaster
# Checks all services and endpoints

set -e

echo "🏥 Running health checks for GitCaster..."
echo ""

# Configuration
URL="${APP_URL:-http://localhost:3000}"
TIMEOUT=5

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_endpoint() {
  local endpoint=$1
  local expected_status=$2
  local name=$3
  
  echo -n "Checking $name... "
  
  response=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT "$URL$endpoint" || echo "000")
  
  if [ "$response" = "$expected_status" ]; then
    echo -e "${GREEN}✓${NC} ($response)"
    return 0
  else
    echo -e "${RED}✗${NC} (got $response, expected $expected_status)"
    return 1
  fi
}

check_docker_service() {
  local service=$1
  
  echo -n "Checking Docker service: $service... "
  
  if docker-compose ps | grep -q "$service.*Up"; then
    echo -e "${GREEN}✓${NC}"
    return 0
  else
    echo -e "${RED}✗${NC}"
    return 1
  fi
}

# Track overall status
overall_status=0

# Check endpoints
echo "📡 Checking API endpoints:"
check_endpoint "/api/health" "200" "Health endpoint" || overall_status=1
check_endpoint "/" "200" "Homepage" || overall_status=1

# Check Docker services if running
if command -v docker-compose &> /dev/null; then
  echo ""
  echo "🐳 Checking Docker services:"
  
  if docker-compose ps &> /dev/null; then
    check_docker_service "app" || overall_status=1
    check_docker_service "postgres" || overall_status=1
    check_docker_service "redis" || overall_status=1
  else
    echo -e "${YELLOW}⚠${NC} Docker Compose not running"
  fi
fi

# Check database connection
echo ""
echo "🗄️  Checking database:"
if npx prisma db execute --stdin <<< "SELECT 1;" &> /dev/null; then
  echo -e "Database connection: ${GREEN}✓${NC}"
else
  echo -e "Database connection: ${RED}✗${NC}"
  overall_status=1
fi

# Summary
echo ""
echo "=" | tr '=' '='
if [ $overall_status -eq 0 ]; then
  echo -e "${GREEN}✅ All health checks passed!${NC}"
else
  echo -e "${RED}❌ Some health checks failed!${NC}"
fi
echo "=" | tr '=' '='

exit $overall_status

