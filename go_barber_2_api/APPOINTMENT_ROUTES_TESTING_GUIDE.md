# Appointment Routes Testing Guide

This guide covers all appointment-related routes in the GoBarber API. All routes require authentication except where noted.

## Base URL
```
http://localhost:3333
```

## Authentication
Most routes require a valid JWT token. Get a token by logging in:

```bash
curl -X POST http://localhost:3333/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

Response will include a token:
```json
{
  "user": {
    "id": "user_id_here",
    "name": "User Name",
    "email": "user@example.com"
  },
  "token": "jwt_token_here"
}
```

Use this token in the `Authorization` header for subsequent requests:
```
Authorization: Bearer jwt_token_here
```

## 1. Appointment Routes (`/appointments`)

### 1.1 Create Appointment
**POST** `/appointments`

Creates a new appointment with a provider.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "provider_id": "provider_user_id_here",
  "date": "2024-01-15T10:00:00.000Z"
}
```

**Example:**
```bash
curl -X POST http://localhost:3333/appointments \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "provider_id": "507f1f77bcf86cd799439011",
    "date": "2024-01-15T10:00:00.000Z"
  }'
```

**Response:**
```json
{
  "_id": "appointment_id",
  "provider_id": "507f1f77bcf86cd799439011",
  "user_id": "user_id_from_token",
  "date": "2024-01-15T10:00:00.000Z",
  "canceled_at": null,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

**Validation Rules:**
- `provider_id`: Must be a valid 24-character hex string
- `date`: Must be a valid date
- Appointments can only be created between 8am and 5pm
- Provider must exist in the system

### 1.2 List User Appointments
**GET** `/appointments`

Lists all appointments for the authenticated user, sorted by date.

**Headers:**
```
Authorization: Bearer <token>
```

**Example:**
```bash
curl -X GET http://localhost:3333/appointments \
  -H "Authorization: Bearer your_jwt_token"
