// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa";
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

    try {
      const res = await axios.post(
        "http://localhost:8080/api/auth/login",
        formData,
      );
      toast.success("Login successful!", {
        position: "top-center",
        autoClose: 2000,
      });

      // Redirect with slight delay for toast to show
      setTimeout(() => {
        const { role } = res.data;
        if (role === "donor") navigate("/donor");
        else if (role === "charity") navigate("/charity");
        else if (role === "admin") navigate("/admin");
        else navigate("/"); // fallback
      }, 2000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
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
              <FaUser />
            </span>
            <input
              type="email"
              name="email"
              placeholder="Email"
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
