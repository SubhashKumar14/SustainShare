import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MapView from "../components/MapView";
import API from "../services/api";
import { toast } from "react-toastify";
import {
  FaTruck,
  FaMapMarkerAlt,
  FaClock,
  FaRoute,
  FaSpinner,
} from "react-icons/fa";
import "./TrackPickup.css";

const TrackPickup = () => {
  const { donationId } = useParams();
  const [donationData, setDonationData] = useState(null);
  const [pickupData, setPickupData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Default Hyderabad locations for demo
  const defaultDonorLocation = [17.4126, 78.4448]; // Hitec City, Hyderabad
  const defaultCharityLocation = [17.3616, 78.4747]; // Charminar, Hyderabad

  useEffect(() => {
    fetchTrackingData();
  }, [donationId]);

  const fetchTrackingData = async () => {
    try {
      // Try to fetch donation data
      const donationRes = await API.get(`/food/${donationId}`);
      setDonationData(donationRes.data);

      // Try to fetch pickup schedule
      const pickupRes = await API.get(`/pickups/food/${donationId}`);
      setPickupData(pickupRes.data);
    } catch (error) {
      console.error("Error fetching tracking data:", error);

      // If API fails, create mock data for demo
      const mockDonation = {
        id: donationId,
        name: "Mixed Vegetarian Meals",
        quantity: "25 units",
        pickupLocation: "Hitec City, Hyderabad",
        expiryTime: "18:30",
        donorId: "DONOR001",
      };

      const mockPickup = {
        id: "PICKUP001",
        scheduledTime: "2024-01-15T17:00:00",
        status: "Scheduled",
        charity: {
          id: "CHARITY001",
          name: "Helping Hands Foundation",
          location: "Charminar, Hyderabad",
        },
      };

      setDonationData(mockDonation);
      setPickupData(mockPickup);

      toast.info("Showing demo tracking data", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "scheduled":
        return "#3b82f6";
      case "in-progress":
        return "#f59e0b";
      case "completed":
        return "#10b981";
      case "cancelled":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "scheduled":
        return <FaClock />;
      case "in-progress":
        return <FaTruck />;
      case "completed":
        return <FaMapMarkerAlt />;
      case "cancelled":
        return <FaMapMarkerAlt />;
      default:
        return <FaSpinner />;
    }
  };

  if (loading) {
    return (
      <div className="tracking-loader">
        <FaSpinner className="spinner" />
        <h2>Loading tracking information...</h2>
      </div>
    );
  }

  return (
    <div className="track-pickup-container">
      <div className="tracking-header">
        <h1>
          <FaRoute /> Track Your Donation
        </h1>
        <p>
          Real-time tracking for donation ID: <strong>{donationId}</strong>
        </p>
      </div>

      <div className="tracking-content">
        {donationData && (
          <div className="tracking-info-panel">
            <div className="info-section">
              <h3>Donation Details</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Food Item:</label>
                  <span>{donationData.name}</span>
                </div>
                <div className="info-item">
                  <label>Quantity:</label>
                  <span>{donationData.quantity}</span>
                </div>
                <div className="info-item">
                  <label>Pickup Location:</label>
                  <span>
                    <FaMapMarkerAlt /> {donationData.pickupLocation}
                  </span>
                </div>
                <div className="info-item">
                  <label>Expires at:</label>
                  <span>
                    <FaClock /> {donationData.expiryTime}
                  </span>
                </div>
              </div>
            </div>

            {pickupData && (
              <div className="info-section">
                <h3>Pickup Status</h3>
                <div className="status-card">
                  <div className="status-header">
                    <span
                      className="status-badge"
                      style={{
                        backgroundColor: getStatusColor(pickupData.status),
                      }}
                    >
                      {getStatusIcon(pickupData.status)}
                      {pickupData.status}
                    </span>
                  </div>
                  <div className="pickup-details">
                    <p>
                      <strong>Charity:</strong>{" "}
                      {pickupData.charity?.name || "Helping Hands Foundation"}
                    </p>
                    <p>
                      <strong>Scheduled Time:</strong>{" "}
                      {new Date(pickupData.scheduledTime).toLocaleString()}
                    </p>
                    <p>
                      <strong>Charity Location:</strong>{" "}
                      {pickupData.charity?.location || "Charminar, Hyderabad"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="map-section">
          <h3>
            <FaMapMarkerAlt /> Route Tracking
          </h3>
          <div className="map-wrapper">
            <MapView
              donorLocation={defaultDonorLocation}
              charityLocation={defaultCharityLocation}
            />
          </div>
          <div className="route-info">
            <div className="route-legend">
              <div className="legend-item">
                <span className="legend-color donor-color"></span>
                <span>Donor Location (Pickup Point)</span>
              </div>
              <div className="legend-item">
                <span className="legend-color charity-color"></span>
                <span>Charity Location (Delivery Point)</span>
              </div>
              <div className="legend-item">
                <span className="legend-line"></span>
                <span>Delivery Route</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackPickup;
