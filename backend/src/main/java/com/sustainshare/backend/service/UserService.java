package com.sustainshare.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sustainshare.backend.model.User;
import com.sustainshare.backend.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {
        if (userRepository.existsById(user.getId())) {
            throw new RuntimeException("User ID already exists.");
        }
        return userRepository.save(user);
    }

    public User loginUser(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent() && user.get().getPassword().equals(password)) {
            return user.get();
        } else {
            throw new RuntimeException("Invalid email or password");
        }
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> getUsersByRole(String role) {
        return userRepository.findAll()
                .stream()
                .filter(user -> user.getRole().equalsIgnoreCase(role))
                .toList();
    }
}
