import React, { useState, useMemo } from "react";
import {
  FaHeart,
  FaCheckCircle,
  FaClock,
  FaFire,
  FaLeaf,
  FaUtensils,
  FaMapMarkerAlt,
} from "react-icons/fa";
import {
  indianFoodCategories,
  getAllFoodItems,
  searchFoodItems,
} from "../data/indianFoodData";
import { useClaim } from "../contexts/ClaimContext";
import "./FoodMenu.css";

const FoodMenu = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [sortBy, setSortBy] = useState("name");

  const { claimFood, removeClaim, isClaimed } = useClaim();

  // Get filtered and sorted food items
  const filteredItems = useMemo(() => {
    let items = getAllFoodItems();

    // Apply search filter
    if (searchQuery) {
      items = searchFoodItems(searchQuery);
    }

    // Apply category filter
    if (selectedCategory !== "All") {
      items = items.filter((item) => item.cuisine === selectedCategory);
    }

    // Apply type filter
    if (filterType !== "All") {
      items = items.filter((item) => item.type === filterType);
    }

    // Apply sorting
    items.sort((a, b) => {
      switch (sortBy) {
        case "time":
          return parseInt(a.preparationTime) - parseInt(b.preparationTime);
        case "spice":
          const spiceOrder = { None: 0, Mild: 1, Medium: 2, Hot: 3 };
          return spiceOrder[a.spiceLevel] - spiceOrder[b.spiceLevel];
        case "servings":
          return b.servings - a.servings;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return items;
  }, [searchQuery, selectedCategory, filterType, sortBy]);

  const getSpiceIcon = (level) => {
    switch (level) {
      case "Hot":
        return "🌶️🌶️🌶️";
      case "Medium":
        return "🌶️🌶️";
      case "Mild":
        return "🌶️";
      default:
        return "";
    }
  };

  const getTypeIcon = (type) => {
    return type === "Veg" ? "🟢" : "🔴";
  };

  return (
    <div className="food-menu-container">
      <div className="menu-header">
        <h1>🍽️ Available Food Donations</h1>
        <p>Claim delicious food items from generous donors in your community</p>
      </div>

      {/* Search and Filters */}
      <div className="menu-controls">
        <div className="search-section">
          <input
            type="text"
            placeholder="Search for dishes, ingredients, or cuisine..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-section">
          <div className="filter-group">
            <label>Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Categories</option>
              {Object.keys(indianFoodCategories).map((category) => (
                <option key={category} value={category}>
                  {indianFoodCategories[category].icon} {category}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Type:</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Types</option>
              <option value="Veg">🟢 Vegetarian</option>
              <option value="Non-Veg">🔴 Non-Vegetarian</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="name">Name (A-Z)</option>
              <option value="servings">Servings (High to Low)</option>
              <option value="time">Preparation Time</option>
              <option value="spice">Spice Level</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="category-pills">
        <button
          className={`category-pill ${selectedCategory === "All" ? "active" : ""}`}
          onClick={() => setSelectedCategory("All")}
        >
          🍽️ All
        </button>
        {Object.entries(indianFoodCategories).map(([category, data]) => (
          <button
            key={category}
            className={`category-pill ${selectedCategory === category ? "active" : ""}`}
            onClick={() => setSelectedCategory(category)}
            style={{
              backgroundColor: selectedCategory === category ? data.color : "",
            }}
          >
            {data.icon} {category}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="results-info">
        <p>Showing {filteredItems.length} available food donations</p>
      </div>

      {/* Food Items Grid */}
      <div className="food-grid">
        {filteredItems.map((item) => (
          <div key={item.id} className="food-card">
            <div className="food-image">
              <img src={item.image} alt={item.name} />
              <div className="food-badges">
                <span className={`type-badge ${item.type.toLowerCase()}`}>
                  {getTypeIcon(item.type)} {item.type}
                </span>
                {item.spiceLevel !== "None" && (
                  <span className="spice-badge">
                    {getSpiceIcon(item.spiceLevel)}
                  </span>
                )}
              </div>
            </div>

            <div className="food-content">
              <div className="food-header">
                <h3>{item.name}</h3>
                <span
                  className="cuisine-tag"
                  style={{ backgroundColor: item.categoryColor }}
                >
                  {item.categoryIcon} {item.cuisine}
                </span>
              </div>

              <p className="food-description">{item.description}</p>

              <div className="food-details">
                <div className="detail-item">
                  <FaClock />
                  <span>Ready in {item.preparationTime}</span>
                </div>
                <div className="detail-item">
                  <FaUtensils />
                  <span>{item.servings} servings available</span>
                </div>
                {item.spiceLevel !== "None" && (
                  <div className="detail-item">
                    <FaFire />
                    <span>{item.spiceLevel} spice level</span>
                  </div>
                )}
                <div className="detail-item">
                  <FaMapMarkerAlt />
                  <span>Pickup available</span>
                </div>
              </div>

              <div className="ingredients">
                <p>
                  <strong>Ingredients:</strong> {item.ingredients.join(", ")}
                </p>
              </div>

              <div className="food-footer">
                <div className="donation-info">
                  <span className="free-badge">🎁 FREE DONATION</span>
                  <span className="servings-info">
                    {item.servings} people can be fed
                  </span>
                </div>

                <div className="claim-controls">
                  {isClaimed(item.id) ? (
                    <div className="claimed-status">
                      <button
                        className="claimed-btn"
                        onClick={() => removeClaim(item.id)}
                      >
                        <FaCheckCircle /> Claimed
                      </button>
                      <span className="claimed-text">
                        You've claimed this food!
                      </span>
                    </div>
                  ) : (
                    <button
                      className="claim-btn"
                      onClick={() => claimFood(item)}
                    >
                      <FaHeart /> Claim This Food
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="no-results">
          <h3>🔍 No food donations found</h3>
          <p>
            Try adjusting your search or filters to find what you're looking
            for.
          </p>
        </div>
      )}
    </div>
  );
};

export default FoodMenu;
