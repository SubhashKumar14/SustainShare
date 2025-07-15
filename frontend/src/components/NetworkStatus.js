import React, { useState, useEffect } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import API from "../services/api";
import "./NetworkStatus.css";

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [backendStatus, setBackendStatus] = useState("checking");
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    // Check browser online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check backend connectivity
    const checkBackendStatus = async () => {
      try {
        // Use existing food endpoint for health check
        await API.get("/food", { timeout: 3000 });
        setBackendStatus("connected");
        setShowStatus(false);
      } catch (error) {
        if (
          error.code === "ERR_NETWORK" ||
          error.message === "Network Error" ||
          error.code === "ECONNABORTED" ||
          error.message.includes("timeout")
        ) {
          setBackendStatus("disconnected");
          setShowStatus(true);
        }
      }
    };

    // Initial check
    checkBackendStatus();

    // Periodic checks with smarter intervals
    let checkInterval = 30000; // Start with 30 seconds

    const setupPeriodicChecks = () => {
      return setInterval(() => {
        checkBackendStatus();
        // Increase interval if backend is down, reset if up
        if (backendStatus === "disconnected") {
          checkInterval = Math.min(checkInterval * 1.5, 120000); // Max 2 minutes
        } else {
          checkInterval = 30000; // Reset to 30 seconds when connected
        }
      }, checkInterval);
    };

    const interval = setupPeriodicChecks();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOnline) {
    return (
      <div className="network-status offline">
        <FaExclamationTriangle />
        <span>No internet connection</span>
      </div>
    );
  }

  if (showStatus && backendStatus === "disconnected") {
    // Auto-dismiss after 8 seconds for better UX
    setTimeout(() => setShowStatus(false), 8000);

    return (
      <div className="network-status backend-offline">
        <span>
          ⚠️ Backend server unavailable. Please start the Spring Boot backend on
          port 8080.
        </span>
        <button
          className="dismiss-btn"
          onClick={() => setShowStatus(false)}
          title="Dismiss notification"
        >
          ×
        </button>
      </div>
    );
  }

  return null;
};

export default NetworkStatus;
