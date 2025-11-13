#!/bin/bash

# Advanced health check script for GitCaster
# Checks app, database, and external dependencies

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_URL="${APP_URL:-http://localhost:3000}"
MAX_RETRIES=3
RETRY_DELAY=2

echo "🏥 Running Health Checks for GitCaster"
echo "========================================"

# Function to check HTTP endpoint
check_http() {
    local url=$1
    local name=$2
    local retries=0
    
    while [ $retries -lt $MAX_RETRIES ]; do
        if response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null); then
            if [ "$response" -eq 200 ]; then
                echo -e "${GREEN}✓${NC} $name: OK (HTTP $response)"
                return 0
            fi
        fi
        
        retries=$((retries + 1))
        if [ $retries -lt $MAX_RETRIES ]; then
            echo -e "${YELLOW}⟳${NC} $name: Retry $retries/$MAX_RETRIES..."
            sleep $RETRY_DELAY
        fi
    done
    
    echo -e "${RED}✗${NC} $name: FAILED (HTTP ${response:-000})"
    return 1
}

# Function to check database connection
check_database() {
    echo -n "Checking database connection... "
    
    if [ -z "$DATABASE_URL" ]; then
        echo -e "${YELLOW}⚠${NC}  Skipped (DATABASE_URL not set)"
        return 0
    fi
    
    # Try to connect using psql if available
    if command -v psql &> /dev/null; then
        if psql "$DATABASE_URL" -c "SELECT 1" &> /dev/null; then
            echo -e "${GREEN}✓${NC} OK"
            return 0
        else
            echo -e "${RED}✗${NC} FAILED"
            return 1
        fi
    else
        echo -e "${YELLOW}⚠${NC}  Skipped (psql not available)"
        return 0
    fi
}

# Function to check Redis
check_redis() {
    echo -n "Checking Redis connection... "
    
    if [ -z "$REDIS_URL" ]; then
        echo -e "${YELLOW}⚠${NC}  Skipped (REDIS_URL not set)"
        return 0
    fi
    
    if command -v redis-cli &> /dev/null; then
        if redis-cli -u "$REDIS_URL" ping &> /dev/null; then
            echo -e "${GREEN}✓${NC} OK"
            return 0
        else
            echo -e "${RED}✗${NC} FAILED"
            return 1
        fi
    else
        echo -e "${YELLOW}⚠${NC}  Skipped (redis-cli not available)"
        return 0
    fi
}

# Function to check disk space
check_disk_space() {
    echo -n "Checking disk space... "
    
    local available=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
    
    if [ "$available" -lt 90 ]; then
        echo -e "${GREEN}✓${NC} OK (${available}% used)"
        return 0
    elif [ "$available" -lt 95 ]; then
        echo -e "${YELLOW}⚠${NC}  Warning (${available}% used)"
        return 0
    else
        echo -e "${RED}✗${NC} Critical (${available}% used)"
        return 1
    fi
}

# Function to check memory
check_memory() {
    echo -n "Checking memory usage... "
    
    if command -v free &> /dev/null; then
        local used=$(free | grep Mem | awk '{print int($3/$2 * 100)}')
        
        if [ "$used" -lt 80 ]; then
            echo -e "${GREEN}✓${NC} OK (${used}% used)"
            return 0
        elif [ "$used" -lt 90 ]; then
            echo -e "${YELLOW}⚠${NC}  Warning (${used}% used)"
            return 0
        else
            echo -e "${RED}✗${NC} Critical (${used}% used)"
            return 1
        fi
    else
        echo -e "${YELLOW}⚠${NC}  Skipped (free command not available)"
        return 0
    fi
}

# Run all checks
FAILED=0

# App health
check_http "$APP_URL/api/health" "Application health" || FAILED=$((FAILED + 1))

# Dependencies
check_database || FAILED=$((FAILED + 1))
check_redis || FAILED=$((FAILED + 1))

# System resources
check_disk_space || FAILED=$((FAILED + 1))
check_memory || FAILED=$((FAILED + 1))

echo ""
echo "========================================"

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All health checks passed${NC}"
    exit 0
else
    echo -e "${RED}✗ $FAILED health check(s) failed${NC}"
    exit 1
fi

