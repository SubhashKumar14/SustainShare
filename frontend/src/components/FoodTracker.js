import React, { useState, useEffect } from "react";
import {
  FaClock,
  FaMapMarkerAlt,
  FaCheck,
  FaTruck,
  FaEye,
  FaUtensils,
  FaUser,
} from "react-icons/fa";
import API from "../services/api";
import "./FoodTracker.css";

const FoodTracker = ({ donationId, compact = false }) => {
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDonationDetails();
  }, [donationId]);

  const fetchDonationDetails = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/food/${donationId}`);
      setDonation(response.data);
    } catch (err) {
      setError("Failed to load donation details");
      console.error("Error fetching donation:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      AVAILABLE: {
        icon: <FaEye />,
        label: "Available",
        color: "#28a745",
        description: "Food is available for pickup",
      },
      CLAIMED: {
        icon: <FaCheck />,
        label: "Claimed",
        color: "#ffc107",
        description: "Claimed by charity, awaiting pickup",
      },
      IN_TRANSIT: {
        icon: <FaTruck />,
        label: "In Transit",
        color: "#17a2b8",
        description: "Food is being picked up",
      },
      DELIVERED: {
        icon: <FaCheck />,
        label: "Delivered",
        color: "#28a745",
        description: "Successfully delivered to charity",
      },
      EXPIRED: {
        icon: <FaClock />,
        label: "Expired",
        color: "#dc3545",
        description: "Food has expired",
      },
    };
    return statusMap[status] || statusMap.AVAILABLE;
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

  const getProgressPercentage = (status) => {
    const progressMap = {
      AVAILABLE: 25,
      CLAIMED: 50,
      IN_TRANSIT: 75,
      DELIVERED: 100,
      EXPIRED: 0,
    };
    return progressMap[status] || 0;
  };

  if (loading) {
    return (
      <div className="food-tracker loading">
        <div className="spinner"></div>
        <p>Loading donation details...</p>
      </div>
    );
  }

  if (error || !donation) {
    return (
      <div className="food-tracker error">
        <p>⚠️ {error || "Donation not found"}</p>
      </div>
    );
  }

  const statusInfo = getStatusInfo(donation.status);
  const timeRemaining = formatTimeRemaining(donation.expiryTime);
  const progress = getProgressPercentage(donation.status);

  if (compact) {
    return (
      <div className="food-tracker compact">
        <div
          className="status-badge"
          style={{ backgroundColor: statusInfo.color }}
        >
          {statusInfo.icon}
          <span>{statusInfo.label}</span>
        </div>
        <div className="time-remaining">
          <FaClock />
          <span>{timeRemaining}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="food-tracker">
      <div className="tracker-header">
        <h3>
          <FaUtensils />
          Food Donation Tracking
        </h3>
        <div className="donation-id">ID: #{donation.id}</div>
      </div>

      <div className="donation-info">
        <div className="info-card">
          <h4>{donation.name}</h4>
          <p className="quantity">Quantity: {donation.quantity}</p>
          <p className="category">
            Category: {donation.category?.replace("_", " ")}
          </p>
        </div>

        <div className="location-info">
          <FaMapMarkerAlt />
          <span>{donation.pickupLocation}</span>
        </div>

        <div className="donor-info">
          <FaUser />
          <span>Donor: {donation.donorId}</span>
        </div>
      </div>

      <div className="status-section">
        <div className="current-status">
          <div
            className="status-indicator"
            style={{ backgroundColor: statusInfo.color }}
          >
            {statusInfo.icon}
          </div>
          <div className="status-details">
            <h4>{statusInfo.label}</h4>
            <p>{statusInfo.description}</p>
          </div>
        </div>

        <div className="time-info">
          <div className="time-remaining">
            <FaClock />
            <span
              className={timeRemaining === "Expired" ? "expired" : "active"}
            >
              {timeRemaining}
            </span>
          </div>
          <div className="expiry-time">
            Expires: {new Date(donation.expiryTime).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-header">
          <span>Donation Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${progress}%`,
              backgroundColor: statusInfo.color,
            }}
          ></div>
        </div>

        <div className="progress-steps">
          <div className={`step ${progress >= 25 ? "completed" : ""}`}>
            <div className="step-circle">📝</div>
            <span>Posted</span>
          </div>
          <div className={`step ${progress >= 50 ? "completed" : ""}`}>
            <div className="step-circle">✋</div>
            <span>Claimed</span>
          </div>
          <div className={`step ${progress >= 75 ? "completed" : ""}`}>
            <div className="step-circle">🚚</div>
            <span>Pickup</span>
          </div>
          <div className={`step ${progress >= 100 ? "completed" : ""}`}>
            <div className="step-circle">✅</div>
            <span>Delivered</span>
          </div>
        </div>
      </div>

      {donation.description && (
        <div className="additional-info">
          <h5>Description</h5>
          <p>{donation.description}</p>
        </div>
      )}

      {donation.specialInstructions && (
        <div className="additional-info">
          <h5>Special Instructions</h5>
          <p>{donation.specialInstructions}</p>
        </div>
      )}
    </div>
  );
};

export default FoodTracker;
