// Demo data for initial application state
export const initializeDemoData = () => {
  // Check if demo data already exists
  if (localStorage.getItem("sustainshare_demo_initialized")) {
    return;
  }

  // Demo users
  const demoUsers = [
    {
      id: "donor001",
      name: "Rajesh Kumar",
      username: "rajesh_donor",
      email: "rajesh@example.com",
      password: "password123",
      role: "donor",
      createdAt: new Date().toISOString(),
    },
    {
      id: "charity001",
      name: "Helping Hands Foundation",
      username: "helping_hands",
      email: "charity@helpinghands.org",
      password: "password123",
      role: "charity",
      createdAt: new Date().toISOString(),
    },
    {
      id: "admin001",
      name: "Admin User",
      username: "admin",
      email: "admin@sustainshare.com",
      password: "admin123",
      role: "admin",
      createdAt: new Date().toISOString(),
    },
  ];

  // Demo food items
  const demoFoodItems = [
    {
      id: "food_001",
      name: "Mixed Vegetarian Meals",
      quantity: "25",
      pickupLocation: "Hitec City, Hyderabad",
      expiryTime: "18:30",
      donorId: "donor001",
      status: "available",
      createdAt: new Date().toISOString(),
    },
    {
      id: "food_002",
      name: "Fresh Bread and Pastries",
      quantity: "50",
      pickupLocation: "Banjara Hills, Hyderabad",
      expiryTime: "19:00",
      donorId: "donor001",
      status: "available",
      createdAt: new Date().toISOString(),
    },
    {
      id: "food_003",
      name: "Cooked Rice and Dal",
      quantity: "100",
      pickupLocation: "Jubilee Hills, Hyderabad",
      expiryTime: "20:00",
      donorId: "donor001",
      status: "available",
      createdAt: new Date().toISOString(),
    },
    {
      id: "food_004",
      name: "Fresh Fruits and Vegetables",
      quantity: "30",
      pickupLocation: "Madhapur, Hyderabad",
      expiryTime: "17:45",
      donorId: "donor001",
      status: "available",
      createdAt: new Date().toISOString(),
    },
  ];

  // Demo pickups
  const demoPickups = [
    {
      id: "pickup_001",
      scheduledTime: "2024-01-15T17:00:00",
      status: "Scheduled",
      foodItem: { id: "food_001" },
      charity: {
        id: "charity001",
        name: "Helping Hands Foundation",
        location: "Charminar, Hyderabad",
      },
      createdAt: new Date().toISOString(),
    },
  ];

  // Save to localStorage
  localStorage.setItem("sustainshare_users", JSON.stringify(demoUsers));
  localStorage.setItem(
    "sustainshare_food_items",
    JSON.stringify(demoFoodItems),
  );
  localStorage.setItem("sustainshare_pickups", JSON.stringify(demoPickups));
  localStorage.setItem("sustainshare_demo_initialized", "true");

  console.log("Demo data initialized successfully!");
};

// Login credentials for demo
export const demoCredentials = {
  donor: { email: "rajesh@example.com", password: "password123" },
  charity: { email: "charity@helpinghands.org", password: "password123" },
  admin: { email: "admin@sustainshare.com", password: "admin123" },
};
