import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DonorDashboard from "./pages/DonorDashboard";
import CharityDashboard from "./pages/CharityDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import TrackPickup from "./pages/TrackPickup";
import "leaflet/dist/leaflet.css";
import { AuthProvider } from "./contexts/AuthContext";
import { ClaimProvider } from "./contexts/ClaimContext";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import AvailableFood from "./pages/AvailableFood";
import FoodList from "./components/FoodList";
import FoodMenu from "./components/FoodMenu";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { initializeDemoData } from "./services/demoData";

function App() {
  useEffect(() => {
    // Initialize demo data on app start
    initializeDemoData();
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/donor" element={<DonorDashboard />} />
            <Route path="/charity" element={<CharityDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/foodlist" element={<FoodList />} />
            <Route path="/menu" element={<FoodMenu />} />
            <Route path="/available-food" element={<AvailableFood />} />
            <Route path="/track/:donationId" element={<TrackPickup />} />
          </Routes>
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
