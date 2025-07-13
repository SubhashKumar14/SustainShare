import React, { useState } from "react";
import {
  testBackendConnection,
  testSignupEndpoint,
  testDataEndpoints,
} from "../utils/backendTest";
import API from "../services/api";

const BackendDebug = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const runTest = async (testName, testFunction) => {
    setLoading(true);
    try {
      const result = await testFunction();
      setResults((prev) => ({ ...prev, [testName]: result }));
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        [testName]: { success: false, error },
      }));
    }
    setLoading(false);
  };

  const testDatabaseTables = async () => {
    setLoading(true);
    const tableTests = {};

    // Test each table by trying to query it
    const tables = ["users", "food_item", "pickup_schedule", "donation_log"];

    for (const table of tables) {
      try {
        // Try to get data from each endpoint that corresponds to tables
        if (table === "food_item") {
          await API.get("/food");
          tableTests[table] = { exists: true, message: "Table accessible" };
        } else if (table === "users") {
          // We can't directly test users table, but we can test auth endpoints
          tableTests[table] = {
            exists: "unknown",
            message: "Cannot test directly",
          };
        } else {
          tableTests[table] = {
            exists: "unknown",
            message: "No endpoint to test",
          };
        }
      } catch (error) {
        tableTests[table] = {
          exists: false,
          message: `Error: ${error.response?.status} - ${error.response?.data || error.message}`,
        };
      }
    }

    setResults((prev) => ({ ...prev, databaseTables: tableTests }));
    setLoading(false);
  };

  const checkEndpointExists = async (endpoint, method = "GET") => {
    try {
      const response = await fetch(`http://localhost:8080/api${endpoint}`, {
        method,
        headers: { "Content-Type": "application/json" },
      });

      return {
        exists: true,
        status: response.status,
        statusText: response.statusText,
      };
    } catch (error) {
      return {
        exists: false,
        error: error.message,
      };
    }
  };

  const testAllEndpoints = async () => {
    setLoading(true);
    const endpoints = [
      { path: "/auth/signup", method: "POST" },
      { path: "/auth/login", method: "POST" },
      { path: "/food", method: "GET" },
      { path: "/food", method: "POST" },
      { path: "/pickups", method: "POST" },
    ];

    const endpointResults = {};
    for (const endpoint of endpoints) {
      const result = await checkEndpointExists(endpoint.path, endpoint.method);
      endpointResults[`${endpoint.method} ${endpoint.path}`] = result;
    }

    setResults((prev) => ({ ...prev, endpoints: endpointResults }));
    setLoading(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        background: "white",
        border: "1px solid #ccc",
        padding: "20px",
        maxWidth: "400px",
        maxHeight: "600px",
        overflow: "auto",
        zIndex: 9999,
        fontSize: "12px",
      }}
    >
      <h3>Backend Debug Panel</h3>

      <div style={{ marginBottom: "10px" }}>
        <button
          onClick={() => runTest("connectivity", testBackendConnection)}
          disabled={loading}
        >
          Test Backend Connection
        </button>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <button
          onClick={() => runTest("signup", testSignupEndpoint)}
          disabled={loading}
        >
          Test Signup Endpoint
        </button>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <button
          onClick={() => runTest("data", testDataEndpoints)}
          disabled={loading}
        >
          Test Data Endpoints
        </button>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <button onClick={testDatabaseTables} disabled={loading}>
          Test Database Tables
        </button>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <button onClick={testAllEndpoints} disabled={loading}>
          Test All Endpoints
        </button>
      </div>

      {loading && <div>Testing...</div>}

      <div style={{ marginTop: "20px" }}>
        <h4>Results:</h4>
        <pre style={{ fontSize: "10px", overflow: "auto", maxHeight: "300px" }}>
          {JSON.stringify(results, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default BackendDebug;
