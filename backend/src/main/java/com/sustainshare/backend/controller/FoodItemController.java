package com.sustainshare.backend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.sustainshare.backend.model.FoodItem;
import com.sustainshare.backend.service.FoodItemService;

@CrossOrigin(origins = {"http://localhost:3000", "*"})
@RestController
@RequestMapping("/api/food")
public class FoodItemController {

    @Autowired
    private FoodItemService foodItemService;

    @PostMapping
    public ResponseEntity<?> addFoodItem(@RequestBody FoodItem item) {
        try {
            // Set default values if not provided
            if (item.getStatus() == null || item.getStatus().isEmpty()) {
                item.setStatus("AVAILABLE");
            }
            if (item.getCreatedAt() == null) {
                item.setCreatedAt(new java.util.Date());
            }

            FoodItem savedItem = foodItemService.addFood(item);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Food item added successfully!");
            response.put("foodItem", savedItem);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error adding food item: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping
    public ResponseEntity<List<FoodItem>> getAllFoodItems() {
        try {
            List<FoodItem> items = foodItemService.getAllFoodItems();
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getFoodById(@PathVariable Long id) {
        try {
            Optional<FoodItem> item = foodItemService.getFoodByIdOptional(id);
            if (item.isPresent()) {
                return ResponseEntity.ok(item.get());
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Food item not found");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error fetching food item: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/available")
    public ResponseEntity<List<FoodItem>> getAvailableFoodItems() {
        try {
            List<FoodItem> items = foodItemService.getAvailableFoodItems();
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/donor/{donorId}")
    public ResponseEntity<List<FoodItem>> getFoodByDonor(@PathVariable String donorId) {
        try {
            List<FoodItem> items = foodItemService.getFoodByDonor(donorId);
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<FoodItem>> getFoodByCategory(@PathVariable String category) {
        try {
            List<FoodItem> items = foodItemService.getFoodByCategory(category.toUpperCase());
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<FoodItem>> getFoodByStatus(@PathVariable String status) {
        try {
            List<FoodItem> items = foodItemService.getFoodByStatus(status.toUpperCase());
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateFoodItem(@PathVariable Long id, @RequestBody FoodItem foodDetails) {
        try {
            Optional<FoodItem> updatedItem = foodItemService.updateFoodItem(id, foodDetails);
            if (updatedItem.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Food item updated successfully");
                response.put("foodItem", updatedItem.get());
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Food item not found");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error updating food item: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateFoodStatus(@PathVariable Long id, @RequestBody Map<String, String> statusRequest) {
        try {
            String newStatus = statusRequest.get("status");
            if (newStatus == null || newStatus.trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Status cannot be empty");
                return ResponseEntity.badRequest().body(error);
            }

            Optional<FoodItem> updatedItem = foodItemService.updateFoodStatus(id, newStatus.toUpperCase());
            if (updatedItem.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Status updated successfully");
                response.put("foodItem", updatedItem.get());
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Food item not found");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error updating status: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{id}/claim")
    public ResponseEntity<?> claimFood(@PathVariable Long id, @RequestBody Map<String, String> claimRequest) {
        try {
            String charityId = claimRequest.get("charityId");
            if (charityId == null || charityId.trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Charity ID is required");
                return ResponseEntity.badRequest().body(error);
            }

            Optional<FoodItem> claimedItem = foodItemService.claimFoodItem(id, charityId);
            if (claimedItem.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Food item claimed successfully");
                response.put("foodItem", claimedItem.get());
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Food item not found or already claimed");
                return ResponseEntity.badRequest().body(error);
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error claiming food item: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFoodItem(@PathVariable Long id) {
        try {
            boolean deleted = foodItemService.deleteFoodItem(id);
            if (deleted) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Food item deleted successfully");
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Food item not found");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error deleting food item: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getFoodStats() {
        try {
            Map<String, Object> stats = foodItemService.getFoodStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error fetching stats: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<FoodItem>> searchFood(@RequestParam String query) {
        try {
            List<FoodItem> items = foodItemService.searchFood(query);
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/expiring")
    public ResponseEntity<List<FoodItem>> getExpiringFood(@RequestParam(defaultValue = "24") int hours) {
        try {
            List<FoodItem> items = foodItemService.getExpiringFood(hours);
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
