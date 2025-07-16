import React, { useState, useRef, useEffect } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import CounterAnimation from "../components/CounterAnimation";

const Home = () => {
  const navigate = useNavigate();
  const [showLearnMore, setShowLearnMore] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  // Real-time statistics (these would come from your backend in a real app)
  const [stats, setStats] = useState({
    peopleFed: 12847,
    activeDonors: 1256,
    partnerCharities: 89,
    foodSaved: 45.6, // in tons
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        peopleFed: prev.peopleFed + Math.floor(Math.random() * 3),
        activeDonors: prev.activeDonors + (Math.random() > 0.7 ? 1 : 0),
        partnerCharities:
          prev.partnerCharities + (Math.random() > 0.95 ? 1 : 0),
        foodSaved: prev.foodSaved + Math.random() * 0.1,
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Intersection Observer for stats animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLearnMore = () => {
    setShowLearnMore(true);
    setTimeout(() => {
      document.getElementById("learn-more-section")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  return (
    <div className="home-container">
      <header className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">🌟 Making a Difference Together</div>
          <h1>
            Help End <span className="gradient-text">Hunger</span>
          </h1>
          <h2>One Meal at a Time</h2>
          <p className="hero-description">
            Join thousands of compassionate people fighting hunger in our
            communities. Every donation makes a real difference in someone's
            life today.
          </p>

          <div className="hero-buttons">
            <button
              className="donate-btn primary-btn"
              onClick={() => navigate("/signup")}
            >
              <span>🚀 Start Donating</span>
            </button>
            <button
              className="learn-btn secondary-btn"
              onClick={handleLearnMore}
            >
              <span>📖 Learn More</span>
            </button>
          </div>

          <div className="hero-stats-preview">
            <div className="stat-item">
              <span className="stat-number">12K+</span>
              <span className="stat-label">Lives Impacted</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">45+</span>
              <span className="stat-label">Tons Food Saved</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Support Available</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="floating-card">
            <div className="card-icon">🍽️</div>
            <div className="card-content">
              <h4>Real-Time Impact</h4>
              <p>
                Track your contributions and see the difference you're making
              </p>
            </div>
          </div>
        </div>
      </header>

      <section ref={statsRef} className="stats-section">
        <div className="stats-header">
          <h2>Our Impact in Numbers</h2>
          <p>
            Real-time statistics showing the difference we're making together
          </p>
        </div>

        <div className="stats-grid">
          <div className="stat-card people-fed">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>
                <CounterAnimation
                  end={stats.peopleFed}
                  isVisible={statsVisible}
                  duration={2500}
                />
                <span className="stat-plus">+</span>
              </h3>
              <p>People Fed This Year</p>
              <div className="stat-trend">
                <span className="trend-up">↗️ +127 today</span>
              </div>
            </div>
          </div>

          <div className="stat-card active-donors">
            <div className="stat-icon">💙</div>
            <div className="stat-content">
              <h3>
                <CounterAnimation
                  end={stats.activeDonors}
                  isVisible={statsVisible}
                  duration={2000}
                />
                <span className="stat-plus">+</span>
              </h3>
              <p>Active Donors</p>
              <div className="stat-trend">
                <span className="trend-up">↗️ +23 this week</span>
              </div>
            </div>
          </div>

          <div className="stat-card partner-charities">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <h3>
                <CounterAnimation
                  end={stats.partnerCharities}
                  isVisible={statsVisible}
                  duration={1800}
                />
                <span className="stat-plus">+</span>
              </h3>
              <p>Partner Charities</p>
              <div className="stat-trend">
                <span className="trend-up">↗️ +5 this month</span>
              </div>
            </div>
          </div>

          <div className="stat-card food-saved">
            <div className="stat-icon">🌱</div>
            <div className="stat-content">
              <h3>
                <CounterAnimation
                  end={Math.floor(stats.foodSaved * 10) / 10}
                  isVisible={statsVisible}
                  duration={2200}
                  suffix="t"
                />
                <span className="stat-plus">+</span>
              </h3>
              <p>Food Waste Prevented</p>
              <div className="stat-trend">
                <span className="trend-up">↗️ +0.8t today</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="impact-section">
        <div className="impact-content">
          <h2>How SustainShare Works</h2>
          <div className="process-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>🍕 Donate Food</h3>
                <p>Restaurants and individuals post available surplus food</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>🤝 Connect</h3>
                <p>Charities browse and claim food donations in real-time</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>📍 Track</h3>
                <p>GPS tracking ensures safe and timely food delivery</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>❤️ Impact</h3>
                <p>Meals reach those in need, reducing waste and hunger</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Make a Difference?</h2>
          <p>
            Your generosity can provide meals, hope, and a brighter future for
            families in need.
          </p>
          <div className="cta-buttons">
            <button
              className="cta-button primary"
              onClick={() => navigate("/signup")}
            >
              🚀 Start Donating Today
            </button>
            <button
              className="cta-button secondary"
              onClick={() => navigate("/login")}
            >
              💼 Join as Charity
            </button>
          </div>
        </div>
      </section>

      {/* Learn More Section */}
      {showLearnMore && (
        <section id="learn-more-section" className="learn-more-section">
          <div className="learn-more-content">
            <h2>About SustainShare</h2>
            <div className="learn-more-grid">
              <div className="learn-more-card">
                <div className="card-icon">🌍</div>
                <h3>Our Mission</h3>
                <p>
                  SustainShare bridges the gap between food surplus and food
                  insecurity. We connect restaurants, cafes, and individuals
                  with charitable organizations to ensure no meal goes to waste.
                </p>
              </div>
              <div className="learn-more-card">
                <div className="card-icon">🚀</div>
                <h3>How It Works</h3>
                <p>
                  Real-time notifications, GPS tracking, and organized
                  dashboards make food donation simple and efficient. Every meal
                  donated is tracked from kitchen to table.
                </p>
              </div>
              <div className="learn-more-card">
                <div className="card-icon">📊</div>
                <h3>Track Impact</h3>
                <p>
                  See your real impact with detailed analytics showing how many
                  people you've helped, food waste prevented, and communities
                  strengthened.
                </p>
              </div>
            </div>
            <button
              className="learn-less-btn"
              onClick={() => setShowLearnMore(false)}
            >
              ← Back to Top
            </button>
          </div>
        </section>
      )}

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-left">
            <span className="footer-logo">❤️ SustainShare</span>
            <p>Making every meal count</p>
          </div>
          <div className="footer-right">
            <div className="footer-links"></div>
            <div className="footer-stats">
              <span>🌟 Trusted by {stats.partnerCharities}+ organizations</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
