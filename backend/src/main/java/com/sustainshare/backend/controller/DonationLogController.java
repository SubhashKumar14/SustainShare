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

import com.sustainshare.backend.model.DonationLog;
import com.sustainshare.backend.service.DonationLogService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/donations")
public class DonationLogController {

    @Autowired
    private DonationLogService donationLogService;

    @PostMapping
    public DonationLog saveDonation(@RequestBody DonationLog log) {
        return donationLogService.saveDonation(log);
    }

    @GetMapping
    public List<DonationLog> getAllDonations() {
        return donationLogService.getAllDonations();
    }

    @GetMapping("/{id}")
    public Optional<DonationLog> getDonationById(@PathVariable Long id) {
        return donationLogService.getDonationById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteDonation(@PathVariable Long id) {
        donationLogService.deleteDonation(id);
    }
}
