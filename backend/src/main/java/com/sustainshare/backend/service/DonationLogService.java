package com.sustainshare.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sustainshare.backend.model.DonationLog;
import com.sustainshare.backend.repository.DonationLogRepository;

@Service
public class DonationLogService {

    @Autowired
    private DonationLogRepository donationLogRepository;

    // Save new donation entry
    public DonationLog saveDonation(DonationLog log) {
        return donationLogRepository.save(log);
    }

    // Get all donations
    public List<DonationLog> getAllDonations() {
        return donationLogRepository.findAll();
    }

    // Get by ID
    public Optional<DonationLog> getDonationById(Long id) {
        return donationLogRepository.findById(id);
    }

    // Delete
    public void deleteDonation(Long id) {
        donationLogRepository.deleteById(id);
    }
}
