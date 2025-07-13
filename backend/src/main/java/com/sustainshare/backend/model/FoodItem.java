package com.sustainshare.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class FoodItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private int quantity;
    private String pickupLocation;
    private String expiryTime;

    // Optional: link to donorId (foreign key-like)
    private Long donorId;

    // Constructors
    public FoodItem() {}

    public FoodItem(String name, int quantity, String pickupLocation, String expiryTime, Long donorId) {
        this.name = name;
        this.quantity = quantity;
        this.pickupLocation = pickupLocation;
        this.expiryTime = expiryTime;
        this.donorId = donorId;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public String getPickupLocation() { return pickupLocation; }
    public void setPickupLocation(String pickupLocation) { this.pickupLocation = pickupLocation; }

    public String getExpiryTime() { return expiryTime; }
    public void setExpiryTime(String expiryTime) { this.expiryTime = expiryTime; }

    public Long getDonorId() { return donorId; }
    public void setDonorId(Long donorId) { this.donorId = donorId; }
}
