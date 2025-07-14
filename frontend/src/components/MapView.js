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
  const [mapCenter, setMapCenter] = useState(null);

  // Calculate distance and center when locations change
  useEffect(() => {
    if (donorLocation && charityLocation) {
      const dist = calculateDistance(donorLocation, charityLocation);
      setDistance(dist);
      setTravelTime(calculateTravelTime(dist));
      setMapCenter([
        (donorLocation[0] + charityLocation[0]) / 2,
        (donorLocation[1] + charityLocation[1]) / 2,
      ]);
    }
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
  const centerMap = () =>
    setMapCenter([
      (donorLocation[0] + charityLocation[0]) / 2,
      (donorLocation[1] + charityLocation[1]) / 2,
    ]);

  if (!donorLocation || !charityLocation) {
    return <div className="map-placeholder">Loading locations...</div>;
  }

  return (
    <div className="map-tracker-container">
      <div className="map-control-panel">
        <div className="control-row">
          <button onClick={toggleRoute} className="control-btn">
            <FaRoute /> {routeVisible ? "Hide Route" : "Show Route"}
          </button>
          <button onClick={centerMap} className="control-btn">
            <FaInfoCircle /> Center Map
          </button>
        </div>
        {distance && (
          <div className="distance-info">
            <div className="distance-badge">{distance} km</div>
            <div className="time-estimate">🕐 {travelTime}</div>
          </div>
        )}
      </div>

      <MapContainer
        center={mapCenter}
        zoom={13}
        className="map-view"
        whenCreated={(map) => map.fitBounds([donorLocation, charityLocation])}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Donor Marker */}
        <Marker position={donorLocation} icon={donorIcon}>
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
        <Marker position={charityLocation} icon={charityIcon}>
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
            positions={[donorLocation, charityLocation]}
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
