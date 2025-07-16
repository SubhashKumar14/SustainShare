import React, { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import {
  FaUtensils,
  FaTrash,
  FaPlus,
  FaSearch,
  FaMapMarkerAlt,
  FaClock,
  FaChartLine,
  FaHeart,
  FaUsers,
  FaCamera,
  FaEdit,
} from "react-icons/fa";
import { AuthContext } from "../contexts/AuthContext";
import { getAllFoodItems } from "../data/indianFoodData";
import MapView from "../components/MapView";
import "./DonorDashboard.css";

const DonorDashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const [donations, setDonations] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    pickupLocation: "",
    expiryTime: "",
    donorId: currentUser?.id || "",
    description: "",
    image: "",
    category: "North Indian",
    spiceLevel: "Medium",
  });
  const [foodList, setFoodList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("post");
  const [stats, setStats] = useState({
    totalDonations: 0,
    peopleHelped: 0,
    foodSaved: 0,
    activeDonations: 0,
  });

  useEffect(() => {
    fetchFoodList();
    fetchDonorStats();
    // Set default user info
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        donorId: currentUser.id,
      }));
    }
  }, [currentUser]);

  const fetchFoodList = async () => {
    try {
      const res = await API.get("/food");
      setFoodList(res.data);

      // Filter donations by current user
      const userDonations = res.data.filter(
        (item) =>
          item.donorId === currentUser?.id ||
          item.donorId === currentUser?.username,
      );
      setDonations(userDonations);
    } catch (error) {
      console.error("Error fetching food list:", error);
      // Use demo data if API fails
      const demoFood = getAllFoodItems()
        .slice(0, 5)
        .map((item) => ({
          ...item,
          donorId: currentUser?.id || "demo_donor",
          pickupLocation: "Hitec City, Hyderabad",
          expiryTime: "18:30",
        }));
      setFoodList(demoFood);
      setDonations(demoFood);
    }
  };

  const fetchDonorStats = () => {
    // In a real app, this would be an API call
    const savedStats = localStorage.getItem(`donor_stats_${currentUser?.id}`);
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    } else {
      // Generate realistic demo stats
      const demoStats = {
        totalDonations: Math.floor(Math.random() * 50) + 20,
        peopleHelped: Math.floor(Math.random() * 200) + 100,
        foodSaved: Math.floor(Math.random() * 100) + 50,
        activeDonations: Math.floor(Math.random() * 10) + 5,
      };
      setStats(demoStats);
      localStorage.setItem(
        `donor_stats_${currentUser?.id}`,
        JSON.stringify(demoStats),
      );
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          image: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const donationData = {
        ...formData,
        id: `food_${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: "available",
      };

      await API.post("/food", donationData);

      toast.success("🎉 Food posted successfully!", {
        position: "top-center",
        autoClose: 3000,
      });

      // Update stats
      const updatedStats = {
        ...stats,
        totalDonations: stats.totalDonations + 1,
        activeDonations: stats.activeDonations + 1,
        peopleHelped: stats.peopleHelped + Math.floor(Math.random() * 10) + 5,
        foodSaved: stats.foodSaved + parseFloat(formData.quantity || 1),
      };
      setStats(updatedStats);
      localStorage.setItem(
        `donor_stats_${currentUser?.id}`,
        JSON.stringify(updatedStats),
      );

      // Reset form
      setFormData({
        name: "",
        quantity: "",
        pickupLocation: "",
        expiryTime: "",
        donorId: currentUser?.id || "",
        description: "",
        image: "",
        category: "North Indian",
        spiceLevel: "Medium",
      });

      fetchFoodList();
    } catch (error) {
      console.error("Error posting food:", error);
      toast.error("Failed to post food. Please try again.", {
        position: "top-center",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this food item?"))
      return;

    try {
      await API.delete(`/food/${id}`);
      toast.success("Food item deleted!", {
        position: "top-center",
      });

      // Update stats
      const updatedStats = {
        ...stats,
        activeDonations: Math.max(0, stats.activeDonations - 1),
      };
      setStats(updatedStats);
      localStorage.setItem(
        `donor_stats_${currentUser?.id}`,
        JSON.stringify(updatedStats),
      );

      fetchFoodList();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete food item");
    }
  };

  const filteredFood = donations.filter(
    (item) =>
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pickupLocation?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="donor-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-text">
            <h1>👋 Welcome back, {currentUser?.name || "Donor"}!</h1>
            <p>
              Make a difference today by sharing surplus food with those in need
            </p>
          </div>
          <div className="user-avatar">
            <FaUsers />
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">🍽️</div>
            <div className="stat-content">
              <h3>{stats.totalDonations}</h3>
              <p>Total Donations</p>
            </div>
          </div>
          <div className="stat-card success">
            <div className="stat-icon">❤️</div>
            <div className="stat-content">
              <h3>{stats.peopleHelped}</h3>
              <p>People Helped</p>
            </div>
          </div>
          <div className="stat-card warning">
            <div className="stat-icon">⚖️</div>
            <div className="stat-content">
              <h3>{stats.foodSaved}kg</h3>
              <p>Food Saved</p>
            </div>
          </div>
          <div className="stat-card info">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>{stats.activeDonations}</h3>
              <p>Active Donations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === "post" ? "active" : ""}`}
          onClick={() => setActiveTab("post")}
        >
          <FaPlus /> Post Food
        </button>
        <button
          className={`tab-btn ${activeTab === "manage" ? "active" : ""}`}
          onClick={() => setActiveTab("manage")}
        >
          <FaEdit /> Manage Donations
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
        {activeTab === "post" && (
          <section className="food-form-section">
            <div className="section-header">
              <h2>🍽️ Post New Food Donation</h2>
              <p>Share your surplus food with those who need it most</p>
            </div>

            <form onSubmit={handleSubmit} className="food-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Food Name *</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Vegetable Biryani"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="North Indian">🍛 North Indian</option>
                    <option value="South Indian">🥞 South Indian</option>
                    <option value="Street Food">🌮 Street Food</option>
                    <option value="Bengali">🐟 Bengali</option>
                    <option value="Cafe Specials">☕ Cafe Specials</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Quantity (servings) *</label>
                  <input
                    name="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="Number of servings"
                    min="1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Best Before Time *</label>
                  <input
                    name="expiryTime"
                    type="time"
                    value={formData.expiryTime}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Spice Level</label>
                  <select
                    name="spiceLevel"
                    value={formData.spiceLevel}
                    onChange={handleChange}
                  >
                    <option value="None">No Spice</option>
                    <option value="Mild">🌶️ Mild</option>
                    <option value="Medium">🌶️🌶️ Medium</option>
                    <option value="Hot">🌶️🌶️🌶️ Hot</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Pickup Location *</label>
                  <input
                    name="pickupLocation"
                    value={formData.pickupLocation}
                    onChange={handleChange}
                    placeholder="e.g., Restaurant Name, Area, Hyderabad"
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Brief description of the food, ingredients, etc."
                    rows="3"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Food Image (Optional)</label>
                  <div className="image-upload">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      id="imageUpload"
                    />
                    <label htmlFor="imageUpload" className="upload-btn">
                      <FaCamera /> Choose Image
                    </label>
                    {formData.image && (
                      <div className="image-preview">
                        <img src={formData.image} alt="Preview" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner"></div>
                    Posting...
                  </>
                ) : (
                  <>
                    <FaPlus /> Post Food Donation
                  </>
                )}
              </button>
            </form>
          </section>
        )}

        {activeTab === "manage" && (
          <section className="food-list-section">
            <div className="section-header">
              <h2>📋 Your Food Donations</h2>
              <div className="search-box">
                <FaSearch />
                <input
                  type="text"
                  placeholder="Search your donations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {filteredFood.length === 0 ? (
              <div className="empty-state">
                <FaUtensils className="empty-icon" />
                <h3>No donations found</h3>
                <p>Start by posting your first food donation!</p>
                <button
                  className="primary-btn"
                  onClick={() => setActiveTab("post")}
                >
                  <FaPlus /> Post Food
                </button>
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
                      <span className="status-badge available">Available</span>
                    </div>

                    <div className="food-content">
                      <h3>{item.name}</h3>
                      <div className="food-meta">
                        <span className="quantity-badge">
                          {item.quantity} servings
                        </span>
                        <span className="location">
                          <FaMapMarkerAlt /> {item.pickupLocation}
                        </span>
                        <span className="expiry">
                          <FaClock /> Best before {item.expiryTime}
                        </span>
                      </div>
                      {item.description && (
                        <p className="description">{item.description}</p>
                      )}
                    </div>

                    <div className="food-actions">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="delete-btn"
                        title="Delete donation"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === "analytics" && (
          <section className="analytics-section">
            <div className="section-header">
              <h2>📊 Your Impact Analytics</h2>
              <p>See the difference you're making in your community</p>
            </div>

            <div className="analytics-grid">
              <div className="analytics-card">
                <h3>🎯 Monthly Impact</h3>
                <div className="impact-stats">
                  <div className="impact-item">
                    <span className="impact-number">
                      {Math.floor(stats.totalDonations / 3)}
                    </span>
                    <span className="impact-label">Donations this month</span>
                  </div>
                  <div className="impact-item">
                    <span className="impact-number">
                      {Math.floor(stats.peopleHelped / 4)}
                    </span>
                    <span className="impact-label">
                      People helped this month
                    </span>
                  </div>
                </div>
              </div>

              <div className="analytics-card">
                <h3>🌍 Environmental Impact</h3>
                <div className="environmental-stats">
                  <p>
                    <strong>{stats.foodSaved}kg</strong> of food saved from
                    waste
                  </p>
                  <p>
                    <strong>{Math.floor(stats.foodSaved * 2.5)}kg</strong> CO₂
                    emissions prevented
                  </p>
                  <p>
                    <strong>{Math.floor(stats.foodSaved * 1000)}L</strong> water
                    saved
                  </p>
                </div>
              </div>

              <div className="analytics-card full-width">
                <h3>🗺️ Delivery Tracking</h3>
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
    </div>
  );
};

export default DonorDashboard;
