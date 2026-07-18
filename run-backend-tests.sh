#!/bin/bash
# Backend test runner - runs Maven tests and copies reports to test-reports/backend
set -e

echo "=========================================="
echo "  EcomNature - Running Backend Tests"
echo "=========================================="

cd backend

# Run tests with surefire plugin for XML + HTML reports
mvn clean test \
  -Dspring.profiles.active=test \
  -Dmaven.test.failure.ignore=true \
  2>&1 | tee ../test-reports/backend/test-output.log

# Copy surefire reports to central test-reports folder
if [ -d "target/surefire-reports" ]; then
  cp -r target/surefire-reports/* ../test-reports/backend/ 2>/dev/null || true
  echo "✓ Surefire reports copied to test-reports/backend"
fi

# Generate a summary
echo ""
echo "=========================================="
echo "  Test Summary"
echo "=========================================="
if [ -f "../test-reports/backend/TEST-com.ecom.backend.*.xml" ]; then
  echo "✓ Test reports available at: test-reports/backend/"
fi

# Count tests from output
TESTS_RUN=$(grep -oP 'Tests run: \K\d+' ../test-reports/backend/test-output.log 2>/dev/null | awk '{s+=$1} END {print s}')
FAILURES=$(grep -oP 'Failures: \K\d+' ../test-reports/backend/test-output.log 2>/dev/null | awk '{s+=$1} END {print s}')
ERRORS=$(grep -oP 'Errors: \K\d+' ../test-reports/backend/test-output.log 2>/dev/null | awk '{s+=$1} END {print s}')

echo ""
echo "  Tests Run: ${TESTS_RUN:-0}"
echo "  Failures:  ${FAILURES:-0}"
echo "  Errors:    ${ERRORS:-0}"
echo ""

if [ -n "$FAILURES" ] && [ "$FAILURES" -gt 0 ] || [ -n "$ERRORS" ] && [ "$ERRORS" -gt 0 ]; then
  echo "⚠ Some tests FAILED. Check reports for details."
else
  echo "✓ All backend tests PASSED!"
fi

echo "=========================================="

cd ..
