// src/pages/TrackPickup.js
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { OpenStreetMapProvider } from 'leaflet-geosearch';

const TrackPickup = () => {
  const [position, setPosition] = useState(null);
  const [locationName, setLocationName] = useState('');

  // Get donor location from localStorage (sent from CharityDashboard)
  const pickupLocation = localStorage.getItem('pickupLocation');

  useEffect(() => {
    const search = async () => {
      if (pickupLocation) {
        const provider = new OpenStreetMapProvider();
        const results = await provider.search({ query: pickupLocation });

        if (results && results.length > 0) {
          const { x, y, label } = results[0];
          setPosition([y, x]);
          setLocationName(label);
        }
      }
    };
    search();
  }, [pickupLocation]);

  return (
    <div style={{ height: '90vh', width: '100%' }}>
      {position ? (
        <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
            lang="en"
          />
          <Marker position={position}>
            <Popup>
              Donor Pickup Location:<br />
              <strong>{locationName}</strong>
            </Popup>
          </Marker>
        </MapContainer>
      ) : (
        <h3 style={{ textAlign: 'center', marginTop: '40px' }}>Loading Map...</h3>
      )}
    </div>
  );
};

export default TrackPickup;
