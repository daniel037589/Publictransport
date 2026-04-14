import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './HomePage.css';

/**
 * HomePage
 * Figma node: 585:2116 — "HomeScreen"
 * New design: community header + embedded map + stacked action cards
 */

// Olive-toned map pins for community members
const communityPinIcon = new L.divIcon({
  className: '',
  html: '<div class="home-map-pin"></div>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

// Simulated community member locations around Kortenhoef/Weesp area
const COMMUNITY_PINS = [
  [52.2325, 5.0788],
  [52.2351, 5.0672],
  [52.2290, 5.0815],
  [52.2368, 5.0846],
  [52.2312, 5.0932],
  [52.2340, 5.0746],
];

function CommunityIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Taxi silhouette for "I need a ride" card
function TaxiIcon() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g opacity="0.7">
        <rect x="8" y="32" width="56" height="24" rx="6" fill="#2d3320"/>
        <rect x="14" y="20" width="20" height="14" rx="4" fill="#2d3320"/>
        <circle cx="20" cy="56" r="6" fill="#2d3320"/>
        <circle cx="52" cy="56" r="6" fill="#2d3320"/>
        <rect x="40" y="36" width="16" height="10" rx="3" fill="#e8e4c8"/>
        <rect x="16" y="36" width="16" height="10" rx="3" fill="#e8e4c8"/>
      </g>
    </svg>
  );
}

// Handshake icon for "I'm here to help" card
function HandshakeIcon() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g opacity="0.7">
        <path d="M12 40L24 28L32 36L44 24L52 32" stroke="#2d3320" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M52 32L60 40L48 52L36 52L24 44" stroke="#2d3320" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 40L20 48L32 48" stroke="#2d3320" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="24" cy="28" r="4" fill="#2d3320"/>
        <circle cx="48" cy="24" r="4" fill="#2d3320"/>
      </g>
    </svg>
  );
}

export default function HomePage({ onNavigate }) {
  return (
    <main className="home-screen" data-node-id="585:2116">
      {/* ── Community Header ── */}
      <motion.header 
        className="home-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="home-header__icon">
          <CommunityIcon />
        </div>
        <div className="home-header__text">
          <span className="home-header__label">Your Community</span>
          <h1 className="home-header__title">Ons Kortenhoef</h1>
        </div>
      </motion.header>

      {/* ── Embedded Map ── */}
      <motion.div 
        className="home-map"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <MapContainer 
          center={[52.2331, 5.0788]} 
          zoom={14} 
          scrollWheelZoom={false}
          zoomControl={false}
          attributionControl={false}
          dragging={false}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
          {COMMUNITY_PINS.map((pos, i) => (
            <Marker key={i} position={pos} icon={communityPinIcon} />
          ))}
        </MapContainer>
        <motion.button 
          className="home-map__explore"
          onClick={() => onNavigate('give-ride')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <SearchIcon />
          Explore
        </motion.button>
      </motion.div>

      {/* ── Action Cards ── */}
      <div className="home-actions">
        <motion.button
          className="home-action-card home-action-card--need"
          onClick={() => onNavigate('get-ride')}
          aria-label="I need a ride"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <span className="home-action-card__text">I need a<br/>ride</span>
          <div className="home-action-card__icon">
            <TaxiIcon />
          </div>
        </motion.button>

        <motion.button
          className="home-action-card home-action-card--help"
          onClick={() => onNavigate('give-ride')}
          aria-label="I'm here to help"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <span className="home-action-card__text">I'm here<br/>to help</span>
          <div className="home-action-card__icon">
            <HandshakeIcon />
          </div>
        </motion.button>
      </div>
    </main>
  );
}
