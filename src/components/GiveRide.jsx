import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './RideScreens.css';

// User Location Glowing Dot
const customUserIcon = new L.divIcon({
  className: 'custom-user-icon',
  html: "<div class='user-location-dot'></div>",
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

// Helper for colored rider markers
const createRiderIcon = (color, initial) => new L.divIcon({
  className: 'custom-rider-icon',
  html: `<div class='rider-marker' style='background-color: ${color}'>${initial}</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

function BackIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 12H5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function GiveRideScreen({ onBack, riders }) {
  const [selectedRider, setSelectedRider] = useState(null);
  
  // Weesp center coordinates (User)
  const MAP_CENTER = [52.3082, 5.0416];

  const handleSelectRider = (rider) => setSelectedRider(rider);
  const handleClose = () => setSelectedRider(null);

  return (
    <div className="ride-screen" style={{ overflow: selectedRider ? 'hidden' : 'auto' }}>
      <header className="ride-header">
        <button className="btn-back" onClick={onBack} aria-label="Go back">
          <BackIcon />
        </button>
        <h1 className="ride-title">Offer a Ride</h1>
      </header>
      
      <p className="ride-subtitle">
        Driving to work or the city? Pick up a neighbor along your route.
      </p>

      {/* Live Map visualization */}
      <div className="map-section">
        <MapContainer 
          center={MAP_CENTER} 
          zoom={13} 
          scrollWheelZoom={false} 
          zoomControl={false}
          style={{ height: '100%', width: '100%', zIndex: 1 }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; CARTO'
          />
          
          {/* Glowing user dot */}
          <Marker position={MAP_CENTER} icon={customUserIcon}>
            <Popup>You are here</Popup>
          </Marker>

          {/* Interactive rider pins & routes */}
          {riders.map(rider => (
            <div key={rider.id}>
              {rider.destinationLocation && (
                <Polyline 
                  positions={[rider.location, rider.destinationLocation]} 
                  pathOptions={{ color: rider.color, weight: 4, dashArray: '8, 8', lineCap: 'round', opacity: 0.8 }} 
                />
              )}
              <Marker 
                position={rider.location} 
                icon={createRiderIcon(rider.color, rider.initial)}
                eventHandlers={{ click: () => handleSelectRider(rider) }}
              />
            </div>
          ))}
        </MapContainer>
      </div>

      <div className="requests-container">
        <h2 className="requests-title">Nearby Requests (Weesp)</h2>

        {riders.map(rider => (
          <div className="request-card" key={rider.id} onClick={() => handleSelectRider(rider)}>
            <div className="request-card-header">
              <div className="request-profile">
                <div className="request-avatar" style={{ background: rider.color }}>{rider.initial}</div>
                <div className="request-info">
                  <h3>{rider.name}</h3>
                  <p>{rider.distance} • {rider.timeframe}</p>
                </div>
              </div>
            </div>
            
            <div className="request-route">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 8L16 12L12 16M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Going to: <strong>{rider.destination}</strong></span>
            </div>

            <div className="request-badges">
              {rider.badges.map((b, i) => (
                <span key={i} className={`request-badge request-badge--${b.color}`}>
                  {b.icon} {b.text}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button className="btn-primary" style={{ marginTop: '32px' }}>
        Create Custom Route Instead
      </button>

      {/* Rider Detail Sliding Overlay */}
      {selectedRider && (
        <div className="rider-detail-overlay" onClick={handleClose}>
          <div className="rider-detail-sheet" onClick={e => e.stopPropagation()}>
            <div className="sheet-header">
              <div className="request-profile">
                <div className="request-avatar" style={{ background: selectedRider.color }}>
                  {selectedRider.initial}
                </div>
                <div className="request-info">
                  <h3>{selectedRider.name}'s Request</h3>
                  <p>{selectedRider.distance}</p>
                </div>
              </div>
              <button className="sheet-close" onClick={handleClose}>
                <CloseIcon />
              </button>
            </div>
            
            <div className="request-route" style={{ marginTop: '8px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 8L16 12L12 16M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Destination: <strong>{selectedRider.destination}</strong></span>
            </div>

            <div className="request-badges" style={{ marginBottom: '8px' }}>
              {selectedRider.badges.map((b, i) => (
                <span key={i} className={`request-badge request-badge--${b.color}`}>
                  {b.icon} {b.text}
                </span>
              ))}
            </div>

            <p style={{ fontSize: '14px', color: 'var(--color-text-nav)', lineHeight: '1.5' }}>
              {selectedRider.name} is looking for a friendly neighbor to help them reach their destination. Accepting this request will alert them that you are on your way.
            </p>

            <div className="sheet-actions">
              <button className="btn-secondary" onClick={handleClose}>Ignore</button>
              <button className="btn-primary" style={{ marginTop: 0 }} onClick={() => {
                alert(`You offered to pick up ${selectedRider.name}!`);
                handleClose();
              }}>
                Pick Up
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
