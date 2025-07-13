package com.sustainshare.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sustainshare.backend.model.FoodItem;
import com.sustainshare.backend.repository.FoodItemRepository;

@Service
public class FoodItemService {

    @Autowired
    private FoodItemRepository foodItemRepository;

    public FoodItem addFood(FoodItem item) {
        return foodItemRepository.save(item);
    }

    public List<FoodItem> getAllFoodItems() {
        return foodItemRepository.findAll();
    }

    public FoodItem getFoodById(Long id) {
        return foodItemRepository.findById(id).orElse(null);
    }

    public void deleteFoodItem(Long id) {
        foodItemRepository.deleteById(id);
    }
}
