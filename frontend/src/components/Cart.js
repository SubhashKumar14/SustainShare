import React, { useState } from "react";
import {
  FaShoppingCart,
  FaTimes,
  FaPlus,
  FaMinus,
  FaTrash,
  FaCreditCard,
  FaClock,
  FaMapMarkerAlt,
  FaPhone,
} from "react-icons/fa";
import { useCart } from "../contexts/CartContext";
import { toast } from "react-toastify";
import "./Cart.css";

const Cart = ({ isOpen, onClose }) => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartWeight,
    getCartItemCount,
  } = useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    if (!deliveryInfo.name || !deliveryInfo.phone || !deliveryInfo.address) {
      toast.error("Please fill in all delivery information");
      return;
    }

    setIsCheckingOut(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const orderData = {
        items: cart,
        total: getCartTotal(),
        weight: getCartWeight(),
        delivery: deliveryInfo,
        orderTime: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000).toISOString(), // 45 minutes from now
      };

      // Save to localStorage for demo
      const existingOrders = JSON.parse(
        localStorage.getItem("sustainshare_orders") || "[]",
      );
      const newOrder = {
        ...orderData,
        id: `order_${Date.now()}`,
        status: "confirmed",
      };
      existingOrders.push(newOrder);
      localStorage.setItem(
        "sustainshare_orders",
        JSON.stringify(existingOrders),
      );

      clearCart();
      toast.success(
        `🎉 Order placed successfully! Order ID: ${newOrder.id.slice(-6)}`,
        {
          position: "top-center",
          autoClose: 5000,
        },
      );

      onClose();
      setDeliveryInfo({ name: "", phone: "", address: "", notes: "" });
    } catch (error) {
      toast.error("Order failed. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  if (!isOpen) return null;

  return (
    <div className="cart-overlay">
      <div className="cart-container">
        {/* Cart Header */}
        <div className="cart-header">
          <div className="cart-title">
            <FaShoppingCart />
            <h2>Your Cart ({getCartItemCount()} items)</h2>
          </div>
          <button className="cart-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Cart Content */}
        <div className="cart-content">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <FaShoppingCart className="empty-icon" />
              <h3>Your cart is empty</h3>
              <p>Add some delicious food items to get started!</p>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="cart-items">
                {cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="item-image">
                      <img src={item.image} alt={item.name} />
                      <span
                        className={`type-indicator ${item.type.toLowerCase()}`}
                      >
                        {item.type === "Veg" ? "🟢" : "🔴"}
                      </span>
                    </div>

                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p className="item-cuisine">
                        {item.categoryIcon} {item.cuisine}
                      </p>
                      <div className="item-meta">
                        <span>
                          <FaClock /> {item.preparationTime}
                        </span>
                        <span>
                          {item.spiceLevel !== "None" &&
                            `🌶️ ${item.spiceLevel}`}
                        </span>
                      </div>
                      <p className="item-price">
                        {formatPrice(item.price)} each
                      </p>
                    </div>

                    <div className="item-controls">
                      <div className="quantity-controls">
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          className="quantity-btn"
                        >
                          <FaMinus />
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                          className="quantity-btn"
                        >
                          <FaPlus />
                        </button>
                      </div>

                      <div className="item-total">
                        {formatPrice(item.price * item.quantity)}
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="remove-btn"
                        title="Remove item"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="cart-summary">
                <div className="summary-row">
                  <span>Subtotal ({getCartItemCount()} items)</span>
                  <span>{formatPrice(getCartTotal())}</span>
                </div>
                <div className="summary-row">
                  <span>Estimated Weight</span>
                  <span>{getCartWeight().toFixed(1)} kg</span>
                </div>
                <div className="summary-row">
                  <span>Delivery Fee</span>
                  <span className="free">FREE</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>{formatPrice(getCartTotal())}</span>
                </div>
              </div>

              {/* Delivery Information */}
              <div className="delivery-info">
                <h3>
                  <FaMapMarkerAlt /> Delivery Information
                </h3>
                <div className="info-form">
                  <div className="form-row">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={deliveryInfo.name}
                      onChange={(e) =>
                        setDeliveryInfo({
                          ...deliveryInfo,
                          name: e.target.value,
                        })
                      }
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={deliveryInfo.phone}
                      onChange={(e) =>
                        setDeliveryInfo({
                          ...deliveryInfo,
                          phone: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <textarea
                    placeholder="Delivery Address"
                    value={deliveryInfo.address}
                    onChange={(e) =>
                      setDeliveryInfo({
                        ...deliveryInfo,
                        address: e.target.value,
                      })
                    }
                    required
                    rows="3"
                  />
                  <textarea
                    placeholder="Special Instructions (Optional)"
                    value={deliveryInfo.notes}
                    onChange={(e) =>
                      setDeliveryInfo({
                        ...deliveryInfo,
                        notes: e.target.value,
                      })
                    }
                    rows="2"
                  />
                </div>
              </div>

              {/* Cart Actions */}
              <div className="cart-actions">
                <button
                  className="clear-cart-btn"
                  onClick={clearCart}
                  disabled={isCheckingOut}
                >
                  <FaTrash /> Clear Cart
                </button>

                <button
                  className="checkout-btn"
                  onClick={handleCheckout}
                  disabled={isCheckingOut || cart.length === 0}
                >
                  {isCheckingOut ? (
                    <>
                      <div className="spinner"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaCreditCard />
                      Place Order • {formatPrice(getCartTotal())}
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
