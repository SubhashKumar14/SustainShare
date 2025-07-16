import React, { createContext, useContext, useReducer, useEffect } from "react";
import { toast } from "react-toastify";

const ClaimContext = createContext();

// Claim actions
const CLAIM_ACTIONS = {
  CLAIM_ITEM: "CLAIM_ITEM",
  REMOVE_CLAIM: "REMOVE_CLAIM",
  CLEAR_CLAIMS: "CLEAR_CLAIMS",
  LOAD_CLAIMS: "LOAD_CLAIMS",
  UPDATE_STATUS: "UPDATE_STATUS",
};

// Claim reducer
const claimReducer = (state, action) => {
  switch (action.type) {
    case CLAIM_ACTIONS.CLAIM_ITEM: {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id,
      );

      if (existingItem) {
        toast.warning("You have already claimed this food item");
        return state;
      } else {
        return {
          ...state,
          items: [
            ...state.items,
            {
              ...action.payload,
              claimedAt: new Date().toISOString(),
              status: "claimed",
            },
          ],
        };
      }
    }

    case CLAIM_ACTIONS.REMOVE_CLAIM:
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case CLAIM_ACTIONS.UPDATE_STATUS:
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, status: action.payload.status }
            : item,
        ),
      };

    case CLAIM_ACTIONS.CLEAR_CLAIMS:
      return {
        ...state,
        items: [],
      };

    case CLAIM_ACTIONS.LOAD_CLAIMS:
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

// Claim provider component
export const ClaimProvider = ({ children }) => {
  const [claims, dispatch] = useReducer(claimReducer, initialState);

  // Load claims from localStorage on mount
  useEffect(() => {
    const savedClaims = localStorage.getItem("sustainshare_claims");
    if (savedClaims) {
      try {
        const parsedClaims = JSON.parse(savedClaims);
        dispatch({ type: CLAIM_ACTIONS.LOAD_CLAIMS, payload: parsedClaims });
      } catch (error) {
        console.error("Error loading claims from localStorage:", error);
      }
    }
  }, []);

  // Save claims to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("sustainshare_claims", JSON.stringify(claims.items));
  }, [claims.items]);

  // Claim actions
  const claimFood = (item) => {
    dispatch({ type: CLAIM_ACTIONS.CLAIM_ITEM, payload: item });
    toast.success(`${item.name} claimed successfully! 🎉`, {
      position: "bottom-right",
      autoClose: 3000,
    });
  };

  const removeClaim = (itemId) => {
    const item = claims.items.find((item) => item.id === itemId);
    dispatch({ type: CLAIM_ACTIONS.REMOVE_CLAIM, payload: itemId });
    if (item) {
      toast.info(`Claim for ${item.name} removed`, {
        position: "bottom-right",
        autoClose: 2000,
      });
    }
  };

  const updateClaimStatus = (itemId, status) => {
    dispatch({
      type: CLAIM_ACTIONS.UPDATE_STATUS,
      payload: { id: itemId, status },
    });
  };

  const clearClaims = () => {
    dispatch({ type: CLAIM_ACTIONS.CLEAR_CLAIMS });
    toast.success("All claims cleared!", {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  // Claim calculations
  const getClaimedItemCount = () => {
    return claims.items.length;
  };

  const getTotalServings = () => {
    return claims.items.reduce(
      (total, item) => total + (item.servings || 0),
      0,
    );
  };

  const isClaimed = (itemId) => {
    return claims.items.some((item) => item.id === itemId);
  };

  const getClaimStatus = (itemId) => {
    const item = claims.items.find((item) => item.id === itemId);
    return item ? item.status : null;
  };

  const value = {
    claimedItems: claims.items,
    claimFood,
    removeClaim,
    updateClaimStatus,
    clearClaims,
    getClaimedItemCount,
    getTotalServings,
    isClaimed,
    getClaimStatus,
  };

  return (
    <ClaimContext.Provider value={value}>{children}</ClaimContext.Provider>
  );
};

// Custom hook to use claim context
export const useClaim = () => {
  const context = useContext(ClaimContext);
  if (!context) {
    throw new Error("useClaim must be used within a ClaimProvider");
  }
  return context;
};

export default ClaimContext;
