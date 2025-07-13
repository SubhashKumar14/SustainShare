import API from "./api";

class StatsService {
  // Get statistics summary
  async getStats() {
    try {
      const response = await API.get("/stats/summary");
      return response.data;
    } catch (error) {
      console.error("Error fetching stats:", error);
      return {
        peopleFed: 0,
        activeDonors: 0,
        partnerCharities: 0,
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
      return 0;
    }
  }

  // Get active donors count
  async getActiveDonorsCount() {
    try {
      const response = await API.get("/stats/active-donors");
      return response.data.count || 0;
    } catch (error) {
      console.error("Error fetching active donors count:", error);
      return 0;
    }
  }

  // Get partner charities count
  async getPartnerCharitiesCount() {
    try {
      const response = await API.get("/stats/partner-charities");
      return response.data.count || 0;
    } catch (error) {
      console.error("Error fetching partner charities count:", error);
      return 0;
    }
  }
}

export default new StatsService();
