#!/bin/bash
# Frontend test runner - runs Vitest tests and copies reports to test-reports/frontend
set -e

echo "=========================================="
echo "  EcomNature - Running Frontend Tests"
echo "=========================================="

cd frontend

# Run vitest tests
npx vitest run --reporter=verbose 2>&1 | tee ../test-reports/frontend/test-output.log

# Copy coverage reports
if [ -d "../test-reports/frontend/coverage" ]; then
  echo "✓ Coverage reports available at: test-reports/frontend/coverage/"
fi

# Generate a summary
echo ""
echo "=========================================="
echo "  Test Summary"
echo "=========================================="

# Count tests from output
TESTS_PASSED=$(grep -c '✓\|PASS' ../test-reports/frontend/test-output.log 2>/dev/null || echo 0)
TESTS_FAILED=$(grep -c '✗\|FAIL' ../test-reports/frontend/test-output.log 2>/dev/null || echo 0)

echo "  Test reports: test-reports/frontend/"
echo ""

if grep -q "FAILED\|failed" ../test-reports/frontend/test-output.log 2>/dev/null; then
  echo "⚠ Some tests FAILED. Check reports for details."
else
  echo "✓ All frontend tests PASSED!"
fi

echo "=========================================="

cd ..
