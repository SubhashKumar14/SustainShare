import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import {
  FaUsers,
  FaUtensils,
  FaTruck,
  FaChartLine,
  FaTrash,
  FaEdit,
  FaEye,
  FaBan,
  FaCheckCircle,
  FaSearch,
  FaFilter,
  FaDownload,
  FaCog,
  FaShieldAlt,
  FaDatabase,
  FaBell,
  FaExclamationTriangle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import MapView from "../components/MapView";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [pickups, setPickups] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalDonations: 0,
    totalPickups: 0,
    revenue: 0,
    growth: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = () => {
    // Load users
    const savedUsers = JSON.parse(
      localStorage.getItem("sustainshare_users") || "[]",
    );
    setUsers(savedUsers);

    // Load donations
    const savedDonations = JSON.parse(
      localStorage.getItem("sustainshare_food_items") || "[]",
    );
    setDonations(savedDonations);

    // Load pickups
    const savedPickups = JSON.parse(
      localStorage.getItem("sustainshare_pickups") || "[]",
    );
    setPickups(savedPickups);

    // Calculate analytics
    const totalDonations = savedDonations.length;
    const completedPickups = savedPickups.filter(
      (p) => p.status === "Completed",
    ).length;
    const totalUsers = savedUsers.length;

    setAnalytics({
      totalUsers,
      totalDonations,
      totalPickups: savedPickups.length,
      completedPickups,
      revenue: completedPickups * 50, // Mock revenue calculation
      growth: Math.floor(Math.random() * 30) + 10, // Mock growth rate
    });
  };

  const handleUserAction = (userId, action) => {
    const updatedUsers = users
      .map((user) => {
        if (user.id === userId) {
          switch (action) {
            case "suspend":
              toast.warning(`User ${user.name} has been suspended`);
              return { ...user, status: "suspended" };
            case "activate":
              toast.success(`User ${user.name} has been activated`);
              return { ...user, status: "active" };
            case "delete":
              toast.error(`User ${user.name} has been deleted`);
              return null;
            default:
              return user;
          }
        }
        return user;
      })
      .filter(Boolean);

    setUsers(updatedUsers);
    localStorage.setItem("sustainshare_users", JSON.stringify(updatedUsers));
  };

  const handleDonationAction = (donationId, action) => {
    const updatedDonations = donations
      .map((donation) => {
        if (donation.id === donationId) {
          switch (action) {
            case "approve":
              toast.success("Donation approved");
              return { ...donation, status: "approved" };
            case "reject":
              toast.error("Donation rejected");
              return { ...donation, status: "rejected" };
            case "delete":
              toast.error("Donation deleted");
              return null;
            default:
              return donation;
          }
        }
        return donation;
      })
      .filter(Boolean);

    setDonations(updatedDonations);
    localStorage.setItem(
      "sustainshare_food_items",
      JSON.stringify(updatedDonations),
    );
  };

  const bulkAction = (action) => {
    if (selectedItems.length === 0) {
      toast.warning("Please select items first");
      return;
    }

    switch (action) {
      case "delete":
        if (window.confirm(`Delete ${selectedItems.length} selected items?`)) {
          toast.success(`${selectedItems.length} items deleted`);
          setSelectedItems([]);
        }
        break;
      case "approve":
        toast.success(`${selectedItems.length} items approved`);
        setSelectedItems([]);
        break;
      default:
        break;
    }
  };

  const exportData = (type) => {
    let data = [];
    let filename = "";

    switch (type) {
      case "users":
        data = users;
        filename = "users_export.json";
        break;
      case "donations":
        data = donations;
        filename = "donations_export.json";
        break;
      case "pickups":
        data = pickups;
        filename = "pickups_export.json";
        break;
      default:
        return;
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    toast.success(`${type} data exported successfully!`);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredDonations = donations.filter((donation) => {
    const matchesSearch = donation.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === "all" || donation.status === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="header-content">
          <div className="header-text">
            <h1>🛡️ Admin Dashboard</h1>
            <p>Manage and monitor the SustainShare platform</p>
          </div>
          <div className="admin-badge">
            <FaShieldAlt />
            <span>Administrator</span>
          </div>
        </div>
      </header>

      {/* Overview Stats */}
      <section className="stats-overview">
        <div className="stats-grid">
          <div className="stat-card users">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>{analytics.totalUsers}</h3>
              <p>Total Users</p>
              <span className="stat-trend">
                +{analytics.growth}% this month
              </span>
            </div>
          </div>
          <div className="stat-card donations">
            <div className="stat-icon">🍽️</div>
            <div className="stat-content">
              <h3>{analytics.totalDonations}</h3>
              <p>Food Donations</p>
              <span className="stat-trend">+15% this week</span>
            </div>
          </div>
          <div className="stat-card pickups">
            <div className="stat-icon">🚛</div>
            <div className="stat-content">
              <h3>{analytics.totalPickups}</h3>
              <p>Scheduled Pickups</p>
              <span className="stat-trend">+8% today</span>
            </div>
          </div>
          <div className="stat-card revenue">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>₹{analytics.revenue}</h3>
              <p>Platform Revenue</p>
              <span className="stat-trend">+22% this month</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          <FaChartLine /> Overview
        </button>
        <button
          className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          <FaUsers /> Users
        </button>
        <button
          className={`tab-btn ${activeTab === "donations" ? "active" : ""}`}
          onClick={() => setActiveTab("donations")}
        >
          <FaUtensils /> Donations
        </button>
        <button
          className={`tab-btn ${activeTab === "pickups" ? "active" : ""}`}
          onClick={() => setActiveTab("pickups")}
        >
          <FaTruck /> Pickups
        </button>
        <button
          className={`tab-btn ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          <FaCog /> Settings
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "overview" && (
          <div className="overview-content">
            <div className="overview-grid">
              <div className="overview-card">
                <h3>📊 Platform Analytics</h3>
                <div className="analytics-chart">
                  <div className="chart-placeholder">
                    <p>Real-time analytics dashboard</p>
                    <div className="chart-bars">
                      <div className="bar" style={{ height: "60%" }}></div>
                      <div className="bar" style={{ height: "80%" }}></div>
                      <div className="bar" style={{ height: "45%" }}></div>
                      <div className="bar" style={{ height: "90%" }}></div>
                      <div className="bar" style={{ height: "70%" }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="overview-card">
                <h3>🚨 Recent Activity</h3>
                <div className="activity-list">
                  <div className="activity-item">
                    <FaUsers className="activity-icon" />
                    <div className="activity-text">
                      <p>New user registered: Priya Sharma</p>
                      <span>2 minutes ago</span>
                    </div>
                  </div>
                  <div className="activity-item">
                    <FaUtensils className="activity-icon" />
                    <div className="activity-text">
                      <p>Food donation posted: Vegetable Biryani</p>
                      <span>15 minutes ago</span>
                    </div>
                  </div>
                  <div className="activity-item">
                    <FaTruck className="activity-icon" />
                    <div className="activity-text">
                      <p>Pickup completed successfully</p>
                      <span>1 hour ago</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="overview-card full-width">
                <h3>🗺️ Live Platform Activity</h3>
                <div className="map-container">
                  <MapView
                    donorLocation={[17.4126, 78.4448]}
                    charityLocation={[17.3616, 78.4747]}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="users-content">
            <div className="content-header">
              <h2>👥 User Management</h2>
              <div className="header-actions">
                <div className="search-box">
                  <FaSearch />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button
                  className="export-btn"
                  onClick={() => exportData("users")}
                >
                  <FaDownload /> Export
                </button>
              </div>
            </div>

            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItems(filteredUsers.map((u) => u.id));
                          } else {
                            setSelectedItems([]);
                          }
                        }}
                      />
                    </th>
                    <th>User</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(user.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedItems([...selectedItems, user.id]);
                            } else {
                              setSelectedItems(
                                selectedItems.filter((id) => id !== user.id),
                              );
                            }
                          }}
                        />
                      </td>
                      <td>
                        <div className="user-info">
                          <div className="user-avatar">
                            {user.name?.charAt(0)}
                          </div>
                          <div>
                            <p className="user-name">{user.name}</p>
                            <p className="user-email">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`role-badge ${user.role}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`status-badge ${user.status || "active"}`}
                        >
                          {user.status || "active"}
                        </span>
                      </td>
                      <td>
                        {new Date(
                          user.createdAt || Date.now(),
                        ).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="action-btn view"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          <button className="action-btn edit" title="Edit User">
                            <FaEdit />
                          </button>
                          <button
                            className="action-btn suspend"
                            onClick={() => handleUserAction(user.id, "suspend")}
                            title="Suspend User"
                          >
                            <FaBan />
                          </button>
                          <button
                            className="action-btn delete"
                            onClick={() => handleUserAction(user.id, "delete")}
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
            </div>

            {selectedItems.length > 0 && (
              <div className="bulk-actions">
                <p>{selectedItems.length} items selected</p>
                <button
                  onClick={() => bulkAction("delete")}
                  className="bulk-btn delete"
                >
                  <FaTrash /> Delete Selected
                </button>
                <button
                  onClick={() => bulkAction("approve")}
                  className="bulk-btn approve"
                >
                  <FaCheckCircle /> Approve Selected
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "donations" && (
          <div className="donations-content">
            <div className="content-header">
              <h2>🍽️ Donation Management</h2>
              <div className="header-actions">
                <div className="search-box">
                  <FaSearch />
                  <input
                    type="text"
                    placeholder="Search donations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Status</option>
                  <option value="available">Available</option>
                  <option value="claimed">Claimed</option>
                  <option value="completed">Completed</option>
                </select>
                <button
                  className="export-btn"
                  onClick={() => exportData("donations")}
                >
                  <FaDownload /> Export
                </button>
              </div>
            </div>

            <div className="donations-grid">
              {filteredDonations.map((donation) => (
                <div key={donation.id} className="donation-card">
                  <div className="donation-image">
                    {donation.image ? (
                      <img src={donation.image} alt={donation.name} />
                    ) : (
                      <div className="placeholder-image">
                        <FaUtensils />
                      </div>
                    )}
                    <span
                      className={`status-badge ${donation.status || "available"}`}
                    >
                      {donation.status || "available"}
                    </span>
                  </div>

                  <div className="donation-content">
                    <h3>{donation.name}</h3>
                    <p>Donor: {donation.donorId}</p>
                    <p>Quantity: {donation.quantity} servings</p>
                    <p>Location: {donation.pickupLocation}</p>

                    <div className="donation-actions">
                      <button
                        onClick={() =>
                          handleDonationAction(donation.id, "approve")
                        }
                        className="action-btn approve"
                      >
                        <FaCheckCircle /> Approve
                      </button>
                      <button
                        onClick={() =>
                          handleDonationAction(donation.id, "reject")
                        }
                        className="action-btn reject"
                      >
                        <FaBan /> Reject
                      </button>
                      <button
                        onClick={() =>
                          handleDonationAction(donation.id, "delete")
                        }
                        className="action-btn delete"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "pickups" && (
          <div className="pickups-content">
            <div className="content-header">
              <h2>🚛 Pickup Management</h2>
              <button
                className="export-btn"
                onClick={() => exportData("pickups")}
              >
                <FaDownload /> Export
              </button>
            </div>

            <div className="pickups-grid">
              {pickups.map((pickup) => (
                <div key={pickup.id} className="pickup-card">
                  <div className="pickup-header">
                    <h3>{pickup.foodItem?.name || "Food Item"}</h3>
                    <span
                      className={`status-badge ${pickup.status?.toLowerCase() || "scheduled"}`}
                    >
                      {pickup.status || "Scheduled"}
                    </span>
                  </div>

                  <div className="pickup-details">
                    <p>
                      <strong>Charity:</strong> {pickup.charity?.name}
                    </p>
                    <p>
                      <strong>Scheduled:</strong>{" "}
                      {new Date(pickup.scheduledTime).toLocaleString()}
                    </p>
                    <p>
                      <strong>Location:</strong> {pickup.charity?.location}
                    </p>
                  </div>

                  <div className="pickup-actions">
                    <button className="action-btn view">
                      <FaEye /> View Details
                    </button>
                    <button className="action-btn edit">
                      <FaEdit /> Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="settings-content">
            <div className="content-header">
              <h2>⚙️ Platform Settings</h2>
            </div>

            <div className="settings-grid">
              <div className="settings-card">
                <h3>
                  <FaDatabase /> Database Management
                </h3>
                <div className="settings-actions">
                  <button className="settings-btn">
                    <FaDownload /> Backup Database
                  </button>
                  <button className="settings-btn">
                    <FaTrash /> Clear Cache
                  </button>
                  <button className="settings-btn warning">
                    <FaExclamationTriangle /> Reset Platform
                  </button>
                </div>
              </div>

              <div className="settings-card">
                <h3>
                  <FaBell /> Notifications
                </h3>
                <div className="setting-item">
                  <label>
                    <input type="checkbox" defaultChecked />
                    Email notifications for new donations
                  </label>
                </div>
                <div className="setting-item">
                  <label>
                    <input type="checkbox" defaultChecked />
                    SMS alerts for urgent pickups
                  </label>
                </div>
                <div className="setting-item">
                  <label>
                    <input type="checkbox" />
                    Weekly analytics reports
                  </label>
                </div>
              </div>

              <div className="settings-card">
                <h3>
                  <FaShieldAlt /> Security Settings
                </h3>
                <div className="setting-item">
                  <label>
                    <input type="checkbox" defaultChecked />
                    Two-factor authentication required
                  </label>
                </div>
                <div className="setting-item">
                  <label>
                    <input type="checkbox" defaultChecked />
                    Auto-logout after 30 minutes
                  </label>
                </div>
                <div className="setting-item">
                  <label>
                    <input type="checkbox" />
                    IP whitelist enforcement
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
