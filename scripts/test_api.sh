#!/bin/bash
# Simple API test script for LexiKor

set -e

API_URL="${API_URL:-http://localhost:8000}"
echo "🧪 Testing LexiKor API at $API_URL"
echo "=================================="

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Test health endpoint
echo -e "\n${BLUE}1. Testing Health Endpoint${NC}"
response=$(curl -s "$API_URL/health")
echo "$response" | jq '.'

# Test register endpoint
echo -e "\n${BLUE}2. Testing User Registration${NC}"
register_data='{
  "email": "testuser@example.com",
  "password": "testpass123",
  "full_name": "Test User"
}'

register_response=$(curl -s -X POST "$API_URL/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d "$register_data" 2>&1 || echo '{"error": "Registration failed"}')

echo "$register_response" | jq '.'

# Test login endpoint
echo -e "\n${BLUE}3. Testing User Login${NC}"
login_response=$(curl -s -X POST "$API_URL/api/v1/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test@example.com&password=test1234" 2>&1 || echo '{"error": "Login failed"}')

echo "$login_response" | jq '.'

# Extract access token
ACCESS_TOKEN=$(echo "$login_response" | jq -r '.access_token // empty')

if [ -n "$ACCESS_TOKEN" ]; then
    echo -e "${GREEN}✓ Login successful, token obtained${NC}"

    # Test authenticated endpoint
    echo -e "\n${BLUE}4. Testing Authenticated Endpoint (/me)${NC}"
    me_response=$(curl -s "$API_URL/api/v1/auth/me" \
      -H "Authorization: Bearer $ACCESS_TOKEN")
    echo "$me_response" | jq '.'

    # Test templates endpoint
    echo -e "\n${BLUE}5. Testing Templates Endpoint${NC}"
    templates_response=$(curl -s "$API_URL/api/v1/templates/" \
      -H "Authorization: Bearer $ACCESS_TOKEN")
    echo "$templates_response" | jq '.'

    # Test research endpoint
    echo -e "\n${BLUE}6. Testing Research Endpoint (Cases)${NC}"
    cases_response=$(curl -s -X POST "$API_URL/api/v1/research/cases/search" \
      -H "Authorization: Bearer $ACCESS_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"query": "손해배상", "limit": 5}')
    echo "$cases_response" | jq '.'

else
    echo -e "${RED}✗ Login failed, skipping authenticated tests${NC}"
fi

echo -e "\n${GREEN}API tests completed!${NC}"
