import API from "./api";

class StatsService {
  // Get statistics summary
  async getStats() {
    try {
      const response = await API.get("/stats/summary");
      return response.data;
    } catch (error) {
      console.error("Error fetching stats:", error);
      // Return fallback data if API fails
      return {
        peopleFed: this.getFallbackPeopleFed(),
        activeDonors: this.getFallbackActiveDonors(),
        partnerCharities: this.getFallbackPartnerCharities(),
      };
    }
  }

  // Get people fed count
  async getPeopleFedCount() {
    try {
      const response = await API.get("/stats/people-fed");
      return response.data.count || 0;
    } catch (error) {
      console.error("Error fetching people fed count:", error);
      return this.getFallbackPeopleFed();
    }
  }

  // Get active donors count
  async getActiveDonorsCount() {
    try {
      const response = await API.get("/stats/active-donors");
      return response.data.count || 0;
    } catch (error) {
      console.error("Error fetching active donors count:", error);
      return this.getFallbackActiveDonors();
    }
  }

  // Get partner charities count
  async getPartnerCharitiesCount() {
    try {
      const response = await API.get("/stats/partner-charities");
      return response.data.count || 0;
    } catch (error) {
      console.error("Error fetching partner charities count:", error);
      return this.getFallbackPartnerCharities();
    }
  }

  // Increment people fed when donation is completed
  async incrementPeopleFed(amount = 1) {
    try {
      const response = await API.post("/stats/people-fed/increment", {
        amount,
      });
      return response.data;
    } catch (error) {
      console.error("Error incrementing people fed:", error);
      throw error;
    }
  }

  // Increment active donors when new donor signs up
  async incrementActiveDonors() {
    try {
      const response = await API.post("/stats/active-donors/increment");
      return response.data;
    } catch (error) {
      console.error("Error incrementing active donors:", error);
      throw error;
    }
  }

  // Increment partner charities when new charity signs up
  async incrementPartnerCharities() {
    try {
      const response = await API.post("/stats/partner-charities/increment");
      return response.data;
    } catch (error) {
      console.error("Error incrementing partner charities:", error);
      throw error;
    }
  }

  // Record donation completion
  async recordDonationCompletion(donationId, estimatedPeopleServed = 5) {
    try {
      const response = await API.post("/stats/donation-completed", {
        donationId,
        estimatedPeopleServed,
      });
      return response.data;
    } catch (error) {
      console.error("Error recording donation completion:", error);
      throw error;
    }
  }

  // Get local storage fallback values
  getFallbackPeopleFed() {
    const stored = localStorage.getItem("stats_people_fed");
    return stored ? parseInt(stored, 10) : 50000;
  }

  getFallbackActiveDonors() {
    const stored = localStorage.getItem("stats_active_donors");
    return stored ? parseInt(stored, 10) : 5000;
  }

  getFallbackPartnerCharities() {
    const stored = localStorage.getItem("stats_partner_charities");
    return stored ? parseInt(stored, 10) : 100;
  }

  // Update local storage fallback values
  updateFallbackStats(stats) {
    if (stats.peopleFed)
      localStorage.setItem("stats_people_fed", stats.peopleFed.toString());
    if (stats.activeDonors)
      localStorage.setItem(
        "stats_active_donors",
        stats.activeDonors.toString(),
      );
    if (stats.partnerCharities)
      localStorage.setItem(
        "stats_partner_charities",
        stats.partnerCharities.toString(),
      );
  }

  // Local increment for immediate UI feedback
  localIncrementPeopleFed(amount = 1) {
    const current = this.getFallbackPeopleFed();
    const updated = current + amount;
    localStorage.setItem("stats_people_fed", updated.toString());
    return updated;
  }

  localIncrementActiveDonors() {
    const current = this.getFallbackActiveDonors();
    const updated = current + 1;
    localStorage.setItem("stats_active_donors", updated.toString());
    return updated;
  }

  localIncrementPartnerCharities() {
    const current = this.getFallbackPartnerCharities();
    const updated = current + 1;
    localStorage.setItem("stats_partner_charities", updated.toString());
    return updated;
  }

  // Reset stats (for testing/admin purposes)
  async resetStats() {
    try {
      const response = await API.post("/stats/reset");
      localStorage.removeItem("stats_people_fed");
      localStorage.removeItem("stats_active_donors");
      localStorage.removeItem("stats_partner_charities");
      return response.data;
    } catch (error) {
      console.error("Error resetting stats:", error);
      throw error;
    }
  }
}

export default new StatsService();
