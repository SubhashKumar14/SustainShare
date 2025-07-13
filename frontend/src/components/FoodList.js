import React, { useEffect, useState } from 'react';
import API from '../services/api';

const FoodList = () => {
  const [foodItems, setFoodItems] = useState([]);

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const fetchFoodItems = async () => {
    try {
      const response = await API.get('/food');
      setFoodItems(response.data);
    } catch (error) {
      console.error('Error fetching food items:', error);
    }
  };

  return (
    <div>
      <h3 style={styles.heading}>Available Surplus Food</h3>
      {foodItems.length === 0 ? (
        <p style={styles.info}>No food posted yet.</p>
      ) : (
        <table style={styles.table}>
         <thead>
  <tr>
    <th style={styles.th}>ID</th>
    <th style={styles.th}>Food Name</th>
    <th style={styles.th}>Quantity</th>
    <th style={styles.th}>Location</th>
    <th style={styles.th}>Expiry Time</th>
    <th style={styles.th}>Donor ID</th>
  </tr>
</thead>
<tbody>
  {foodItems.map((item) => (
    <tr key={item.id}>
      <td style={styles.td}>{item.id}</td>
      <td style={styles.td}>{item.name}</td>
      <td style={styles.td}>{item.quantity}</td>
      <td style={styles.td}>{item.pickupLocation}</td>
      <td style={styles.td}>{item.expiryTime}</td>
      <td style={styles.td}>{item.donorId}</td>
    </tr>
  ))}
</tbody>

        </table>
      )}
    </div>
  );
};

const styles = {
  heading: {
    marginBottom: '10px',
    color: '#34495e'
  },
  info: {
    color: '#888'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff'
  },
  th: {
    backgroundColor: '#2c3e50',
    color: '#fff',
    padding: '8px'
  },
  td: {
    padding: '8px',
    borderBottom: '1px solid #ccc',
    textAlign: 'center'
  }
};

export default FoodList;
