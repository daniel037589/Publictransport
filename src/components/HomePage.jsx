import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Tooltip, Polyline, useMap, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './HomePage.css';

/**
 * HomePage — Figma node 585:2116 "HomeScreen"
 * Frame: 402 × 874px
 */

function MapRecenter({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length > 0) {
      try {
        map.fitBounds(bounds, { padding: [30, 30] });
      } catch (e) {}
    }
  }, [bounds, map]);
  return null;
}

// Invisible anchor for the town name tooltip
const townLabelIcon = new L.DivIcon({
  className: '',
  html: '',
  iconSize: [0, 0],
  iconAnchor: [0, 0],
});

const KORTENHOEF = [52.2331, 5.0760];

// ── Icons ──────────────────────────────────────────────────────
function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

function TaxiIcon() {
  return (
    <svg width="94" height="73" viewBox="0 0 94 73" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g opacity="0.8">
        <path d="M34.375 3.13291C34.375 2.30201 34.7042 1.50514 35.2903 0.917608C35.8763 0.330074 36.6712 0 37.5 0H56.25C57.0788 0 57.8737 0.330074 58.4597 0.917608C59.0458 1.50514 59.375 2.30201 59.375 3.13291C59.375 3.96381 59.0458 4.76068 58.4597 5.34821C57.8737 5.93575 57.0788 6.26582 56.25 6.26582H37.5C36.6712 6.26582 35.8763 5.93575 35.2903 5.34821C34.7042 4.76068 34.375 3.96381 34.375 3.13291ZM93.75 37.5949C93.75 38.4258 93.4208 39.2227 92.8347 39.8102C92.2487 40.3978 91.4538 40.7278 90.625 40.7278H87.5V72.057C87.5 73.7188 86.8415 75.3125 85.6694 76.4876C84.4973 77.6626 82.9076 78.3228 81.25 78.3228H71.875C70.2174 78.3228 68.6277 77.6626 67.4556 76.4876C66.2835 75.3125 65.625 73.7188 65.625 72.057V68.924H28.125V72.057C28.125 73.7188 27.4665 75.3125 26.2944 76.4876C25.1223 77.6626 23.5326 78.3228 21.875 78.3228H12.5C10.8424 78.3228 9.25268 77.6626 8.08058 76.4876C6.90848 75.3125 6.25 73.7188 6.25 72.057V40.7278H3.125C2.2962 40.7278 1.50134 40.3978 0.915291 39.8102C0.32924 39.2227 0 38.4258 0 37.5949C0 36.764 0.32924 35.9672 0.915291 35.3796C1.50134 34.7921 2.2962 34.462 3.125 34.462H7.5625L18.2617 15.6881C18.8084 14.7292 19.5982 13.9323 20.551 13.378C21.5038 12.8237 22.5859 12.5317 23.6875 12.5316H70.0625C71.1641 12.5317 72.2462 12.8237 73.199 13.378C74.1518 13.9323 74.9416 14.7292 75.4883 15.6881L86.1875 34.462H90.625C91.4538 34.462 92.2487 34.7921 92.8347 35.3796C93.4208 35.9672 93.75 36.764 93.75 37.5949ZM31.25 50.1266C31.25 49.2957 30.9208 48.4988 30.3347 47.9113C29.7487 47.3237 28.9538 46.9937 28.125 46.9937H18.75C17.9212 46.9937 17.1263 47.3237 16.5403 47.9113C15.9542 48.4988 15.625 49.2957 15.625 50.1266C15.625 50.9575 15.9542 51.7544 16.5403 52.3419C17.1263 52.9294 17.9212 53.2595 18.75 53.2595H28.125C28.9538 53.2595 29.7487 52.9294 30.3347 52.3419C30.9208 51.7544 31.25 50.9575 31.25 50.1266ZM78.125 50.1266C78.125 49.2957 77.7958 48.4988 77.2097 47.9113C76.6237 47.3237 75.8288 46.9937 75 46.9937H65.625C64.7962 46.9937 64.0013 47.3237 63.4153 47.9113C62.8292 48.4988 62.5 49.2957 62.5 50.1266C62.5 50.9575 62.8292 51.7544 63.4153 52.3419C64.0013 52.9294 64.7962 53.2595 65.625 53.2595H75C75.8288 53.2595 76.6237 52.9294 77.2097 52.3419C77.7958 51.7544 78.125 50.9575 78.125 50.1266ZM78.9883 34.462L70.0625 18.7975H23.6875L14.7617 34.462H78.9883Z" fill="#1A1A1A"/>
      </g>
    </svg>
  );
}

