import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './RideScreens.css';
import { TripCard } from './MyTrips';

// User Location Glowing Dot
const customUserIcon = new L.DivIcon({
  className: 'custom-user-icon',
  html: "<div class='marker-current'></div>",
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

// Helper for colored rider markers
const createRiderIcon = (color, initial, avatarUrl) => new L.DivIcon({
  className: 'custom-rider-icon',
  html: `<div class='rider-marker' ${avatarUrl ? `style='background-image: url(${avatarUrl}); background-size: cover; color: transparent;'` : `style='background-color: ${color};'`}>${avatarUrl ? '' : initial}</div>`,
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

export function GiveRideScreen({ onBack, riders, onOfferRide }) {
  const [selectedRider, setSelectedRider] = useState(null);
  
  // Kortenhoef center coordinates
  const MAP_CENTER = [52.2331, 5.0760];

  const handleSelectRider = (rider) => setSelectedRider(rider);
  const handleClose = () => setSelectedRider(null);

  // Filter out rides that have already been accepted
  const pendingRiders = riders.filter(r => r.status === 'pending' || !r.status);

  return (
    <div className="ride-screen redesign" style={{ overflowY: 'auto' }}>
      <header className="ride-header-new">
        <button className="btn-back-circle" type="button" onClick={onBack} aria-label="Go back">
          <BackIcon />
        </button>
      </header>

      <div className="ride-redesign-card orange">
        <div className="card-header">
          <div className="card-title-group">
            <h1 className="card-title">I'm here to help</h1>
            <p className="card-subtitle">Offer a ride to a neighbor</p>
          </div>
        </div>

        <div className="card-car-icon" style={{ opacity: 0.2 }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="108" height="90" viewBox="0 0 24 24" fill="#2D3320">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>

        <div className="card-map-container">
          <MapContainer 
            center={MAP_CENTER} 
            zoom={13} 
            scrollWheelZoom={false} 
            zoomControl={false}
            attributionControl={false}
            style={{ width: '100%', height: '100%', zIndex: 1 }}
          >
            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
            
            {/* Glowing user dot - using current location style from get-ride */}
            <Marker position={MAP_CENTER} icon={customUserIcon}>
              <Popup>You are here</Popup>
            </Marker>

            {/* Interactive rider pins & routes */}
            {pendingRiders.map(rider => (
              <div key={rider.id}>
                {rider.routeGeometry && rider.routeGeometry.length > 0 ? (
                  <Polyline 
                    positions={rider.routeGeometry} 
                    pathOptions={{ color: rider.color || '#F08A4B', weight: 4, opacity: 0.8 }} 
                  />
                ) : null}
                <Marker 
                  position={rider.location} 
                  icon={createRiderIcon(rider.color || '#F08A4B', rider.initial, rider.avatarUrl)}
                  eventHandlers={{ click: () => handleSelectRider(rider) }}
                />
              </div>
            ))}
          </MapContainer>
          <div className="map-badge" style={{ background: 'white', color: '#2D3320' }}>Kortenhoef Area</div>
        </div>
      </div>

      <div className="trips-content" style={{ padding: '0 24px', width: '100%', boxSizing: 'border-box', marginBottom: '40px' }}>
        <h2 className="trips-date-header" style={{ marginBottom: '16px', color: '#2D3320' }}>Nearby Requests</h2>
        <div className="trips-date-group">
          {pendingRiders.map(trip => (
            <TripCard 
              key={trip.id} 
              trip={trip} 
              actionLabel="Pick Up"
              actionClassName="trip-pickup-btn"
              onAction={() => handleSelectRider(trip)} 
            />
          ))}
          {pendingRiders.length === 0 && (
            <p style={{ textAlign: 'center', margin: '24px 0', color: 'var(--color-text-nav)' }}>No pending requests at the moment.</p>
          )}
        </div>
      </div>

      {/* Rider Detail Sliding Overlay */}
      {selectedRider && (
        <div className="rider-detail-overlay" onClick={handleClose}>
          <div className="rider-detail-sheet" onClick={e => e.stopPropagation()}>
            <div className="sheet-header">
              <div className="request-profile">
                <div 
                  className="request-avatar" 
                  style={selectedRider.avatarUrl ? { backgroundImage: `url(${selectedRider.avatarUrl})`, backgroundSize: 'cover', color: 'transparent' } : { background: selectedRider.color }}
                >
                  {selectedRider.avatarUrl ? '' : selectedRider.initial}
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
                if (onOfferRide) onOfferRide(selectedRider.id);
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
