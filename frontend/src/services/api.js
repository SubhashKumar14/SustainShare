import axios from "axios";
import mockAPI from "./mockAPI";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle errors
API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Handle different types of errors
    if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      // Timeout error - backend might be slow or unavailable
      error.isTimeout = true;
      console.warn("Backend request timeout. Attempting to use mock API...");
    } else if (
      error.code === "ERR_NETWORK" ||
      error.message === "Network Error" ||
      error.message.includes("ECONNREFUSED")
    ) {
      // Network error - backend unavailable, try mock API
      error.isNetworkError = true;
      console.info(
        "Backend server unavailable. Using mock API for development...",
      );

      // Try to fulfill the request with mock API
      if (process.env.NODE_ENV === "development") {
        try {
          const originalConfig = error.config;
          const method = originalConfig.method.toUpperCase();
          const url = originalConfig.url.replace(originalConfig.baseURL, "");
          const data = originalConfig.data
            ? JSON.parse(originalConfig.data)
            : null;

          const mockResponse = await mockAPI.request(method, url, data);

          // Return a response that looks like axios response
          return {
            data: mockResponse,
            status: 200,
            statusText: "OK",
            headers: {},
            config: originalConfig,
          };
        } catch (mockError) {
          console.error("Mock API also failed:", mockError.message);
        }
      }
    } else if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");
      // Redirect to login if not already there
      if (
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/signup"
      ) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default API;