function HandHeartIcon() {
  return (
    <svg width="94" height="64" viewBox="0 0 94 79" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g opacity="0.8">
        <path d="M89.9562 46.4234C88.9345 45.5652 87.7632 44.9427 86.5136 44.5936C85.2641 44.2445 83.9625 44.1763 82.688 44.393C90.0226 36.3224 93.7328 28.2986 93.7328 20.4323C93.7328 9.16497 85.4179 0.000399397 75.1972 0.000399397C72.4852 -0.0181625 69.8024 0.610482 67.337 1.8422C64.8717 3.07392 62.6836 4.87885 60.9263 7.13029C59.1691 4.87885 56.981 3.07392 54.5157 1.8422C52.0503 0.610482 49.3675 -0.0181625 46.6555 0.000399397C36.4347 0.000399397 28.1198 9.16497 28.1198 20.4323C28.1198 25.1146 29.3852 29.665 32.0488 34.4793C29.8673 35.0816 27.8765 36.3173 26.2881 38.0549L17.4538 47.6749H6.24885C4.59156 47.6749 3.00213 48.3924 1.83025 49.6697C0.65836 50.9469 0 52.6792 0 54.4855L0 71.5121C0 73.3184 0.65836 75.0507 1.83025 76.328C3.00213 77.6052 4.59156 78.3228 6.24885 78.3228H46.8664C47.1219 78.3229 47.3764 78.2886 47.6241 78.2206L72.6195 71.41C72.7788 71.3686 72.9344 71.3117 73.0843 71.2397L88.2651 64.1992L88.4369 64.1141C89.8959 63.3195 91.1453 62.1332 92.0673 60.6669C92.9894 59.2006 93.5538 57.5026 93.7073 55.7328C93.8609 53.9631 93.5985 52.1799 92.945 50.5512C92.2915 48.9225 91.2683 47.502 89.9718 46.4234H89.9562ZM85.6991 57.9802L70.8581 64.8675L46.4759 71.5121H21.871V52.4892L30.7092 42.8606C31.2874 42.2254 31.9756 41.7219 32.7339 41.3791C33.4922 41.0364 34.3055 40.8614 35.1264 40.8643H54.6775C55.9205 40.8643 57.1125 41.4024 57.9914 42.3603C58.8703 43.3183 59.3641 44.6175 59.3641 45.9722C59.3641 47.327 58.8703 48.6262 57.9914 49.5841C57.1125 50.542 55.9205 51.0802 54.6775 51.0802H43.742C42.9133 51.0802 42.1186 51.439 41.5327 52.0776C40.9467 52.7162 40.6176 53.5824 40.6176 54.4855C40.6176 55.3887 40.9467 56.2548 41.5327 56.8935C42.1186 57.5321 42.9133 57.8909 43.742 57.8909H56.2397C56.4749 57.8901 56.7093 57.8616 56.9388 57.8057L83.1059 51.2462L83.2269 51.2122C84.0257 50.9705 84.8783 51.0593 85.6206 51.4615C86.363 51.8638 86.9426 52.551 87.248 53.391C87.5533 54.231 87.5629 55.1644 87.2748 56.0116C86.9867 56.8589 86.4213 57.56 85.6874 57.9802H85.6991Z" fill="#1A1A1A"/>
      </g>
    </svg>
  );
}

