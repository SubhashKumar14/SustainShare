import React, { useState } from 'react';
import API from '../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Important: import styles once in your root file (usually App.js)
import { addressToCoordinates } from '../utils/geocode';
const DonorForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    pickupLocation: '',
    expiryTime: '',
    donorId: '',
    address: " ",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/food', formData);
      toast.success('✅ Food posted successfully!', {
        position: "bottom-right"
      });

      setFormData({
        name: '',
        quantity: '',
        pickupLocation: '',
        expiryTime: '',
        donorId: ''
      });
    } catch (error) {
      console.error('Error posting food:', error);
      toast.error('❌ Failed to post food.', {
        position: "bottom-right"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
         <div className="input-group">
        <label>Pickup Location Address</label>
        <input
          type="text"
          name="address"
          placeholder="e.g. Uppal X Roads, Hyderabad"
          required
          onChange={(e) => setFormData({...formData, address: e.target.value})}
        />
        <small>Enter full address for accurate mapping</small>
      </div>
      <input name="name" placeholder="Food name" value={formData.name} onChange={handleChange} required style={styles.input} />
      <input name="quantity" placeholder="Quantity" type="number" value={formData.quantity} onChange={handleChange} required style={styles.input} />
      <input name="pickupLocation" placeholder="Pickup Location" value={formData.pickupLocation} onChange={handleChange} required style={styles.input} />
      <input name="expiryTime" placeholder="Expiry Time" value={formData.expiryTime} onChange={handleChange} required style={styles.input} />
      <input name="donorId" placeholder="Donor ID" value={formData.donorId} onChange={handleChange} required style={styles.input} />
      <button type="submit" style={styles.button}>Post Food</button>
    </form>
  );
};

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '30px'
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px'
  },
  button: {
    backgroundColor: '#27ae60',
    color: 'white',
    padding: '12px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer'
  }
};

export default DonorForm;
