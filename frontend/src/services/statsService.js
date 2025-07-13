class StatsService {
  // Get statistics summary - currently using localStorage until backend endpoints are implemented
  async getStats() {
    // Use localStorage data directly since backend endpoints aren't implemented yet
    return {
      peopleFed: this.getFallbackPeopleFed(),
      activeDonors: this.getFallbackActiveDonors(),
      partnerCharities: this.getFallbackPartnerCharities(),
    };
  }

  // Get people fed count - using localStorage until backend is implemented
  async getPeopleFedCount() {
    return this.getFallbackPeopleFed();
  }

  // Get active donors count - using localStorage until backend is implemented
  async getActiveDonorsCount() {
    return this.getFallbackActiveDonors();
  }

  // Get partner charities count - using localStorage until backend is implemented
  async getPartnerCharitiesCount() {
    return this.getFallbackPartnerCharities();
  }

  // Increment people fed when donation is completed - localStorage only until backend is ready
  async incrementPeopleFed(amount = 1) {
    return this.localIncrementPeopleFed(amount);
  }

  // Increment active donors when new donor signs up - localStorage only until backend is ready
  async incrementActiveDonors() {
    return this.localIncrementActiveDonors();
  }

  // Increment partner charities when new charity signs up - localStorage only until backend is ready
  async incrementPartnerCharities() {
    return this.localIncrementPartnerCharities();
  }

  // Record donation completion - localStorage only until backend is ready
  async recordDonationCompletion(donationId, estimatedPeopleServed = 5) {
    return this.localIncrementPeopleFed(estimatedPeopleServed);
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

  // Reset stats (for testing/admin purposes) - localStorage only until backend is ready
  async resetStats() {
    localStorage.removeItem("stats_people_fed");
    localStorage.removeItem("stats_active_donors");
    localStorage.removeItem("stats_partner_charities");
    return { success: true, message: "Stats reset successfully" };
  }
}

const statsService = new StatsService();
export default statsService;
