package com.sustainshare.backend.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class PickupSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime scheduledTime;

    private String status; // e.g., "Scheduled", "Completed", "Missed"

    @ManyToOne
    @JoinColumn(name = "food_item_id")
    private FoodItem foodItem;

    @ManyToOne
    @JoinColumn(name = "charity_id")
    private User charity;

    // Constructors
    public PickupSchedule() {}

    public PickupSchedule(LocalDateTime scheduledTime, String status, FoodItem foodItem, User charity) {
        this.scheduledTime = scheduledTime;
        this.status = status;
        this.foodItem = foodItem;
        this.charity = charity;
    }

    // Getters and Setters
    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public LocalDateTime getScheduledTime() { return scheduledTime; }

    public void setScheduledTime(LocalDateTime scheduledTime) { this.scheduledTime = scheduledTime; }

    public String getStatus() { return status; }

    public void setStatus(String status) { this.status = status; }

    public FoodItem getFoodItem() { return foodItem; }

    public void setFoodItem(FoodItem foodItem) { this.foodItem = foodItem; }

    public User getCharity() { return charity; }

    public void setCharity(User charity) { this.charity = charity; }
}
