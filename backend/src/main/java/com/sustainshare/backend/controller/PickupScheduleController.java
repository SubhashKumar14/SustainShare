package com.sustainshare.backend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sustainshare.backend.model.PickupSchedule;
import com.sustainshare.backend.service.PickupScheduleService;



@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/pickups")
public class PickupScheduleController {

    @Autowired
    private PickupScheduleService pickupScheduleService;



    @PostMapping
    public PickupSchedule schedulePickup(@RequestBody PickupSchedule pickup) {
        PickupSchedule savedPickup = pickupScheduleService.schedulePickup(pickup);

  

    return savedPickup;
}
    

    @GetMapping
    public List<PickupSchedule> getAllPickups() {
        return pickupScheduleService.getAllPickups();
    }

    @GetMapping("/{id}")
    public Optional<PickupSchedule> getPickupById(@PathVariable Long id) {
        return pickupScheduleService.getPickupById(id);
    }

    @DeleteMapping("/{id}")
    public void deletePickup(@PathVariable Long id) {
        pickupScheduleService.deletePickup(id);
    }
}
