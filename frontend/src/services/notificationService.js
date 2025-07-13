import { toast } from "react-toastify";

class NotificationService {
  // Success notifications
  success(message, options = {}) {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    });
  }

  // Error notifications
  error(message, options = {}) {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    });
  }

  // Warning notifications
  warning(message, options = {}) {
    toast.warning(message, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    });
  }

  // Info notifications
  info(message, options = {}) {
    toast.info(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    });
  }

  // Custom notifications
  custom(message, type = "default", options = {}) {
    toast(message, {
      type,
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    });
  }

  // Donation-specific notifications
  donationCreated(donorName) {
    this.success(
      `Thank you ${donorName}! Your donation has been listed and charities can now view it.`,
    );
  }

  donationClaimed(charityName, donationId) {
    this.info(
      `Your donation #${donationId} has been claimed by ${charityName}. They will contact you for pickup details.`,
    );
  }

  donationCompleted(donationId) {
    this.success(
      `Donation #${donationId} has been successfully completed! Thank you for making a difference.`,
    );
  }

  // Account-specific notifications
  accountCreated(userType) {
    this.success(
      `Welcome to SustainShare! Your ${userType} account has been created successfully.`,
    );
  }

  loginSuccess(userName) {
    this.success(`Welcome back, ${userName}!`);
  }

  // System notifications
  systemMaintenance() {
    this.warning(
      "System maintenance scheduled for tonight at 2 AM. Service may be temporarily unavailable.",
    );
  }

  newFeature(feature) {
    this.info(
      `New feature available: ${feature}. Check it out in your dashboard!`,
    );
  }

  // Distance notifications
  pickupScheduled(distance, time) {
    this.info(
      `Pickup scheduled! Distance: ${distance} km, Estimated time: ${time}`,
    );
  }

  // Map-related notifications
  locationUpdated() {
    this.success("Your location has been updated successfully.");
  }

  locationError() {
    this.error(
      "Unable to get your location. Please check your browser permissions.",
    );
  }
}

export default new NotificationService();
