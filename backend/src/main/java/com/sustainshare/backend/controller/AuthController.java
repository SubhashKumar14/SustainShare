package com.sustainshare.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.sustainshare.backend.model.User;
import com.sustainshare.backend.service.UserService;
import com.sustainshare.backend.dto.LoginRequest;
import com.sustainshare.backend.dto.LoginResponse;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "*"})
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            // Check if user already exists
            if (userService.existsByEmail(user.getEmail())) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Email already exists!");
                return ResponseEntity.badRequest().body(error);
            }
            
            if (userService.existsByUserId(user.getUserId())) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "User ID already exists!");
                return ResponseEntity.badRequest().body(error);
            }

            // Register the user
            User savedUser = userService.registerUser(user);
            
            // Create response without password
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully!");
            response.put("userId", savedUser.getUserId());
            response.put("name", savedUser.getName());
            response.put("email", savedUser.getEmail());
            response.put("role", savedUser.getRole());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Registration failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            Optional<User> userOpt = userService.authenticateUser(
                loginRequest.getEmail(), 
                loginRequest.getPassword()
            );
            
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                
                // Create login response
                LoginResponse response = new LoginResponse();
                response.setUserId(user.getUserId());
                response.setName(user.getName());
                response.setEmail(user.getEmail());
                response.setRole(user.getRole());
                response.setToken("demo-jwt-token-" + user.getUserId()); // Demo token
                response.setMessage("Login successful!");
                
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Invalid email or password");
                return ResponseEntity.badRequest().body(error);
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Login failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader(value = "Authorization", required = false) String token) {
        // In a real application, you would invalidate the token here
        Map<String, String> response = new HashMap<>();
        response.put("message", "Logged out successfully!");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyToken(@RequestHeader(value = "Authorization", required = false) String token) {
        // In a real application, you would verify the JWT token here
        if (token != null && token.startsWith("Bearer ")) {
            String actualToken = token.substring(7);
            if (actualToken.startsWith("demo-jwt-token-")) {
                Map<String, Object> response = new HashMap<>();
                response.put("valid", true);
                response.put("message", "Token is valid");
                return ResponseEntity.ok(response);
            }
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("valid", false);
        response.put("message", "Invalid or missing token");
        return ResponseEntity.badRequest().body(response);
    }
}
