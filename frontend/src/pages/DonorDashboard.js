import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  FaUtensils,
  FaChartBar,
  FaEye,
  FaPlus,
  FaHistory,
  FaMapMarkerAlt,
  FaClock,
  FaTruck,
  FaCheckCircle,
  FaUsers,
} from "react-icons/fa";
import API from "../services/api";
import FoodForm from "../components/FoodForm";
import FoodList from "../components/FoodList";
import FoodTracker from "../components/FoodTracker";
import "./DonorDashboard.css";

const DonorDashboard = () => {
  const [activeTab, setActiveTab] = useState("post");
  const [stats, setStats] = useState({
    totalDonations: 0,
    activeDonations: 0,
    completedDonations: 0,
    peopleFed: 0,
  });
  const [myDonations, setMyDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTrackingId, setSelectedTrackingId] = useState(null);

  const currentUserId = localStorage.getItem("userId") || "donor123";

  useEffect(() => {
    fetchMyDonations();
    fetchStats();
  }, []);

  const fetchMyDonations = async () => {
    try {
      setLoading(true);
      const response = await API.get("/food");
      // Filter donations by current user
      const myFood =
        response.data?.filter((item) => item.donorId === currentUserId) || [];
      setMyDonations(myFood);
    } catch (error) {
      console.error("Error fetching donations:", error);
      // Use demo data when backend is unavailable
      const demoData = [
        {
          id: 1,
          name: "Fresh Vegetables",
          quantity: "50 servings",
          status: "AVAILABLE",
          pickupLocation: "123 Main St, Downtown",
          expiryTime: "2024-12-25T18:00:00",
          donorId: currentUserId,
          createdAt: "2024-12-24T10:00:00",
        },
        {
          id: 2,
          name: "Cooked Rice",
          quantity: "100 servings",
          status: "CLAIMED",
          pickupLocation: "456 Oak Ave, City Center",
          expiryTime: "2024-12-24T20:00:00",
          donorId: currentUserId,
          createdAt: "2024-12-24T08:00:00",
        },
      ];
      setMyDonations(demoData);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await API.get("/food");
      const myFood =
        response.data?.filter((item) => item.donorId === currentUserId) || [];

      const totalDonations = myFood.length;
      const activeDonations = myFood.filter(
        (item) => item.status === "AVAILABLE" || item.status === "CLAIMED",
      ).length;
      const completedDonations = myFood.filter(
        (item) => item.status === "DELIVERED",
      ).length;
      const peopleFed = myFood.reduce((sum, item) => {
        const qty = parseInt(item.quantity) || 0;
        return sum + (item.status === "DELIVERED" ? qty : 0);
      }, 0);

      setStats({
        totalDonations,
        activeDonations,
        completedDonations,
        peopleFed,
      });
    } catch (error) {
      // Use demo stats
      setStats({
        totalDonations: 12,
        activeDonations: 3,
        completedDonations: 9,
        peopleFed: 450,
      });
    }
  };

  const handleFoodAdded = (newFood) => {
    setMyDonations((prev) => [newFood, ...prev]);
    fetchStats();
    toast.success("Food donation posted successfully! 🎉");
    setActiveTab("manage");
  };

  const updateDonationStatus = async (donationId, newStatus) => {
    try {
      await API.put(`/food/${donationId}/status`, { status: newStatus });
      setMyDonations((prev) =>
        prev.map((item) =>
          item.id === donationId ? { ...item, status: newStatus } : item,
        ),
      );
      fetchStats();
      toast.success(`Status updated to ${newStatus}!`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "AVAILABLE":
        return <FaEye className="status-icon available" />;
      case "CLAIMED":
        return <FaClock className="status-icon claimed" />;
      case "IN_TRANSIT":
        return <FaTruck className="status-icon in-transit" />;
      case "DELIVERED":
        return <FaCheckCircle className="status-icon delivered" />;
      default:
        return <FaEye className="status-icon" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "AVAILABLE":
        return "#28a745";
      case "CLAIMED":
        return "#ffc107";
      case "IN_TRANSIT":
        return "#17a2b8";
      case "DELIVERED":
        return "#28a745";
      default:
        return "#6c757d";
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    if (diffHours > 0)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return "Just now";
  };

  return (
    <div className="donor-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-text">
            <h1>
              <FaUtensils className="header-icon" />
              Donor Dashboard
            </h1>
            <p>Manage your food donations and track their impact</p>
          </div>
          <div className="stats-overview">
            <div className="stat-card">
              <FaChartBar className="stat-icon" />
              <div className="stat-content">
                <span className="stat-number">{stats.totalDonations}</span>
                <span className="stat-label">Total Donations</span>
              </div>
            </div>
            <div className="stat-card">
              <FaTruck className="stat-icon" />
              <div className="stat-content">
                <span className="stat-number">{stats.activeDonations}</span>
                <span className="stat-label">Active</span>
              </div>
            </div>
            <div className="stat-card">
              <FaUsers className="stat-icon" />
              <div className="stat-content">
                <span className="stat-number">{stats.peopleFed}</span>
                <span className="stat-label">People Fed</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <nav className="dashboard-nav">
          <button
            className={`nav-btn ${activeTab === "post" ? "active" : ""}`}
            onClick={() => setActiveTab("post")}
          >
            <FaPlus /> Post Food
          </button>
          <button
            className={`nav-btn ${activeTab === "manage" ? "active" : ""}`}
            onClick={() => setActiveTab("manage")}
          >
            <FaHistory /> Manage Donations
          </button>
          <button
            className={`nav-btn ${activeTab === "track" ? "active" : ""}`}
            onClick={() => setActiveTab("track")}
          >
            <FaEye /> Track Donations
          </button>
        </nav>

        <div className="tab-content">
          {activeTab === "post" && (
            <div className="post-food-tab">
              <h2>🍽️ Post New Food Donation</h2>
              <FoodForm onFoodAdded={handleFoodAdded} />
            </div>
          )}

          {activeTab === "manage" && (
            <div className="manage-tab">
              <h2>📋 My Food Donations</h2>
              {loading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <p>Loading your donations...</p>
                </div>
              ) : myDonations.length === 0 ? (
                <div className="empty-state">
                  <FaUtensils size={48} />
                  <h3>No donations yet</h3>
                  <p>Start by posting your first food donation!</p>
                  <button
                    className="primary-btn"
                    onClick={() => setActiveTab("post")}
                  >
                    <FaPlus /> Post Food
                  </button>
                </div>
              ) : (
                <div className="donations-grid">
                  {myDonations.map((donation) => (
                    <div key={donation.id} className="donation-card">
                      <div className="donation-header">
                        <h3>{donation.name}</h3>
                        <div
                          className="status-badge"
                          style={{
                            backgroundColor: getStatusColor(donation.status),
                          }}
                        >
                          {getStatusIcon(donation.status)}
                          {donation.status}
                        </div>
                      </div>

                      <div className="donation-content">
                        <div className="donation-meta">
                          <div className="meta-item">
                            <FaUtensils />
                            <span>{donation.quantity}</span>
                          </div>
                          <div className="meta-item">
                            <FaMapMarkerAlt />
                            <span>{donation.pickupLocation}</span>
                          </div>
                          <div className="meta-item">
                            <FaClock />
                            <span>{formatTimeAgo(donation.createdAt)}</span>
                          </div>
                        </div>

                        <div className="donation-actions">
                          {donation.status === "CLAIMED" && (
                            <button
                              className="action-btn in-transit"
                              onClick={() =>
                                updateDonationStatus(donation.id, "IN_TRANSIT")
                              }
                            >
                              <FaTruck /> Mark In Transit
                            </button>
                          )}
                          {donation.status === "IN_TRANSIT" && (
                            <button
                              className="action-btn delivered"
                              onClick={() =>
                                updateDonationStatus(donation.id, "DELIVERED")
                              }
                            >
                              <FaCheckCircle /> Mark Delivered
                            </button>
                          )}
                          <button
                            className="action-btn track"
                            onClick={() =>
                              setSelectedTrackingId(
                                selectedTrackingId === donation.id
                                  ? null
                                  : donation.id,
                              )
                            }
                          >
                            <FaEye />
                            {selectedTrackingId === donation.id
                              ? "Hide Details"
                              : "Track Progress"}
                          </button>
                        </div>

                        {selectedTrackingId === donation.id && (
                          <div className="tracking-section">
                            <FoodTracker donationId={donation.id} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "track" && (
            <div className="track-tab">
              <h2>📊 Donation Tracking Overview</h2>
              <FoodList showTracking={true} userRole="donor" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
