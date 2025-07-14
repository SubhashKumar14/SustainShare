import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  FaUtensils,
  FaMapMarkerAlt,
  FaClock,
  FaWeight,
  FaUser,
  FaPlus,
} from "react-icons/fa";
import API from "../services/api";
import { addressToCoordinates } from "../utils/geocode";
import "./FoodForm.css";

const FoodForm = ({ onFoodAdded }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLocationVerifying, setIsLocationVerifying] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    pickupLocation: "",
    expiryTime: "",
    description: "",
    category: "COOKED_FOOD",
    servingSize: "",
    allergens: "",
    specialInstructions: "",
  });

  const foodCategories = [
    { value: "COOKED_FOOD", label: "🍽️ Cooked Food", icon: "🍽️" },
    { value: "FRESH_PRODUCE", label: "🥬 Fresh Produce", icon: "🥬" },
    { value: "PACKAGED_FOOD", label: "📦 Packaged Food", icon: "📦" },
    { value: "BAKERY", label: "🥖 Bakery Items", icon: "🥖" },
    { value: "DAIRY", label: "🥛 Dairy Products", icon: "🥛" },
    { value: "OTHER", label: "🍕 Other", icon: "🍕" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const verifyLocation = async () => {
    if (!formData.pickupLocation.trim()) {
      toast.warning("Please enter a pickup location first");
      return;
    }

    setIsLocationVerifying(true);
    try {
      const coordinates = await addressToCoordinates(formData.pickupLocation);
      if (coordinates) {
        toast.success("📍 Location verified successfully!");
      } else {
        toast.warning("Could not verify location. Please check the address.");
      }
    } catch (error) {
      toast.error("Error verifying location");
    } finally {
      setIsLocationVerifying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (
      !formData.name ||
      !formData.quantity ||
      !formData.pickupLocation ||
      !formData.expiryTime
    ) {
      toast.error("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    // Check if expiry time is in the future
    const expiryDate = new Date(formData.expiryTime);
    const now = new Date();
    if (expiryDate <= now) {
      toast.error("Expiry time must be in the future");
      setIsLoading(false);
      return;
    }

    try {
      // Get coordinates for the location
      const coordinates = await addressToCoordinates(formData.pickupLocation);

      const foodData = {
        ...formData,
        donorId: localStorage.getItem("userId") || "anonymous",
        coordinates: coordinates,
        status: "AVAILABLE",
        createdAt: new Date().toISOString(),
        estimatedPeopleFed: Math.ceil(parseInt(formData.quantity) / 10), // rough estimate
      };

      const response = await API.post("/food", foodData);

      toast.success("🎉 Food donation posted successfully!", {
        position: "top-center",
        autoClose: 3000,
      });

      // Reset form
      setFormData({
        name: "",
        quantity: "",
        pickupLocation: "",
        expiryTime: "",
        description: "",
        category: "COOKED_FOOD",
        servingSize: "",
        allergens: "",
        specialInstructions: "",
      });

      // Callback to parent component
      if (onFoodAdded) {
        onFoodAdded(response.data);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to post food donation";
      toast.error(errorMessage);
      console.error("Error posting food:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate minimum date (now + 1 hour)
  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="food-form-container">
      <div className="food-form-header">
        <h2>📋 Donate Food</h2>
        <p>Help reduce waste and feed those in need</p>
      </div>

      <form onSubmit={handleSubmit} className="food-form">
        {/* Basic Information */}
        <div className="form-section">
          <h3>Basic Information</h3>

          <div className="form-row">
            <div className="input-group">
              <label htmlFor="name">
                <FaUtensils /> Food Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Vegetable Curry, Fresh Apples, etc."
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="category">🏷️ Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                {foodCategories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label htmlFor="quantity">
                <FaWeight /> Quantity *
              </label>
              <input
                type="text"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="e.g., 50 servings, 10 kg, 20 boxes"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="servingSize">👥 Estimated Serving Size</label>
              <input
                type="text"
                id="servingSize"
                name="servingSize"
                value={formData.servingSize}
                onChange={handleInputChange}
                placeholder="e.g., Feeds 20-30 people"
              />
            </div>
          </div>
        </div>

        {/* Location & Timing */}
        <div className="form-section">
          <h3>Pickup Details</h3>

          <div className="input-group">
            <label htmlFor="pickupLocation">
              <FaMapMarkerAlt /> Pickup Location *
            </label>
            <div className="location-input-group">
              <input
                type="text"
                id="pickupLocation"
                name="pickupLocation"
                value={formData.pickupLocation}
                onChange={handleInputChange}
                placeholder="Full address for pickup"
                required
              />
              <button
                type="button"
                onClick={verifyLocation}
                className="verify-location-btn"
                disabled={isLocationVerifying}
              >
                {isLocationVerifying ? "Verifying..." : "Verify"}
              </button>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="expiryTime">
              <FaClock /> Available Until *
            </label>
            <input
              type="datetime-local"
              id="expiryTime"
              name="expiryTime"
              value={formData.expiryTime}
              onChange={handleInputChange}
              min={getMinDateTime()}
              required
            />
          </div>
        </div>

        {/* Additional Information */}
        <div className="form-section">
          <h3>Additional Information</h3>

          <div className="input-group">
            <label htmlFor="description">📝 Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Additional details about the food..."
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="input-group">
              <label htmlFor="allergens">⚠️ Allergens & Dietary Info</label>
              <input
                type="text"
                id="allergens"
                name="allergens"
                value={formData.allergens}
                onChange={handleInputChange}
                placeholder="e.g., Contains nuts, Vegetarian, Halal"
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="specialInstructions">📋 Special Instructions</label>
            <textarea
              id="specialInstructions"
              name="specialInstructions"
              value={formData.specialInstructions}
              onChange={handleInputChange}
              placeholder="Any special handling or pickup instructions..."
              rows="2"
            />
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? (
            <>
              <div className="spinner"></div>
              Posting Donation...
            </>
          ) : (
            <>
              <FaPlus /> Post Food Donation
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default FoodForm;
