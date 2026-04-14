import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './HomePage.css';

/**
 * HomePage
 * Figma node: 585:2116 — "HomeScreen"
 * Logo: 585:3773 (full) / 585:3782 (icon)
 * Buttons: 585:7057
 * Button icons: 585:8029
 * Navbar: 585:7148
 */

// Olive-toned map pins for community members
const communityPinIcon = new L.divIcon({
  className: '',
  html: '<div class="home-map-pin"></div>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

// Simulated community member locations around Kortenhoef area
const COMMUNITY_PINS = [
  [52.2325, 5.0788],
  [52.2351, 5.0672],
  [52.2290, 5.0815],
  [52.2368, 5.0846],
  [52.2312, 5.0932],
  [52.2340, 5.0746],
];

// Logo Icon — Figma 585:3782
// Rounded pentagon (house shape) with white "&" symbol
function LogoIcon({ size = 44 }) {
  return (
    <svg width={size} height={size * 1.04} viewBox="0 0 50 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M25 2L46 16V40C46 44.4183 42.4183 48 38 48H12C7.58172 48 4 44.4183 4 40V16L25 2Z" fill="#2D3320" rx="6"/>
      <text x="25" y="36" textAnchor="middle" fill="white" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="26">&amp;</text>
    </svg>
  );
}

// Search icon for Explore button
function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

// Taxi icon — Figma 585:8029 (front-facing taxi silhouette)
function TaxiIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g opacity="0.6">
        {/* Taxi sign on top */}
        <rect x="30" y="12" width="20" height="8" rx="4" fill="#2D3320"/>
        {/* Car body */}
        <path d="M16 36L22 22H58L64 36V56C64 58.2091 62.2091 60 60 60H20C17.7909 60 16 58.2091 16 56V36Z" fill="#2D3320"/>
        {/* Windshield */}
        <path d="M24 24L20 36H60L56 24H24Z" fill="rgba(255,255,255,0.2)"/>
        {/* Windows */}
        <rect x="22" y="38" width="14" height="10" rx="3" fill="rgba(255,255,255,0.25)"/>
        <rect x="44" y="38" width="14" height="10" rx="3" fill="rgba(255,255,255,0.25)"/>
        {/* Wheels */}
        <circle cx="26" cy="60" r="7" fill="#2D3320"/>
        <circle cx="26" cy="60" r="3" fill="rgba(255,255,255,0.15)"/>
        <circle cx="54" cy="60" r="7" fill="#2D3320"/>
        <circle cx="54" cy="60" r="3" fill="rgba(255,255,255,0.15)"/>
        {/* Headlights */}
        <rect x="18" y="50" width="6" height="4" rx="2" fill="rgba(255,255,255,0.3)"/>
        <rect x="56" y="50" width="6" height="4" rx="2" fill="rgba(255,255,255,0.3)"/>
      </g>
    </svg>
  );
}

// Help icon — Figma 585:8029 (hand holding heart silhouette)
function HandHeartIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g opacity="0.55">
        {/* Hand */}
        <path d="M20 52C20 52 22 42 28 38C34 34 38 36 40 40C42 36 46 34 52 38C58 42 60 52 60 52" stroke="#2D3320" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 54H64V62C64 64.2091 62.2091 66 60 66H20C17.7909 66 16 64.2091 16 62V54Z" fill="#2D3320"/>
        {/* Heart */}
        <path d="M40 32C40 32 34 18 27 22C20 26 26 36 40 44C54 36 60 26 53 22C46 18 40 32 40 32Z" fill="#2D3320"/>
      </g>
    </svg>
  );
}

export default function HomePage({ onNavigate }) {
  return (
    <main className="home-screen" data-node-id="585:2116">
      {/* ── Community Header with Logo — Figma 585:3773 ── */}
      <motion.header
        className="home-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="home-header__icon">
          <LogoIcon size={40} />
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

      {/* ── Action Cards — Figma 585:7057 ── */}
      <div className="home-actions">
        {/* "I need a ride" — yellow-green #D9E021 */}
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

        {/* "I'm here to help" — warm orange #F7AC53 */}
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
            <HandHeartIcon />
          </div>
        </motion.button>
      </div>
    </main>
  );
}
