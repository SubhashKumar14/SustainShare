# Backend Implementation Guide

## Current Error: 500 Internal Server Error

The frontend is working correctly and sending properly formatted requests. The 500 error indicates your backend has an issue processing the signup request.

## Required Backend Endpoints

Based on your SQL schema and frontend code, you need these Spring Boot endpoints:

### 1. POST /api/auth/signup

**Request Body:**

```json
{
  "id": "string",
  "name": "string",
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "DONOR" | "CHARITY"
}
```

**Expected Response:**

```json
{
  "id": "string",
  "name": "string",
  "username": "string",
  "email": "string",
  "role": "string"
}
```

**Spring Boot Controller Example:**

```java
@PostMapping("/auth/signup")
public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
    try {
        User user = new User();
        user.setId(request.getId());
        user.setName(request.getName());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    } catch (Exception e) {
        return ResponseEntity.status(500).body("Error: " + e.getMessage());
    }
}
```

### 2. POST /api/auth/login

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

### 3. GET /api/food

**Response:** Array of food items

### 4. POST /api/food

**Request Body:**

```json
{
  "name": "string",
  "quantity": number,
  "pickup_location": "string",
  "expiry_time": "string",
  "donor_id": "string"
}
```

### 5. POST /api/pickups

**Request Body:**

```json
{
  "food_item_id": number,
  "charity_id": "string",
  "scheduled_time": "string",
  "status": "string"
}
```

## Common Issues Causing 500 Errors

1. **Database Connection Issues**
   - Check if your database is running
   - Verify connection string in application.properties

2. **Missing Tables**
   - Ensure all SQL tables are created
   - Check table names match exactly (case-sensitive)

3. **JPA Entity Mapping Issues**
   - Field names in entities must match database columns
   - Check @Column annotations

4. **Missing Dependencies**
   - Spring Boot Starter Web
   - Spring Boot Starter Data JPA
   - Database driver (H2, MySQL, PostgreSQL, etc.)

5. **CORS Configuration**

```java
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class AuthController {
    // ... endpoints
}
```

## Debugging Steps

1. **Check Backend Logs**
   - Look at Spring Boot console output
   - Check for stack traces

2. **Test Database Connection**
   - Try connecting to database manually
   - Check if tables exist

3. **Test with Postman**
   - Send POST request to http://localhost:8080/api/auth/signup
   - Use the exact JSON payload from frontend

4. **Enable Debug Logging**
   ```properties
   logging.level.com.sustainshare=DEBUG
   logging.level.org.springframework.web=DEBUG
   ```

## Quick Backend Test

Create a simple test endpoint:

```java
@GetMapping("/test")
public ResponseEntity<String> test() {
    return ResponseEntity.ok("Backend is running!");
}
```

This will help verify your backend is accessible.
