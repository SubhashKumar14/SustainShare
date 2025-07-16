import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaUser,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaHome,
} from "react-icons/fa";
import CartButton from "./CartButton";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

  // Check if on a dashboard route
  const isDashboard =
    location.pathname.includes("/donor") ||
    location.pathname.includes("/charity") ||
    location.pathname.includes("/admin");

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="brand-link">
          <img
            src="/logo.png"
            alt="SustainShare Logo"
            className="logo"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/logo.jpg"; // Fallback to JPG if PNG not found
            }}
          />
          <span className="brand-name">SustainShare</span>
        </Link>
      </div>

      <div className="navbar-right">
        {!isDashboard ? (
          <>
            <Link
              to="/"
              className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
            >
              <FaHome className="nav-icon" /> Home
            </Link>
            <CartButton />
            <Link
              to="/signup"
              className={`nav-link ${location.pathname === "/signup" ? "active" : ""}`}
            >
              <FaUserPlus className="nav-icon" /> Sign Up
            </Link>
            <Link
              to="/login"
              className={`nav-link ${location.pathname === "/login" ? "active" : ""}`}
            >
              <FaSignInAlt className="nav-icon" /> Login
            </Link>
          </>
        ) : (
          <div
            className="profile-menu"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <div className="profile-icon">
              <FaUser />
            </div>
            {showDropdown && (
              <div className="dropdown-menu">
                <Link
                  to="/login"
                  className="dropdown-item"
                  onClick={() => {
                    // Add logout logic here if needed
                    localStorage.removeItem("authToken");
                  }}
                >
                  <FaSignOutAlt /> Logout
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
