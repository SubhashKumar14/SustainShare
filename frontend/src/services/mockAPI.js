// Mock API service that simulates backend responses
class MockAPI {
  constructor() {
    this.baseURL = "http://localhost:8080/api";
    this.isEnabled =
      process.env.NODE_ENV === "development" && !this.isBackendAvailable();

    // In-memory storage
    this.storage = {
      users: [
        {
          id: 1,
          name: "Rajesh Kumar",
          email: "rajesh@example.com",
          role: "DONOR",
          createdAt: new Date().toISOString(),
          phone: "+91-9876543210",
        },
        {
          id: 2,
          name: "Priya Sharma",
          email: "priya@example.com",
          role: "CHARITY",
          createdAt: new Date().toISOString(),
          phone: "+91-9876543211",
        },
        {
          id: 3,
          name: "Admin User",
          email: "admin@example.com",
          role: "ADMIN",
          createdAt: new Date().toISOString(),
          phone: "+91-9876543212",
        },
      ],
      foodItems: [
        {
          id: 1,
          name: "Fresh Vegetable Curry",
          quantity: "50 servings",
          category: "COOKED_FOOD",
          pickupLocation: "Banjara Hills Road No 12, Hyderabad",
          expiryTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          description: "Fresh homemade vegetable curry, perfect for lunch",
          donorId: 1,
          status: "AVAILABLE",
          allergens: "None",
          coordinates: [17.4065, 78.4772],
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          name: "Organic Fruits & Vegetables",
          quantity: "100 pieces",
          category: "FRESH_PRODUCE",
          pickupLocation: "Hitech City Main Road, Madhapur",
          expiryTime: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
          description: "Fresh organic fruits and vegetables from local farm",
          donorId: 1,
          status: "AVAILABLE",
          allergens: "None",
          coordinates: [17.4483, 78.3915],
          createdAt: new Date().toISOString(),
        },
        {
          id: 3,
          name: "Hyderabadi Biryani",
          quantity: "75 servings",
          category: "COOKED_FOOD",
          pickupLocation: "Jubilee Bus Station (JBS), Secunderabad",
          expiryTime: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
          description: "Authentic Hyderabadi biryani with raita",
          donorId: 2,
          status: "CLAIMED",
          allergens: "Contains dairy",
          coordinates: [17.4399, 78.4983],
          claimedBy: 2,
          claimedAt: new Date().toISOString(),
          createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        },
      ],
      pickups: [
        {
          id: 1,
          scheduledTime: new Date(
            Date.now() + 2 * 60 * 60 * 1000,
          ).toISOString(),
          status: "Scheduled",
          charityId: 2,
          foodItemId: 3,
          createdAt: new Date().toISOString(),
        },
      ],
      idCounter: 4,
    };

    console.info("🔧 Mock API Service initialized for development");
  }

