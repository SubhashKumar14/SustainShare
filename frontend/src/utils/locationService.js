import { addressToCoordinates } from "./geocode";
import notificationService from "../services/notificationService";

class LocationService {
  // Calculate distance between two coordinates using Haversine formula
  calculateDistance(coord1, coord2) {
    const [lat1, lon1] = coord1;
    const [lat2, lon2] = coord2;

    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  // Calculate travel time (assuming 30km/h average speed)
  calculateTravelTime(distance) {
    const hours = distance / 30;
    if (hours < 1) {
      return `${Math.round(hours * 60)} minutes`;
    }
    return `${hours.toFixed(1)} hours`;
  }

  // Get user's current location
  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        notificationService.error(
          "Geolocation is not supported by this browser",
        );
        reject(new Error("Geolocation not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = [position.coords.latitude, position.coords.longitude];
          notificationService.locationUpdated();
          resolve(coords);
        },
        (error) => {
          console.error("Error getting location:", error);
          notificationService.locationError();
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // Cache for 5 minutes
        },
      );
    });
  }

  // Convert address to coordinates with error handling
  async getCoordinatesFromAddress(address) {
    try {
      const coords = await addressToCoordinates(address);
      if (!coords) {
        notificationService.error(
          `Could not find coordinates for address: ${address}`,
        );
        return null;
      }
      return coords;
    } catch (error) {
      console.error("Geocoding error:", error);
      notificationService.error("Failed to convert address to coordinates");
      return null;
    }
  }

  // Get distance and time between donor and charity
  async getDistanceInfo(donorAddress, charityAddress) {
    try {
      const [donorCoords, charityCoords] = await Promise.all([
        this.getCoordinatesFromAddress(donorAddress),
        this.getCoordinatesFromAddress(charityAddress),
      ]);

      if (!donorCoords || !charityCoords) {
        return null;
      }

      const distance = this.calculateDistance(donorCoords, charityCoords);
      const travelTime = this.calculateTravelTime(distance);

      return {
        distance: distance.toFixed(2),
        travelTime,
        donorCoords,
        charityCoords,
      };
    } catch (error) {
      console.error("Error calculating distance:", error);
      notificationService.error("Failed to calculate distance");
      return null;
    }
  }

  // Find nearest charities to a donor location
  async findNearestCharities(donorAddress, charities, maxDistance = 50) {
    try {
      const donorCoords = await this.getCoordinatesFromAddress(donorAddress);
      if (!donorCoords) return [];

      const charitiesWithDistance = await Promise.all(
        charities.map(async (charity) => {
          try {
            const charityCoords = await this.getCoordinatesFromAddress(
              charity.address,
            );
            if (!charityCoords) return null;

            const distance = this.calculateDistance(donorCoords, charityCoords);
            if (distance <= maxDistance) {
              return {
                ...charity,
                distance: distance.toFixed(2),
                travelTime: this.calculateTravelTime(distance),
                coordinates: charityCoords,
              };
            }
            return null;
          } catch (error) {
            console.error(`Error processing charity ${charity.id}:`, error);
            return null;
          }
        }),
      );

      return charitiesWithDistance
        .filter((charity) => charity !== null)
        .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    } catch (error) {
      console.error("Error finding nearest charities:", error);
      return [];
    }
  }

  // Format distance for display
  formatDistance(distance) {
    const dist = parseFloat(distance);
    if (dist < 1) {
      return `${Math.round(dist * 1000)}m`;
    }
    return `${dist.toFixed(1)}km`;
  }

  // Check if two locations are within reasonable pickup distance
  isWithinPickupRange(distance, maxRange = 100) {
    return parseFloat(distance) <= maxRange;
  }
}

const locationService = new LocationService();
export default locationService;
