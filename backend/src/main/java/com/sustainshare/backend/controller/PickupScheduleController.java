package com.sustainshare.backend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.sustainshare.backend.model.PickupSchedule;
import com.sustainshare.backend.service.PickupScheduleService;

@CrossOrigin(origins = {"http://localhost:3000", "*"})
@RestController
@RequestMapping("/api/pickups")
public class PickupScheduleController {

    @Autowired
    private PickupScheduleService pickupScheduleService;

    @PostMapping
    public ResponseEntity<?> schedulePickup(@RequestBody PickupSchedule pickup) {
        try {
            // Set default values if not provided
            if (pickup.getStatus() == null || pickup.getStatus().isEmpty()) {
                pickup.setStatus("Scheduled");
            }
            if (pickup.getCreatedAt() == null) {
                pickup.setCreatedAt(new java.util.Date());
            }

            PickupSchedule savedPickup = pickupScheduleService.schedulePickup(pickup);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Pickup scheduled successfully!");
            response.put("pickup", savedPickup);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error scheduling pickup: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping
    public ResponseEntity<List<PickupSchedule>> getAllPickups() {
        try {
            List<PickupSchedule> pickups = pickupScheduleService.getAllPickups();
            return ResponseEntity.ok(pickups);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPickupById(@PathVariable Long id) {
        try {
            Optional<PickupSchedule> pickup = pickupScheduleService.getPickupByIdOptional(id);
            if (pickup.isPresent()) {
                return ResponseEntity.ok(pickup.get());
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Pickup not found");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error fetching pickup: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/charity/{charityId}")
    public ResponseEntity<List<PickupSchedule>> getPickupsByCharity(@PathVariable String charityId) {
        try {
            List<PickupSchedule> pickups = pickupScheduleService.getPickupsByCharity(charityId);
            return ResponseEntity.ok(pickups);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<PickupSchedule>> getPickupsByStatus(@PathVariable String status) {
        try {
            List<PickupSchedule> pickups = pickupScheduleService.getPickupsByStatus(status);
            return ResponseEntity.ok(pickups);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/scheduled")
    public ResponseEntity<List<PickupSchedule>> getScheduledPickups() {
        try {
            List<PickupSchedule> pickups = pickupScheduleService.getScheduledPickups();
            return ResponseEntity.ok(pickups);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/today")
    public ResponseEntity<List<PickupSchedule>> getTodayPickups() {
        try {
            List<PickupSchedule> pickups = pickupScheduleService.getTodayPickups();
            return ResponseEntity.ok(pickups);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePickup(@PathVariable Long id, @RequestBody PickupSchedule pickupDetails) {
        try {
            Optional<PickupSchedule> updatedPickup = pickupScheduleService.updatePickup(id, pickupDetails);
            if (updatedPickup.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Pickup updated successfully");
                response.put("pickup", updatedPickup.get());
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Pickup not found");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error updating pickup: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updatePickupStatus(@PathVariable Long id, @RequestBody Map<String, String> statusRequest) {
        try {
            String newStatus = statusRequest.get("status");
            if (newStatus == null || newStatus.trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Status cannot be empty");
                return ResponseEntity.badRequest().body(error);
            }

            Optional<PickupSchedule> updatedPickup = pickupScheduleService.updatePickupStatus(id, newStatus);
            if (updatedPickup.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Status updated successfully");
                response.put("pickup", updatedPickup.get());
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Pickup not found");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error updating status: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<?> completePickup(@PathVariable Long id) {
        try {
            Optional<PickupSchedule> completedPickup = pickupScheduleService.completePickup(id);
            if (completedPickup.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Pickup completed successfully");
                response.put("pickup", completedPickup.get());
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Pickup not found");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error completing pickup: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancelPickup(@PathVariable Long id, @RequestBody(required = false) Map<String, String> cancelRequest) {
        try {
            String reason = cancelRequest != null ? cancelRequest.get("reason") : "No reason provided";
            Optional<PickupSchedule> cancelledPickup = pickupScheduleService.cancelPickup(id, reason);
            if (cancelledPickup.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Pickup cancelled successfully");
                response.put("pickup", cancelledPickup.get());
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Pickup not found");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error cancelling pickup: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePickup(@PathVariable Long id) {
        try {
            boolean deleted = pickupScheduleService.deletePickup(id);
            if (deleted) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Pickup deleted successfully");
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Pickup not found");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error deleting pickup: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getPickupStats() {
        try {
            Map<String, Object> stats = pickupScheduleService.getPickupStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error fetching stats: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<PickupSchedule>> getUpcomingPickups(@RequestParam(defaultValue = "7") int days) {
        try {
            List<PickupSchedule> pickups = pickupScheduleService.getUpcomingPickups(days);
            return ResponseEntity.ok(pickups);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<PickupSchedule>> searchPickups(@RequestParam String query) {
        try {
            List<PickupSchedule> pickups = pickupScheduleService.searchPickups(query);
            return ResponseEntity.ok(pickups);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
