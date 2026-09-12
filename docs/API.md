# API Documentation

## Base URL
```
http://localhost:5000/api/v1
```

## Authentication

All endpoints (except login/register) require JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Error Responses

```json
{
  "error": "Error message"
}
```

## Authentication Endpoints

### Register User
- **POST** `/auth/register`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "254700000000",
    "role": "secretary"
  }
  ```
- **Response:** User object and JWT token

### Login
- **POST** `/auth/login`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123"
  }
  ```
- **Response:** User object and JWT token

### Get Current User
- **GET** `/auth/me`
- **Response:** Current user profile

## Members Endpoints

### Get All Members
- **GET** `/members?page=1&limit=20&status=active&search=john`
- **Response:** Paginated list of members

### Get Member by ID
- **GET** `/members/:id`
- **Response:** Member details

### Create Member
- **POST** `/members`
- **Role Required:** Admin, Secretary
- **Body:**
  ```json
  {
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
    "phoneNumber": "254700000001",
    "idNumber": "12345678",
    "dateOfBirth": "1990-01-01",
    "gender": "Female",
    "address": "123 Main St",
    "occupation": "Teacher"
  }
  ```

### Update Member
- **PUT** `/members/:id`
- **Role Required:** Admin, Secretary
- **Body:** Same as create (partial update supported)

### Delete Member
- **DELETE** `/members/:id`
- **Role Required:** Admin

## Dependants Endpoints

### Get All Dependants
- **GET** `/dependants?memberId=<id>&page=1&limit=20`
- **Response:** Paginated list of dependants

### Get Dependant by ID
- **GET** `/dependants/:id`
- **Response:** Dependant details

### Create Dependant
- **POST** `/dependants`
- **Role Required:** Admin, Secretary
- **Body:**
  ```json
  {
    "memberId": "<member-id>",
    "firstName": "John",
    "lastName": "Smith",
    "relationship": "Son",
    "dateOfBirth": "2015-05-10",
    "gender": "Male",
    "isBeneficiary": true,
    "healthStatus": "Good",
    "notes": "Primary school student"
  }
  ```

### Get Member's Dependants
- **GET** `/dependants/member/:memberId`
- **Response:** List of dependants for a member

## Payments Endpoints

### Get All Payments
- **GET** `/payments?page=1&limit=20&memberId=<id>&verified=true&startDate=2024-01-01&endDate=2024-12-31`
- **Response:** Paginated payment list

### Record Payment
- **POST** `/payments`
- **Role Required:** Admin, Treasurer
- **Body:**
  ```json
  {
    "memberId": "<member-id>",
    "paymentTypeId": "<payment-type-id>",
    "amount": 200.00,
    "paymentDate": "2024-01-15",
    "paymentMonth": "January",
    "paymentYear": 2024,
    "paymentMethod": "cash",
    "transactionReference": "TXN123",
    "notes": "Monthly contribution"
  }
  ```

### Verify Payment
- **POST** `/payments/:id/verify`
- **Role Required:** Admin, Treasurer
- **Response:** Updated payment with verification details

### Get Member Payment History
- **GET** `/payments/member/:memberId`
- **Response:** All payments for a member

## Dependant Benefits Endpoints

### Get All Benefits
- **GET** `/dependant-benefits?dependantId=<id>&status=active&page=1&limit=20`
- **Response:** Paginated benefits list

### Create Benefit
- **POST** `/dependant-benefits`
- **Role Required:** Admin, Treasurer
- **Body:**
  ```json
  {
    "dependantId": "<dependant-id>",
    "benefitType": "Medical Insurance",
    "amount": 5000.00,
    "benefitDate": "2024-01-01",
    "expiryDate": "2024-12-31",
    "status": "active",
    "notes": "Annual health insurance"
  }
  ```

### Get Dependant Benefits
- **GET** `/dependant-benefits/dependant/:dependantId`
- **Response:** All benefits for a dependant

## Reports Endpoints

### Financial Report
- **GET** `/reports/financial?startDate=2024-01-01&endDate=2024-12-31`
- **Role Required:** Admin, Treasurer, Secretary
- **Response:** Financial summary with totals

### Member Report
- **GET** `/reports/members`
- **Role Required:** Admin, Secretary
- **Response:** Member statistics by status

### Payment Report
- **GET** `/reports/payments?startDate=2024-01-01&endDate=2024-12-31`
- **Role Required:** Admin, Treasurer
- **Response:** Payment breakdown by type

### Outstanding Payments
- **GET** `/reports/outstanding`
- **Role Required:** Admin, Treasurer
- **Response:** Members with outstanding payments

## Dashboard Endpoints

### Get Dashboard Overview
- **GET** `/dashboard/overview`
- **Response:**
  ```json
  {
    "totalMembers": 150,
    "activeMembers": 145,
    "totalDependants": 320,
    "totalPayments": 45000.00,
    "thisMonthPayments": 8500.00
  }
  ```

### Get Dashboard Metrics
- **GET** `/dashboard/metrics`
- **Response:** Payment methods, member status, recent payments

### Get Chart Data
- **GET** `/dashboard/charts`
- **Response:** Monthly trends and payment type distribution

## User Management Endpoints

### Get All Users
- **GET** `/users?page=1&limit=20`
- **Role Required:** Admin
- **Response:** Paginated user list

### Update User
- **PUT** `/users/:id`
- **Body:**
  ```json
  {
    "firstName": "Jane",
    "lastName": "Updated",
    "phoneNumber": "254700000002",
    "role": "treasurer"
  }
  ```

### Delete User
- **DELETE** `/users/:id`
- **Role Required:** Admin

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## Roles

- **Admin** - Full system access
- **Treasurer** - Financial management
- **Secretary** - Member and report management
- **Member** - View own profile and payments
