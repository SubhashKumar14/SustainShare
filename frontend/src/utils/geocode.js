import { OpenStreetMapProvider } from 'leaflet-geosearch';

const provider = new OpenStreetMapProvider();

export const addressToCoordinates = async (address) => {
  try {
    const results = await provider.search({ query: address });
    if (results.length > 0) {
      return [results[0].y, results[0].x]; // [lat, lng]
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
};