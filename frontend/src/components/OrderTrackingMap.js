import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  FaTruck,
  FaRoute,
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
  FaSpinner,
  FaPhone,
  FaLocationArrow,
  FaRedo,
} from "react-icons/fa";
import "./OrderTrackingMap.css";

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Custom icons for different statuses
const donorIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;base64," +
    btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#28a745">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const charityIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;base64," +
    btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#dc3545">
      <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5 2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const truckIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;base64=" +
    btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#007bff">
      <path d="M18,8H20V16H21A1,1 0 0,1 22,17A1,1 0 0,1 21,18H20A2,2 0 0,1 18,20A2,2 0 0,1 16,18H8A2,2 0 0,1 6,20A2,2 0 0,1 4,18H3A1,1 0 0,1 2,17A1,1 0 0,1 3,16H4V8A1,1 0 0,1 5,7H16V3A1,1 0 0,1 17,2A1,1 0 0,1 18,3V8M6,16A1,1 0 0,0 7,17A1,1 0 0,0 8,16A1,1 0 0,0 7,15A1,1 0 0,0 6,16M16,16A1,1 0 0,0 17,17A1,1 0 0,0 18,16A1,1 0 0,0 17,15A1,1 0 0,0 16,16Z"/>
    </svg>
  `),
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
});

// Component to handle map bounds and animations
const MapController = ({ bounds, animateTo }) => {
  const map = useMap();

  useEffect(() => {
    if (bounds && bounds.length === 2) {
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [bounds, map]);

  useEffect(() => {
    if (animateTo) {
      map.flyTo(animateTo, 15, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [animateTo, map]);

  return null;
};

const OrderTrackingMap = ({ order, onStatusUpdate, isAdmin = false }) => {
  const [trackingData, setTrackingData] = useState({
    donor: null,
    charity: null,
    currentLocation: null,
    route: [],
    estimatedTime: null,
    distance: null,
    status: "pending",
  });
  const [isTracking, setIsTracking] = useState(false);
  const [showRoute, setShowRoute] = useState(true);
  const [mapBounds, setMapBounds] = useState(null);
  const [animateToLocation, setAnimateToLocation] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (order) {
      initializeTracking();
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [order]); // eslint-disable-line react-hooks/exhaustive-deps

  const initializeTracking = async () => {
    if (!order) return;

    setIsTracking(true);

    try {
      // Set donor and charity locations
      const donorCoords = order.donorLocation || [17.4065, 78.4772]; // Banjara Hills, Hyderabad default
      const charityCoords = order.charityLocation || [17.4126, 78.44]; // Jubilee Hills, Hyderabad default

      const newTrackingData = {
        donor: {
          coordinates: donorCoords,
          address: order.pickupLocation || "Donor Location",
          name: order.donorName || "Food Donor",
          phone: order.donorPhone || "+91-XXXXX-XXXXX",
        },
        charity: {
          coordinates: charityCoords,
          address: order.charityAddress || "Charity Location",
          name: order.charityName || "Community Kitchen",
          phone: order.charityPhone || "+1-XXX-XXX-XXXX",
        },
        currentLocation:
          order.status === "claimed"
            ? donorCoords
            : order.status === "in_transit"
              ? simulateCurrentLocation(donorCoords, charityCoords)
              : charityCoords,
        status: order.status || "pending",
        estimatedTime: calculateEstimatedTime(donorCoords, charityCoords),
        distance: calculateDistance(donorCoords, charityCoords),
      };

      // Generate route
      newTrackingData.route = generateRoute(donorCoords, charityCoords);

      setTrackingData(newTrackingData);
      setMapBounds([donorCoords, charityCoords]);

      // Start real-time tracking for in-transit orders
      if (order.status === "in_transit") {
        startRealTimeTracking(donorCoords, charityCoords);
      }
    } catch (error) {
      console.error("Error initializing tracking:", error);
    } finally {
      setIsTracking(false);
    }
  };

  const startRealTimeTracking = (startCoords, endCoords) => {
    let progress = 0;
    const totalSteps = 60; // 60 updates over journey

    intervalRef.current = setInterval(() => {
      progress += 1;

      if (progress <= totalSteps) {
        const currentPos = interpolatePosition(
          startCoords,
          endCoords,
          progress / totalSteps,
        );

        setTrackingData((prev) => ({
          ...prev,
          currentLocation: currentPos,
          estimatedTime: Math.max(1, Math.round((totalSteps - progress) / 2)), // Decreasing ETA
        }));
      } else {
        // Journey complete
        clearInterval(intervalRef.current);
        setTrackingData((prev) => ({
          ...prev,
          currentLocation: endCoords,
          status: "delivered",
          estimatedTime: 0,
        }));

        if (onStatusUpdate) {
          onStatusUpdate("delivered");
        }
      }
    }, 3000); // Update every 3 seconds
  };

  const simulateCurrentLocation = (start, end) => {
    // Simulate truck being 30% of the way there
    return interpolatePosition(start, end, 0.3);
  };

  const interpolatePosition = (start, end, progress) => {
    const lat = start[0] + (end[0] - start[0]) * progress;
    const lng = start[1] + (end[1] - start[1]) * progress;
    return [lat, lng];
  };

  const generateRoute = (start, end) => {
    // Simple route generation - in real app would use routing API
    const points = [];
    const steps = 20;

    for (let i = 0; i <= steps; i++) {
      const progress = i / steps;
      // Add some curve to make route more realistic
      const curvature = Math.sin(progress * Math.PI) * 0.001;
      points.push([
        start[0] + (end[0] - start[0]) * progress + curvature,
        start[1] + (end[1] - start[1]) * progress,
      ]);
    }

    return points;
  };

  const calculateDistance = (coord1, coord2) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((coord2[0] - coord1[0]) * Math.PI) / 180;
    const dLon = ((coord2[1] - coord1[1]) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((coord1[0] * Math.PI) / 180) *
        Math.cos((coord2[0] * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  const calculateEstimatedTime = (start, end) => {
    const distance = calculateDistance(start, end);
    return Math.round((distance / 30) * 60); // Assuming 30 km/h, return minutes
  };

  const handleLocateDriver = () => {
    if (trackingData.currentLocation) {
      setAnimateToLocation(trackingData.currentLocation);
    }
  };

  const handleRefreshTracking = () => {
    initializeTracking();
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: { icon: <FaClock />, label: "Pickup Pending", color: "#ffc107" },
      claimed: { icon: <FaCheckCircle />, label: "Claimed", color: "#28a745" },
      in_transit: { icon: <FaTruck />, label: "In Transit", color: "#007bff" },
      delivered: {
        icon: <FaCheckCircle />,
        label: "Delivered",
        color: "#28a745",
      },
      cancelled: {
        icon: <FaCheckCircle />,
        label: "Cancelled",
        color: "#dc3545",
      },
    };
    return statusMap[status] || statusMap.pending;
  };

  if (!order) {
    return (
      <div className="tracking-placeholder">
        <FaMapMarkerAlt size={48} />
        <h3>Select an order to track</h3>
        <p>Choose a food donation to see real-time tracking</p>
      </div>
    );
  }

  const statusInfo = getStatusInfo(trackingData.status);

  return (
    <div className="order-tracking-container">
      {/* Tracking Header */}
      <div className="tracking-header">
        <div className="order-info">
          <h3>📦 Order Tracking</h3>
          <div className="order-details">
            <span className="order-id">#{order.id}</span>
            <span className="food-name">{order.name}</span>
          </div>
        </div>

        <div className="status-info">
          <div
            className="status-badge"
            style={{ backgroundColor: statusInfo.color }}
          >
            {statusInfo.icon}
            <span>{statusInfo.label}</span>
          </div>
        </div>
      </div>

      {/* Tracking Controls */}
      <div className="tracking-controls">
        <button
          className="control-btn"
          onClick={() => setShowRoute(!showRoute)}
        >
          <FaRoute />
          {showRoute ? "Hide Route" : "Show Route"}
        </button>

        <button
          className="control-btn"
          onClick={handleLocateDriver}
          disabled={!trackingData.currentLocation}
        >
          <FaLocationArrow />
          Locate Driver
        </button>

        <button className="control-btn" onClick={handleRefreshTracking}>
          <FaRedo />
          Refresh
        </button>

        {trackingData.estimatedTime && (
          <div className="eta-info">
            <FaClock />
            <span>ETA: {trackingData.estimatedTime} min</span>
          </div>
        )}
      </div>

      {/* Map Container */}
      <div className="map-container">
        {isTracking && (
          <div className="tracking-loader">
            <FaSpinner className="spinner" />
            <span>Initializing tracking...</span>
          </div>
        )}

        <MapContainer
          center={trackingData.donor?.coordinates || [17.4065, 78.4772]}
          zoom={13}
          className="tracking-map"
          scrollWheelZoom={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <MapController bounds={mapBounds} animateTo={animateToLocation} />

          {/* Donor Marker */}
          {trackingData.donor && (
            <Marker position={trackingData.donor.coordinates} icon={donorIcon}>
              <Popup>
                <div className="tracking-popup">
                  <h4>🍽️ Pickup Location</h4>
                  <p>
                    <strong>{trackingData.donor.name}</strong>
                  </p>
                  <p>{trackingData.donor.address}</p>
                  <div className="popup-actions">
                    <a href={`tel:${trackingData.donor.phone}`}>
                      <FaPhone /> Call Donor
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Charity Marker */}
          {trackingData.charity && (
            <Marker
              position={trackingData.charity.coordinates}
              icon={charityIcon}
            >
              <Popup>
                <div className="tracking-popup">
                  <h4>❤️ Delivery Location</h4>
                  <p>
                    <strong>{trackingData.charity.name}</strong>
                  </p>
                  <p>{trackingData.charity.address}</p>
                  <div className="popup-actions">
                    <a href={`tel:${trackingData.charity.phone}`}>
                      <FaPhone /> Call Charity
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Current Location (Truck) */}
          {trackingData.currentLocation &&
            trackingData.status === "in_transit" && (
              <>
                <Marker
                  position={trackingData.currentLocation}
                  icon={truckIcon}
                >
                  <Popup>
                    <div className="tracking-popup">
                      <h4>🚚 Driver Location</h4>
                      <p>Currently en route</p>
                      <p>ETA: {trackingData.estimatedTime} minutes</p>
                      <p>Distance: {trackingData.distance} km</p>
                    </div>
                  </Popup>
                </Marker>

                {/* Accuracy circle around truck */}
                <Circle
                  center={trackingData.currentLocation}
                  radius={100}
                  pathOptions={{
                    color: "#007bff",
                    fillColor: "#007bff",
                    fillOpacity: 0.1,
                  }}
                />
              </>
            )}

          {/* Route Line */}
          {showRoute && trackingData.route.length > 0 && (
            <Polyline
              positions={trackingData.route}
              pathOptions={{
                color: "#007bff",
                weight: 4,
                opacity: 0.7,
                dashArray:
                  trackingData.status === "in_transit" ? null : "10, 10",
              }}
            />
          )}

          {/* Progress Line (for in-transit orders) */}
          {trackingData.status === "in_transit" &&
            trackingData.route.length > 0 && (
              <Polyline
                positions={trackingData.route.slice(
                  0,
                  Math.floor(trackingData.route.length * 0.3),
                )}
                pathOptions={{
                  color: "#28a745",
                  weight: 6,
                  opacity: 0.8,
                }}
              />
            )}
        </MapContainer>
      </div>

      {/* Tracking Details */}
      <div className="tracking-details">
        <div className="detail-card">
          <div className="detail-header">
            <FaTruck />
            <span>Journey Details</span>
          </div>
          <div className="detail-content">
            <div className="detail-row">
              <span>Distance:</span>
              <span>{trackingData.distance} km</span>
            </div>
            <div className="detail-row">
              <span>Estimated Time:</span>
              <span>{trackingData.estimatedTime || "Calculating..."} min</span>
            </div>
            <div className="detail-row">
              <span>Food Item:</span>
              <span>{order.name}</span>
            </div>
            <div className="detail-row">
              <span>Quantity:</span>
              <span>{order.quantity}</span>
            </div>
          </div>
        </div>

        {/* Admin Controls */}
        {isAdmin && (
          <div className="admin-controls">
            <h4>Admin Actions</h4>
            <div className="admin-buttons">
              <button
                className="admin-btn"
                onClick={() => onStatusUpdate && onStatusUpdate("in_transit")}
                disabled={trackingData.status === "delivered"}
              >
                Mark In Transit
              </button>
              <button
                className="admin-btn"
                onClick={() => onStatusUpdate && onStatusUpdate("delivered")}
                disabled={trackingData.status === "delivered"}
              >
                Mark Delivered
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTrackingMap;
