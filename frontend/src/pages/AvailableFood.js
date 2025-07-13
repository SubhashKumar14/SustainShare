import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AvailableFood.css';

const AvailableFood = () => {
  const [foodItems, setFoodItems] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/food')
      .then(response => setFoodItems(response.data))
      .catch(error => console.error("Error fetching food items:", error));
  }, []);

  return (
    <div className="available-container">
      <h2>Available Surplus Food</h2>
      <table className="available-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Food</th>
            <th>Qty</th>
            <th>Location</th>
            <th>Expires</th>
          </tr>
        </thead>
        <tbody>
          {foodItems.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.pickupLocation}</td>
              <td>{item.expiryTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default AvailableFood;
