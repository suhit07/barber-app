# GoBarber 2.0 API

This is the backend API for the GoBarber 2.0 application, a barbershop scheduling system.

## 🚀 Getting Started

### Prerequisites

- Node.js
- MongoDB
- Redis (for caching)

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Copy the environment file:
```bash
cp .env.example .env
```
4. Configure your environment variables in `.env`
5. Run the application:
```bash
yarn dev:server
```

## 📚 API Documentation

### Authentication

All routes marked with 🔒 require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-token>
```

### Routes

#### Users

| Method | Route | Description | Auth Required |
|--------|-------|-------------|---------------|
| POST | `/users` | Create a new user | No |
| PUT | `/users` | Update user | 🔒 |
| GET | `/users/profile` | Get user profile | 🔒 |
| DELETE | `/users/avatar` | Delete user avatar | 🔒 |

**Create User Schema:**
```json
{
  "name": "string",
  "email": "string (email)",
  "password": "string",
  "password_confirmation": "string (must match password)"
}
```

#### Sessions

| Method | Route | Description | Auth Required |
|--------|-------|-------------|---------------|
| POST | `/sessions` | Create a new session (login) | No |

**Login Schema:**
```json
{
  "email": "string (email)",
  "password": "string"
}
```

#### Password

| Method | Route | Description | Auth Required |
|--------|-------|-------------|---------------|
| POST | `/password/forgot` | Request password reset | No |
| POST | `/password/reset` | Reset password | No |

**Forgot Password Schema:**
```json
{
  "email": "string (email)"
}
```

**Reset Password Schema:**
```json
{
  "token": "string",
  "password": "string",
  "password_confirmation": "string (must match password)"
}
```

#### Appointments

| Method | Route | Description | Auth Required |
|--------|-------|-------------|---------------|
| POST | `/appointments` | Create a new appointment | 🔒 |
| GET | `/appointments/me` | List provider's appointments | 🔒 |
| DELETE | `/appointments/:id` | Cancel an appointment | 🔒 |

**Create Appointment Schema:**
```json
{
  "provider_id": "string (MongoDB ObjectId)",
  "date": "date"
}
```

#### Providers

| Method | Route | Description | Auth Required |
|--------|-------|-------------|---------------|
| GET | `/providers` | List all providers | 🔒 |
| GET | `/providers/:provider_id/day-availability` | Get provider's day availability | 🔒 |
| GET | `/providers/:provider_id/month-availability` | Get provider's month availability | 🔒 |

**Day Availability Schema:**
```json
{
  "day": "number",
  "month": "number",
  "year": "number"
}
```

#### Notifications

| Method | Route | Description | Auth Required |
|--------|-------|-------------|---------------|
| GET | `/notifications` | List user's notifications | 🔒 |

## 🔧 Technical Details

- Built with Node.js and Express
- MongoDB database with Mongoose ODM
- Redis for caching
- JWT for authentication
- TypeScript for type safety
- Jest for testing

## 📝 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# App
APP_SECRET=your_app_secret
APP_URL=http://localhost:3333

# Database
MONGODB_URL=mongodb://localhost:27017/gobarber

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Mail
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USER=your_mail_user
MAIL_PASS=your_mail_password

# Storage
STORAGE_DRIVER=disk
```

## 🧪 Testing

Run the test suite:
```bash
yarn test
```

## 🧪 Testing Guide

### Starting the Server

1. Start MongoDB:
```bash
mongod
```

2. Start Redis:
```bash
redis-server
```

3. Start the API server:
```bash
npm run dev:server
```

The server will start at `http://localhost:3333`

### Testing Routes

#### 1. User Registration
```bash
curl -X POST http://localhost:3333/users \
-H "Content-Type: application/json" \
-d '{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456",
  "password_confirmation": "123456"
}'
```

#### 2. User Login
```bash
curl -X POST http://localhost:3333/sessions \
-H "Content-Type: application/json" \
-d '{
  "email": "john@example.com",
  "password": "123456"
}'
```
Save the returned token for authenticated requests.

#### 3. Create Appointment
```bash
curl -X POST http://localhost:3333/appointments \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_TOKEN" \
-d '{
  "provider_id": "PROVIDER_ID",
  "date": "2024-03-20T14:00:00.000Z"
}'
```

#### 4. List Provider's Appointments
```bash
curl -X GET http://localhost:3333/appointments/me \
-H "Authorization: Bearer YOUR_TOKEN"
```

#### 5. List All Providers
```bash
curl -X GET http://localhost:3333/providers \
-H "Authorization: Bearer YOUR_TOKEN"
```

#### 6. Get Provider's Day Availability
```bash
curl -X GET "http://localhost:3333/providers/PROVIDER_ID/day-availability" \
-H "Authorization: Bearer YOUR_TOKEN" \
-H "Content-Type: application/json" \
-d '{
  "day": 20,
  "month": 3,
  "year": 2024
}'
```

#### 7. Get Provider's Month Availability
```bash
curl -X GET "http://localhost:3333/providers/PROVIDER_ID/month-availability" \
-H "Authorization: Bearer YOUR_TOKEN" \
-H "Content-Type: application/json" \
-d '{
  "month": 3,
  "year": 2024
}'
```

#### 8. Update User Profile
```bash
curl -X PUT http://localhost:3333/profile \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_TOKEN" \
-d '{
  "name": "John Updated",
  "email": "john.updated@example.com",
  "old_password": "123456",
  "password": "newpassword",
  "password_confirmation": "newpassword"
}'
```

#### 9. Forgot Password
```bash
curl -X POST http://localhost:3333/password/forgot \
-H "Content-Type: application/json" \
-d '{
  "email": "john@example.com"
}'
```

#### 10. Reset Password
```bash
curl -X POST http://localhost:3333/password/reset \
-H "Content-Type: application/json" \
-d '{
  "token": "RESET_TOKEN",
  "password": "newpassword",
  "password_confirmation": "newpassword"
}'
```

#### 11. List Notifications
```bash
curl -X GET http://localhost:3333/notifications \
-H "Authorization: Bearer YOUR_TOKEN"
```

### Testing with Postman

1. Import the following collection into Postman:

```json
{
  "info": {
    "name": "GoBarber API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "url": "http://localhost:3333/users",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"John Doe\",\n  \"email\": \"john@example.com\",\n  \"password\": \"123456\",\n  \"password_confirmation\": \"123456\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": "http://localhost:3333/sessions",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"john@example.com\",\n  \"password\": \"123456\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            }
          }
        }
      ]
    }
  ]
}
```

2. Create an environment variable `token` and set it with the JWT token received from login
3. Use the token in the Authorization header for authenticated requests

### Common Test Scenarios

1. **User Flow**:
   - Register a new user
   - Login with the user
   - Update profile
   - Test password reset flow

2. **Appointment Flow**:
   - List providers
   - Check provider availability
   - Create an appointment
   - List appointments
   - Cancel an appointment

3. **Provider Flow**:
   - Register as a provider
   - Check day/month availability
   - List provider's appointments

### Error Testing

Test these scenarios to ensure proper error handling:

1. Invalid authentication token
2. Invalid email format
3. Password mismatch
4. Invalid appointment date
5. Appointment outside business hours
6. Canceling appointment less than 2 hours before
7. Invalid provider ID

## 📄 License

This project is licensed under the MIT License. 