import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './RideScreens.css';

// ── Need badge SVG icons (Figma 732-5089/5084/5075/5070) ──────
function VehicleEntryIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="2"/>
      <path d="M10.5 8.5h3l1 4h-5l1-4z"/>
      <path d="M8 16l2-3.5h4l2 3.5"/>
      <circle cx="9" cy="19" r="1.5"/>
      <circle cx="15" cy="19" r="1.5"/>
      <path d="M4 12h2M18 12h2"/>
    </svg>
  );
}
function StrollerSpaceIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h4l3 8h7l3-8"/>
      <path d="M5 6l-2 4"/>
      <circle cx="9" cy="19" r="2"/>
      <circle cx="17" cy="19" r="2"/>
    </svg>
  );
}
function NewbornIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3"/>
      <path d="M7 21v-2a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v2"/>
      <path d="M9 11c0 2 1 3 3 4"/>
    </svg>
  );
}
function WalkerSpaceIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="4" r="2"/>
      <path d="M8 10h8"/>
      <path d="M9 10v8l3 4 3-4v-8"/>
      <path d="M7 22h3M14 22h3"/>
    </svg>
  );
}

// Maps badge text patterns → icon component
const getBadgeIcon = (text) => {
  const t = (text || '').toLowerCase();
  if (t.includes('vehicle') || t.includes('entry') || t.includes('wheelchair') || t.includes('access')) return <VehicleEntryIcon />;
  if (t.includes('stroller')) return <StrollerSpaceIcon />;
  if (t.includes('newborn') || t.includes('baby') || t.includes('infant')) return <NewbornIcon />;
  if (t.includes('walker')) return <WalkerSpaceIcon />;
  return null;
};

// Renders a single badge pill (white bg, border, icon + text)
function NeedBadge({ badge }) {
  const text = typeof badge === 'string' ? badge : badge.text || '';
  const icon = getBadgeIcon(text);
  return (
    <span className="gr-badge-pill">
      {icon && <span className="gr-badge-icon">{icon}</span>}
      {text}
    </span>
  );
}

// ── GiveRideCard — tappable, no button, Figma-accurate ────────
function GiveRideCard({ rider, onClick }) {
  return (
    <div className="gr-card" onClick={() => onClick(rider)}>
      {/* Profile row */}
      <div className="gr-card-profile">
        <div
          className="gr-card-avatar"
          style={rider.avatarUrl
            ? { backgroundImage: `url(${rider.avatarUrl})`, backgroundSize: 'cover' }
            : { backgroundColor: rider.color || '#F08A4B' }}
        >
          {!rider.avatarUrl && <span>{rider.initial || (rider.name ? rider.name[0] : '?')}</span>}
        </div>
        <div>
          <p className="gr-card-name">{rider.name}</p>
          <p className="gr-card-sub">{rider.timeframe || 'Needs ride now'}</p>
        </div>
      </div>

      {/* Badges */}
      {rider.badges && rider.badges.length > 0 && (
        <div className="gr-badges">
          {rider.badges.map((b, i) => <NeedBadge key={i} badge={b} />)}
        </div>
      )}

      {/* Route */}
      <div className="gr-route">
        <div className="gr-route-row">
          <div className="gr-dot gr-dot--pickup" />
          <div className="gr-route-text">
            <p className="gr-route-label">Pick up</p>
            <p className="gr-route-address">{rider.pickup || 'Kortenhoef center'}</p>
          </div>
        </div>
        <div className="gr-route-line" />
        <div className="gr-route-row">
          <div className="gr-dot gr-dot--dropoff" />
          <div className="gr-route-text">
            <p className="gr-route-label">Drop off</p>
            <p className="gr-route-address">{rider.destination || 'Destination'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

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

  // Lock scroll on the parent screen when popup is open
  useEffect(() => {
    const el = document.querySelector('.ride-screen.redesign');
    if (el) {
      el.style.overflowY = selectedRider ? 'hidden' : 'auto';
    }
  }, [selectedRider]);

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
      <div className="ride-form-new" style={{ paddingBottom: '24px', flexShrink: 0 }}>
        <h2 style={{ fontFamily: 'var(--font-family-button)', fontSize: '18px', fontWeight: 700, color: '#2D3320', margin: '20px 0 12px 0' }}>
          Nearby Requests
        </h2>
        <div className="trips-date-group">
          {pendingRiders.map(rider => (
            <GiveRideCard
              key={rider.id}
              rider={rider}
              onClick={setSelectedRider}
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
