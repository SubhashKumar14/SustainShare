const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 8080;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());

// In-memory storage
let users = [];
let foodItems = [];
let pickups = [];
let idCounter = 1;

// Helper function to generate Hyderabad coordinates
const getRandomHyderabadCoords = () => {
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
  ];
  return locations[Math.floor(Math.random() * locations.length)];
};

// Initialize with some sample data
const initializeData = () => {
  // Sample users
  users = [
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
  ];

  // Sample food items
  foodItems = [
    {
      id: 1,
      name: "Fresh Vegetable Curry",
      quantity: "50 servings",
      category: "COOKED_FOOD",
      pickupLocation: "Banjara Hills Road No 12, Hyderabad",
      expiryTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      description: "Fresh homemade vegetable curry",
      donorId: 1,
      status: "AVAILABLE",
      allergens: "None",
      coordinates: [17.4065, 78.4772],
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      name: "Organic Fruits",
      quantity: "100 pieces",
      category: "FRESH_PRODUCE",
      pickupLocation: "Hitech City Main Road, Madhapur",
      expiryTime: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      description: "Fresh organic fruits from local farm",
      donorId: 1,
      status: "AVAILABLE",
      allergens: "None",
      coordinates: [17.4483, 78.3915],
      createdAt: new Date().toISOString(),
    },
  ];

  idCounter = 3;
};

initializeData();

// Routes

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Mock backend server running" });
});

// Auth routes
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);

  if (user) {
    res.json({
      token: "mock-jwt-token-" + Date.now(),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

app.post("/api/auth/register", (req, res) => {
  const { name, email, password, role = "DONOR" } = req.body;

  // Check if user already exists
  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ message: "User already exists" });
  }

  const newUser = {
    id: ++idCounter,
    name,
    email,
    role,
    createdAt: new Date().toISOString(),
    phone: "+91-" + Math.floor(Math.random() * 9000000000 + 1000000000),
  };

  users.push(newUser);

  res.status(201).json({
    token: "mock-jwt-token-" + Date.now(),
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    },
  });
});

// User routes
app.get("/api/users", (req, res) => {
  res.json(users);
});

app.delete("/api/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  users = users.filter((u) => u.id !== id);
  res.json({ message: "User deleted successfully" });
});

app.put("/api/users/:id/role", (req, res) => {
  const id = parseInt(req.params.id);
  const { role } = req.body;
  const user = users.find((u) => u.id === id);

  if (user) {
    user.role = role;
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Food routes
app.get("/api/food", (req, res) => {
  res.json(foodItems);
});

app.post("/api/food", (req, res) => {
  const {
    name,
    quantity,
    category,
    pickupLocation,
    expiryTime,
    description,
    allergens,
  } = req.body;

  const newFoodItem = {
    id: ++idCounter,
    name,
    quantity,
    category,
    pickupLocation,
    expiryTime,
    description,
    allergens: allergens || "None",
    donorId: 1, // Mock donor ID
    status: "AVAILABLE",
    coordinates: getRandomHyderabadCoords(),
    createdAt: new Date().toISOString(),
  };

  foodItems.push(newFoodItem);
  res.status(201).json(newFoodItem);
});

app.put("/api/food/:id/claim", (req, res) => {
  const id = parseInt(req.params.id);
  const { charityId } = req.body;
  const item = foodItems.find((f) => f.id === id);

  if (item) {
    item.status = "CLAIMED";
    item.claimedBy = charityId;
    item.claimedAt = new Date().toISOString();
    res.json(item);
  } else {
    res.status(404).json({ message: "Food item not found" });
  }
});

app.put("/api/food/:id/status", (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;
  const item = foodItems.find((f) => f.id === id);

  if (item) {
    item.status = status;
    res.json(item);
  } else {
    res.status(404).json({ message: "Food item not found" });
  }
});

app.delete("/api/food/:id", (req, res) => {
  const id = parseInt(req.params.id);
  foodItems = foodItems.filter((f) => f.id !== id);
  res.json({ message: "Food item deleted successfully" });
});

// Pickup routes
app.get("/api/pickups", (req, res) => {
  res.json(pickups);
});

app.post("/api/pickups", (req, res) => {
  const { scheduledTime, foodItemId, charityId } = req.body;

  const newPickup = {
    id: ++idCounter,
    scheduledTime,
    foodItemId,
    charityId,
    status: "Scheduled",
    createdAt: new Date().toISOString(),
  };

  pickups.push(newPickup);
  res.status(201).json(newPickup);
});

app.put("/api/pickups/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const pickup = pickups.find((p) => p.id === id);

  if (pickup) {
    Object.assign(pickup, req.body);
    res.json(pickup);
  } else {
    res.status(404).json({ message: "Pickup not found" });
  }
});

// Stats endpoint for homepage
app.get("/api/stats", (req, res) => {
  const stats = {
    peopleFed:
      foodItems
        .filter((f) => f.status === "DELIVERED")
        .reduce((sum, f) => sum + parseInt(f.quantity) || 0, 0) + 1250,
    activeDonors: users.filter((u) => u.role === "DONOR").length + 180,
    partnerCharities: users.filter((u) => u.role === "CHARITY").length + 28,
  };
  res.json(stats);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Mock Backend Server running on http://localhost:${PORT}`);
  console.log(`📊 API Endpoints available:`);
  console.log(`   - GET  /api/health`);
  console.log(`   - POST /api/auth/login`);
  console.log(`   - POST /api/auth/register`);
  console.log(`   - GET  /api/users`);
  console.log(`   - GET  /api/food`);
  console.log(`   - POST /api/food`);
  console.log(`   - GET  /api/pickups`);
  console.log(`   - GET  /api/stats`);
  console.log(`🗺️  Sample data includes Hyderabad locations`);
  console.log(`🌐 CORS enabled for http://localhost:3000`);
});

module.exports = app;
