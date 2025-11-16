#!/bin/bash
# Health check script for LexiKor services

set -e

echo "🏥 LexiKor Health Check"
echo "======================"

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_service() {
    local service_name=$1
    local url=$2
    local expected_code=${3:-200}

    echo -n "Checking $service_name... "

    response_code=$(curl -s -o /dev/null -w "%{http_code}" $url 2>/dev/null || echo "000")

    if [ "$response_code" = "$expected_code" ]; then
        echo -e "${GREEN}✓ OK${NC} (HTTP $response_code)"
        return 0
    else
        echo -e "${RED}✗ FAILED${NC} (HTTP $response_code)"
        return 1
    fi
}

# Check PostgreSQL
echo -n "Checking PostgreSQL... "
if pg_isready -h localhost -p 5432 -U lexikor >/dev/null 2>&1; then
    echo -e "${GREEN}✓ OK${NC}"
else
    echo -e "${RED}✗ FAILED${NC}"
fi

# Check Redis
echo -n "Checking Redis... "
if redis-cli -h localhost -p 6379 ping >/dev/null 2>&1; then
    echo -e "${GREEN}✓ OK${NC}"
else
    echo -e "${RED}✗ FAILED${NC}"
fi

# Check Backend API
check_service "Backend API" "http://localhost:8000/health"

# Check Frontend
check_service "Frontend" "http://localhost:3000"

# Check API Documentation
check_service "API Docs" "http://localhost:8000/docs"

echo ""
echo "Health check completed!"
