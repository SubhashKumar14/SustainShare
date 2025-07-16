import React, { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../contexts/CartContext";
import Cart from "./Cart";
import "./CartButton.css";

const CartButton = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { getCartItemCount, getCartTotal } = useCart();

  const itemCount = getCartItemCount();
  const total = getCartTotal();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      <button
        className={`cart-button ${itemCount > 0 ? "has-items" : ""}`}
        onClick={() => setIsCartOpen(true)}
        title={`Cart (${itemCount} items)`}
      >
        <div className="cart-icon">
          <FaShoppingCart />
          {itemCount > 0 && (
            <span className="cart-badge">
              {itemCount > 99 ? "99+" : itemCount}
            </span>
          )}
        </div>

        {itemCount > 0 && (
          <div className="cart-info">
            <span className="cart-count">
              {itemCount} item{itemCount !== 1 ? "s" : ""}
            </span>
            <span className="cart-total">{formatPrice(total)}</span>
          </div>
        )}
      </button>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default CartButton;
