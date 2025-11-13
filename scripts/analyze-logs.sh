#!/bin/bash

# Log analysis script for GitCaster
# Analyzes performance logs and generates reports

set -e

LOG_FILE="${1:-/tmp/gitcaster-performance.log}"

if [ ! -f "$LOG_FILE" ]; then
    echo "❌ Log file not found: $LOG_FILE"
    exit 1
fi

echo "📈 GitCaster Log Analysis"
echo "========================="
echo "Analyzing: $LOG_FILE"
echo ""

# Count total requests
total_requests=$(wc -l < "$LOG_FILE")
echo "Total requests: $total_requests"

# Calculate average response times
avg_health=$(awk -F',' '{sum+=$3; count++} END {if (count>0) print sum/count; else print 0}' "$LOG_FILE")
avg_search=$(awk -F',' '{sum+=$5; count++} END {if (count>0) print sum/count; else print 0}' "$LOG_FILE")

echo ""
echo "Average Response Times:"
echo "  Health endpoint: ${avg_health}ms"
echo "  Search endpoint: ${avg_search}ms"

# Count errors (non-200 status codes)
health_errors=$(awk -F',' '$2 != 200 {print}' "$LOG_FILE" | wc -l)
search_errors=$(awk -F',' '$4 != 200 {print}' "$LOG_FILE" | wc -l)

echo ""
echo "Error Counts:"
echo "  Health endpoint: $health_errors"
echo "  Search endpoint: $search_errors"

# Find slowest requests
echo ""
echo "Slowest Health Requests:"
sort -t',' -k3 -rn "$LOG_FILE" | head -5 | awk -F',' '{print "  "$1" - "$3"ms (status: "$2")"}'

echo ""
echo "Slowest Search Requests:"
sort -t',' -k5 -rn "$LOG_FILE" | head -5 | awk -F',' '{print "  "$1" - "$5"ms (status: "$4")"}'

# Resource usage stats
avg_cpu=$(awk -F',' '{sum+=$6; count++} END {if (count>0) print sum/count; else print 0}' "$LOG_FILE")
avg_mem=$(awk -F',' '{sum+=$7; count++} END {if (count>0) print sum/count; else print 0}' "$LOG_FILE")

echo ""
echo "Average Resource Usage:"
echo "  CPU: ${avg_cpu}%"
echo "  Memory: ${avg_mem}%"

# Generate alert summary
echo ""
echo "Alert Summary:"

slow_health=$(awk -F',' '$3 > 1000 {print}' "$LOG_FILE" | wc -l)
slow_search=$(awk -F',' '$5 > 500 {print}' "$LOG_FILE" | wc -l)

if [ "$slow_health" -gt 0 ]; then
    echo "  ⚠ $slow_health health checks exceeded 1s"
fi

if [ "$slow_search" -gt 0 ]; then
    echo "  ⚠ $slow_search searches exceeded 500ms"
fi

if [ "$health_errors" -gt 0 ] || [ "$search_errors" -gt 0 ]; then
    echo "  ❌ Total errors: $((health_errors + search_errors))"
fi

echo ""
echo "✅ Analysis complete"