// ── Reusable Map Content (shared by inline + fullscreen) ───────
function MapContent({ dragging = false, scrollWheelZoom = false, riders = [] }) {
  const ongoingRides = riders.filter(r => r.status === 'ongoing');
  const mapBounds = ongoingRides.length > 0 
    ? ongoingRides.flatMap(r => [r.location, r.destinationLocation]).filter(Boolean)
    : null;

  return (
    <>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        maxZoom={19}
      />
      {/* Town name label pinned to Kortenhoef center */}
      <Marker position={KORTENHOEF} icon={townLabelIcon}>
        <Tooltip
          permanent
          direction="top"
          offset={[0, 0]}
          className="map-town-label"
        >
          Kortenhoef
        </Tooltip>
      </Marker>
      {/* Community member pins */}
      {/* Realtime Ongoing Rides */}
      {ongoingRides.map(rider => rider.routeGeometry && (
        <Polyline
          key={`route-${rider.id}`}
          positions={rider.routeGeometry}
          pathOptions={{ color: rider.color || '#F08A4B', weight: 4, opacity: 0.8, dashArray: '8, 8' }}
        />
      ))}
      {ongoingRides.map(rider => rider.location && (
        <Marker key={`car-${rider.id}`} position={rider.location} icon={new L.DivIcon({
          className: '',
          html: `<div style="background-color: white; border-radius: 50%; padding: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.2); font-size: 14px; text-align: center; line-height: 20px; width: 28px; height: 28px;">🚗</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        })}>
          <Popup className="rider-status-popup">
            <div style={{ textAlign: 'center', lineHeight: '1.4' }}>
              <div style={{ fontWeight: 'bold', color: '#1A1A1A' }}>{rider.name}</div>
              <div style={{ fontSize: '12px', color: '#707072' }}>{rider.status === 'ongoing' ? 'En Route' : 'Waiting'}</div>
            </div>
          </Popup>
        </Marker>
      ))}
      <MapRecenter bounds={mapBounds} />
    </>
  );
}

// ── Fullscreen Map Modal ───────────────────────────────────────
function FullscreenMap({ onClose, riders = [] }) {
  return (
    <AnimatePresence>
      <motion.div
        className="map-fullscreen"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
      >
        <MapContainer
          center={KORTENHOEF}
          zoom={15}
          scrollWheelZoom
          zoomControl
          attributionControl={false}
          dragging
          style={{ width: '100%', height: '100%' }}
        >
          <MapContent dragging scrollWheelZoom riders={riders} />
        </MapContainer>

        {/* Close button */}
        <motion.button
          className="map-fullscreen__close"
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Close map"
        >
          <CloseIcon />
        </motion.button>

        {/* Location label */}
        <div className="map-fullscreen__label">
          <span>📍 Kortenhoef</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── HomePage ───────────────────────────────────────────────────
export default function HomePage({ onNavigate, riders = [] }) {
  const [mapOpen, setMapOpen] = useState(false);

  return (
    <>
      <main className="home-screen" data-node-id="585:2116">

        {/* ── Header ── */}
        <motion.header
          className="home-header"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="home-header__icon">
            <img src="/logo.png" alt="Weesp logo" draggable={false} />
          </div>
          <div className="home-header__text">
            <span className="home-header__label">Your Community</span>
            <h1 className="home-header__title">Ons Kortenhoef</h1>
          </div>
        </motion.header>

        {/* ── Map Section ── */}
        <motion.div
          className="home-map"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <MapContainer
            center={KORTENHOEF}
            zoom={14}
            scrollWheelZoom={true}
            zoomControl={false}
            attributionControl={false}
            dragging={true}
            style={{ width: '100%', height: '100%' }}
          >
            <MapContent riders={riders} />
          </MapContainer>

          {/* Explore → opens fullscreen map */}
          <motion.button
            className="home-map__explore"
            onClick={() => setMapOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Open full map"
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
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <span className="home-action-card__text">I need a ride</span>
            <div className="home-action-card__icon"><TaxiIcon /></div>
          </motion.button>

          <motion.button
            className="home-action-card home-action-card--help"
            onClick={() => onNavigate('give-ride')}
            aria-label="I'm here to help"
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <span className="home-action-card__text">I'm here to help</span>
            <div className="home-action-card__icon"><HandHeartIcon /></div>
          </motion.button>
        </div>
      </main>

      {/* ── Fullscreen Map overlay (portals over entire app-shell) ── */}
      {mapOpen && <FullscreenMap onClose={() => setMapOpen(false)} riders={riders} />}
    </>
  );
}
