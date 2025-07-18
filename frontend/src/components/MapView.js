import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FaRoute, FaInfoCircle } from "react-icons/fa";
import "./MapView.css";

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Custom icons
const donorIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
  iconSize: [35, 35],
  popupAnchor: [0, -15],
});

const charityIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447035.png",
  iconSize: [35, 35],
  popupAnchor: [0, -15],
});

const MapView = ({ donorLocation, charityLocation }) => {
  const [distance, setDistance] = useState(null);
  const [travelTime, setTravelTime] = useState(null);
  const [routeVisible, setRouteVisible] = useState(true);
  // Default to Hyderabad, India coordinates
  const [mapCenter, setMapCenter] = useState([17.385, 78.4867]);

  // Calculate distance and center when locations change
  useEffect(() => {
    const finalDonorLoc = donorLocation || [17.4126, 78.4448];
    const finalCharityLoc = charityLocation || [17.3616, 78.4747];

    const dist = calculateDistance(finalDonorLoc, finalCharityLoc);
    setDistance(dist);
    setTravelTime(calculateTravelTime(dist));
    setMapCenter([
      (finalDonorLoc[0] + finalCharityLoc[0]) / 2,
      (finalDonorLoc[1] + finalCharityLoc[1]) / 2,
    ]);
  }, [donorLocation, charityLocation]);

  // Calculate distance in km using Haversine formula
  const calculateDistance = (coord1, coord2) => {
    const [lat1, lon1] = coord1;
    const [lat2, lon2] = coord2;

    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2); // Distance in km with 2 decimals
  };

  // Estimate travel time (assuming 30km/h average speed)
  const calculateTravelTime = (distance) => {
    const hours = distance / 30;
    if (hours < 1) {
      return `${Math.round(hours * 60)} minutes`;
    }
    return `${hours.toFixed(1)} hours`;
  };

  const toggleRoute = () => setRouteVisible(!routeVisible);
  const centerMap = () => {
    const finalDonorLoc = donorLocation || [17.4126, 78.4448];
    const finalCharityLoc = charityLocation || [17.3616, 78.4747];
    setMapCenter([
      (finalDonorLoc[0] + finalCharityLoc[0]) / 2,
      (finalDonorLoc[1] + finalCharityLoc[1]) / 2,
    ]);
  };

  // If no locations provided, use default Hyderabad coordinates
  const defaultDonorLocation = donorLocation || [17.4126, 78.4448]; // Hitec City, Hyderabad
  const defaultCharityLocation = charityLocation || [17.3616, 78.4747]; // Charminar, Hyderabad

  const finalDonorLocation = donorLocation || defaultDonorLocation;
  const finalCharityLocation = charityLocation || defaultCharityLocation;

  return (
    <div className="map-tracker-container">
      <div className="map-controls">
        <button onClick={toggleRoute} className="control-button">
          <FaRoute /> {routeVisible ? "Hide Route" : "Show Route"}
        </button>
        <button onClick={centerMap} className="control-button">
          <FaInfoCircle /> Center Map
        </button>
        {distance && (
          <div className="distance-info">
            <span className="distance-value">{distance} km</span>
            <span className="time-estimate">~{travelTime}</span>
          </div>
        )}
      </div>

      <MapContainer
        center={mapCenter}
        zoom={13}
        className="map-view"
        whenCreated={(map) =>
          map.fitBounds([finalDonorLocation, finalCharityLocation])
        }
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Donor Marker */}
        <Marker position={finalDonorLocation} icon={donorIcon}>
          <Popup>
            <div className="map-popup">
              <h3>Donor Location</h3>
              <p>Food available for pickup</p>
              {distance && <p>{distance} km from charity</p>}
            </div>
          </Popup>
          <Tooltip permanent direction="top">
            🍕 Food Donor
          </Tooltip>
        </Marker>

        {/* Charity Marker */}
        <Marker position={finalCharityLocation} icon={charityIcon}>
          <Popup>
            <div className="map-popup">
              <h3>Charity Location</h3>
              <p>Food distribution point</p>
              {distance && <p>{distance} km from donor</p>}
            </div>
          </Popup>
          <Tooltip permanent direction="top">
            🏠 Charity
          </Tooltip>
        </Marker>

        {/* Route Line */}
        {routeVisible && (
          <Polyline
            positions={[finalDonorLocation, finalCharityLocation]}
            color="#3b82f6"
            weight={4}
            dashArray="10, 10"
          >
            <Tooltip sticky>
              <div className="route-tooltip">
                <strong>Delivery Route</strong>
                <p>Distance: {distance} km</p>
                <p>Estimated travel time: ~{travelTime}</p>
              </div>
            </Tooltip>
          </Polyline>
        )}
      </MapContainer>
    </div>
  );
};

export default MapView;
