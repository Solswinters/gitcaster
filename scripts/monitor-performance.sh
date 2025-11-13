#!/bin/bash

# Performance monitoring script for GitCaster
# Tracks response times, error rates, and resource usage

set -e

# Configuration
APP_URL="${APP_URL:-http://localhost:3000}"
LOG_FILE="${LOG_FILE:-/tmp/gitcaster-performance.log}"
INTERVAL="${INTERVAL:-60}" # seconds

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "📊 GitCaster Performance Monitor"
echo "================================"
echo "Monitoring: $APP_URL"
echo "Interval: ${INTERVAL}s"
echo "Log file: $LOG_FILE"
echo ""

# Function to measure endpoint response time
measure_endpoint() {
    local endpoint=$1
    local url="${APP_URL}${endpoint}"
    
    # Measure time and get status code
    local start=$(date +%s%3N)
    local status=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
    local end=$(date +%s%3N)
    local duration=$((end - start))
    
    echo "${endpoint},${status},${duration}"
}

# Function to get system metrics
get_system_metrics() {
    local cpu_usage=0
    local mem_usage=0
    
    # CPU usage
    if command -v top &> /dev/null; then
        cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1 || echo "0")
    fi
    
    # Memory usage
    if command -v free &> /dev/null; then
        mem_usage=$(free | grep Mem | awk '{print int($3/$2 * 100)}')
    fi
    
    echo "${cpu_usage},${mem_usage}"
}

# Main monitoring loop
while true; do
    timestamp=$(date +"%Y-%m-%d %H:%M:%S")
    
    # Measure key endpoints
    health_metrics=$(measure_endpoint "/api/health")
    profile_metrics=$(measure_endpoint "/api/profile/test" || echo "/api/profile/test,000,0")
    search_metrics=$(measure_endpoint "/api/search" || echo "/api/search,000,0")
    
    # Get system metrics
    system_metrics=$(get_system_metrics)
    
    # Parse metrics
    health_status=$(echo "$health_metrics" | cut -d',' -f2)
    health_time=$(echo "$health_metrics" | cut -d',' -f3)
    
    search_status=$(echo "$search_metrics" | cut -d',' -f2)
    search_time=$(echo "$search_metrics" | cut -d',' -f3)
    
    cpu_usage=$(echo "$system_metrics" | cut -d',' -f1)
    mem_usage=$(echo "$system_metrics" | cut -d',' -f2)
    
    # Log to file
    echo "$timestamp,$health_status,$health_time,$search_status,$search_time,$cpu_usage,$mem_usage" >> "$LOG_FILE"
    
    # Display summary
    if [ "$health_status" -eq 200 ]; then
        health_color=$GREEN
    else
        health_color=$RED
    fi
    
    echo -e "[$timestamp] Health: ${health_color}${health_status}${NC} (${health_time}ms) | Search: ${search_time}ms | CPU: ${cpu_usage}% | Mem: ${mem_usage}%"
    
    # Alert on high response times
    if [ "$health_time" -gt 1000 ]; then
        echo -e "${RED}⚠ Warning: Health check took ${health_time}ms (>1s)${NC}"
    fi
    
    if [ "$search_time" -gt 500 ]; then
        echo -e "${YELLOW}⚠ Warning: Search took ${search_time}ms (>500ms)${NC}"
    fi
    
    sleep "$INTERVAL"
done

