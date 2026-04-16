import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { HomeIcon } from './Icons';
import './IpadScreen.css';

// Ongoing rides mock data (similar to HomePage)
const ONGOING_RIDES = [
  { id: 1, lat: 52.2281, lng: 5.0645, name: "Johan G.", type: "driver", location: "Kortenhoef" },
  { id: 2, lat: 52.2350, lng: 5.0750, name: "Maria S.", type: "rider", location: "Kortenhoef Center" },
  { id: 3, lat: 52.2150, lng: 5.0550, name: "Piet de V.", type: "driver", location: "Emmaweg" }
];

export default function IpadScreen() {
  const [rides, setRides] = useState(ONGOING_RIDES);

  return (
    <div className="ipad-screen">
      {/* Top Header */}
      <header className="ipad-header">
        <div className="ipad-logo-group">
          <div className="ipad-logo">
            <img src="/logo.png" alt="Ons Kortenhoef" />
          </div>
          <div className="ipad-header-text">
            <span className="ipad-header-label">Your Community</span>
            <h1 className="ipad-header-title">Ons Kortenhoef</h1>
          </div>
        </div>
      </header>

      {/* Full Map */}
      <div className="ipad-map-container">
        <MapContainer 
          center={[52.2281, 5.0645]} 
          zoom={14} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          {rides.map(ride => (
            <Marker 
              key={ride.id} 
              position={[ride.lat, ride.lng]}
            >
              <Popup>
                <div className="ride-popup">
                  <strong>{ride.name}</strong>
                  <p>{ride.type === 'driver' ? 'Driving' : 'Waiting'} in {ride.location}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Decorative corners/frames if needed from Figma */}
      <div className="ipad-frame-corner ipad-frame-corner--tl" />
      <div className="ipad-frame-corner ipad-frame-corner--tr" />
      <div className="ipad-frame-corner ipad-frame-corner--bl" />
      <div className="ipad-frame-corner ipad-frame-corner--br" />
    </div>
  );
}
