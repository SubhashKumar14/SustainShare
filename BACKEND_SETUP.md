# Backend Server Setup Instructions

## Quick Start (In Your Local Terminal)

### Option 1: H2 Database (Recommended for Testing)

```bash
cd backend
chmod +x mvnw
./mvnw spring-boot:run
```

### Option 2: MySQL Database

```bash
cd backend
./mvnw spring-boot:run -Dspring.profiles.active=prod
```

## What's Configured

✅ **H2 Database (Development)**: In-memory database, no setup required

- URL: `jdbc:h2:mem:sustainshare`
- Console: http://localhost:8080/h2-console
- Username: `sa`, Password: `password`

✅ **MySQL Database (Production)**: For persistent data

- URL: `jdbc:mysql://localhost:3306/sustainshare`
- Username: `root`, Password: `tiger`

✅ **CORS**: Frontend (localhost:3000) can access backend (localhost:8080)

✅ **REST APIs**: All endpoints ready for frontend integration

## Backend Features Ready

- **User Management**: Registration, login, role management
- **Food Donations**: CRUD operations with Hyderabad locations
- **Pickup Scheduling**: Charity pickup management
- **Authentication**: JWT-style token management

## API Endpoints Available

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Users

- `GET /api/users` - Get all users (Admin)
- `PUT /api/users/{id}/role` - Update user role
- `DELETE /api/users/{id}` - Delete user

### Food Donations

- `GET /api/food` - Get food donations
- `POST /api/food` - Create food donation
- `PUT /api/food/{id}/claim` - Claim food donation
- `PUT /api/food/{id}/status` - Update food status
- `DELETE /api/food/{id}` - Delete food donation

### Pickups

- `GET /api/pickups` - Get pickup schedules
- `POST /api/pickups` - Schedule pickup
- `PUT /api/pickups/{id}` - Update pickup

## Troubleshooting

### If Backend Won't Start:

1. **Check Java Version**: Ensure Java 17+ is installed
2. **Check Port 8080**: Make sure no other service is using port 8080
3. **MySQL Issues**: Switch to H2 database for development

### If Frontend Shows "Backend Unavailable":

1. **Check Backend Status**: Ensure backend is running on http://localhost:8080
2. **Check Network**: Verify CORS is working
3. **Check Console**: Look for network errors in browser console

### Database Connection Issues:

1. **H2 Database**: Should work out of the box
2. **MySQL**: Make sure MySQL is installed and running
3. **Database Creation**: Create `sustainshare` database in MySQL

## Test Backend is Working

Once backend is running, test these URLs:

- http://localhost:8080/h2-console (H2 console)
- http://localhost:8080/api/food (Should return empty array [])
- http://localhost:8080/api/users (Should return empty array [])

## Frontend Will Show:

- ✅ Real data from database (no more demo data)
- ✅ User registration and login working
- ✅ Food posting saves to database
- ✅ Map tracking with real Hyderabad coordinates
- ✅ Admin panel with actual data management
