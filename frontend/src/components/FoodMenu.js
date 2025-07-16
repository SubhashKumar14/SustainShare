import React, { useState, useMemo } from "react";
import {
  FaPlus,
  FaMinus,
  FaShoppingCart,
  FaClock,
  FaFire,
  FaLeaf,
} from "react-icons/fa";
import {
  indianFoodCategories,
  getAllFoodItems,
  searchFoodItems,
} from "../data/indianFoodData";
import { useCart } from "../contexts/CartContext";
import "./FoodMenu.css";

const FoodMenu = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [sortBy, setSortBy] = useState("name");

  const { addToCart, removeFromCart, getItemQuantity, isInCart } = useCart();

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
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "time":
          return parseInt(a.preparationTime) - parseInt(b.preparationTime);
        case "spice":
          const spiceOrder = { None: 0, Mild: 1, Medium: 2, Hot: 3 };
          return spiceOrder[a.spiceLevel] - spiceOrder[b.spiceLevel];
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
        <h1>🍽️ Food Menu</h1>
        <p>Discover delicious Indian cuisine available for donation</p>
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
              <option value="price-low">Price (Low to High)</option>
              <option value="price-high">Price (High to Low)</option>
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
        <p>Showing {filteredItems.length} dishes</p>
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
                  <span>{item.preparationTime}</span>
                </div>
                <div className="detail-item">
                  <FaLeaf />
                  <span>{item.servings} servings</span>
                </div>
                {item.spiceLevel !== "None" && (
                  <div className="detail-item">
                    <FaFire />
                    <span>{item.spiceLevel}</span>
                  </div>
                )}
              </div>

              <div className="ingredients">
                <p>
                  <strong>Ingredients:</strong> {item.ingredients.join(", ")}
                </p>
              </div>

              <div className="food-footer">
                <div className="price">
                  <span className="price-amount">₹{item.price}</span>
                  <span className="price-per">per dish</span>
                </div>

                <div className="cart-controls">
                  {isInCart(item.id) ? (
                    <div className="quantity-controls">
                      <button
                        className="quantity-btn"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <FaMinus />
                      </button>
                      <span className="quantity">
                        {getItemQuantity(item.id)}
                      </span>
                      <button
                        className="quantity-btn"
                        onClick={() => addToCart(item)}
                      >
                        <FaPlus />
                      </button>
                    </div>
                  ) : (
                    <button
                      className="add-to-cart-btn"
                      onClick={() => addToCart(item)}
                    >
                      <FaShoppingCart /> Add to Cart
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
          <h3>🔍 No dishes found</h3>
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
