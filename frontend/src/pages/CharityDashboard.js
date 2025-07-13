import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import API from "../services/api";
import notificationService from "../services/notificationService";
import MapView from "../components/MapView";
import locationService from "../utils/locationService";
import {
  FaHeart,
  FaClock,
  FaMapMarkerAlt,
  FaSearch,
  FaUtensils,
  FaTruck,
  FaRoute,
} from "react-icons/fa";
import "./CharityDashboard.css";

const CharityDashboard = () => {
  const navigate = useNavigate();
  const { currentCharity } = useContext(AuthContext);
  const [foodItems, setFoodItems] = useState([]);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isClaiming, setIsClaiming] = useState(false);
  const [distanceInfo, setDistanceInfo] = useState({});
  const [charityLocation, setCharityLocation] = useState(null);

  useEffect(() => {
    fetchAvailableFood();
    loadCharityLocation();
  }, []);

  useEffect(() => {
    if (charityLocation && foodItems.length > 0) {
      calculateDistances();
    }
  }, [charityLocation, foodItems]);

  const loadCharityLocation = async () => {
    try {
      // Try to get current location first, fallback to a default charity address
      const coords = await locationService.getCurrentLocation();
      setCharityLocation(coords);
    } catch (error) {
      // Use a default charity location if geolocation fails
      console.log("Using default charity location");
      setCharityLocation([40.7128, -74.006]); // NYC as default
    }
  };

  const calculateDistances = async () => {
    const distances = {};
    for (const item of foodItems) {
      if (item.pickupLocation) {
        try {
          const info = await locationService.getDistanceInfo(
            item.pickupLocation,
            "Current Location",
          );
          if (info) {
            distances[item.id] = info;
          }
        } catch (error) {
          console.error(
            `Error calculating distance for item ${item.id}:`,
            error,
          );
        }
      }
    }
    setDistanceInfo(distances);
  };

  const fetchAvailableFood = async () => {
    try {
      const res = await API.get("/food");
      setFoodItems(res.data);
    } catch (error) {
      console.error("Error fetching food:", error);
      toast.error("Failed to fetch available food");
    }
  };

  const claimPickup = async (foodItem) => {
    if (!currentCharity?.id) {
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
      await API.post("/pickups", {
        scheduledTime,
        foodItem: { id: foodItem.id },
        charity: { id: currentCharity.id },
        status: "Scheduled",
      });
      toast.success(
        <div>
          <FaTruck /> Pickup scheduled successfully!
          <div style={{ fontSize: "0.9em", marginTop: "5px" }}>
            {foodItem.name} at {time}
          </div>
        </div>,
        { autoClose: 3000 },
      );
      setSelectedDonation(foodItem);
    } catch (error) {
      console.error("Failed to schedule pickup:", error);
      toast.error(error.response?.data?.message || "Failed to schedule pickup");
    } finally {
      setIsClaiming(false);
    }
  };

  const filteredFood = foodItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="charity-dashboard">
      <header className="dashboard-header">
        <h1>
          <FaHeart /> Charity Dashboard
        </h1>
        <p>Claim available food donations</p>
      </header>

      <div className="content-section">
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
        </div>

        {filteredFood.length === 0 ? (
          <div className="empty-state">
            <img src="/empty-food.svg" alt="No food available" />
            <p>No food donations currently available</p>
          </div>
        ) : (
          <div className="food-grid">
            {filteredFood.map((item) => (
              <div key={item.id} className="food-card">
                <div className="food-header">
                  <h3>
                    <FaUtensils /> {item.name}
                  </h3>
                  <span className="quantity-badge">{item.quantity} units</span>
                </div>

                <div className="food-details">
                  <div className="detail-row">
                    <FaMapMarkerAlt />
                    <span>{item.pickupLocation}</span>
                  </div>
                  <div className="detail-row">
                    <FaClock />
                    <span>Expires at {item.expiryTime}</span>
                  </div>
                </div>

                <div className="action-buttons">
                  <button
                    onClick={() => claimPickup(item)}
                    className="claim-btn"
                    disabled={isClaiming}
                  >
                    {isClaiming ? "Processing..." : "Claim Donation"}
                  </button>
                  <button
                    onClick={() => {
                      if (!item.id) {
                        toast.error("Invalid donation ID");
                        return;
                      }
                      navigate(`/track/${item.id}`); // Correct navigation with ID
                    }}
                    className="track-btn"
                  >
                    Track Location
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedDonation && currentCharity && (
          <div className="map-container">
            <MapView
              donorLocation={selectedDonation.location}
              charityLocation={currentCharity.location}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CharityDashboard;
