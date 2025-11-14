#!/bin/bash

# Generate test coverage report

echo "🧪 Running tests with coverage..."

npm run test:coverage

echo "📊 Coverage report generated!"
echo "Open coverage/lcov-report/index.html to view the detailed report"

