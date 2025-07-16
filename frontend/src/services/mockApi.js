// Mock API service for offline functionality

// Mock data storage using localStorage
const STORAGE_KEYS = {
  USERS: "sustainshare_users",
  FOOD_ITEMS: "sustainshare_food_items",
  PICKUPS: "sustainshare_pickups",
  DONATIONS: "sustainshare_donations",
};

// Helper functions for localStorage
const getFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
};

// Mock API functions
export const mockApi = {
  // Auth endpoints
  auth: {
    signup: async (userData) => {
      const users = getFromStorage(STORAGE_KEYS.USERS);

      // Check if user already exists
      const existingUser = users.find(
        (u) => u.email === userData.email || u.username === userData.username,
      );
      if (existingUser) {
        throw new Error("User already exists");
      }

      const newUser = {
        ...userData,
        id: userData.id || `user_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      saveToStorage(STORAGE_KEYS.USERS, users);

      return { data: newUser };
    },

    login: async (credentials) => {
      const users = getFromStorage(STORAGE_KEYS.USERS);
      const user = users.find(
        (u) =>
          u.email === credentials.email && u.password === credentials.password,
      );

      if (!user) {
        throw new Error("Invalid credentials");
      }

      return { data: user };
    },
  },

  // Food endpoints
  food: {
    getAll: async () => {
      const foodItems = getFromStorage(STORAGE_KEYS.FOOD_ITEMS);
      return { data: foodItems };
    },

    create: async (foodData) => {
      const foodItems = getFromStorage(STORAGE_KEYS.FOOD_ITEMS);
      const newItem = {
        ...foodData,
        id: `food_${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: "available",
      };

      foodItems.push(newItem);
      saveToStorage(STORAGE_KEYS.FOOD_ITEMS, foodItems);

      return { data: newItem };
    },

    delete: async (id) => {
      const foodItems = getFromStorage(STORAGE_KEYS.FOOD_ITEMS);
      const updatedItems = foodItems.filter((item) => item.id !== id);
      saveToStorage(STORAGE_KEYS.FOOD_ITEMS, updatedItems);

      return { data: { message: "Food item deleted" } };
    },

    getById: async (id) => {
      const foodItems = getFromStorage(STORAGE_KEYS.FOOD_ITEMS);
      const item = foodItems.find((item) => item.id === id);

      if (!item) {
        // Return mock data for demo
        return {
          data: {
            id: id,
            name: "Mixed Vegetarian Meals",
            quantity: "25 units",
            pickupLocation: "Hitec City, Hyderabad",
            expiryTime: "18:30",
            donorId: "DONOR001",
          },
        };
      }

      return { data: item };
    },
  },

  // Pickup endpoints
  pickups: {
    create: async (pickupData) => {
      const pickups = getFromStorage(STORAGE_KEYS.PICKUPS);
      const newPickup = {
        ...pickupData,
        id: `pickup_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };

      pickups.push(newPickup);
      saveToStorage(STORAGE_KEYS.PICKUPS, pickups);

      return { data: newPickup };
    },

    getByFoodId: async (foodId) => {
      const pickups = getFromStorage(STORAGE_KEYS.PICKUPS);
      const pickup = pickups.find((p) => p.foodItem?.id === foodId);

      if (!pickup) {
        // Return mock data for demo
        return {
          data: {
            id: "PICKUP001",
            scheduledTime: "2024-01-15T17:00:00",
            status: "Scheduled",
            charity: {
              id: "CHARITY001",
              name: "Helping Hands Foundation",
              location: "Charminar, Hyderabad",
            },
          },
        };
      }

      return { data: pickup };
    },
  },
};

// Check if backend is available
export const checkBackendConnection = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/health", {
      method: "GET",
      timeout: 3000,
    });
    return response.ok;
  } catch {
    return false;
  }
};

// Smart API wrapper that tries backend first, falls back to mock
export const smartApi = {
  get: async (url) => {
    try {
      const backendAvailable = await checkBackendConnection();
      if (!backendAvailable) {
        throw new Error("Backend not available");
      }

      // Try real API
      const response = await fetch(`http://localhost:8080/api${url}`);
      if (!response.ok) throw new Error("API request failed");

      const data = await response.json();
      return { data };
    } catch (error) {
      console.log("Falling back to mock API for GET", url);

      // Handle different endpoints
      if (url === "/food") {
        return mockApi.food.getAll();
      } else if (url.startsWith("/food/")) {
        const id = url.split("/")[2];
        return mockApi.food.getById(id);
      } else if (url.startsWith("/pickups/food/")) {
        const foodId = url.split("/")[3];
        return mockApi.pickups.getByFoodId(foodId);
      }

      throw error;
    }
  },

  post: async (url, data) => {
    try {
      const backendAvailable = await checkBackendConnection();
      if (!backendAvailable) {
        throw new Error("Backend not available");
      }

      // Try real API
      const response = await fetch(`http://localhost:8080/api${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("API request failed");

      const responseData = await response.json();
      return { data: responseData };
    } catch (error) {
      console.log("Falling back to mock API for POST", url);

      // Handle different endpoints
      if (url === "/auth/signup") {
        return mockApi.auth.signup(data);
      } else if (url === "/auth/login") {
        return mockApi.auth.login(data);
      } else if (url === "/food") {
        return mockApi.food.create(data);
      } else if (url === "/pickups") {
        return mockApi.pickups.create(data);
      }

      throw error;
    }
  },

  delete: async (url) => {
    try {
      const backendAvailable = await checkBackendConnection();
      if (!backendAvailable) {
        throw new Error("Backend not available");
      }

      // Try real API
      const response = await fetch(`http://localhost:8080/api${url}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("API request failed");

      return { data: { message: "Deleted successfully" } };
    } catch (error) {
      console.log("Falling back to mock API for DELETE", url);

      if (url.startsWith("/food/")) {
        const id = url.split("/")[2];
        return mockApi.food.delete(id);
      }

      throw error;
    }
  },
};

export default smartApi;
