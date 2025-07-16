import React, { createContext, useContext, useReducer, useEffect } from "react";
import { toast } from "react-toastify";

const CartContext = createContext();

// Cart actions
const CART_ACTIONS = {
  ADD_ITEM: "ADD_ITEM",
  REMOVE_ITEM: "REMOVE_ITEM",
  UPDATE_QUANTITY: "UPDATE_QUANTITY",
  CLEAR_CART: "CLEAR_CART",
  LOAD_CART: "LOAD_CART",
};

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id,
      );

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        };
      } else {
        return {
          ...state,
          items: [...state.items, { ...action.payload, quantity: 1 }],
        };
      }
    }

    case CART_ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case CART_ACTIONS.UPDATE_QUANTITY:
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== action.payload.id),
        };
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item,
        ),
      };

    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: [],
      };

    case CART_ACTIONS.LOAD_CART:
      return {
        ...state,
        items: action.payload,
      };

    default:
      return state;
  }
};

// Initial state
const initialState = {
  items: [],
};

// Cart provider component
export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("sustainshare_cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: CART_ACTIONS.LOAD_CART, payload: parsedCart });
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("sustainshare_cart", JSON.stringify(cart.items));
  }, [cart.items]);

  // Cart actions
  const addToCart = (item) => {
    dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: item });
    toast.success(`${item.name} added to cart! 🛒`, {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  const removeFromCart = (itemId) => {
    const item = cart.items.find((item) => item.id === itemId);
    dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: itemId });
    if (item) {
      toast.info(`${item.name} removed from cart`, {
        position: "bottom-right",
        autoClose: 2000,
      });
    }
  };

  const updateQuantity = (itemId, quantity) => {
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { id: itemId, quantity },
    });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
    toast.success("Cart cleared!", {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  // Cart calculations
  const getCartTotal = () => {
    return cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  };

  const getCartItemCount = () => {
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  };

  const getCartWeight = () => {
    // Assume each serving is approximately 0.5kg
    return cart.items.reduce(
      (weight, item) => weight + item.servings * item.quantity * 0.5,
      0,
    );
  };

  const isInCart = (itemId) => {
    return cart.items.some((item) => item.id === itemId);
  };

  const getItemQuantity = (itemId) => {
    const item = cart.items.find((item) => item.id === itemId);
    return item ? item.quantity : 0;
  };

  const value = {
    cart: cart.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    getCartWeight,
    isInCart,
    getItemQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartContext;
