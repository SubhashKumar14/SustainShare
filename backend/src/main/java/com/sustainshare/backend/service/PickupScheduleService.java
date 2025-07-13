package com.sustainshare.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sustainshare.backend.model.PickupSchedule;
import com.sustainshare.backend.repository.PickupScheduleRepository;

@Service
public class PickupScheduleService {

    @Autowired
    private PickupScheduleRepository pickupScheduleRepository;

    // Add new pickup schedule
    public PickupSchedule schedulePickup(PickupSchedule pickup) {
        return pickupScheduleRepository.save(pickup);
    }

    // Get all pickup schedules
    public List<PickupSchedule> getAllPickups() {
        return pickupScheduleRepository.findAll();
    }

    // Get pickup by ID
    public Optional<PickupSchedule> getPickupById(Long id) {
        return pickupScheduleRepository.findById(id);
    }

    // Delete a pickup
    public void deletePickup(Long id) {
        pickupScheduleRepository.deleteById(id);
    }
}
