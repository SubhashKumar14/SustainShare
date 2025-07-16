import React, { useState } from "react";
import { FaHeart, FaCheckCircle, FaTimes, FaUtensils } from "react-icons/fa";
import { useClaim } from "../contexts/ClaimContext";
import "./ClaimNotification.css";

const ClaimNotification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { claimedItems, getClaimedItemCount, getTotalServings, removeClaim } =
    useClaim();

  if (getClaimedItemCount() === 0) {
    return null;
  }

  return (
    <>
      <button
        className="claim-notification-btn"
        onClick={() => setIsOpen(true)}
        title={`${getClaimedItemCount()} claimed items`}
      >
        <FaHeart />
        <span className="claim-count">{getClaimedItemCount()}</span>
      </button>

      {isOpen && (
        <div className="claim-notification-overlay">
          <div className="claim-notification-panel">
            <div className="panel-header">
              <h3>
                <FaHeart /> Your Claimed Food Items
              </h3>
              <button className="close-btn" onClick={() => setIsOpen(false)}>
                <FaTimes />
              </button>
            </div>

            <div className="claim-summary">
              <div className="summary-item">
                <span className="summary-number">{getClaimedItemCount()}</span>
                <span className="summary-label">Items Claimed</span>
              </div>
              <div className="summary-item">
                <span className="summary-number">{getTotalServings()}</span>
                <span className="summary-label">Total Servings</span>
              </div>
            </div>

            <div className="claimed-items-list">
              {claimedItems.map((item) => (
                <div key={item.id} className="claimed-item">
                  <div className="item-image">
                    <img src={item.image} alt={item.name} />
                  </div>

                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>
                      {item.servings} servings • {item.cuisine}
                    </p>
                    <span className="claimed-badge">
                      <FaCheckCircle /> Claimed
                    </span>
                  </div>

                  <button
                    className="remove-claim-btn"
                    onClick={() => removeClaim(item.id)}
                    title="Remove claim"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>

            <div className="panel-footer">
              <p>
                <FaUtensils /> These food items are reserved for you. Please
                coordinate pickup with the donors.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ClaimNotification;
