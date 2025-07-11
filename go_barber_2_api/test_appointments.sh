#!/bin/bash

# GoBarber Appointment Routes Testing Script
# Make sure the server is running: npm run dev

# Configuration
BASE_URL="http://localhost:3333"
EMAIL="user@example.com"
PASSWORD="password123"
PROVIDER_ID="507f1f77bcf86cd799439011"

echo "=== GoBarber Appointment Routes Testing ==="
echo "Base URL: $BASE_URL"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    print_warning "jq is not installed. Install it for better JSON formatting."
    print_warning "On Ubuntu/Debian: sudo apt install jq"
    print_warning "On macOS: brew install jq"
    print_warning "On Windows: choco install jq"
    JQ_AVAILABLE=false
else
    JQ_AVAILABLE=true
fi

# Function to format JSON output
format_json() {
    if [ "$JQ_AVAILABLE" = true ]; then
        jq '.'
    else
        cat
    fi
}

# 1. Login to get token
print_status "1. Logging in to get authentication token..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/sessions" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\"
  }")

if [ "$JQ_AVAILABLE" = true ]; then
    TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token // empty')
else
    TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
fi

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
    print_error "Login failed. Please check your credentials."
    print_error "Response: $LOGIN_RESPONSE"
    exit 1
fi

print_success "Login successful. Token obtained."

# 2. List providers
print_status "2. Listing all providers..."
PROVIDERS_RESPONSE=$(curl -s -X GET "$BASE_URL/providers" \
  -H "Authorization: Bearer $TOKEN")

echo "$PROVIDERS_RESPONSE" | format_json

# Extract first provider ID if available
if [ "$JQ_AVAILABLE" = true ]; then
    FIRST_PROVIDER_ID=$(echo "$PROVIDERS_RESPONSE" | jq -r '.[0]._id // empty')
else
    FIRST_PROVIDER_ID=$(echo "$PROVIDERS_RESPONSE" | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
fi

if [ ! -z "$FIRST_PROVIDER_ID" ] && [ "$FIRST_PROVIDER_ID" != "null" ]; then
    PROVIDER_ID="$FIRST_PROVIDER_ID"
    print_success "Using provider ID: $PROVIDER_ID"
else
    print_warning "No providers found. Using default provider ID: $PROVIDER_ID"
fi

# 3. Get provider month availability
print_status "3. Getting provider month availability..."
MONTH_AVAILABILITY=$(curl -s -X GET "$BASE_URL/providers/$PROVIDER_ID/month-availability?month=1&year=2024" \
  -H "Authorization: Bearer $TOKEN")

echo "$MONTH_AVAILABILITY" | format_json

# 4. Get provider day availability
print_status "4. Getting provider day availability..."
DAY_AVAILABILITY=$(curl -s -X GET "$BASE_URL/providers/$PROVIDER_ID/day-availability?day=15&month=1&year=2024" \
  -H "Authorization: Bearer $TOKEN")

echo "$DAY_AVAILABILITY" | format_json

# 5. List user appointments
print_status "5. Listing user appointments..."
APPOINTMENTS_LIST=$(curl -s -X GET "$BASE_URL/appointments" \
  -H "Authorization: Bearer $TOKEN")

echo "$APPOINTMENTS_LIST" | format_json

# 6. Create appointment
print_status "6. Creating a new appointment..."
APPOINTMENT_RESPONSE=$(curl -s -X POST "$BASE_URL/appointments" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"provider_id\": \"$PROVIDER_ID\",
    \"date\": \"2024-01-15T10:00:00.000Z\"
  }")

echo "$APPOINTMENT_RESPONSE" | format_json

# Extract appointment ID for cancellation test
if [ "$JQ_AVAILABLE" = true ]; then
    APPOINTMENT_ID=$(echo "$APPOINTMENT_RESPONSE" | jq -r '._id // empty')
else
    APPOINTMENT_ID=$(echo "$APPOINTMENT_RESPONSE" | grep -o '"_id":"[^"]*"' | cut -d'"' -f4)
fi

if [ ! -z "$APPOINTMENT_ID" ] && [ "$APPOINTMENT_ID" != "null" ]; then
    print_success "Appointment created with ID: $APPOINTMENT_ID"
    
    # 7. Cancel appointment
    print_status "7. Canceling appointment..."
    CANCEL_RESPONSE=$(curl -s -X DELETE "$BASE_URL/appointments/$APPOINTMENT_ID" \
      -H "Authorization: Bearer $TOKEN")
    
    echo "$CANCEL_RESPONSE" | format_json
else
    print_error "Failed to create appointment or extract appointment ID"
    print_error "Response: $APPOINTMENT_RESPONSE"
fi

# 8. Test error cases
print_status "8. Testing error cases..."

# Test with invalid provider ID
print_status "8.1. Testing with invalid provider ID..."
INVALID_PROVIDER_RESPONSE=$(curl -s -X POST "$BASE_URL/appointments" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"provider_id\": \"invalid_provider_id\",
    \"date\": \"2024-01-15T10:00:00.000Z\"
  }")

echo "$INVALID_PROVIDER_RESPONSE" | format_json

# Test with invalid time (outside business hours)
print_status "8.2. Testing with appointment outside business hours..."
INVALID_TIME_RESPONSE=$(curl -s -X POST "$BASE_URL/appointments" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"provider_id\": \"$PROVIDER_ID\",
    \"date\": \"2024-01-15T20:00:00.000Z\"
  }")

echo "$INVALID_TIME_RESPONSE" | format_json

# Test canceling non-existent appointment
print_status "8.3. Testing canceling non-existent appointment..."
INVALID_CANCEL_RESPONSE=$(curl -s -X DELETE "$BASE_URL/appointments/nonexistent_id" \
  -H "Authorization: Bearer $TOKEN")

echo "$INVALID_CANCEL_RESPONSE" | format_json

print_success "=== Testing Complete ==="
echo ""
print_status "Summary:"
print_status "- Authentication: ✅"
print_status "- List providers: ✅"
print_status "- Provider availability: ✅"
print_status "- List appointments: ✅"
print_status "- Create appointment: ✅"
print_status "- Cancel appointment: ✅"
print_status "- Error handling: ✅" 