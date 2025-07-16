// Indian Food Data with Images and Varieties
export const indianFoodCategories = {
  "North Indian": {
    icon: "🍛",
    color: "#ff6b6b",
    items: [
      {
        id: "ni_001",
        name: "Butter Chicken",
        image:
          "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&h=300&fit=crop",
        description: "Creamy tomato-based curry with tender chicken pieces",
        cuisine: "North Indian",
        type: "Non-Veg",
        spiceLevel: "Medium",
        servings: 4,
        price: 320,
        preparationTime: "45 mins",
        ingredients: ["Chicken", "Tomato", "Cream", "Butter", "Spices"],
      },
      {
        id: "ni_002",
        name: "Dal Makhani",
        image:
          "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop",
        description: "Rich and creamy black lentils slow-cooked with butter",
        cuisine: "North Indian",
        type: "Veg",
        spiceLevel: "Mild",
        servings: 6,
        price: 240,
        preparationTime: "2 hours",
        ingredients: [
          "Black Lentils",
          "Kidney Beans",
          "Cream",
          "Butter",
          "Tomatoes",
        ],
      },
      {
        id: "ni_003",
        name: "Tandoori Naan",
        image:
          "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=400&h=300&fit=crop",
        description: "Soft, fluffy bread baked in traditional tandoor oven",
        cuisine: "North Indian",
        type: "Veg",
        spiceLevel: "None",
        servings: 2,
        price: 60,
        preparationTime: "20 mins",
        ingredients: ["Wheat Flour", "Yogurt", "Milk", "Yeast", "Garlic"],
      },
      {
        id: "ni_004",
        name: "Paneer Tikka",
        image:
          "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop",
        description: "Grilled cottage cheese marinated in aromatic spices",
        cuisine: "North Indian",
        type: "Veg",
        spiceLevel: "Medium",
        servings: 3,
        price: 280,
        preparationTime: "30 mins",
        ingredients: ["Paneer", "Yogurt", "Bell Peppers", "Onions", "Spices"],
      },
    ],
  },
  "South Indian": {
    icon: "🥞",
    color: "#4ecdc4",
    items: [
      {
        id: "si_001",
        name: "Masala Dosa",
        image:
          "https://images.unsplash.com/photo-1630409342552-a886cacce29a?w=400&h=300&fit=crop",
        description: "Crispy crepe filled with spiced potato curry",
        cuisine: "South Indian",
        type: "Veg",
        spiceLevel: "Medium",
        servings: 2,
        price: 120,
        preparationTime: "25 mins",
        ingredients: ["Rice", "Lentils", "Potatoes", "Onions", "Curry Leaves"],
      },
      {
        id: "si_002",
        name: "Idli Sambar",
        image:
          "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=300&fit=crop",
        description: "Steamed rice cakes served with lentil curry",
        cuisine: "South Indian",
        type: "Veg",
        spiceLevel: "Mild",
        servings: 4,
        price: 90,
        preparationTime: "30 mins",
        ingredients: ["Rice", "Urad Dal", "Toor Dal", "Vegetables", "Tamarind"],
      },
      {
        id: "si_003",
        name: "Chicken Chettinad",
        image:
          "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop",
        description: "Spicy and aromatic chicken curry from Tamil Nadu",
        cuisine: "South Indian",
        type: "Non-Veg",
        spiceLevel: "Hot",
        servings: 4,
        price: 350,
        preparationTime: "50 mins",
        ingredients: [
          "Chicken",
          "Coconut",
          "Red Chilies",
          "Fennel",
          "Star Anise",
        ],
      },
      {
        id: "si_004",
        name: "Coconut Rice",
        image:
          "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop",
        description: "Fragrant rice cooked with fresh coconut and curry leaves",
        cuisine: "South Indian",
        type: "Veg",
        spiceLevel: "Mild",
        servings: 4,
        price: 140,
        preparationTime: "20 mins",
        ingredients: [
          "Basmati Rice",
          "Coconut",
          "Curry Leaves",
          "Mustard Seeds",
          "Urad Dal",
        ],
      },
    ],
  },
  "Street Food": {
    icon: "🌮",
    color: "#ffa726",
    items: [
      {
        id: "sf_001",
        name: "Pav Bhaji",
        image:
          "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop",
        description: "Spicy vegetable curry served with buttered bread rolls",
        cuisine: "Street Food",
        type: "Veg",
        spiceLevel: "Medium",
        servings: 2,
        price: 100,
        preparationTime: "30 mins",
        ingredients: [
          "Mixed Vegetables",
          "Pav Bread",
          "Butter",
          "Onions",
          "Tomatoes",
        ],
      },
      {
        id: "sf_002",
        name: "Vada Pav",
        image:
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
        description: "Mumbai's famous potato fritter sandwich",
        cuisine: "Street Food",
        type: "Veg",
        spiceLevel: "Medium",
        servings: 1,
        price: 40,
        preparationTime: "20 mins",
        ingredients: [
          "Potatoes",
          "Pav Bread",
          "Gram Flour",
          "Green Chilies",
          "Garlic",
        ],
      },
      {
        id: "sf_003",
        name: "Chaat Platter",
        image:
          "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop",
        description: "Assorted savory snacks with tangy chutneys",
        cuisine: "Street Food",
        type: "Veg",
        spiceLevel: "Medium",
        servings: 3,
        price: 180,
        preparationTime: "25 mins",
        ingredients: ["Puri", "Potatoes", "Chickpeas", "Yogurt", "Chutneys"],
      },
      {
        id: "sf_004",
        name: "Chicken Tikka Roll",
        image:
          "https://images.unsplash.com/photo-1601050690117-94f5f6fa9d2d?w=400&h=300&fit=crop",
        description: "Grilled chicken wrapped in soft flatbread",
        cuisine: "Street Food",
        type: "Non-Veg",
        spiceLevel: "Medium",
        servings: 1,
        price: 160,
        preparationTime: "35 mins",
        ingredients: ["Chicken", "Roti", "Onions", "Mint Chutney", "Yogurt"],
      },
    ],
  },
  Bengali: {
    icon: "🐟",
    color: "#ab47bc",
    items: [
      {
        id: "bn_001",
        name: "Fish Curry (Maacher Jhol)",
        image:
          "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop",
        description: "Traditional Bengali fish curry with vegetables",
        cuisine: "Bengali",
        type: "Non-Veg",
        spiceLevel: "Medium",
        servings: 4,
        price: 320,
        preparationTime: "40 mins",
        ingredients: ["Fish", "Potatoes", "Tomatoes", "Onions", "Turmeric"],
      },
      {
        id: "bn_002",
        name: "Rasgulla",
        image:
          "https://images.unsplash.com/photo-1571881148818-27ab19422d9c?w=400&h=300&fit=crop",
        description: "Soft, spongy cottage cheese balls in sugar syrup",
        cuisine: "Bengali",
        type: "Veg",
        spiceLevel: "None",
        servings: 6,
        price: 150,
        preparationTime: "45 mins",
        ingredients: ["Cottage Cheese", "Sugar", "Cardamom", "Rose Water"],
      },
      {
        id: "bn_003",
        name: "Aloo Posto",
        image:
          "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop",
        description: "Potatoes cooked in poppy seed paste - a Bengali delicacy",
        cuisine: "Bengali",
        type: "Veg",
        spiceLevel: "Mild",
        servings: 4,
        price: 180,
        preparationTime: "25 mins",
        ingredients: [
          "Potatoes",
          "Poppy Seeds",
          "Green Chilies",
          "Turmeric",
          "Mustard Oil",
        ],
      },
    ],
  },
  "Cafe Specials": {
    icon: "☕",
    color: "#8bc34a",
    items: [
      {
        id: "cs_001",
        name: "Masala Chai",
        image:
          "https://images.unsplash.com/photo-1597318236244-8e28a4c69b1b?w=400&h=300&fit=crop",
        description: "Aromatic spiced tea blend - perfect with any meal",
        cuisine: "Cafe Special",
        type: "Veg",
        spiceLevel: "Mild",
        servings: 2,
        price: 60,
        preparationTime: "10 mins",
        ingredients: ["Tea", "Milk", "Cardamom", "Ginger", "Cinnamon"],
      },
      {
        id: "cs_002",
        name: "Samosa Chat",
        image:
          "https://images.unsplash.com/photo-1601050690117-94f5f6fa9d2d?w=400&h=300&fit=crop",
        description: "Crispy samosas topped with chutneys and yogurt",
        cuisine: "Cafe Special",
        type: "Veg",
        spiceLevel: "Medium",
        servings: 2,
        price: 120,
        preparationTime: "15 mins",
        ingredients: ["Samosas", "Yogurt", "Chutneys", "Onions", "Sev"],
      },
      {
        id: "cs_003",
        name: "Kulfi Ice Cream",
        image:
          "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&h=300&fit=crop",
        description:
          "Traditional Indian ice cream with cardamom and pistachios",
        cuisine: "Cafe Special",
        type: "Veg",
        spiceLevel: "None",
        servings: 1,
        price: 80,
        preparationTime: "5 mins",
        ingredients: ["Milk", "Cardamom", "Pistachios", "Sugar", "Cream"],
      },
    ],
  },
};

