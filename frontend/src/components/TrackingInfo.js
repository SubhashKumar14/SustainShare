import React from "react";
import {
  FaTruck,
  FaMapMarkerAlt,
  FaRoute,
  FaClock,
  FaPhone,
} from "react-icons/fa";
import "./TrackingInfo.css";

const TrackingInfo = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="tracking-info-overlay">
      <div className="tracking-info-modal">
        <div className="tracking-info-header">
          <h2>🚚 Order Tracking Features</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="tracking-info-content">
          <div className="feature-section">
            <div className="feature-icon">
              <FaMapMarkerAlt />
            </div>
            <div className="feature-details">
              <h3>Real-Time Location Tracking</h3>
              <p>
                Track your food donations in real-time from pickup to delivery
                using OpenStreetMap and Leaflet.js integration.
              </p>
            </div>
          </div>

          <div className="feature-section">
            <div className="feature-icon">
              <FaRoute />
            </div>
            <div className="feature-details">
              <h3>Dynamic Route Visualization</h3>
              <p>
                See the complete route from donor to charity with real-time
                progress indicators and estimated arrival times.
              </p>
            </div>
          </div>

          <div className="feature-section">
            <div className="feature-icon">
              <FaTruck />
            </div>
            <div className="feature-details">
              <h3>Live Driver Tracking</h3>
              <p>
                Monitor the driver's current location with accuracy indicators
                and get live updates during transit.
              </p>
            </div>
          </div>

          <div className="feature-section">
            <div className="feature-icon">
              <FaClock />
            </div>
            <div className="feature-details">
              <h3>Smart ETA Calculations</h3>
              <p>
                Get accurate estimated arrival times that update dynamically
                based on current location and traffic conditions.
              </p>
            </div>
          </div>

          <div className="feature-section">
            <div className="feature-icon">
              <FaPhone />
            </div>
            <div className="feature-details">
              <h3>Quick Communication</h3>
              <p>
                Direct contact links for donors and charities with integrated
                phone calling functionality.
              </p>
            </div>
          </div>
        </div>

        <div className="tracking-info-footer">
          <div className="status-legend">
            <h4>Status Legend</h4>
            <div className="legend-items">
              <div className="legend-item">
                <span className="legend-dot claimed"></span>
                <span>Claimed - Ready for pickup</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot in-transit"></span>
                <span>In Transit - On the way</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot delivered"></span>
                <span>Delivered - Successfully completed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingInfo;
