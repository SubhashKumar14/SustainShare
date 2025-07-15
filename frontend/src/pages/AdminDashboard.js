import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaUtensils,
  FaTruck,
  FaChartBar,
  FaSearch,
  FaTrash,
  FaMapMarkerAlt,
  FaDownload,
} from "react-icons/fa";
import { toast } from "react-toastify";
import API from "../services/api";
import MapView from "../components/MapView";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [data, setData] = useState({
    users: [],
    foodItems: [],
    pickups: [],
    analytics: {
      totalUsers: 0,
      totalDonations: 0,
      totalPickups: 0,
      successfulDeliveries: 0,
      averageResponseTime: 0,
      peopleFed: 0,
    },
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchAllData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Try to fetch from API
      const [usersRes, foodRes, pickupsRes] = await Promise.all([
        API.get("/users"),
        API.get("/food"),
        API.get("/pickups"),
      ]);

      const users = usersRes.data || [];
      const foodItems = foodRes.data || [];
      const pickups = pickupsRes.data || [];

      setData({
        users,
        foodItems,
        pickups,
        analytics: calculateAnalytics(users, foodItems, pickups),
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      // No demo data - require backend connection
      setData({
        users: [],
        foodItems: [],
        pickups: [],
        analytics: {
          totalUsers: 0,
          totalDonations: 0,
          totalPickups: 0,
          successfulDeliveries: 0,
          averageResponseTime: 0,
          peopleFed: 0,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (users, foodItems, pickups) => {
    const totalUsers = users.length;
    const donors = users.filter((u) => u.role === "DONOR").length;
    const charities = users.filter((u) => u.role === "CHARITY").length;
    const totalDonations = foodItems.length;
    const successfulDeliveries = foodItems.filter(
      (item) => item.status === "DELIVERED",
    ).length;
    const totalPickups = pickups.length;
    const completedPickups = pickups.filter(
      (pickup) => pickup.status === "Completed",
    ).length;

    // Calculate people fed based on delivered food quantities
    const peopleFed = foodItems
      .filter((item) => item.status === "DELIVERED")
      .reduce((sum, item) => {
        const qty = parseInt(item.quantity) || 0;
        return sum + qty;
      }, 0);

    return {
      totalUsers,
      donors,
      charities,
      totalDonations,
      totalPickups,
      successfulDeliveries,
      completedPickups,
      averageResponseTime: totalPickups > 0 ? 24 : 0,
      peopleFed,
    };
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await API.delete(`/users/${userId}`);
      setData((prev) => ({
        ...prev,
        users: prev.users.filter((user) => user.id !== userId),
      }));
      toast.success("User deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const deleteFood = async (foodId) => {
    if (!window.confirm("Are you sure you want to delete this food item?"))
      return;

    try {
      await API.delete(`/food/${foodId}`);
      setData((prev) => ({
        ...prev,
        foodItems: prev.foodItems.filter((item) => item.id !== foodId),
      }));
      toast.success("Food item deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete food item");
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await API.put(`/users/${userId}/role`, { role: newRole });
      setData((prev) => ({
        ...prev,
        users: prev.users.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user,
        ),
      }));
      toast.success("User role updated successfully!");
    } catch (error) {
      toast.error("Failed to update user role");
    }
  };

  const exportData = () => {
    const exportObject = {
      users: data.users,
      foodItems: data.foodItems,
      pickups: data.pickups,
      analytics: data.analytics,
      exportedAt: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(exportObject, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sustain_share_data_${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Data exported successfully!");
  };

  const filteredUsers = data.users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredFood = data.foodItems.filter(
    (item) =>
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pickupLocation?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-text">
            <h1>
              <FaChartBar className="header-icon" />
              Admin Dashboard
            </h1>
            <p>Manage users, donations, and system analytics</p>
          </div>
          <div className="header-actions">
            <button onClick={exportData} className="export-btn">
              <FaDownload />
              Export Data
            </button>
            <button onClick={fetchAllData} className="refresh-btn">
              🔄 Refresh
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <nav className="dashboard-nav">
          <button
            className={`nav-btn ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <FaChartBar /> Overview
          </button>
          <button
            className={`nav-btn ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <FaUsers /> Users
          </button>
          <button
            className={`nav-btn ${activeTab === "food" ? "active" : ""}`}
            onClick={() => setActiveTab("food")}
          >
            <FaUtensils /> Food Donations
          </button>
          <button
            className={`nav-btn ${activeTab === "pickups" ? "active" : ""}`}
            onClick={() => setActiveTab("pickups")}
          >
            <FaTruck /> Pickups
          </button>
          <button
            className={`nav-btn ${activeTab === "map" ? "active" : ""}`}
            onClick={() => setActiveTab("map")}
          >
            <FaMapMarkerAlt /> Map View
          </button>
        </nav>

        <div className="tab-content">
          {activeTab === "overview" && (
            <div className="overview-tab">
              <h2>📊 System Overview</h2>

              {loading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <p>Loading system data...</p>
                </div>
              ) : (
                <>
                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-icon users">
                        <FaUsers />
                      </div>
                      <div className="stat-content">
                        <span className="stat-number">
                          {data.analytics.totalUsers}
                        </span>
                        <span className="stat-label">Total Users</span>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-icon donations">
                        <FaUtensils />
                      </div>
                      <div className="stat-content">
                        <span className="stat-number">
                          {data.analytics.totalDonations}
                        </span>
                        <span className="stat-label">Food Donations</span>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-icon pickups">
                        <FaTruck />
                      </div>
                      <div className="stat-content">
                        <span className="stat-number">
                          {data.analytics.totalPickups}
                        </span>
                        <span className="stat-label">Scheduled Pickups</span>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-icon delivered">
                        <FaChartBar />
                      </div>
                      <div className="stat-content">
                        <span className="stat-number">
                          {data.analytics.peopleFed}
                        </span>
                        <span className="stat-label">People Fed</span>
                      </div>
                    </div>
                  </div>

                  {data.analytics.totalUsers === 0 && (
                    <div className="empty-state">
                      <FaChartBar size={48} />
                      <h3>No data available</h3>
                      <p>
                        Please start the backend server to load system data.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === "users" && (
            <div className="users-tab">
              <div className="tab-header">
                <h2>👥 User Management</h2>
                <div className="search-box">
                  <FaSearch />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {filteredUsers.length === 0 ? (
                <div className="empty-state">
                  <FaUsers size={48} />
                  <h3>No users found</h3>
                  <p>Start the backend server to load user data.</p>
                </div>
              ) : (
                <div className="data-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>
                            <select
                              value={user.role}
                              onChange={(e) =>
                                updateUserRole(user.id, e.target.value)
                              }
                              className="role-select"
                            >
                              <option value="DONOR">Donor</option>
                              <option value="CHARITY">Charity</option>
                              <option value="ADMIN">Admin</option>
                            </select>
                          </td>
                          <td>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <button
                              onClick={() => deleteUser(user.id)}
                              className="delete-btn"
                              title="Delete user"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "food" && (
            <div className="food-tab">
              <div className="tab-header">
                <h2>🍽️ Food Donations</h2>
                <div className="search-box">
                  <FaSearch />
                  <input
                    type="text"
                    placeholder="Search food items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {filteredFood.length === 0 ? (
                <div className="empty-state">
                  <FaUtensils size={48} />
                  <h3>No food donations found</h3>
                  <p>Start the backend server to load donation data.</p>
                </div>
              ) : (
                <div className="data-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Food Item</th>
                        <th>Quantity</th>
                        <th>Status</th>
                        <th>Pickup Location</th>
                        <th>Expiry</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFood.map((item) => (
                        <tr key={item.id}>
                          <td>{item.name}</td>
                          <td>{item.quantity}</td>
                          <td>
                            <span
                              className={`status-badge ${item.status?.toLowerCase()}`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td>{item.pickupLocation}</td>
                          <td>
                            {new Date(item.expiryTime).toLocaleDateString()}
                          </td>
                          <td>
                            <button
                              onClick={() => deleteFood(item.id)}
                              className="delete-btn"
                              title="Delete food item"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "map" && (
            <div className="map-tab">
              <h2>🗺️ Donation Map</h2>
              <div className="map-container">
                <MapView
                  donorLocation={[17.4065, 78.4772]} // Banjara Hills, Hyderabad
                  charityLocation={[17.4126, 78.44]} // Jubilee Hills, Hyderabad
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
