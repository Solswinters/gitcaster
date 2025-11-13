#!/bin/bash

# Run load tests with k6

set -e

echo "🚀 Running Load Tests"
echo "===================="

# Check if k6 is installed
if ! command -v k6 &> /dev/null; then
    echo "❌ k6 is not installed"
    echo "Install it from: https://k6.io/docs/getting-started/installation/"
    exit 1
fi

# Configuration
BASE_URL="${BASE_URL:-http://localhost:3000}"
TEST_FILE="${1:-tests/load/k6-load-test.js}"

echo "Base URL: $BASE_URL"
echo "Test file: $TEST_FILE"
echo ""

# Run k6 tests
k6 run --env BASE_URL="$BASE_URL" "$TEST_FILE"

echo ""
echo "✅ Load tests complete"

