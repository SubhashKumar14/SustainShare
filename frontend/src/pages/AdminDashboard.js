import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  FaUserShield,
  FaChartBar,
  FaUsers,
  FaUtensils,
  FaTruck,
  FaSearch,
  FaClock,
  FaMapMarkerAlt,
  FaTrash,
  FaEye,
  FaDownload,
  FaCheckCircle,
  FaExclamationTriangle,
  FaHeart,
} from "react-icons/fa";
import API from "../services/api";
import MapView from "../components/MapView";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [data, setData] = useState({
    users: [],
    foodItems: [],
    pickups: [],
    analytics: {
      totalUsers: 0,
      totalDonations: 0,
      totalPickups: 0,
      peopleFed: 0,
      donors: 0,
      charities: 0,
    },
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [selectedTimeRange, setSelectedTimeRange] = useState("7days");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showMap, setShowMap] = useState(false);

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
      // Use comprehensive demo data
      const demoUsers = [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          role: "DONOR",
          createdAt: "2024-12-20T10:00:00",
          phone: "+1234567890",
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@example.com",
          role: "CHARITY",
          createdAt: "2024-12-21T14:00:00",
          phone: "+1234567891",
        },
        {
          id: 3,
          name: "Bob Wilson",
          email: "bob@example.com",
          role: "DONOR",
          createdAt: "2024-12-22T09:00:00",
          phone: "+1234567892",
        },
        {
          id: 4,
          name: "Mary Johnson",
          email: "mary@example.com",
          role: "CHARITY",
          createdAt: "2024-12-23T16:00:00",
          phone: "+1234567893",
        },
        {
          id: 5,
          name: "Admin User",
          email: "admin@example.com",
          role: "ADMIN",
          createdAt: "2024-12-19T08:00:00",
          phone: "+1234567894",
        },
      ];

      const demoFood = [
        {
          id: 1,
          name: "Fresh Vegetables",
          quantity: "50 servings",
          category: "FRESH_PRODUCE",
          status: "AVAILABLE",
          pickupLocation: "123 Main St",
          donorId: "donor123",
          createdAt: "2024-12-24T10:00:00",
          expiryTime: "2024-12-25T18:00:00",
        },
        {
          id: 2,
          name: "Cooked Rice",
          quantity: "100 servings",
          category: "COOKED_FOOD",
          status: "CLAIMED",
          pickupLocation: "456 Oak Ave",
          donorId: "donor456",
          createdAt: "2024-12-24T08:00:00",
          expiryTime: "2024-12-24T20:00:00",
        },
        {
          id: 3,
          name: "Packaged Bread",
          quantity: "30 loaves",
          category: "PACKAGED_FOOD",
          status: "DELIVERED",
          pickupLocation: "789 Pine St",
          donorId: "donor789",
          createdAt: "2024-12-23T15:00:00",
          expiryTime: "2024-12-26T12:00:00",
        },
      ];

      const demoPickups = [
        {
          id: 1,
          scheduledTime: "2024-12-24T15:00:00",
          status: "Completed",
          charity: { id: 1, name: "Food Bank Central" },
          foodItem: { id: 1, name: "Fresh Vegetables" },
          createdAt: "2024-12-24T14:30:00",
        },
        {
          id: 2,
          scheduledTime: "2024-12-24T17:00:00",
          status: "Scheduled",
          charity: { id: 2, name: "Community Kitchen" },
          foodItem: { id: 2, name: "Cooked Rice" },
          createdAt: "2024-12-24T16:00:00",
        },
      ];

      setData({
        users: demoUsers,
        foodItems: demoFood,
        pickups: demoPickups,
        analytics: calculateAnalytics(demoUsers, demoFood, demoPickups),
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
    const totalPickups = pickups.length;
    const peopleFed = foodItems.reduce((sum, item) => {
      const qty = parseInt(item.quantity) || 0;
      return sum + (item.status === "DELIVERED" ? qty : 0);
    }, 0);

    return {
      totalUsers,
      totalDonations,
      totalPickups,
      peopleFed,
      donors,
      charities,
    };
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await API.delete(`/users/${userId}`);
      setData((prev) => ({
        ...prev,
        users: prev.users.filter((u) => u.id !== userId),
      }));
      toast.success("User deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const deleteFoodItem = async (foodId) => {
    if (!window.confirm("Are you sure you want to delete this food item?"))
      return;

    try {
      await API.delete(`/food/${foodId}`);
      setData((prev) => ({
        ...prev,
        foodItems: prev.foodItems.filter((f) => f.id !== foodId),
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
        users: prev.users.map((u) =>
          u.id === userId ? { ...u, role: newRole } : u,
        ),
      }));
      toast.success(`User role updated to ${newRole}!`);
    } catch (error) {
      toast.error("Failed to update user role");
    }
  };

  const exportData = (type) => {
    let dataToExport;
    let filename;

    switch (type) {
      case "users":
        dataToExport = data.users;
        filename = "users_export.json";
        break;
      case "food":
        dataToExport = data.foodItems;
        filename = "food_donations_export.json";
        break;
      case "pickups":
        dataToExport = data.pickups;
        filename = "pickups_export.json";
        break;
      default:
        return;
    }

    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();

    toast.success(`${type} data exported successfully!`);
  };

  const filteredUsers = data.users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "ALL" || user.role === filterType;
    return matchesSearch && matchesFilter;
  });

  const filteredFood = data.foodItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "ALL" || item.status === filterType;
    return matchesSearch && matchesFilter;
  });

  const filteredPickups = data.pickups.filter((pickup) => {
    const matchesSearch =
      pickup.charity?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pickup.foodItem?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "ALL" || pickup.status === filterType;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "AVAILABLE":
        return <FaEye className="status-icon available" />;
      case "CLAIMED":
        return <FaHeart className="status-icon claimed" />;
      case "DELIVERED":
        return <FaCheckCircle className="status-icon delivered" />;
      case "Completed":
        return <FaCheckCircle className="status-icon completed" />;
      case "Scheduled":
        return <FaClock className="status-icon scheduled" />;
      default:
        return <FaExclamationTriangle className="status-icon" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "AVAILABLE":
        return "#17a2b8";
      case "CLAIMED":
        return "#ffc107";
      case "DELIVERED":
        return "#28a745";
      case "Completed":
        return "#28a745";
      case "Scheduled":
        return "#6f42c1";
      default:
        return "#6c757d";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "DONOR":
        return "#007bff";
      case "CHARITY":
        return "#dc3545";
      case "ADMIN":
        return "#6f42c1";
      default:
        return "#6c757d";
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-text">
            <h1>
              <FaUserShield className="header-icon" />
              Admin Dashboard
            </h1>
            <p>Manage users, monitor donations, and track system analytics</p>
          </div>
          <div className="header-actions">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="time-range-select"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="all">All Time</option>
            </select>
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
        </nav>

        <div className="tab-content">
          {activeTab === "overview" && (
            <div className="overview-tab">
              <h2>📊 System Overview</h2>

              <div className="analytics-grid">
                <div className="analytics-card">
                  <div className="analytics-icon users">
                    <FaUsers />
                  </div>
                  <div className="analytics-content">
                    <span className="analytics-number">
                      {data.analytics.totalUsers}
                    </span>
                    <span className="analytics-label">Total Users</span>
                    <div className="analytics-breakdown">
                      <span>👥 {data.analytics.donors} Donors</span>
                      <span>❤️ {data.analytics.charities} Charities</span>
                    </div>
                  </div>
                </div>

                <div className="analytics-card">
                  <div className="analytics-icon donations">
                    <FaUtensils />
                  </div>
                  <div className="analytics-content">
                    <span className="analytics-number">
                      {data.analytics.totalDonations}
                    </span>
                    <span className="analytics-label">Food Donations</span>
                    <div className="analytics-breakdown">
                      <span>📦 Total Posted</span>
                    </div>
                  </div>
                </div>

                <div className="analytics-card">
                  <div className="analytics-icon pickups">
                    <FaTruck />
                  </div>
                  <div className="analytics-content">
                    <span className="analytics-number">
                      {data.analytics.totalPickups}
                    </span>
                    <span className="analytics-label">Pickups</span>
                    <div className="analytics-breakdown">
                      <span>🚚 Scheduled & Completed</span>
                    </div>
                  </div>
                </div>

                <div className="analytics-card">
                  <div className="analytics-icon impact">
                    <FaHeart />
                  </div>
                  <div className="analytics-content">
                    <span className="analytics-number">
                      {data.analytics.peopleFed}
                    </span>
                    <span className="analytics-label">People Fed</span>
                    <div className="analytics-breakdown">
                      <span>🍽️ Through Donations</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="recent-activity">
                <h3>Recent Activity</h3>
                <div className="activity-list">
                  {data.pickups.slice(0, 5).map((pickup) => (
                    <div key={pickup.id} className="activity-item">
                      <div className="activity-icon">
                        {getStatusIcon(pickup.status)}
                      </div>
                      <div className="activity-content">
                        <div className="activity-title">
                          {pickup.charity?.name} picked up{" "}
                          {pickup.foodItem?.name}
                        </div>
                        <div className="activity-time">
                          {new Date(pickup.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="users-tab">
              <div className="tab-header">
                <h2>👥 User Management</h2>
                <div className="tab-actions">
                  <button
                    className="export-btn"
                    onClick={() => exportData("users")}
                  >
                    <FaDownload /> Export Users
                  </button>
                </div>
              </div>

              <div className="filters-section">
                <div className="search-box">
                  <FaSearch />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="filter-select"
                >
                  <option value="ALL">All Roles</option>
                  <option value="DONOR">Donors</option>
                  <option value="CHARITY">Charities</option>
                  <option value="ADMIN">Admins</option>
                </select>
              </div>

              {loading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <p>Loading users...</p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID</th>
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
                          <td>#{user.id}</td>
                          <td>
                            <div className="user-info">
                              <span className="user-name">{user.name}</span>
                              {user.phone && (
                                <span className="user-phone">{user.phone}</span>
                              )}
                            </div>
                          </td>
                          <td>{user.email}</td>
                          <td>
                            <span
                              className="role-badge"
                              style={{
                                backgroundColor: getRoleColor(user.role),
                              }}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <div className="action-buttons">
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
                              <button
                                className="delete-btn"
                                onClick={() => deleteUser(user.id)}
                                title="Delete User"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredUsers.length === 0 && (
                    <div className="empty-state">No users found</div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "food" && (
            <div className="food-tab">
              <div className="tab-header">
                <h2>🍽️ Food Donations</h2>
                <div className="tab-actions">
                  <button
                    className="export-btn"
                    onClick={() => exportData("food")}
                  >
                    <FaDownload /> Export Food Data
                  </button>
                </div>
              </div>

              <div className="filters-section">
                <div className="search-box">
                  <FaSearch />
                  <input
                    type="text"
                    placeholder="Search food items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="filter-select"
                >
                  <option value="ALL">All Status</option>
                  <option value="AVAILABLE">Available</option>
                  <option value="CLAIMED">Claimed</option>
                  <option value="DELIVERED">Delivered</option>
                </select>
              </div>

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Food Name</th>
                      <th>Quantity</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Location</th>
                      <th>Expiry</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFood.map((item) => (
                      <tr key={item.id}>
                        <td>#{item.id}</td>
                        <td>
                          <div className="food-info">
                            <span className="food-name">{item.name}</span>
                          </div>
                        </td>
                        <td>{item.quantity}</td>
                        <td>{item.category?.replace("_", " ")}</td>
                        <td>
                          <div
                            className="status-badge"
                            style={{
                              backgroundColor: getStatusColor(item.status),
                            }}
                          >
                            {getStatusIcon(item.status)}
                            {item.status}
                          </div>
                        </td>
                        <td>
                          <div className="location-cell">
                            <FaMapMarkerAlt />
                            {item.pickupLocation}
                          </div>
                        </td>
                        <td>{new Date(item.expiryTime).toLocaleString()}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="view-btn"
                              onClick={() => setSelectedItem(item)}
                              title="View Details"
                            >
                              <FaEye />
                            </button>
                            <button
                              className="delete-btn"
                              onClick={() => deleteFoodItem(item.id)}
                              title="Delete Food Item"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredFood.length === 0 && (
                  <div className="empty-state">No food items found</div>
                )}
              </div>
            </div>
          )}

          {activeTab === "pickups" && (
            <div className="pickups-tab">
              <div className="tab-header">
                <h2>🚚 Pickup Management</h2>
                <div className="tab-actions">
                  <button
                    className="export-btn"
                    onClick={() => exportData("pickups")}
                  >
                    <FaDownload /> Export Pickups
                  </button>
                </div>
              </div>

              <div className="filters-section">
                <div className="search-box">
                  <FaSearch />
                  <input
                    type="text"
                    placeholder="Search pickups..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="filter-select"
                >
                  <option value="ALL">All Status</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Charity</th>
                      <th>Food Item</th>
                      <th>Scheduled Time</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPickups.map((pickup) => (
                      <tr key={pickup.id}>
                        <td>#{pickup.id}</td>
                        <td>{pickup.charity?.name || "N/A"}</td>
                        <td>{pickup.foodItem?.name || "N/A"}</td>
                        <td>
                          <div className="time-cell">
                            <FaClock />
                            {new Date(pickup.scheduledTime).toLocaleString()}
                          </div>
                        </td>
                        <td>
                          <div
                            className="status-badge"
                            style={{
                              backgroundColor: getStatusColor(pickup.status),
                            }}
                          >
                            {getStatusIcon(pickup.status)}
                            {pickup.status}
                          </div>
                        </td>
                        <td>
                          {new Date(pickup.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="view-btn"
                              onClick={() => {
                                setSelectedItem(pickup);
                                setShowMap(true);
                              }}
                              title="View on Map"
                            >
                              <FaMapMarkerAlt />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredPickups.length === 0 && (
                  <div className="empty-state">No pickups found</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Map Modal */}
        {showMap && selectedItem && (
          <div className="map-modal">
            <div className="map-modal-content">
              <div className="map-modal-header">
                <h3>📍 Pickup Location</h3>
                <button className="close-btn" onClick={() => setShowMap(false)}>
                  ×
                </button>
              </div>
              <div className="map-container">
                <MapView
                  donorLocation={[17.4065, 78.4772]} // Banjara Hills, Hyderabad
                  charityLocation={[17.4126, 78.44]} // Jubilee Hills, Hyderabad
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
