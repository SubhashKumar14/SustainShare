import axios from "axios";

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
  (error) => {
    // Handle different types of errors
    if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      // Timeout error - backend might be slow or unavailable
      error.isTimeout = true;
      console.warn(
        "Backend request timeout. Please check if the backend server is running on port 8080.",
      );
    } else if (
      error.code === "ERR_NETWORK" ||
      error.message === "Network Error" ||
      error.message.includes("ECONNREFUSED")
    ) {
      // Network error - backend unavailable
      error.isNetworkError = true;
      console.error(
        "Backend server unavailable. Please start the Spring Boot backend on port 8080.",
      );
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
