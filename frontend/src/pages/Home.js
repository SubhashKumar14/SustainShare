import React, { useState, useRef, useEffect } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import statsService from "../services/statsService";
import BackendDebug from "../components/BackendDebug";

const Home = () => {
  const navigate = useNavigate();
  const [showLearnMore, setShowLearnMore] = useState(false);
  const [stats, setStats] = useState({
    peopleFed: 0,
    activeDonors: 0,
    partnerCharities: 0,
    loading: true,
  });

  // Ref for Learn More section
  const learnMoreRef = useRef(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsData = await statsService.getStats();
        setStats({
          peopleFed: statsData.peopleFed || 0,
          activeDonors: statsData.activeDonors || 0,
          partnerCharities: statsData.partnerCharities || 0,
          loading: false,
        });
      } catch (error) {
        console.error("Error loading stats:", error);
        setStats((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchStats();

    // Refresh stats every 30 seconds to show real-time updates
    const interval = setInterval(fetchStats, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleLearnMore = () => {
    setShowLearnMore(true);
    setTimeout(() => {
      learnMoreRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100); // slight delay to ensure section is rendered
  };

  return (
    <div className="home-container">
      <BackendDebug />
      <header className="hero-section">
        <h1>Help End Hunger</h1>
        <h2>
          <span>One Meal at a Time</span>
        </h2>
        <p>
          Every donation makes a difference. Join thousands of compassionate
          people fighting hunger in our communities today.
        </p>

        <div className="hero-buttons">
          <button className="donate-btn" onClick={() => navigate("/signup")}>
            Donate Now →
          </button>
          <button className="learn-btn" onClick={handleLearnMore}>
            Learn More
          </button>
        </div>
      </header>

      <section className="stats-section">
        <div className="stat-card">
          <div className="icon">👥</div>
          <h3>
            {stats.loading ? "..." : `${stats.peopleFed.toLocaleString()}+`}
          </h3>
          <p>People Fed This Year</p>
        </div>
        <div className="stat-card">
          <div className="icon">💙</div>
          <h3>
            {stats.loading ? "..." : `${stats.activeDonors.toLocaleString()}+`}
          </h3>
          <p>Active Donors</p>
        </div>
        <div className="stat-card">
          <div className="icon">🎯</div>
          <h3>
            {stats.loading
              ? "..."
              : `${stats.partnerCharities.toLocaleString()}+`}
          </h3>
          <p>Partner Charities</p>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Make a Difference?</h2>
        <p>
          Your generosity can provide meals, hope, and a brighter future for
          families in need.
        </p>
        <button className="cta-button" onClick={() => navigate("/signup")}>
          Start Donating Today →
        </button>
      </section>

      {/* Learn More Section */}
      {showLearnMore && (
        <section ref={learnMoreRef} className="learn-more-section">
          <h2>About SustainShare</h2>
          <p>
            SustainShare is a compassionate platform that bridges the gap
            between those with surplus food and those in need. Whether you're a
            restaurant, grocery store, or individual with excess food,
            SustainShare allows you to donate effortlessly. Charities can view
            available donations, schedule pickups, and track everything through
            a simple dashboard. Together, we reduce food waste, combat hunger,
            and make our communities stronger — one meal at a time.
          </p>
          <p>
            🌱 Empowering donors with a mission.
            <br />
            ���� Helping charities reach more people.
            <br />
            📦 Real-time tracking, instant notifications, and organized
            dashboards.
          </p>
          <button
            className="learn-less-btn"
            onClick={() => setShowLearnMore(false)}
          >
            Hide
          </button>
        </section>
      )}

      <footer className="footer">
        <div className="footer-left">❤️ SustainShare</div>
        <div className="footer-right">
          <a href="/donor">Donor Portal</a>
          <a href="/charity">Charity Portal</a>
          <a href="/admin">Admin Panel</a>
        </div>
      </footer>
    </div>
  );
};

export default Home;
