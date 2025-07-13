import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaIdCard,
  FaUserTag,
} from "react-icons/fa";
import API from "../services/api";
import notificationService from "../services/notificationService";
import statsService from "../services/statsService";
import { AuthContext } from "../contexts/AuthContext";
import { testBackendConnection } from "../utils/backendTest";
import "./Auth.css";

const Signup = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [userIdError, setUserIdError] = useState("");

  const [user, setUser] = useState({
    userId: "", // Changed to match backend DTO field name
    name: "",
    username: "",
    email: "",
    password: "",
    role: "DONOR",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: name === "role" ? value.toUpperCase() : value,
    }));

    // Real-time validation
    if (name === "password") {
      setPasswordError(
        value.length > 0 && value.length < 6
          ? "Password must be at least 6 characters"
          : "",
      );
    }

    if (name === "userId") {
      setUserIdError(
        value.length > 0 && !/^[a-zA-Z0-9_]+$/.test(value)
          ? "Only letters, numbers and underscores allowed"
          : "",
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Final validation
    if (
      !user.userId ||
      !user.name ||
      !user.username ||
      !user.email ||
      !user.password
    ) {
      notificationService.error("All fields are required");
      setIsLoading(false);
      return;
    }

    if (passwordError || userIdError) {
      setIsLoading(false);
      return;
    }

    try {
      // Test backend connectivity first
      const backendTest = await testBackendConnection();
      console.log("Backend connectivity test:", backendTest);

      if (!backendTest.success) {
        notificationService.error(
          "Backend server is not running. Please start the backend server.",
        );
        setIsLoading(false);
        return;
      }

      const payload = {
        id: user.userId,
        name: user.name,
        username: user.username,
        email: user.email,
        password: user.password,
        role: user.role,
      };

      console.log("Signup payload:", payload);
      const response = await API.post("/auth/signup", payload);
      console.log("Signup response:", response);

      // Store user data in AuthContext
      const userData = {
        id: user.userId,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
      };
      setCurrentUser(userData);

      // Increment appropriate statistics counter
      try {
        if (user.role === "DONOR") {
          statsService.localIncrementActiveDonors();
        } else if (user.role === "CHARITY") {
          statsService.localIncrementPartnerCharities();
        }
      } catch (error) {
        console.error("Error updating statistics:", error);
      }

      notificationService.accountCreated(user.role.toLowerCase());

      setTimeout(() => {
        navigate(`/${user.role.toLowerCase()}`);
      }, 2000);
    } catch (err) {
      console.error("Signup error details:", {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        headers: err.response?.headers,
        message: err.message,
        fullError: err,
      });

      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data ||
        "Signup failed. Please try again.";
      notificationService.error(`Signup failed: ${JSON.stringify(errorMsg)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create Your Account</h2>
          <p>Join SustainShare to make a difference</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* User ID Field */}
          <div className="input-group">
            <span className="input-icon">
              <FaIdCard />
            </span>
            <input
              type="text"
              name="userId"
              placeholder="Choose a Unique ID"
              value={user.userId}
              onChange={handleChange}
              className="auth-input"
              required
              pattern="[a-zA-Z0-9_]+"
              title="Only letters, numbers and underscores allowed"
            />
            {userIdError && <span className="error-text">{userIdError}</span>}
          </div>

          {/* Name Field */}
          <div className="input-group">
            <span className="input-icon">
              <FaUser />
            </span>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={user.name}
              onChange={handleChange}
              className="auth-input"
              required
              minLength={3}
            />
          </div>

          {/* Username Field */}
          <div className="input-group">
            <span className="input-icon">
              <FaUser />
            </span>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={user.username}
              onChange={handleChange}
              className="auth-input"
              required
            />
          </div>

          {/* Email Field */}
          <div className="input-group">
            <span className="input-icon">
              <FaEnvelope />
            </span>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={user.email}
              onChange={handleChange}
              className="auth-input"
              required
            />
          </div>

          {/* Password Field */}
          <div className="input-group">
            <span className="input-icon">
              <FaLock />
            </span>
            <input
              type="password"
              name="password"
              placeholder="Password (min 6 characters)"
              value={user.password}
              onChange={handleChange}
              className="auth-input"
              required
              minLength={6}
            />
            {passwordError && (
              <span className="error-text">{passwordError}</span>
            )}
          </div>

          {/* Role Selection */}
          <div className="input-group">
            <span className="input-icon">
              <FaUserTag />
            </span>
            <select
              name="role"
              value={user.role}
              onChange={handleChange}
              className="auth-select"
              required
            >
              <option value="DONOR">Food Donor</option>
              <option value="CHARITY">Charity Organization</option>
            </select>
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={isLoading || passwordError || userIdError}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <a href="/login">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
