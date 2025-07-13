import React, { useState, useRef } from 'react';
import './Home.css';
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [showLearnMore, setShowLearnMore] = useState(false);

  // Ref for Learn More section
  const learnMoreRef = useRef(null);

  const handleLearnMore = () => {
    setShowLearnMore(true);
    setTimeout(() => {
      learnMoreRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100); // slight delay to ensure section is rendered
  };

  return (
    <div className="home-container">
      <header className="hero-section">
        <h1>Help End Hunger</h1>
        <h2><span>One Meal at a Time</span></h2>
        <p>
          Every donation makes a difference. Join thousands of compassionate people fighting hunger in our communities today.
        </p>

        <div className="hero-buttons">
          <button className="donate-btn" onClick={() => navigate('/signup')}>
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
          <h3>+</h3>
          <p>People Fed This Year</p>
        </div>
        <div className="stat-card">
          <div className="icon">💙</div>
          <h3>+</h3>
          <p>Active Donors</p>
        </div>
        <div className="stat-card">
          <div className="icon">🎯</div>
          <h3>+</h3>
          <p>Partner Charities</p>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Make a Difference?</h2>
        <p>Your generosity can provide meals, hope, and a brighter future for families in need.</p>
        <button className="cta-button" onClick={() => navigate('/signup')}>
          Start Donating Today →
        </button>
      </section>

      {/* Learn More Section */}
      {showLearnMore && (
        <section ref={learnMoreRef} className="learn-more-section">
          <h2>About SustainShare</h2>
          <p>
            SustainShare is a compassionate platform that bridges the gap between those with surplus food and those in need.
            Whether you're a restaurant, grocery store, or individual with excess food, SustainShare allows you to donate
            effortlessly. Charities can view available donations, schedule pickups, and track everything through a simple
            dashboard. Together, we reduce food waste, combat hunger, and make our communities stronger — one meal at a time.
          </p>
          <p>
            🌱 Empowering donors with a mission.<br />
            🤝 Helping charities reach more people.<br />
            📦 Real-time tracking, instant notifications, and organized dashboards.
          </p>
          <button className="learn-less-btn" onClick={() => setShowLearnMore(false)}>Hide</button>
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
