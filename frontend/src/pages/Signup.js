import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaIdCard,
  FaUserTag,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
} from "react-icons/fa";
import API from "../services/api";
import "./Auth.css";

const Signup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [buttonState, setButtonState] = useState("default");

  const [user, setUser] = useState({
    id: "",
    name: "",
    username: "",
    email: "",
    password: "",
    role: "donor",
  });

  const validateField = (name, value) => {
    const errors = { ...formErrors };

    switch (name) {
      case "id":
        if (value && !/^[a-zA-Z0-9_]{3,}$/.test(value)) {
          errors.id =
            "ID must be at least 3 characters (letters, numbers, underscore only)";
        } else {
          delete errors.id;
        }
        break;
      case "name":
        if (value && value.length < 2) {
          errors.name = "Name must be at least 2 characters";
        } else {
          delete errors.name;
        }
        break;
      case "email":
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = "Please enter a valid email address";
        } else {
          delete errors.email;
        }
        break;
      case "password":
        if (value) {
          if (value.length < 6) {
            errors.password = "Password must be at least 6 characters";
            setPasswordStrength("weak");
          } else if (value.length < 8) {
            setPasswordStrength("medium");
            delete errors.password;
          } else if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
            setPasswordStrength("strong");
            delete errors.password;
          } else {
            setPasswordStrength("medium");
            delete errors.password;
          }
        } else {
          setPasswordStrength("");
        }
        break;
      default:
        break;
    }

    setFormErrors(errors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));

    validateField(name, value);
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case "weak":
        return "#e53e3e";
      case "medium":
        return "#dd6b20";
      case "strong":
        return "#38a169";
      default:
        return "#e2e8f0";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setButtonState("loading");

    // Final validation
    const requiredFields = ["id", "name", "email", "password"];
    const errors = {};

    requiredFields.forEach((field) => {
      if (!user[field]) {
        errors[field] = "This field is required";
      }
    });

    if (Object.keys(errors).length > 0 || Object.keys(formErrors).length > 0) {
      setFormErrors({ ...formErrors, ...errors });
      toast.error("Please fix the errors below", { position: "top-center" });
      setIsLoading(false);
      setButtonState("error");
      setTimeout(() => setButtonState("default"), 2000);
      return;
    }

    try {
      const payload = {
        id: user.id,
        name: user.name,
        username: user.username || user.id,
        email: user.email,
        password: user.password,
        role: user.role,
      };

      await API.post("/auth/signup", payload);

      setButtonState("success");
      toast.success("🎉 Account created successfully! Redirecting...", {
        position: "top-center",
        autoClose: 2000,
      });

      setTimeout(() => {
        navigate(`/${user.role}`);
      }, 2000);
    } catch (err) {
      setButtonState("error");
      const errorMsg = err.message || "Signup failed. Please try again.";
      toast.error(errorMsg, { position: "top-center" });
      setTimeout(() => setButtonState("default"), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Join SustainShare</h2>
          <p>Create your account and start making a difference today</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* User ID Field */}
          <div className="input-group">
            <span className="input-icon">
              <FaIdCard />
            </span>
            <input
              type="text"
              name="id"
              placeholder="Choose a unique ID (e.g., rajesh_123)"
              value={user.id}
              onChange={handleChange}
              className="auth-input"
              required
            />
            {formErrors.id && (
              <span className="error-text">{formErrors.id}</span>
            )}
          </div>

          {/* Name Field */}
          <div className="input-group">
            <span className="input-icon">
              <FaUser />
            </span>
            <input
              type="text"
              name="name"
              placeholder="Your full name"
              value={user.name}
              onChange={handleChange}
              className="auth-input"
              required
            />
            {formErrors.name && (
              <span className="error-text">{formErrors.name}</span>
            )}
          </div>

          {/* Username Field */}
          <div className="input-group">
            <span className="input-icon">
              <FaUser />
            </span>
            <input
              type="text"
              name="username"
              placeholder="Username (optional - will use ID if empty)"
              value={user.username}
              onChange={handleChange}
              className="auth-input"
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
              placeholder="your.email@example.com"
              value={user.email}
              onChange={handleChange}
              className="auth-input"
              required
            />
            {formErrors.email && (
              <span className="error-text">{formErrors.email}</span>
            )}
          </div>

          {/* Password Field */}
          <div className="input-group">
            <span className="input-icon">
              <FaLock />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create a strong password"
              value={user.password}
              onChange={handleChange}
              className="auth-input"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "15px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "#667eea",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {user.password && (
              <div
                style={{
                  marginTop: "8px",
                  padding: "4px 0",
                  fontSize: "12px",
                  color: getPasswordStrengthColor(),
                  fontWeight: "600",
                }}
              >
                Password strength: {passwordStrength}
                <div
                  style={{
                    width: "100%",
                    height: "3px",
                    background: "#e2e8f0",
                    borderRadius: "2px",
                    marginTop: "4px",
                  }}
                >
                  <div
                    style={{
                      width:
                        passwordStrength === "weak"
                          ? "33%"
                          : passwordStrength === "medium"
                            ? "66%"
                            : passwordStrength === "strong"
                              ? "100%"
                              : "0%",
                      height: "100%",
                      background: getPasswordStrengthColor(),
                      borderRadius: "2px",
                      transition: "all 0.3s ease",
                    }}
                  ></div>
                </div>
              </div>
            )}
            {formErrors.password && (
              <span className="error-text">{formErrors.password}</span>
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
              <option value="donor">
                🍽️ Food Donor (Restaurant/Individual)
              </option>
              <option value="charity">❤️ Charity Organization</option>
            </select>
          </div>

          <button
            type="submit"
            className={`auth-button ${buttonState}`}
            disabled={isLoading || Object.keys(formErrors).length > 0}
          >
            {buttonState === "loading" && <span className="spinner"></span>}
            {buttonState === "success" ? (
              <>
                <FaCheckCircle /> Account Created!
              </>
            ) : buttonState === "loading" ? (
              "Creating Account..."
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <a href="/login">Sign in here</a>
          </p>
          <p style={{ fontSize: "12px", opacity: "0.8" }}>
            By signing up, you agree to help reduce food waste and fight hunger
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
