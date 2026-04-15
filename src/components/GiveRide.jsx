import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './RideScreens.css';
import { TripCard } from './MyTrips';

// ── Icons ─────────────────────────────────────────────────────
function BackIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M19 12H5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ── Leaflet icons ─────────────────────────────────────────────
const currentLocationIcon = new L.DivIcon({
  className: '',
  html: `<div class="marker-current"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const createRiderIcon = (color, initial, avatarUrl) => new L.DivIcon({
  className: '',
  html: avatarUrl
    ? `<div class="rider-marker" style="background-image:url(${avatarUrl});background-size:cover;"></div>`
    : `<div class="rider-marker" style="background-color:${color};">${initial}</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

// ── GiveRideScreen ────────────────────────────────────────────
export function GiveRideScreen({ onBack, riders, onOfferRide }) {
  const [selectedRider, setSelectedRider] = useState(null);
  const MAP_CENTER = [52.2331, 5.0760]; // Kortenhoef

  const pendingRiders = riders.filter(r => r.status === 'pending' || !r.status);

  return (
    <div className="ride-screen redesign" style={{ overflowY: 'auto', overflowX: 'hidden' }}>
      <header className="ride-header-new">
        <button className="btn-back-circle" type="button" onClick={onBack} aria-label="Go back">
          <BackIcon />
        </button>
      </header>

      {/* ── Orange Hero Card ─────────────────────────────── */}
      <div className="ride-redesign-card" style={{ backgroundColor: '#F08A4B', flexShrink: 0 }}>
        <div className="card-header">
          <div className="card-title-group">
            <h1 className="card-title" style={{ color: '#2D3320' }}>I'm here to help</h1>
            <p className="card-subtitle">Offer a ride to a neighbor</p>
          </div>
        </div>

        {/* Hand-heart watermark */}
        <div className="card-car-icon" style={{ opacity: 0.2 }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="108" height="90" viewBox="0 0 24 24" fill="#2D3320">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>

        {/* Map */}
        <div className="card-map-container">
          <MapContainer
            key="give-ride-map"
            center={MAP_CENTER}
            zoom={15}
            style={{ width: '100%', height: '100%' }}
            zoomControl={false}
            attributionControl={false}
            scrollWheelZoom={false}
          >
            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
            <Marker position={MAP_CENTER} icon={currentLocationIcon}>
              <Popup>You are here</Popup>
            </Marker>
            {pendingRiders.map(rider => (
              rider.location ? (
                <Marker
                  key={rider.id}
                  position={rider.location}
                  icon={createRiderIcon(rider.color || '#F08A4B', rider.initial, rider.avatarUrl)}
                  eventHandlers={{ click: () => setSelectedRider(rider) }}
                />
              ) : null
            ))}
            {pendingRiders.map(rider =>
              rider.routeGeometry && rider.routeGeometry.length > 0 ? (
                <Polyline
                  key={rider.id + '-route'}
                  positions={rider.routeGeometry}
                  pathOptions={{ color: rider.color || '#F08A4B', weight: 4, opacity: 0.8 }}
                />
              ) : null
            )}
          </MapContainer>
          <div className="map-badge" style={{ background: 'white', color: '#2D3320' }}>Kortenhoef Area</div>
        </div>
      </div>

      {/* ── Nearby Requests ───────────────────────────────── */}
      <div className="ride-form-new" style={{ paddingBottom: '40px', flexShrink: 0 }}>
        <h2 style={{ fontFamily: 'var(--font-family-button)', fontSize: '18px', fontWeight: 700, color: '#2D3320', margin: '20px 0 12px 0' }}>
          Nearby Requests
        </h2>
        <div className="trips-date-group">
          {pendingRiders.map(rider => (
            <TripCard
              key={rider.id}
              trip={rider}
              actionLabel="Pick Up"
              actionClassName="trip-pickup-btn"
              onAction={() => setSelectedRider(rider)}
            />
          ))}
          {pendingRiders.length === 0 && (
            <p style={{ textAlign: 'center', margin: '24px 0', color: 'var(--color-text-nav)', fontSize: '14px' }}>
              No pending requests at the moment.
            </p>
          )}
        </div>
      </div>

      {/* ── Rider Detail Bottom Sheet ─────────────────────── */}
      {selectedRider && (
        <div className="gr-overlay" onClick={() => setSelectedRider(null)}>
          <div className="gr-sheet" onClick={e => e.stopPropagation()}>

            {/* Drag handle */}
            <div className="gr-handle" />

            {/* Profile row */}
            <div className="gr-profile">
              <div
                className="gr-avatar"
                style={selectedRider.avatarUrl
                  ? { backgroundImage: `url(${selectedRider.avatarUrl})`, backgroundSize: 'cover' }
                  : { backgroundColor: selectedRider.color || '#F08A4B' }}
              >
                {!selectedRider.avatarUrl && (
                  <span>{selectedRider.initial || (selectedRider.name ? selectedRider.name[0] : '?')}</span>
                )}
              </div>
              <div className="gr-profile-info">
                <p className="gr-name">{selectedRider.name}</p>
                <p className="gr-age">{selectedRider.distance}</p>
              </div>
            </div>

            {/* Badges */}
            {selectedRider.badges && selectedRider.badges.length > 0 && (
              <div className="gr-badges">
                {selectedRider.badges.map((b, i) => (
                  <span key={i} className="gr-badge">
                    {typeof b === 'string' ? b : `${b.icon || ''} ${b.text || ''}`.trim()}
                  </span>
                ))}
              </div>
            )}

            {/* Route rows */}
            <div className="gr-route">
              <div className="gr-route-row">
                <div className="gr-dot gr-dot--pickup" />
                <div className="gr-route-text">
                  <p className="gr-route-label">Pick up</p>
                  <p className="gr-route-address">{selectedRider.pickup || 'Kortenhoef center'}</p>
                </div>
              </div>
              <div className="gr-route-line" />
              <div className="gr-route-row">
                <div className="gr-dot gr-dot--dropoff" />
                <div className="gr-route-text">
                  <p className="gr-route-label">Drop off</p>
                  <p className="gr-route-address">{selectedRider.destination || 'Destination'}</p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="gr-actions">
              <button className="gr-btn gr-btn--cancel" onClick={() => setSelectedRider(null)}>
                Cancel
              </button>
              <button className="gr-btn gr-btn--pickup" onClick={() => {
                if (onOfferRide) onOfferRide(selectedRider.id);
                setSelectedRider(null);
              }}>
                Pick up
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
