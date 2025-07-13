package com.sustainshare.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sustainshare.backend.model.PickupSchedule;

public interface PickupScheduleRepository extends JpaRepository<PickupSchedule, Long> {
    // Add custom query methods if needed
}
