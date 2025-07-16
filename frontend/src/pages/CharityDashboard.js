import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import API from "../services/api";
import { toast } from "react-toastify";
import MapView from "../components/MapView";
import {
  FaHeart,
  FaClock,
  FaMapMarkerAlt,
  FaSearch,
  FaUtensils,
  FaTruck,
  FaChartLine,
  FaUsers,
  FaBoxOpen,
  FaCalendarAlt,
  FaPhone,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import "./CharityDashboard.css";

const CharityDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [foodItems, setFoodItems] = useState([]);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isClaiming, setIsClaiming] = useState(false);
  const [activeTab, setActiveTab] = useState("browse");
  const [myPickups, setMyPickups] = useState([]);
  const [stats, setStats] = useState({
    totalClaimed: 0,
    peopleServed: 0,
    activeDonations: 0,
    completedPickups: 0,
  });

  useEffect(() => {
    fetchAvailableFood();
    fetchMyPickups();
    fetchCharityStats();
  }, [currentUser]);

  const fetchAvailableFood = async () => {
    try {
      const res = await API.get("/food");
      setFoodItems(res.data);
    } catch (error) {
      console.error("Error fetching food:", error);
      toast.error("Failed to fetch available food");
    }
  };

  const fetchMyPickups = async () => {
    try {
      // In a real app, this would filter by charity ID
      const pickups = JSON.parse(
        localStorage.getItem("sustainshare_pickups") || "[]",
      );
      const charityPickups = pickups.filter(
        (pickup) =>
          pickup.charity?.id === currentUser?.id ||
          pickup.charity?.name === currentUser?.name,
      );
      setMyPickups(charityPickups);
    } catch (error) {
      console.error("Error fetching pickups:", error);
    }
  };

  const fetchCharityStats = () => {
    const savedStats = localStorage.getItem(`charity_stats_${currentUser?.id}`);
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    } else {
      const demoStats = {
        totalClaimed: Math.floor(Math.random() * 30) + 15,
        peopleServed: Math.floor(Math.random() * 500) + 200,
        activeDonations: Math.floor(Math.random() * 8) + 3,
        completedPickups: Math.floor(Math.random() * 25) + 10,
      };
      setStats(demoStats);
      localStorage.setItem(
        `charity_stats_${currentUser?.id}`,
        JSON.stringify(demoStats),
      );
    }
  };

  const claimPickup = async (foodItem) => {
    if (!currentUser?.id) {
      toast.error("Please log in as a charity first");
      return;
    }

    const time = prompt("Enter pickup time in 24-hr format (e.g., 17:30):");
    if (!time || !/^\d{2}:\d{2}$/.test(time)) {
      toast.error("Please enter a valid time in 24-hour format (HH:MM)");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const scheduledTime = `${today}T${time}:00`;

    setIsClaiming(true);
    try {
      const pickupData = {
        id: `pickup_${Date.now()}`,
        scheduledTime,
        foodItem: { id: foodItem.id, name: foodItem.name },
        charity: {
          id: currentUser.id,
          name: currentUser.name,
          location: "Charminar, Hyderabad", // Default charity location
        },
        status: "Scheduled",
        createdAt: new Date().toISOString(),
      };

      await API.post("/pickups", pickupData);

      // Update local storage for demo
      const pickups = JSON.parse(
        localStorage.getItem("sustainshare_pickups") || "[]",
      );
      pickups.push(pickupData);
      localStorage.setItem("sustainshare_pickups", JSON.stringify(pickups));

      toast.success(
        <div>
          <FaTruck /> Pickup scheduled successfully!
          <div style={{ fontSize: "0.9em", marginTop: "5px" }}>
            {foodItem.name} at {time}
          </div>
        </div>,
        { autoClose: 3000 },
      );

      // Update stats
      const updatedStats = {
        ...stats,
        totalClaimed: stats.totalClaimed + 1,
        activeDonations: stats.activeDonations + 1,
        peopleServed: stats.peopleServed + Math.floor(Math.random() * 20) + 10,
      };
      setStats(updatedStats);
      localStorage.setItem(
        `charity_stats_${currentUser?.id}`,
        JSON.stringify(updatedStats),
      );

      setSelectedDonation(foodItem);
      fetchMyPickups();
    } catch (error) {
      console.error("Failed to schedule pickup:", error);
      toast.error("Failed to schedule pickup. Please try again.");
    } finally {
      setIsClaiming(false);
    }
  };

  const updatePickupStatus = async (pickupId, newStatus) => {
    try {
      const pickups = JSON.parse(
        localStorage.getItem("sustainshare_pickups") || "[]",
      );
      const updatedPickups = pickups.map((pickup) =>
        pickup.id === pickupId ? { ...pickup, status: newStatus } : pickup,
      );
      localStorage.setItem(
        "sustainshare_pickups",
        JSON.stringify(updatedPickups),
      );

      if (newStatus === "Completed") {
        const updatedStats = {
          ...stats,
          completedPickups: stats.completedPickups + 1,
          activeDonations: Math.max(0, stats.activeDonations - 1),
        };
        setStats(updatedStats);
        localStorage.setItem(
          `charity_stats_${currentUser?.id}`,
          JSON.stringify(updatedStats),
        );
      }

      toast.success(`Pickup ${newStatus.toLowerCase()}!`);
      fetchMyPickups();
    } catch (error) {
      toast.error("Failed to update pickup status");
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "scheduled":
        return "#4299e1";
      case "in-progress":
        return "#ed8936";
      case "completed":
        return "#48bb78";
      case "cancelled":
        return "#e53e3e";
      default:
        return "#718096";
    }
  };

  const filteredFood = foodItems.filter(
    (item) =>
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pickupLocation?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="charity-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-text">
            <h1>🤝 Welcome, {currentUser?.name || "Charity"}!</h1>
            <p>
              Help distribute food to those who need it most in your community
            </p>
          </div>
          <div className="user-avatar">
            <FaHeart />
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <h3>{stats.totalClaimed}</h3>
              <p>Total Claimed</p>
            </div>
          </div>
          <div className="stat-card success">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>{stats.peopleServed}</h3>
              <p>People Served</p>
            </div>
          </div>
          <div className="stat-card warning">
            <div className="stat-icon">🚛</div>
            <div className="stat-content">
              <h3>{stats.activeDonations}</h3>
              <p>Active Pickups</p>
            </div>
          </div>
          <div className="stat-card info">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>{stats.completedPickups}</h3>
              <p>Completed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === "browse" ? "active" : ""}`}
          onClick={() => setActiveTab("browse")}
        >
          <FaBoxOpen /> Browse Food
        </button>
        <button
          className={`tab-btn ${activeTab === "pickups" ? "active" : ""}`}
          onClick={() => setActiveTab("pickups")}
        >
          <FaTruck /> My Pickups
        </button>
        <button
          className={`tab-btn ${activeTab === "analytics" ? "active" : ""}`}
          onClick={() => setActiveTab("analytics")}
        >
          <FaChartLine /> Analytics
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "browse" && (
          <section className="food-browse-section">
            <div className="section-header">
              <h2>🍽️ Available Food Donations</h2>
              <div className="search-box">
                <FaSearch />
                <input
                  type="text"
                  placeholder="Search food or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {filteredFood.length === 0 ? (
              <div className="empty-state">
                <FaUtensils className="empty-icon" />
                <h3>No food donations available</h3>
                <p>Check back later for new donations from generous donors!</p>
              </div>
            ) : (
              <div className="food-grid">
                {filteredFood.map((item) => (
                  <div key={item.id} className="food-card">
                    <div className="food-image">
                      {item.image ? (
                        <img src={item.image} alt={item.name} />
                      ) : (
                        <div className="placeholder-image">
                          <FaUtensils />
                        </div>
                      )}
                      <div className="food-badges">
                        <span
                          className={`type-badge ${item.type?.toLowerCase() || "veg"}`}
                        >
                          {item.type === "Non-Veg" ? "🔴" : "🟢"}{" "}
                          {item.type || "Veg"}
                        </span>
                        {item.spiceLevel && item.spiceLevel !== "None" && (
                          <span className="spice-badge">
                            {item.spiceLevel === "Hot"
                              ? "🌶️🌶️🌶️"
                              : item.spiceLevel === "Medium"
                                ? "🌶️🌶️"
                                : "🌶️"}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="food-content">
                      <div className="food-header">
                        <h3>
                          <FaUtensils /> {item.name}
                        </h3>
                        <span className="quantity-badge">
                          {item.quantity} servings
                        </span>
                      </div>

                      <div className="food-details">
                        <div className="detail-row">
                          <FaMapMarkerAlt />
                          <span>{item.pickupLocation}</span>
                        </div>
                        <div className="detail-row">
                          <FaClock />
                          <span>Best before {item.expiryTime}</span>
                        </div>
                        {item.description && (
                          <p className="description">{item.description}</p>
                        )}
                      </div>

                      <div className="action-buttons">
                        <button
                          onClick={() => claimPickup(item)}
                          className="claim-btn"
                          disabled={isClaiming}
                        >
                          {isClaiming ? (
                            <>
                              <div className="spinner"></div>
                              Processing...
                            </>
                          ) : (
                            <>
                              <FaTruck /> Claim Donation
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => {
                            if (!item.id) {
                              toast.error("Invalid donation ID");
                              return;
                            }
                            navigate(`/track/${item.id}`);
                          }}
                          className="track-btn"
                        >
                          <FaMapMarkerAlt /> View Location
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === "pickups" && (
          <section className="pickups-section">
            <div className="section-header">
              <h2>🚛 My Scheduled Pickups</h2>
              <p>Manage your upcoming and completed food pickups</p>
            </div>

            {myPickups.length === 0 ? (
              <div className="empty-state">
                <FaTruck className="empty-icon" />
                <h3>No pickups scheduled</h3>
                <p>
                  Claim some food donations to start helping your community!
                </p>
                <button
                  className="primary-btn"
                  onClick={() => setActiveTab("browse")}
                >
                  <FaBoxOpen /> Browse Food
                </button>
              </div>
            ) : (
              <div className="pickups-grid">
                {myPickups.map((pickup) => (
                  <div key={pickup.id} className="pickup-card">
                    <div className="pickup-header">
                      <div className="pickup-info">
                        <h3>{pickup.foodItem?.name || "Food Item"}</h3>
                        <span
                          className="status-badge"
                          style={{
                            backgroundColor: getStatusColor(pickup.status),
                          }}
                        >
                          {pickup.status}
                        </span>
                      </div>
                      <div className="pickup-time">
                        <FaCalendarAlt />
                        <span>
                          {new Date(pickup.scheduledTime).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="pickup-details">
                      <div className="detail-item">
                        <FaMapMarkerAlt />
                        <span>Pickup from donor location</span>
                      </div>
                      <div className="detail-item">
                        <FaPhone />
                        <span>Contact: +91 98765 43210</span>
                      </div>
                    </div>

                    {pickup.status === "Scheduled" && (
                      <div className="pickup-actions">
                        <button
                          onClick={() =>
                            updatePickupStatus(pickup.id, "In-Progress")
                          }
                          className="start-btn"
                        >
                          <FaTruck /> Start Pickup
                        </button>
                        <button
                          onClick={() =>
                            updatePickupStatus(pickup.id, "Cancelled")
                          }
                          className="cancel-btn"
                        >
                          <FaTimesCircle /> Cancel
                        </button>
                      </div>
                    )}

                    {pickup.status === "In-Progress" && (
                      <div className="pickup-actions">
                        <button
                          onClick={() =>
                            updatePickupStatus(pickup.id, "Completed")
                          }
                          className="complete-btn"
                        >
                          <FaCheckCircle /> Mark Complete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === "analytics" && (
          <section className="analytics-section">
            <div className="section-header">
              <h2>📊 Impact Analytics</h2>
              <p>Track your charity's impact in the community</p>
            </div>

            <div className="analytics-grid">
              <div className="analytics-card">
                <h3>📈 Monthly Performance</h3>
                <div className="performance-stats">
                  <div className="performance-item">
                    <span className="performance-number">
                      {Math.floor(stats.totalClaimed / 2)}
                    </span>
                    <span className="performance-label">
                      Donations this month
                    </span>
                  </div>
                  <div className="performance-item">
                    <span className="performance-number">
                      {Math.floor(stats.peopleServed / 3)}
                    </span>
                    <span className="performance-label">
                      People served this month
                    </span>
                  </div>
                </div>
              </div>

              <div className="analytics-card">
                <h3>🎯 Community Impact</h3>
                <div className="impact-metrics">
                  <p>
                    <strong>{stats.peopleServed}</strong> people served to date
                  </p>
                  <p>
                    <strong>{stats.totalClaimed * 5}kg</strong> food distributed
                  </p>
                  <p>
                    <strong>{Math.floor(stats.completedPickups * 2.3)}</strong>{" "}
                    families helped
                  </p>
                </div>
              </div>

              <div className="analytics-card full-width">
                <h3>🗺️ Service Area Tracking</h3>
                <div className="map-container">
                  <MapView
                    donorLocation={[17.4126, 78.4448]}
                    charityLocation={[17.3616, 78.4747]}
                  />
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {selectedDonation && currentUser && (
        <div className="floating-map">
          <div className="map-header">
            <h4>📍 Route to Pickup Location</h4>
            <button onClick={() => setSelectedDonation(null)}>×</button>
          </div>
          <MapView
            donorLocation={[17.4126, 78.4448]}
            charityLocation={[17.3616, 78.4747]}
          />
        </div>
      )}
    </div>
  );
};

export default CharityDashboard;
