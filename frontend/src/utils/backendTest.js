import API from "../services/api";

// Test backend connectivity
export const testBackendConnection = async () => {
  try {
    console.log("Testing backend connection...");

    // Try a simple request to test if backend is running
    const response = await fetch("http://localhost:8080/api/test", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Backend response status:", response.status);
    console.log("Backend response headers:", response.headers);

    if (response.ok) {
      const data = await response.text();
      console.log("Backend is running, response:", data);
      return { success: true, message: "Backend is reachable" };
    } else {
      console.log("Backend returned non-200 status:", response.status);
      return {
        success: false,
        message: `Backend returned status ${response.status}`,
      };
    }
  } catch (error) {
    console.error("Backend connection test failed:", error);
    return { success: false, message: "Backend is not reachable", error };
  }
};

// Test specific endpoints
export const testSignupEndpoint = async () => {
  try {
    console.log("Testing signup endpoint...");

    // Test with a minimal payload to see what happens
    const testPayload = {
      id: "test_user",
      name: "Test User",
      username: "testuser",
      email: "test@example.com",
      password: "password123",
      role: "DONOR",
    };

    const response = await API.post("/auth/signup", testPayload);
    console.log("Signup endpoint test successful:", response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Signup endpoint test failed:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });
    return { success: false, error };
  }
};

// Test database tables existence by trying to get data
export const testDataEndpoints = async () => {
  try {
    console.log("Testing data endpoints...");

    // Test if we can get food items (this will tell us if tables exist)
    const foodResponse = await API.get("/food");
    console.log("Food endpoint test successful:", foodResponse.data);

    return { success: true, message: "Data endpoints are working" };
  } catch (error) {
    console.error("Data endpoints test failed:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });
    return { success: false, error };
  }
};
