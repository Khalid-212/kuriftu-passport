# Kuriftu Passport Backend API

This is the backend API for the Kuriftu Passport application, providing endpoints for user authentication, room management, activity management, and loyalty program features.

## Features

- User Authentication (Registration & Login)
- Room Management
- Activity Management
- Loyalty Program with Points System
- JWT-based Authentication
- PostgreSQL Database
- File Upload Support

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Update the `.env` file with your database credentials and other configurations
5. Create the database:
   ```bash
   createdb kuriftu_passport
   ```
6. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

#### Register User

- **POST** `/api/auth/register`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "1234567890",
    "password": "strongpassword",
    "idPhoto": "file"
  }
  ```

#### Login

- **POST** `/api/auth/login`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "strongpassword"
  }
  ```

### Rooms

#### Get All Rooms

- **GET** `/api/rooms`

#### Get Room by ID

- **GET** `/api/rooms/:id`

#### Create Room (Admin)

- **POST** `/api/rooms`
- **Body**:
  ```json
  {
    "roomType": "Deluxe",
    "description": "Spacious room with ocean view",
    "price": 200.0
  }
  ```

#### Update Room (Admin)

- **PUT** `/api/rooms/:id`
- **Body**:
  ```json
  {
    "roomType": "Deluxe",
    "description": "Updated description",
    "price": 250.0,
    "available": true
  }
  ```

#### Delete Room (Admin)

- **DELETE** `/api/rooms/:id`

### Activities

#### Get All Activities

- **GET** `/api/activities`

#### Get Activity by ID

- **GET** `/api/activities/:id`

#### Create Activity (Admin)

- **POST** `/api/activities`
- **Body**:
  ```json
  {
    "name": "Spa Treatment",
    "description": "Relaxing spa experience",
    "price": 100.0
  }
  ```

#### Update Activity (Admin)

- **PUT** `/api/activities/:id`
- **Body**:
  ```json
  {
    "name": "Spa Treatment",
    "description": "Updated description",
    "price": 120.0,
    "available": true
  }
  ```

#### Delete Activity (Admin)

- **DELETE** `/api/activities/:id`

### Loyalty Program

#### Get User Loyalty Status

- **GET** `/api/loyalty/status`
- **Headers**: `Authorization: Bearer <token>`

#### Add Points Transaction

- **POST** `/api/loyalty/transaction`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "points": 100,
    "activityType": "room_booking",
    "description": "Points earned for room booking"
  }
  ```

#### Get Points History

- **GET** `/api/loyalty/history`
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `year` (optional): Filter by year (defaults to current year)

## Error Handling

The API uses standard HTTP status codes and returns errors in the following format:

```json
{
  "status": "error",
  "message": "Error message description"
}
```

## Authentication

Protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Development

To start the development server with hot reloading:

```bash
npm run dev
```

## Testing

To run tests:

```bash
npm test
```

## License

ISC