// Additional utility functions
export const getAllFoodItems = () => {
  return Object.values(indianFoodCategories).flatMap((category) =>
    category.items.map((item) => ({
      ...item,
      categoryIcon: category.icon,
      categoryColor: category.color,
    })),
  );
};

export const getFoodItemById = (id) => {
  const allItems = getAllFoodItems();
  return allItems.find((item) => item.id === id);
};

export const getFoodItemsByCategory = (categoryName) => {
  return indianFoodCategories[categoryName]?.items || [];
};

export const getFoodItemsByType = (type) => {
  const allItems = getAllFoodItems();
  return allItems.filter((item) => item.type === type);
};

export const getFoodItemsBySpiceLevel = (spiceLevel) => {
  const allItems = getAllFoodItems();
  return allItems.filter((item) => item.spiceLevel === spiceLevel);
};

export const searchFoodItems = (query) => {
  const allItems = getAllFoodItems();
  const lowercaseQuery = query.toLowerCase();

  return allItems.filter(
    (item) =>
      item.name.toLowerCase().includes(lowercaseQuery) ||
      item.description.toLowerCase().includes(lowercaseQuery) ||
      item.cuisine.toLowerCase().includes(lowercaseQuery) ||
      item.ingredients.some((ingredient) =>
        ingredient.toLowerCase().includes(lowercaseQuery),
      ),
  );
};

// Sample restaurant data
export const sampleRestaurants = [
  {
    id: "rest_001",
    name: "Spice Garden Restaurant",
    location: "Hitec City, Hyderabad",
    rating: 4.5,
    cuisine: ["North Indian", "South Indian"],
    specialties: ["ni_001", "si_001", "ni_002"],
    contact: "+91 9876543210",
  },
  {
    id: "rest_002",
    name: "Street Food Junction",
    location: "Banjara Hills, Hyderabad",
    rating: 4.2,
    cuisine: ["Street Food", "Cafe Specials"],
    specialties: ["sf_001", "sf_002", "cs_001"],
    contact: "+91 9876543211",
  },
  {
    id: "rest_003",
    name: "Bengali Delights",
    location: "Jubilee Hills, Hyderabad",
    rating: 4.7,
    cuisine: ["Bengali", "North Indian"],
    specialties: ["bn_001", "bn_002", "ni_004"],
    contact: "+91 9876543212",
  },
];
