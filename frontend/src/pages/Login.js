import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUser, FaLock, FaSignInAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import { AuthContext } from "../contexts/AuthContext";
import API from "../services/api";
import "./Auth.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [buttonState, setButtonState] = useState("default");
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setButtonState("loading");

    try {
      const res = await API.post("/auth/login", formData);

      // Store user data in context and localStorage
      setCurrentUser(res.data);
      localStorage.setItem("currentUser", JSON.stringify(res.data));

      setButtonState("success");
      toast.success("Welcome back! Login successful!", {
        position: "top-center",
        autoClose: 2000,
        icon: "🎉",
      });

      // Redirect based on role
      setTimeout(() => {
        const { role } = res.data;
        if (role === "donor") navigate("/donor");
        else if (role === "charity") navigate("/charity");
        else if (role === "admin") navigate("/admin");
        else navigate("/");
      }, 1500);
    } catch (err) {
      setButtonState("error");
      const errorMessage =
        err.message || "Login failed. Please check your credentials.";
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
        icon: "❌",
      });

      setTimeout(() => setButtonState("default"), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (role) => {
    const credentials = {
      donor: { email: "rajesh@example.com", password: "password123" },
      charity: { email: "charity@helpinghands.org", password: "password123" },
      admin: { email: "admin@sustainshare.com", password: "admin123" },
    };

    setFormData(credentials[role]);
    toast.info(`Demo ${role} credentials filled!`, {
      position: "top-center",
      autoClose: 1500,
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to continue your journey with SustainShare</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <span className="input-icon">
              <FaUser />
            </span>
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              className="auth-input"
              required
            />
          </div>

          <div className="input-group">
            <span className="input-icon">
              <FaLock />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
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
          </div>

          <button
            type="submit"
            className={`auth-button ${buttonState}`}
            disabled={isLoading}
          >
            {buttonState === "loading" && <span className="spinner"></span>}
            {buttonState === "success" ? (
              "✓ Success!"
            ) : buttonState === "loading" ? (
              "Signing in..."
            ) : (
              <>
                <FaSignInAlt /> Sign In
              </>
            )}
          </button>
        </form>

        <div className="demo-notice">
          <p>
            <strong>🚀 Quick Demo Access</strong>
          </p>
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <button
              onClick={() => fillDemoCredentials("donor")}
              style={{
                background: "#4299e1",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "6px",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              Try as Donor
            </button>
            <button
              onClick={() => fillDemoCredentials("charity")}
              style={{
                background: "#48bb78",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "6px",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              Try as Charity
            </button>
            <button
              onClick={() => fillDemoCredentials("admin")}
              style={{
                background: "#ed8936",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "6px",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              Try as Admin
            </button>
          </div>
        </div>

        <div className="auth-footer">
          <p>
            Don't have an account? <a href="/signup">Create one here</a>
          </p>
          <p>
            <a href="#forgot">Forgot your password?</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
