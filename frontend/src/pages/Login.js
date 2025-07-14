import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";
import API from "../services/api";
import "./Auth.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields", {
        position: "top-center",
        autoClose: 3000,
      });
      setIsLoading(false);
      return;
    }

    try {
      const res = await API.post("/auth/login", formData);

      // Store user data if needed
      if (res.data.token) {
        localStorage.setItem("authToken", res.data.token);
        localStorage.setItem("userRole", res.data.role);
        localStorage.setItem("userId", res.data.userId);
      }

      toast.success("Login successful!", {
        position: "top-center",
        autoClose: 2000,
      });

      // Redirect based on role
      setTimeout(() => {
        const role = res.data.role?.toLowerCase();
        if (role === "donor") navigate("/donor");
        else if (role === "charity") navigate("/charity");
        else if (role === "admin") navigate("/admin");
        else navigate("/"); // fallback
      }, 2000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Login failed. Please check your credentials.";
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to continue to SustainShare</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <span className="input-icon">
              <FaEnvelope />
            </span>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              required
              onChange={handleChange}
              className="auth-input"
            />
          </div>

          <div className="input-group">
            <span className="input-icon">
              <FaLock />
            </span>
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              onChange={handleChange}
              className="auth-input"
            />
          </div>

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? (
              "Logging in..."
            ) : (
              <>
                <FaSignInAlt /> Login
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account? <a href="/signup">Sign up</a>
          </p>
          <p>
            <a href="/forgot-password">Forgot password?</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
