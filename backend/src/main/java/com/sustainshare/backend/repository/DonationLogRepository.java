package com.sustainshare.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sustainshare.backend.model.DonationLog;

public interface DonationLogRepository extends JpaRepository<DonationLog, Long> {
    // Add filter by donor or charity if needed
    
}
