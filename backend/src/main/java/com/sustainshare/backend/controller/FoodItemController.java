package com.sustainshare.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sustainshare.backend.model.FoodItem;
import com.sustainshare.backend.service.FoodItemService;

@CrossOrigin(origins = "http://localhost:3000") // Allow frontend to access
@RestController
@RequestMapping("/api/food")
public class FoodItemController {

    @Autowired
    private FoodItemService foodItemService;

    @PostMapping
    public FoodItem addFoodItem(@RequestBody FoodItem item) {
        return foodItemService.addFood(item);
    }

    @GetMapping
    public List<FoodItem> getAllFoodItems() {
        return foodItemService.getAllFoodItems();
    }

    @GetMapping("/{id}")
    public FoodItem getFoodById(@PathVariable Long id) {
        return foodItemService.getFoodById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteFoodItem(@PathVariable Long id) {
        foodItemService.deleteFoodItem(id);
    }
}
