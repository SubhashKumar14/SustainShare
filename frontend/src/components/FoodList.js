import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  FaUtensils,
  FaMapMarkerAlt,
  FaClock,
  FaEye,
  FaSearch,
  FaHeart,
  FaTruck,
} from "react-icons/fa";
import API from "../services/api";
import FoodTracker from "./FoodTracker";
import "./FoodList.css";

const FoodList = ({ showTracking = false, userRole = "charity" }) => {
  const [foodItems, setFoodItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    category: "ALL",
    status: "ALL",
    location: "",
  });

  const categories = [
    { value: "ALL", label: "All Categories" },
    { value: "COOKED_FOOD", label: "🍽️ Cooked Food" },
    { value: "FRESH_PRODUCE", label: "🥬 Fresh Produce" },
    { value: "PACKAGED_FOOD", label: "📦 Packaged Food" },
    { value: "BAKERY", label: "🥖 Bakery Items" },
    { value: "DAIRY", label: "🥛 Dairy Products" },
    { value: "OTHER", label: "🍕 Other" },
  ];

  const statusOptions = [
    { value: "ALL", label: "All Status" },
    { value: "AVAILABLE", label: "✅ Available" },
    { value: "CLAIMED", label: "✋ Claimed" },
    { value: "IN_TRANSIT", label: "🚚 In Transit" },
    { value: "DELIVERED", label: "📦 Delivered" },
  ];

  useEffect(() => {
    fetchFoodItems();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [foodItems, filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchFoodItems = async () => {
    try {
      setLoading(true);
      const response = await API.get("/food");
      setFoodItems(response.data || []);
    } catch (error) {
      console.error("Error fetching food items:", error);
      toast.error("Failed to load food items");
      setFoodItems([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...foodItems];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name?.toLowerCase().includes(searchTerm) ||
          item.description?.toLowerCase().includes(searchTerm) ||
          item.donorId?.toLowerCase().includes(searchTerm),
      );
    }

    // Category filter
    if (filters.category !== "ALL") {
      filtered = filtered.filter((item) => item.category === filters.category);
    }

    // Status filter
    if (filters.status !== "ALL") {
      filtered = filtered.filter((item) => item.status === filters.status);
    }

    // Location filter
    if (filters.location) {
      const locationTerm = filters.location.toLowerCase();
      filtered = filtered.filter((item) =>
        item.pickupLocation?.toLowerCase().includes(locationTerm),
      );
    }

    setFilteredItems(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const claimFood = async (item) => {
    try {
      await API.put(`/food/${item.id}/claim`, {
        charityId: localStorage.getItem("userId"),
        status: "CLAIMED",
      });

      toast.success(`Successfully claimed ${item.name}!`, {
        position: "top-center",
      });

      fetchFoodItems(); // Refresh the list
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to claim food item";
      toast.error(errorMsg);
    }
  };

  const updateStatus = async (itemId, newStatus) => {
    try {
      await API.put(`/food/${itemId}/status`, { status: newStatus });
      toast.success("Status updated successfully!");
      fetchFoodItems(); // Refresh the list
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      AVAILABLE: { color: "#28a745", label: "Available", icon: "✅" },
      CLAIMED: { color: "#ffc107", label: "Claimed", icon: "✋" },
      IN_TRANSIT: { color: "#17a2b8", label: "In Transit", icon: "🚚" },
      DELIVERED: { color: "#28a745", label: "Delivered", icon: "📦" },
      EXPIRED: { color: "#dc3545", label: "Expired", icon: "⏰" },
    };

    const info = statusMap[status] || statusMap.AVAILABLE;

    return (
      <span className="status-badge" style={{ backgroundColor: info.color }}>
        {info.icon} {info.label}
      </span>
    );
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

  if (loading) {
    return (
      <div className="food-list-container loading">
        <div className="spinner"></div>
        <p>Loading available food donations...</p>
      </div>
    );
  }

  return (
    <div className="food-list-container">
      <div className="food-list-header">
        <h2>
          <FaUtensils />
          {showTracking ? "Food Donation Tracking" : "Available Food Donations"}
        </h2>
        <p>
          {showTracking
            ? "Track the status of your food donations"
            : "Help reduce food waste by claiming available donations"}
        </p>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-bar">
          <FaSearch />
          <input
            type="text"
            placeholder="Search food items..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            {statusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Filter by location..."
            value={filters.location}
            onChange={(e) => handleFilterChange("location", e.target.value)}
          />
        </div>
      </div>

      {/* Results count */}
      <div className="results-info">
        <span>
          {filteredItems.length} donation{filteredItems.length !== 1 ? "s" : ""}{" "}
          found
        </span>
        {filters.search ||
        filters.category !== "ALL" ||
        filters.status !== "ALL" ||
        filters.location ? (
          <button
            className="clear-filters"
            onClick={() =>
              setFilters({
                search: "",
                category: "ALL",
                status: "ALL",
                location: "",
              })
            }
          >
            Clear Filters
          </button>
        ) : null}
      </div>

      {/* Food Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="no-items">
          <FaUtensils size={48} />
          <h3>No food donations found</h3>
          <p>
            {filters.search ||
            filters.category !== "ALL" ||
            filters.status !== "ALL" ||
            filters.location
              ? "Try adjusting your filters to see more results."
              : "No food has been posted yet. Check back later!"}
          </p>
        </div>
      ) : (
        <div className="food-grid">
          {filteredItems.map((item) => (
            <div key={item.id} className="food-card">
              <div className="food-card-header">
                <h3>{item.name}</h3>
                {getStatusBadge(item.status)}
              </div>

              <div className="food-card-content">
                <div className="food-info">
                  <p className="quantity">
                    <FaUtensils />
                    <span>{item.quantity}</span>
                  </p>

                  <p className="location">
                    <FaMapMarkerAlt />
                    <span>{item.pickupLocation}</span>
                  </p>

                  <p className="expiry">
                    <FaClock />
                    <span
                      className={
                        item.status === "EXPIRED" ? "expired" : "active"
                      }
                    >
                      {formatTimeRemaining(item.expiryTime)}
                    </span>
                  </p>

                  {item.category && (
                    <p className="category">
                      Category: {item.category.replace("_", " ")}
                    </p>
                  )}

                  {item.description && (
                    <p className="description">{item.description}</p>
                  )}

                  {item.allergens && (
                    <p className="allergens">⚠️ Allergens: {item.allergens}</p>
                  )}
                </div>

                <div className="food-card-actions">
                  {showTracking ? (
                    <button
                      className="track-btn"
                      onClick={() =>
                        setSelectedItem(
                          selectedItem === item.id ? null : item.id,
                        )
                      }
                    >
                      <FaEye />
                      {selectedItem === item.id
                        ? "Hide Tracker"
                        : "Track Progress"}
                    </button>
                  ) : (
                    <>
                      {item.status === "AVAILABLE" &&
                        userRole === "charity" && (
                          <button
                            className="claim-btn"
                            onClick={() => claimFood(item)}
                          >
                            <FaHeart />
                            Claim Food
                          </button>
                        )}

                      {userRole === "donor" &&
                        item.donorId === localStorage.getItem("userId") && (
                          <div className="status-controls">
                            {item.status === "CLAIMED" && (
                              <button
                                className="status-btn in-transit"
                                onClick={() =>
                                  updateStatus(item.id, "IN_TRANSIT")
                                }
                              >
                                <FaTruck />
                                Mark In Transit
                              </button>
                            )}
                          </div>
                        )}
                    </>
                  )}
                </div>

                {/* Tracking component */}
                {showTracking && selectedItem === item.id && (
                  <div className="tracker-section">
                    <FoodTracker donationId={item.id} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FoodList;
