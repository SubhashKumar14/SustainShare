import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBox, FaUtensils, FaUsers, FaSearch, FaClock, FaMapMarkerAlt, FaUserTag } from 'react-icons/fa';
import './AdminDashboard.css';
import MapView from '../components/MapView';
const AdminDashboard = () => {
  const [activePickups, setActivePickups] = useState([]);
  const [pickups, setPickups] = useState([]);
  const [food, setFood] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState({
    pickups: true,
    food: true,
    users: true
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pickupsRes, foodRes, usersRes] = await Promise.all([
          axios.get('http://localhost:8080/api/pickups'),
          axios.get('http://localhost:8080/api/food'),
          axios.get('http://localhost:8080/api/users')
        ]);
        setPickups(pickupsRes.data);
        setFood(foodRes.data);
        setUsers(usersRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading({
          pickups: false,
          food: false,
          users: false
        });
      }
    };
    fetchData();
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1><FaUserTag /> Admin Dashboard</h1>
        <div className="search-box">
          <FaSearch />

          {activePickups.map(pickup => (
        <MapView
          key={pickup.id}
          donorLocation={pickup.donorCoords}
          charityLocation={pickup.charityCoords}
        />
      ))}
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="dashboard-grid">
        {/* Pickups Section */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2><FaBox /> Pickup Logs</h2>
            <span className="count-badge">{pickups.length}</span>
          </div>
          {loading.pickups ? (
            <div className="loading-spinner">Loading...</div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Charity</th>
                    <th>Food</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {pickups.map(p => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.charity?.name || 'N/A'}</td>
                      <td>{p.foodItem?.name || 'N/A'}</td>
                      <td>
                        <div className="time-cell">
                          <FaClock /> {p.scheduledTime}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {pickups.length === 0 && <div className="empty-state">No pickups recorded</div>}
            </div>
          )}
        </section>

        {/* Food Section */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2><FaUtensils /> Donated Food</h2>
            <span className="count-badge">{food.length}</span>
          </div>
          {loading.food ? (
            <div className="loading-spinner">Loading...</div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Qty</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody>
                  {food.map(f => (
                    <tr key={f.id}>
                      <td>{f.id}</td>
                      <td>{f.name}</td>
                      <td className="quantity-cell">{f.quantity}</td>
                      <td>
                        <div className="location-cell">
                          <FaMapMarkerAlt /> {f.pickupLocation}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {food.length === 0 && <div className="empty-state">No food donations</div>}
            </div>
          )}
        </section>

        {/* Users Section */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2><FaUsers /> Registered Users</h2>
            <span className="count-badge">{users.length}</span>
          </div>
          {loading.users ? (
            <div className="loading-spinner">Loading...</div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td className={`role-cell ${u.role.toLowerCase()}`}>
                        {u.role}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && <div className="empty-state">No users found</div>}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;