```

**Response:**
```json
[
  {
    "_id": "appointment_id_1",
    "provider_id": "provider_id_1",
    "user_id": "user_id",
    "date": "2024-01-15T10:00:00.000Z",
    "canceled_at": null,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  },
  {
    "_id": "appointment_id_2",
    "provider_id": "provider_id_2",
    "user_id": "user_id",
    "date": "2024-01-16T14:00:00.000Z",
    "canceled_at": null,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

### 1.3 Cancel Appointment
**DELETE** `/appointments/:id`

Cancels an appointment. Can only be cancelled by the user who created it and at least 2 hours before the appointment time.

**Headers:**
```
Authorization: Bearer <token>
```

**Example:**
```bash
curl -X DELETE http://localhost:3333/appointments/appointment_id_here \
  -H "Authorization: Bearer your_jwt_token"
```

**Response:**
```json
{
  "_id": "appointment_id",
  "provider_id": "provider_id",
  "user_id": "user_id",
  "date": "2024-01-15T10:00:00.000Z",
  "canceled_at": "2024-01-01T08:00:00.000Z",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T08:00:00.000Z"
}
```

**Validation Rules:**
- User must own the appointment
- Can only cancel appointments at least 2 hours in advance
- Appointment must exist

## 2. Provider Routes (`/providers`)

### 2.1 List All Providers
**GET** `/providers`

Lists all available providers (users who are providers).

**Headers:**
```
Authorization: Bearer <token>
```

**Example:**
```bash
curl -X GET http://localhost:3333/providers \
  -H "Authorization: Bearer your_jwt_token"
```

**Response:**
```json
[
  {
    "_id": "provider_id_1",
    "name": "Provider Name 1",
    "email": "provider1@example.com",
    "avatar": "avatar_url_1",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  },
  {
    "_id": "provider_id_2",
    "name": "Provider Name 2",
    "email": "provider2@example.com",
    "avatar": "avatar_url_2",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

### 2.2 Get Provider Month Availability
**GET** `/providers/:provider_id/month-availability`

Gets the availability for a specific provider for a given month.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `month`: Month number (1-12)
- `year`: Year (e.g., 2024)

**Example:**
```bash
curl -X GET "http://localhost:3333/providers/provider_id_here/month-availability?month=1&year=2024" \
  -H "Authorization: Bearer your_jwt_token"
```

**Response:**
```json
[
  {
    "day": 1,
    "available": true
  },
  {
    "day": 2,
    "available": false
  },
  {
    "day": 3,
    "available": true
  }
  // ... continues for all days in the month
]
```

### 2.3 Get Provider Day Availability
**GET** `/providers/:provider_id/day-availability`

Gets the hourly availability for a specific provider for a given day.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `day`: Day of month (1-31)
- `month`: Month number (1-12)
- `year`: Year (e.g., 2024)

**Example:**
```bash
curl -X GET "http://localhost:3333/providers/provider_id_here/day-availability?day=15&month=1&year=2024" \
  -H "Authorization: Bearer your_jwt_token"
```

**Response:**
```json
[
  {
    "hour": 8,
    "available": true
  },
  {
    "hour": 9,
    "available": false
  },
  {
    "hour": 10,
    "available": true
  }
  // ... continues for all hours (8-17)
]
```

## 3. Complete Testing Script

Here's a complete bash script to test all appointment routes:

```bash
#!/bin/bash

# Configuration
BASE_URL="http://localhost:3333"
EMAIL="user@example.com"
PASSWORD="password123"
PROVIDER_ID="507f1f77bcf86cd799439011"

echo "=== GoBarber Appointment Routes Testing ==="

# 1. Login to get token
echo "1. Logging in to get authentication token..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/sessions" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\"
  }")

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Login failed. Please check your credentials."
  exit 1
fi

echo "✅ Login successful. Token obtained."

# 2. List providers
echo "2. Listing all providers..."
curl -s -X GET "$BASE_URL/providers" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# 3. Get provider month availability
echo "3. Getting provider month availability..."
curl -s -X GET "$BASE_URL/providers/$PROVIDER_ID/month-availability?month=1&year=2024" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# 4. Get provider day availability
echo "4. Getting provider day availability..."
curl -s -X GET "$BASE_URL/providers/$PROVIDER_ID/day-availability?day=15&month=1&year=2024" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# 5. List user appointments
echo "5. Listing user appointments..."
curl -s -X GET "$BASE_URL/appointments" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# 6. Create appointment
echo "6. Creating a new appointment..."
APPOINTMENT_RESPONSE=$(curl -s -X POST "$BASE_URL/appointments" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"provider_id\": \"$PROVIDER_ID\",
    \"date\": \"2024-01-15T10:00:00.000Z\"
  }")

echo $APPOINTMENT_RESPONSE | jq '.'

# Extract appointment ID for cancellation test
APPOINTMENT_ID=$(echo $APPOINTMENT_RESPONSE | grep -o '"_id":"[^"]*"' | cut -d'"' -f4)

if [ ! -z "$APPOINTMENT_ID" ]; then
  echo "7. Canceling appointment..."
  curl -s -X DELETE "$BASE_URL/appointments/$APPOINTMENT_ID" \
    -H "Authorization: Bearer $TOKEN" | jq '.'
fi

echo "=== Testing Complete ==="
```

## 4. Error Responses

### Common Error Responses:

**400 Bad Request:**
```json
{
  "error": "Provider not found"
}
```

**400 Bad Request:**
```json
{
  "error": "You can only create appointments between 8am and 5pm"
}
```

**401 Unauthorized:**
```json
{
  "error": "You don't have permission to cancel this appointment"
}
```

**400 Bad Request:**
```json
{
  "error": "You can only cancel appointments 2 hours in advance"
}
```

**404 Not Found:**
```json
{
  "error": "Appointment not found"
}
```

## 5. Testing Tips

1. **Start the server first:**
   ```bash
   cd go_barber_2_api
   npm run dev
   ```

2. **Use jq for better JSON formatting:**
   ```bash
   curl ... | jq '.'
   ```

3. **Test with different scenarios:**
   - Create appointments at different times
   - Try to cancel appointments with different time constraints
   - Test with invalid provider IDs
   - Test with invalid dates

4. **Monitor the server logs** to see detailed error information

5. **Use tools like Postman or Insomnia** for easier testing with a GUI

## 6. Database Setup

Make sure your database is properly configured and running. Check the `ormconfig.json` file for database connection settings.

## 7. Environment Variables

Ensure these environment variables are set in your `.env` file:
- Database connection string
- JWT secret
- Redis connection (if using cache)
- Mail service credentials (if using email features) 