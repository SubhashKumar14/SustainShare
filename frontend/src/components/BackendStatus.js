import React, { useState, useEffect } from "react";
import { FaCircle, FaServer, FaDatabase } from "react-icons/fa";
import API from "../services/api";
import "./BackendStatus.css";

const BackendStatus = () => {
  const [status, setStatus] = useState("checking");
  const [lastChecked, setLastChecked] = useState(null);

  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        await API.get("/food", { timeout: 3000 });
        setStatus("connected");
      } catch (error) {
        // Log error for debugging but handle gracefully
        console.log("Backend status check failed:", error.message);
        setStatus("disconnected");
      }
      setLastChecked(new Date());
    };

    // Initial check
    checkBackendStatus();

    // Check every 30 seconds
    const interval = setInterval(checkBackendStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case "connected":
        return "#28a745";
      case "disconnected":
        return "#dc3545";
      case "checking":
        return "#ffc107";
      default:
        return "#6c757d";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "connected":
        return "Backend Connected";
      case "disconnected":
        return "Backend Offline";
      case "checking":
        return "Checking...";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="backend-status">
      <div className="status-indicator">
        <FaServer className="server-icon" />
        <FaCircle className="status-dot" style={{ color: getStatusColor() }} />
        <span className="status-text">{getStatusText()}</span>
      </div>

      {status === "disconnected" && (
        <div className="connection-help">
          <FaDatabase className="help-icon" />
          <div className="help-text">
            <strong>Start Backend Server:</strong>
            <code>cd backend && ./mvnw spring-boot:run</code>
          </div>
        </div>
      )}

      {lastChecked && (
        <div className="last-checked">
          Last checked: {lastChecked.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default BackendStatus;