  async isBackendAvailable() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1000);

      await fetch(`${this.baseURL}/health`, {
        method: "GET",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return true;
    } catch (error) {
      return false;
    }
  }

  getRandomHyderabadCoords() {
    const locations = [
      [17.4065, 78.4772], // Banjara Hills
      [17.4126, 78.44], // Jubilee Hills
      [17.4483, 78.3915], // Hitech City
      [17.4374, 78.4482], // Ameerpet
      [17.3616, 78.5747], // Nagole
      [17.4065, 78.5562], // Uppal
      [17.4399, 78.4983], // JBS
      [17.3687, 78.5318], // Dilsukhnagar
      [17.3616, 78.4747], // Charminar
      [17.504, 78.3588], // Miyapur
      [17.3528, 78.552], // LB Nagar
      [17.3753, 78.4744], // Koti Sultan Bazaar
    ];
    return locations[Math.floor(Math.random() * locations.length)];
  }

  delay(ms = 200) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async mockRequest(method, endpoint, data = null) {
    // Simulate network delay
    await this.delay();

    const path = endpoint.replace("/api", "");

    switch (true) {
      // Health check
      case path === "/health":
        return { status: "OK", message: "Mock API service running" };

      // Auth endpoints
      case path === "/auth/login" && method === "POST":
        const { email } = data;
        const foundUser = this.storage.users.find((u) => u.email === email);
        if (foundUser) {
          return {
            token: "mock-jwt-token-" + Date.now(),
            user: {
              id: foundUser.id,
              name: foundUser.name,
              email: foundUser.email,
              role: foundUser.role,
            },
          };
        }
        throw new Error("Invalid credentials");

      case path === "/auth/register" && method === "POST":
        const { name, email: regEmail, role = "DONOR" } = data;

        if (this.storage.users.find((u) => u.email === regEmail)) {
          throw new Error("User already exists");
        }

        const newUser = {
          id: ++this.storage.idCounter,
          name,
          email: regEmail,
          role,
          createdAt: new Date().toISOString(),
          phone: "+91-" + Math.floor(Math.random() * 9000000000 + 1000000000),
        };

        this.storage.users.push(newUser);

        return {
          token: "mock-jwt-token-" + Date.now(),
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
          },
        };

      // User endpoints
      case path === "/users" && method === "GET":
        return this.storage.users;

      case path.startsWith("/users/") &&
        path.includes("/role") &&
        method === "PUT":
        const userId = parseInt(path.split("/")[2]);
        const userToUpdate = this.storage.users.find((u) => u.id === userId);
        if (userToUpdate) {
          userToUpdate.role = data.role;
          return userToUpdate;
        }
        throw new Error("User not found");

      case path.startsWith("/users/") && method === "DELETE":
        const deleteUserId = parseInt(path.split("/")[2]);
        this.storage.users = this.storage.users.filter(
          (u) => u.id !== deleteUserId,
        );
        return { message: "User deleted successfully" };

      // Food endpoints
      case path === "/food" && method === "GET":
        return this.storage.foodItems;

      case path === "/food" && method === "POST":
        const newFoodItem = {
          id: ++this.storage.idCounter,
          ...data,
          allergens: data.allergens || "None",
          donorId: 1,
          status: "AVAILABLE",
          coordinates: this.getRandomHyderabadCoords(),
          createdAt: new Date().toISOString(),
        };
        this.storage.foodItems.push(newFoodItem);
        return newFoodItem;

      case path.startsWith("/food/") &&
        path.includes("/claim") &&
        method === "PUT":
        const claimFoodId = parseInt(path.split("/")[2]);
        const foodItem = this.storage.foodItems.find(
          (f) => f.id === claimFoodId,
        );
        if (foodItem) {
          foodItem.status = "CLAIMED";
          foodItem.claimedBy = data.charityId;
          foodItem.claimedAt = new Date().toISOString();
          return foodItem;
        }
        throw new Error("Food item not found");

      case path.startsWith("/food/") &&
        path.includes("/status") &&
        method === "PUT":
        const statusFoodId = parseInt(path.split("/")[2]);
        const statusFoodItem = this.storage.foodItems.find(
          (f) => f.id === statusFoodId,
        );
        if (statusFoodItem) {
          statusFoodItem.status = data.status;
          return statusFoodItem;
        }
        throw new Error("Food item not found");

      case path.startsWith("/food/") && method === "DELETE":
        const deleteFoodId = parseInt(path.split("/")[2]);
        this.storage.foodItems = this.storage.foodItems.filter(
          (f) => f.id !== deleteFoodId,
        );
        return { message: "Food item deleted successfully" };

      // Pickup endpoints
      case path === "/pickups" && method === "GET":
        return this.storage.pickups;

      case path === "/pickups" && method === "POST":
        const newPickup = {
          id: ++this.storage.idCounter,
          ...data,
          status: "Scheduled",
          createdAt: new Date().toISOString(),
        };
        this.storage.pickups.push(newPickup);
        return newPickup;

      case path.startsWith("/pickups/") && method === "PUT":
        const pickupId = parseInt(path.split("/")[2]);
        const pickup = this.storage.pickups.find((p) => p.id === pickupId);
        if (pickup) {
          Object.assign(pickup, data);
          return pickup;
        }
        throw new Error("Pickup not found");

      // Stats endpoint
      case path === "/stats" && method === "GET":
        const deliveredFood = this.storage.foodItems.filter(
          (f) => f.status === "DELIVERED",
        );
        const peopleFed =
          deliveredFood.reduce(
            (sum, f) => sum + (parseInt(f.quantity) || 0),
            0,
          ) + 1250;
        const activeDonors =
          this.storage.users.filter((u) => u.role === "DONOR").length + 180;
        const partnerCharities =
          this.storage.users.filter((u) => u.role === "CHARITY").length + 28;

        return { peopleFed, activeDonors, partnerCharities };

      default:
        throw new Error(`Mock API: Endpoint not found: ${method} ${path}`);
    }
  }

  isEnabled() {
    return this.isEnabled;
  }

  async request(method, endpoint, data = null) {
    if (this.isEnabled) {
      console.info(`🔧 Mock API: ${method} ${endpoint}`, data ? data : "");
      return this.mockRequest(method, endpoint, data);
    }
    throw new Error("Mock API is disabled");
  }
}

export default new MockAPI();
