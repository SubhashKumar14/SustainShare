import React, { useState, useEffect } from "react";

import { toast } from "react-toastify";
import {
  FaHeart,
  FaClock,
  FaMapMarkerAlt,
  FaSearch,
  FaUtensils,
  FaTruck,
  FaFilter,
  FaPhoneAlt,
  FaCheckCircle,
  FaEye,
  FaChartBar,
} from "react-icons/fa";
import API from "../services/api";

import OrderTrackingMap from "../components/OrderTrackingMap";

import { addressToCoordinates } from "../utils/geocode";
import "./CharityDashboard.css";

const CharityDashboard = () => {
  const [activeTab, setActiveTab] = useState("available");
  const [foodItems, setFoodItems] = useState([]);
  const [claimedItems, setClaimedItems] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [loading, setLoading] = useState(false);

  const [charityLocation, setCharityLocation] = useState(null);
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState(null);
  const [stats, setStats] = useState({
    totalClaimed: 0,
    activeClaims: 0,
    peopleFed: 0,
  });

  const currentCharityId = localStorage.getItem("userId") || "charity123";
  const charityAddress = "789 Charity Ave, Community Center"; // Demo address

  const categories = [
    { value: "ALL", label: "All Categories" },
    { value: "COOKED_FOOD", label: "����️ Cooked Food" },
    { value: "FRESH_PRODUCE", label: "🥬 Fresh Produce" },
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAvailableFood = async () => {
    try {
      setLoading(true);
      const response = await API.get("/food");
      const availableFood =
        response.data?.filter((item) => item.status === "AVAILABLE") || [];
      setFoodItems(availableFood);
    } catch (error) {
      console.error("Error fetching food:", error);
      // No demo data - require backend connection
      setFoodItems([]);
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
      console.error("Error fetching claimed food:", error);
      // No demo data - require backend connection
      setClaimedItems([]);
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

      // Set for map tracking view
      setSelectedTrackingOrder({
        ...foodItem,
        status: "CLAIMED",
        claimedBy: currentCharityId,
        donorLocation: foodItem.coordinates || [40.7128, -74.006],
        charityLocation: charityLocation || [40.7831, -73.9712],
        donorName: "Food Donor",
        donorPhone: "+1-555-123-4567",
        charityName: "Community Kitchen",
        charityPhone: "+1-555-987-6543",
        charityAddress: charityAddress,
      });

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
        return <FaHeart className="status-icon claimed" />;
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
            <FaHeart /> My Claims
          </button>
          <button
            className={`nav-btn ${activeTab === "tracking" ? "active" : ""}`}
            onClick={() => setActiveTab("tracking")}
          >
            <FaTruck /> Map Tracking
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
                          <FaHeart />
                          {loading ? "Claiming..." : "Claim Food"}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTrackingOrder(item);
                            setActiveTab("tracking");
                          }}
                          className="view-location-btn"
                        >
                          <FaMapMarkerAlt />
                          View on Map
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
              <h2>��� My Claimed Donations</h2>
              {claimedItems.length === 0 ? (
                <div className="empty-state">
                  <FaHeart size={48} />
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
                          <button
                            className="action-btn track"
                            onClick={() => {
                              setSelectedTrackingOrder(item);
                              setActiveTab("tracking");
                            }}
                          >
                            <FaTruck /> Track Order
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "tracking" && (
            <div className="tracking-tab">
              <h2>🗺️ Map-Based Order Tracking</h2>
              <p className="tracking-description">
                Select a food donation to track its pickup and delivery in
                real-time using our interactive map
              </p>

              {/* Available Food for Tracking */}
              {filteredFood.length > 0 && (
                <div className="available-for-tracking">
                  <h3>📍 Available Donations (Click to Track Location)</h3>
                  <div className="tracking-food-grid">
                    {filteredFood.slice(0, 3).map((item) => (
                      <div key={item.id} className="tracking-food-card">
                        <h4>{item.name}</h4>
                        <p>📍 {item.pickupLocation}</p>
                        <p>🍽️ {item.quantity}</p>
                        <button
                          className="track-location-btn"
                          onClick={() => {
                            setSelectedTrackingOrder({
                              ...item,
                              status: "AVAILABLE",
                              donorLocation: item.coordinates || [
                                17.4065, 78.4772,
                              ],
                              charityLocation: charityLocation || [
                                17.4126, 78.44,
                              ],
                              donorName: "Food Donor",
                              donorPhone: "+91-9876543210",
                              charityName: "Community Kitchen",
                              charityPhone: "+91-8765432109",
                              charityAddress: charityAddress,
                            });
                          }}
                        >
                          <FaMapMarkerAlt /> Track on Map
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Claimed Orders Tracking */}
              {claimedItems.length === 0 && filteredFood.length === 0 ? (
                <div className="empty-state">
                  <FaTruck size={48} />
                  <h3>No donations to track</h3>
                  <p>
                    Claim some food donations to start tracking their delivery
                    on the map!
                  </p>
                  <button
                    className="primary-btn"
                    onClick={() => setActiveTab("available")}
                  >
                    <FaUtensils /> Browse Available Food
                  </button>
                </div>
              ) : (
                <div className="tracking-section">
                  {/* Claimed Orders */}
                  {claimedItems.length > 0 && (
                    <div className="claimed-orders-tracking">
                      <h3>🚚 My Claimed Orders (Live Tracking)</h3>
                      <div className="order-list">
                        {claimedItems.map((item) => (
                          <div
                            key={item.id}
                            className={`order-item ${selectedTrackingOrder?.id === item.id ? "selected" : ""}`}
                            onClick={() => setSelectedTrackingOrder(item)}
                          >
                            <div className="order-item-info">
                              <h4>{item.name}</h4>
                              <p>
                                {item.quantity} - {item.pickupLocation}
                              </p>
                            </div>
                            <div
                              className="order-status"
                              style={{
                                backgroundColor: getStatusColor(item.status),
                              }}
                            >
                              {getStatusIcon(item.status)}
                              {item.status}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Interactive Order Tracking Map */}
                  <div className="tracking-map-section">
                    <OrderTrackingMap
                      order={selectedTrackingOrder}
                      onStatusUpdate={(newStatus) => {
                        if (selectedTrackingOrder) {
                          updateClaimStatus(
                            selectedTrackingOrder.id,
                            newStatus,
                          );
                        }
                      }}
                    />
                  </div>
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
