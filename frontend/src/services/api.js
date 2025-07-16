import axios from "axios";
import { smartApi } from "./mockApi";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Enhanced API with fallback to mock
const enhancedAPI = {
  get: async (url) => {
    try {
      const response = await API.get(url);
      return response;
    } catch (error) {
      // Silently fall back to mock API when backend is unavailable
      return await smartApi.get(url);
    }
  },

  post: async (url, data) => {
    try {
      const response = await API.post(url, data);
      return response;
    } catch (error) {
      // Silently fall back to mock API when backend is unavailable
      return await smartApi.post(url, data);
    }
  },

  delete: async (url) => {
    try {
      const response = await API.delete(url);
      return response;
    } catch (error) {
      // Silently fall back to mock API when backend is unavailable
      return await smartApi.delete(url);
    }
  },

  put: async (url, data) => {
    try {
      const response = await API.put(url, data);
      return response;
    } catch (error) {
      // Silently fall back to mock API when backend is unavailable
      // For now, treat PUT like POST
      return await smartApi.post(url, data);
    }
  },
};

export default enhancedAPI;
