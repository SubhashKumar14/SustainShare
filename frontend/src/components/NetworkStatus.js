import React, { useState, useEffect } from "react";
import { FaWifi, FaExclamationTriangle } from "react-icons/fa";
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
        await API.get("/health", { timeout: 3000 });
        setBackendStatus("connected");
        setShowStatus(false);
      } catch (error) {
        if (error.isNetworkError || error.isTimeout) {
          setBackendStatus("disconnected");
          setShowStatus(true);
        }
      }
    };

    // Initial check
    checkBackendStatus();

    // Periodic checks
    const interval = setInterval(checkBackendStatus, 30000); // Check every 30 seconds

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, []);

  if (!isOnline) {
    return (
      <div className="network-status offline">
        <FaExclamationTriangle />
        <span>No internet connection</span>
      </div>
    );
  }

  if (showStatus && backendStatus === "disconnected") {
    return (
      <div className="network-status backend-offline">
        <FaExclamationTriangle />
        <span>Backend unavailable - using demo data</span>
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
