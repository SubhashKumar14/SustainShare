import React, { useEffect, useState, useContext } from "react";
import API from "../services/api";
import notificationService from "../services/notificationService";
import { AuthContext } from "../contexts/AuthContext";
import {
  FaUtensils,
  FaTrash,
  FaPlus,
  FaSearch,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";
import "./DonorDashboard.css";
import MapView from "../components/MapView";

const DonorDashboard = () => {
  const [claimedDonations] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    pickupLocation: "",
    expiryTime: "",
    donorId: "",
  });
  const [foodList, setFoodList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchFoodList();
  }, []);

  const fetchFoodList = async () => {
    try {
      const res = await API.get("/food");
      setFoodList(res.data);
    } catch (error) {
      console.error("Error fetching food list:", error);
      notificationService.error("Failed to fetch food list");
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("Submitting:", formData); // Debugging

    try {
      // Map frontend field names to backend/SQL field names
      const mappedData = {
        name: formData.name,
        quantity: parseInt(formData.quantity) || 0,
        pickup_location: formData.pickupLocation,
        expiry_time: formData.expiryTime,
        donor_id: formData.donorId,
      };

      console.log("Food submission data:", mappedData);
      const response = await API.post("/food", mappedData);
      console.log("Food submission response:", response);
      notificationService.success("Food posted successfully!");
      setFormData({
        name: "",
        quantity: "",
        pickupLocation: "",
        expiryTime: "",
        donorId: "",
      });
      fetchFoodList();
    } catch (error) {
      console.error("Error posting food:", error.response || error.message);
      notificationService.error("Failed to post food");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this food item?"))
      return;

    try {
      await API.delete(`/food/${id}`);
      notificationService.success("Food item deleted!");
      fetchFoodList();
    } catch (error) {
      console.error("Delete error:", error);
      notificationService.error("Failed to delete food item");
    }
  };

  const filteredFood = foodList.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="donor-dashboard">
      <header className="dashboard-header">
        <h1>
          <FaUtensils /> Donor Dashboard
        </h1>
        <p>Manage your food donations</p>
      </header>

      {claimedDonations.map((donation) => (
        <MapView
          key={donation.id}
          donorLocation={donation.donorLocation}
          charityLocation={donation.charityLocation}
        />
      ))}

      <div className="dashboard-grid">
        <section className="food-form-section">
          <h2>Post New Food</h2>
          <form onSubmit={handleSubmit} className="food-form">
            <div className="form-group">
              <label>Food Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Quantity</label>
                <input
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Expiry Time</label>
                <input
                  name="expiryTime"
                  type="time"
                  value={formData.expiryTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Pickup Location</label>
              <input
                name="pickupLocation"
                value={formData.pickupLocation}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Your Donor ID</label>
              <input
                name="donorId"
                value={formData.donorId}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Posting..."
              ) : (
                <>
                  <FaPlus /> Post Food
                </>
              )}
            </button>
          </form>
        </section>

        <section className="food-list-section">
          <div className="section-header">
            <h2>Your Posted Food</h2>
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
              <img src="/empty-food.svg" alt="No food" />
              <p>No food items found</p>
            </div>
          ) : (
            <div className="food-list">
              {filteredFood.map((item) => (
                <div key={item.id} className="food-card">
                  <div className="food-info">
                    <h3>{item.name}</h3>
                    <div className="food-meta">
                      <span className="quantity-badge">
                        {item.quantity} units
                      </span>
                      <span className="location">
                        <FaMapMarkerAlt /> {item.pickupLocation}
                      </span>
                      <span className="expiry">
                        <FaClock /> {item.expiryTime}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="delete-btn"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default DonorDashboard;
