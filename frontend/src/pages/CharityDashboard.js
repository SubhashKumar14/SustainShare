import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaHeart,
  FaClock,
  FaMapMarkerAlt,
  FaSearch,
  FaUtensils,
  FaTruck,
  FaFilter,
  FaRoute,
  FaPhoneAlt,
  FaCheckCircle,
  FaEye,
  FaHeart,
  FaChartBar,
} from "react-icons/fa";
import API from "../services/api";
import MapView from "../components/MapView";
import FoodList from "../components/FoodList";
import { addressToCoordinates } from "../utils/geocode";
import "./CharityDashboard.css";

const CharityDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("available");
  const [foodItems, setFoodItems] = useState([]);
  const [claimedItems, setClaimedItems] = useState([]);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [charityLocation, setCharityLocation] = useState(null);
  const [stats, setStats] = useState({
    totalClaimed: 0,
    activeClaims: 0,
    peopleFed: 0,
  });

  const currentCharityId = localStorage.getItem("userId") || "charity123";
  const charityAddress = "789 Charity Ave, Community Center"; // Demo address

  const categories = [
    { value: "ALL", label: "All Categories" },
    { value: "COOKED_FOOD", label: "🍽️ Cooked Food" },
    { value: "FRESH_PRODUCE", label: "��� Fresh Produce" },
    { value: "PACKAGED_FOOD", label: "📦 Packaged Food" },
    { value: "BAKERY", label: "🥖 Bakery Items" },
    { value: "DAIRY", label: "🥛 Dairy Products" },
    { value: "OTHER", label: "🍕 Other" },
  ];

  useEffect(() => {
    fetchAvailableFood();
    fetchClaimedFood();
    fetchCharityLocation();
    fetchStats();
  }, []);

  const fetchAvailableFood = async () => {
    try {
      setLoading(true);
      const response = await API.get("/food");
      const availableFood =
        response.data?.filter((item) => item.status === "AVAILABLE") || [];
      setFoodItems(availableFood);
    } catch (error) {
      console.error("Error fetching food:", error);
      // Demo data for available food
      const demoFood = [
        {
          id: 1,
          name: "Fresh Vegetable Soup",
          quantity: "50 servings",
          category: "COOKED_FOOD",
          pickupLocation: "123 Main St, Downtown",
          expiryTime: "2024-12-25T18:00:00",
          description: "Fresh homemade vegetable soup, perfect for winter",
          donorId: "donor123",
          status: "AVAILABLE",
          allergens: "None",
          coordinates: [40.7128, -74.006],
        },
        {
          id: 2,
          name: "Fresh Organic Apples",
          quantity: "200 pieces",
          category: "FRESH_PRODUCE",
          pickupLocation: "456 Oak Ave, City Center",
          expiryTime: "2024-12-26T12:00:00",
          description: "Organic apples from local farm",
          donorId: "donor456",
          status: "AVAILABLE",
          allergens: "None",
          coordinates: [40.7589, -73.9851],
        },
        {
          id: 3,
          name: "Packaged Pasta & Sauce",
          quantity: "100 boxes",
          category: "PACKAGED_FOOD",
          pickupLocation: "789 Pine St, Uptown",
          expiryTime: "2024-12-30T20:00:00",
          description: "Unopened pasta boxes with tomato sauce",
          donorId: "donor789",
          status: "AVAILABLE",
          allergens: "Contains gluten",
          coordinates: [40.7831, -73.9712],
        },
      ];
      setFoodItems(demoFood);
    } finally {
      setLoading(false);
    }
  };

  const fetchClaimedFood = async () => {
    try {
      const response = await API.get("/food");
      const claimedFood =
        response.data?.filter((item) => item.claimedBy === currentCharityId) ||
        [];
      setClaimedItems(claimedFood);
    } catch (error) {
      // Demo claimed food data
      const demoClaimed = [
        {
          id: 4,
          name: "Cooked Rice & Curry",
          quantity: "75 servings",
          category: "COOKED_FOOD",
          pickupLocation: "321 Elm St, Downtown",
          status: "CLAIMED",
          claimedAt: "2024-12-24T14:00:00",
          claimedBy: currentCharityId,
          coordinates: [40.7505, -73.9934],
        },
      ];
      setClaimedItems(demoClaimed);
    }
  };

  const fetchCharityLocation = async () => {
    try {
      const coordinates = await addressToCoordinates(charityAddress);
      setCharityLocation(coordinates || [40.7831, -73.9712]); // Default NYC coordinates
    } catch (error) {
      setCharityLocation([40.7831, -73.9712]); // Default coordinates
    }
  };

  const fetchStats = async () => {
    try {
      const response = await API.get("/food");
      const claimedFood =
        response.data?.filter((item) => item.claimedBy === currentCharityId) ||
        [];

      const totalClaimed = claimedFood.length;
      const activeClaims = claimedFood.filter(
        (item) => item.status === "CLAIMED" || item.status === "IN_TRANSIT",
      ).length;
      const peopleFed = claimedFood.reduce((sum, item) => {
        const qty = parseInt(item.quantity) || 0;
        return sum + (item.status === "DELIVERED" ? qty : 0);
      }, 0);

      setStats({ totalClaimed, activeClaims, peopleFed });
    } catch (error) {
      setStats({ totalClaimed: 8, activeClaims: 2, peopleFed: 320 });
    }
  };

  const claimFood = async (foodItem) => {
    try {
      setLoading(true);

      // Simulate claiming API call
      await API.put(`/food/${foodItem.id}/claim`, {
        charityId: currentCharityId,
        claimedAt: new Date().toISOString(),
        status: "CLAIMED",
      });

      toast.success(`Successfully claimed ${foodItem.name}! 🎉`, {
        position: "top-center",
      });

      // Update local state
      setFoodItems((prev) => prev.filter((item) => item.id !== foodItem.id));
      setClaimedItems((prev) => [
        ...prev,
        { ...foodItem, status: "CLAIMED", claimedBy: currentCharityId },
      ]);

      // Set for map view
      setSelectedDonation(foodItem);
      setShowMap(true);

      fetchStats();
    } catch (error) {
      toast.error("Failed to claim food item");
    } finally {
      setLoading(false);
    }
  };

  const updateClaimStatus = async (itemId, newStatus) => {
    try {
      await API.put(`/food/${itemId}/status`, { status: newStatus });

      setClaimedItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, status: newStatus } : item,
        ),
      );

      toast.success(`Status updated to ${newStatus}!`);
      fetchStats();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const schedulePickup = async (foodItem) => {
    const time = prompt("Enter pickup time in 24-hr format (e.g., 17:30):");
    if (!time || !/^\d{2}:\d{2}$/.test(time)) {
      toast.error("Please enter a valid time in 24-hour format (HH:MM)");
      return;
    }

    try {
      const today = new Date().toISOString().split("T")[0];
      const scheduledTime = `${today}T${time}:00`;

      await API.post("/pickups", {
        scheduledTime,
        foodItemId: foodItem.id,
        charityId: currentCharityId,
        status: "Scheduled",
      });

      toast.success(`Pickup scheduled for ${time}! 🚚`);

      updateClaimStatus(foodItem.id, "IN_TRANSIT");
    } catch (error) {
      toast.error("Failed to schedule pickup");
    }
  };

  const filteredFood = foodItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "ALL" || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "CLAIMED":
        return <FaHandHeart className="status-icon claimed" />;
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

  const formatTimeRemaining = (expiryTime) => {
    const now = new Date();
    const expiry = new Date(expiryTime);
    const diff = expiry - now;

    if (diff <= 0) return "Expired";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} day${days > 1 ? "s" : ""} left`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m left`;
    } else {
      return `${minutes}m left`;
    }
  };

  return (
    <div className="charity-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-text">
            <h1>
              <FaHeart className="header-icon" />
              Charity Dashboard
            </h1>
            <p>Claim food donations and help feed the community</p>
          </div>
          <div className="stats-overview">
            <div className="stat-card">
              <FaChartBar className="stat-icon" />
              <div className="stat-content">
                <span className="stat-number">{stats.totalClaimed}</span>
                <span className="stat-label">Total Claimed</span>
              </div>
            </div>
            <div className="stat-card">
              <FaTruck className="stat-icon" />
              <div className="stat-content">
                <span className="stat-number">{stats.activeClaims}</span>
                <span className="stat-label">Active Claims</span>
              </div>
            </div>
            <div className="stat-card">
              <FaUtensils className="stat-icon" />
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
            className={`nav-btn ${activeTab === "available" ? "active" : ""}`}
            onClick={() => setActiveTab("available")}
          >
            <FaUtensils /> Available Food
          </button>
          <button
            className={`nav-btn ${activeTab === "claimed" ? "active" : ""}`}
            onClick={() => setActiveTab("claimed")}
          >
            <FaHandHeart /> My Claims
          </button>
          <button
            className={`nav-btn ${activeTab === "map" ? "active" : ""}`}
            onClick={() => setActiveTab("map")}
          >
            <FaMapMarkerAlt /> Map View
          </button>
        </nav>

        <div className="tab-content">
          {activeTab === "available" && (
            <div className="available-tab">
              <div className="filters-section">
                <div className="search-controls">
                  <div className="search-box">
                    <FaSearch />
                    <input
                      type="text"
                      placeholder="Search food or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="category-filter"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="results-info">
                  {filteredFood.length} donation
                  {filteredFood.length !== 1 ? "s" : ""} available
                </div>
              </div>

              {loading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <p>Loading available donations...</p>
                </div>
              ) : filteredFood.length === 0 ? (
                <div className="empty-state">
                  <FaUtensils size={48} />
                  <h3>No food donations available</h3>
                  <p>
                    Check back later for new donations from generous donors!
                  </p>
                </div>
              ) : (
                <div className="food-grid">
                  {filteredFood.map((item) => (
                    <div key={item.id} className="food-card">
                      <div className="food-header">
                        <h3>{item.name}</h3>
                        <span className="quantity-badge">{item.quantity}</span>
                      </div>

                      <div className="food-details">
                        <div className="detail-row">
                          <FaMapMarkerAlt />
                          <span>{item.pickupLocation}</span>
                        </div>
                        <div className="detail-row">
                          <FaClock />
                          <span
                            className={
                              formatTimeRemaining(item.expiryTime) === "Expired"
                                ? "expired"
                                : "active"
                            }
                          >
                            {formatTimeRemaining(item.expiryTime)}
                          </span>
                        </div>
                        {item.category && (
                          <div className="detail-row">
                            <FaFilter />
                            <span>{item.category.replace("_", " ")}</span>
                          </div>
                        )}
                        {item.allergens && (
                          <div className="allergen-info">
                            ⚠️ {item.allergens}
                          </div>
                        )}
                      </div>

                      <div className="food-description">{item.description}</div>

                      <div className="action-buttons">
                        <button
                          onClick={() => claimFood(item)}
                          className="claim-btn"
                          disabled={loading}
                        >
                          <FaHandHeart />
                          {loading ? "Claiming..." : "Claim Food"}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedDonation(item);
                            setShowMap(true);
                          }}
                          className="view-location-btn"
                        >
                          <FaMapMarkerAlt />
                          View Location
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "claimed" && (
            <div className="claimed-tab">
              <h2>📋 My Claimed Donations</h2>
              {claimedItems.length === 0 ? (
                <div className="empty-state">
                  <FaHandHeart size={48} />
                  <h3>No claimed donations yet</h3>
                  <p>Start by claiming available food donations!</p>
                  <button
                    className="primary-btn"
                    onClick={() => setActiveTab("available")}
                  >
                    <FaUtensils /> Browse Available Food
                  </button>
                </div>
              ) : (
                <div className="claimed-grid">
                  {claimedItems.map((item) => (
                    <div key={item.id} className="claimed-card">
                      <div className="claimed-header">
                        <h3>{item.name}</h3>
                        <div
                          className="status-badge"
                          style={{
                            backgroundColor: getStatusColor(item.status),
                          }}
                        >
                          {getStatusIcon(item.status)}
                          {item.status}
                        </div>
                      </div>

                      <div className="claimed-content">
                        <div className="claimed-meta">
                          <div className="meta-item">
                            <FaUtensils />
                            <span>{item.quantity}</span>
                          </div>
                          <div className="meta-item">
                            <FaMapMarkerAlt />
                            <span>{item.pickupLocation}</span>
                          </div>
                        </div>

                        <div className="claimed-actions">
                          {item.status === "CLAIMED" && (
                            <button
                              className="action-btn schedule"
                              onClick={() => schedulePickup(item)}
                            >
                              <FaTruck /> Schedule Pickup
                            </button>
                          )}
                          {item.status === "IN_TRANSIT" && (
                            <button
                              className="action-btn delivered"
                              onClick={() =>
                                updateClaimStatus(item.id, "DELIVERED")
                              }
                            >
                              <FaCheckCircle /> Mark Delivered
                            </button>
                          )}
                          <button
                            className="action-btn contact"
                            onClick={() =>
                              toast.info("Contact feature coming soon!")
                            }
                          >
                            <FaPhoneAlt /> Contact Donor
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "map" && (
            <div className="map-tab">
              <h2>🗺️ Food Donation Map</h2>
              <div className="map-controls">
                <button
                  className={`map-control-btn ${showMap ? "active" : ""}`}
                  onClick={() => setShowMap(!showMap)}
                >
                  <FaRoute />
                  {showMap ? "Hide Map" : "Show Map"}
                </button>
                {selectedDonation && (
                  <div className="selected-donation-info">
                    <span>📍 Viewing: {selectedDonation.name}</span>
                    <button
                      className="clear-selection-btn"
                      onClick={() => setSelectedDonation(null)}
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>

              {showMap && selectedDonation && charityLocation && (
                <div className="map-container">
                  <MapView
                    donorLocation={
                      selectedDonation.coordinates || [40.7128, -74.006]
                    }
                    charityLocation={charityLocation}
                  />
                </div>
              )}

              {!selectedDonation && (
                <div className="map-placeholder">
                  <FaMapMarkerAlt size={48} />
                  <h3>Select a donation to view on map</h3>
                  <p>
                    Choose a food donation to see the pickup location and route
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharityDashboard;
