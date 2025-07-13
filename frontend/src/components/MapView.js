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
import { FaRoute, FaInfoCircle, FaExclamationTriangle } from "react-icons/fa";
import locationService from "../utils/locationService";
import notificationService from "../services/notificationService";
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

const MapView = ({
  donorLocation,
  charityLocation,
  donorAddress,
  charityAddress,
}) => {
  const [distance, setDistance] = useState(null);
  const [travelTime, setTravelTime] = useState(null);
  const [routeVisible, setRouteVisible] = useState(true);
  const [mapCenter, setMapCenter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actualDonorLocation, setActualDonorLocation] = useState(donorLocation);
  const [actualCharityLocation, setActualCharityLocation] =
    useState(charityLocation);

  // Resolve locations from addresses if coordinates not provided
  useEffect(() => {
    const resolveLocations = async () => {
      setLoading(true);
      setError(null);

      try {
        let resolvedDonorLocation = donorLocation;
        let resolvedCharityLocation = charityLocation;

        // If addresses are provided but coordinates aren't, resolve them
        if (!donorLocation && donorAddress) {
          resolvedDonorLocation =
            await locationService.getCoordinatesFromAddress(donorAddress);
        }

        if (!charityLocation && charityAddress) {
          resolvedCharityLocation =
            await locationService.getCoordinatesFromAddress(charityAddress);
        }

        if (!resolvedDonorLocation || !resolvedCharityLocation) {
          throw new Error("Could not resolve one or more locations");
        }

        setActualDonorLocation(resolvedDonorLocation);
        setActualCharityLocation(resolvedCharityLocation);

        const dist = locationService.calculateDistance(
          resolvedDonorLocation,
          resolvedCharityLocation,
        );
        setDistance(dist.toFixed(2));
        setTravelTime(locationService.calculateTravelTime(dist));
        setMapCenter([
          (resolvedDonorLocation[0] + resolvedCharityLocation[0]) / 2,
          (resolvedDonorLocation[1] + resolvedCharityLocation[1]) / 2,
        ]);
      } catch (error) {
        console.error("Error resolving locations:", error);
        setError("Unable to load map locations. Please check the addresses.");
      } finally {
        setLoading(false);
      }
    };

    if (
      (donorLocation && charityLocation) ||
      (donorAddress && charityAddress)
    ) {
      resolveLocations();
    } else {
      setLoading(false);
      setError("Donor and charity locations are required");
    }
  }, [donorLocation, charityLocation, donorAddress, charityAddress]);

  const toggleRoute = () => setRouteVisible(!routeVisible);

  const centerMap = () => {
    if (actualDonorLocation && actualCharityLocation) {
      setMapCenter([
        (actualDonorLocation[0] + actualCharityLocation[0]) / 2,
        (actualDonorLocation[1] + actualCharityLocation[1]) / 2,
      ]);
    }
  };

  if (loading) {
    return (
      <div className="map-placeholder">
        <div>Loading map locations...</div>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="map-placeholder error">
        <FaExclamationTriangle />
        <div>{error}</div>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (!actualDonorLocation || !actualCharityLocation) {
    return (
      <div className="map-placeholder">
        <div>Unable to load map locations</div>
        <div>
          Please check that both donor and charity locations are available
        </div>
      </div>
    );
  }

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
        center={mapCenter || actualDonorLocation}
        zoom={13}
        className="map-view"
        key={`${actualDonorLocation}-${actualCharityLocation}`}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Donor Marker */}
        <Marker position={actualDonorLocation} icon={donorIcon}>
          <Popup>
            <div className="map-popup">
              <h3>Donor Location</h3>
              <p>Food available for pickup</p>
              {distance && <p>{distance} km from charity</p>}
              {donorAddress && (
                <p>
                  <small>{donorAddress}</small>
                </p>
              )}
            </div>
          </Popup>
          <Tooltip permanent direction="top">
            🍕 Food Donor
          </Tooltip>
        </Marker>

        {/* Charity Marker */}
        <Marker position={actualCharityLocation} icon={charityIcon}>
          <Popup>
            <div className="map-popup">
              <h3>Charity Location</h3>
              <p>Food distribution point</p>
              {distance && <p>{distance} km from donor</p>}
              {charityAddress && (
                <p>
                  <small>{charityAddress}</small>
                </p>
              )}
            </div>
          </Popup>
          <Tooltip permanent direction="top">
            🏠 Charity
          </Tooltip>
        </Marker>

        {/* Route Line */}
        {routeVisible && (
          <Polyline
            positions={[actualDonorLocation, actualCharityLocation]}
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
