import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, Polyline, useMap, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './IpadScreen.css';

const KORTENHOEF = [52.2331, 5.0760];

// Invisible anchor for the town name tooltip
const townLabelIcon = new L.DivIcon({
  className: '',
  html: '',
  iconSize: [0, 0],
  iconAnchor: [0, 0],
});

function MapRecenter({ bounds }) {
  const map = useMap();
  useEffect(() => {
    const applyCentering = () => {
      try {
        if (bounds && bounds.length > 0) {
          map.flyToBounds(bounds, { padding: [80, 80], duration: 1.5 });
        } else {
          map.flyTo(KORTENHOEF, 13, { duration: 1.5 });
        }
      } catch (e) {
         console.error("Map bounds parsing error", e);
      }
    };

    applyCentering();

    window.addEventListener('recenter', applyCentering);
    return () => window.removeEventListener('recenter', applyCentering);
  }, [JSON.stringify(bounds), map]);
  return null;
}

export default function IpadScreen({ riders = [] }) {
  const ongoingRides = riders.filter(r => r.status === 'ongoing');
  const mapBounds = ongoingRides.length > 0 
    ? ongoingRides.flatMap(r => [r.location, r.destinationLocation]).filter(loc => Array.isArray(loc) && loc.length === 2)
    : null;

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
          center={KORTENHOEF} 
          zoom={15} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            maxZoom={19}
          />
          
          {/* Town name label */}
          <Marker position={KORTENHOEF} icon={townLabelIcon}>
            <Tooltip permanent direction="top" className="map-town-label">
              Kortenhoef
            </Tooltip>
          </Marker>

          {/* Realtime Ongoing Rides Routes */}
          {ongoingRides.map(rider => {
            const hasRealRoute = rider.routeGeometry && rider.routeGeometry.length > 1;
            const hasFallbackRoute = rider.location && rider.destinationLocation;

            if (hasRealRoute) {
              return (
                <Polyline
                  key={`route-${rider.id}`}
                  positions={rider.routeGeometry}
                  pathOptions={{ color: rider.color || '#F08A4B', weight: 5, opacity: 0.6, dashArray: '10, 10' }}
                />
              );
            } else if (hasFallbackRoute) {
              return (
                <Polyline
                  key={`route-${rider.id}`}
                  positions={[rider.location, rider.destinationLocation]}
                  pathOptions={{ color: rider.color || '#F08A4B', weight: 4, opacity: 0.8, dashArray: '8, 8' }}
                />
              );
            }
            return null;
          })}

          {ongoingRides.map((rider, idx) => {
            if (!rider.location) return null;
            
            // Add a tiny invisible GPS jitter so markers at the exact same location spread apart visually
            const jitterLat = rider.location[0] + (idx * 0.0005) - 0.0002;
            const jitterLng = rider.location[1] + (idx * 0.0005) - 0.0002;
            const offsetLocation = [jitterLat, jitterLng];

            return (
              <Marker 
                key={`car-${rider.id}`} 
                position={offsetLocation} 
                icon={new L.DivIcon({
                  className: '',
                  html: `<div class="ipad-car-marker" style="border-color: ${rider.color || '#F08A4B'}">🚗</div>`,
                  iconSize: [40, 40],
                  iconAnchor: [20, 20],
                })}
              >
                <Popup>
                  <div className="ride-popup">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <div className="popup-avatar" style={{ backgroundImage: `url(${rider.avatarUrl})` }} />
                      <strong>{rider.name}</strong>
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', color: '#707072' }}>
                      Driving to {rider.destination}
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          <MapRecenter bounds={mapBounds} />

          {/* Quick Recenter Button inside the map */}
          <div style={{ position: 'absolute', bottom: 30, right: 30, zIndex: 1000 }}>
            <button 
              onClick={() => {
                const dummyMapEvent = new Event('recenter');
                window.dispatchEvent(dummyMapEvent);
              }}
              style={{
                padding: '16px 24px', 
                background: '#2D3320', 
                color: 'white', 
                border: 'none', 
                borderRadius: '30px', 
                fontWeight: 'bold', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)', 
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Recenter Map
            </button>
          </div>
        </MapContainer>
      </div>

      <div className="ipad-frame-corner ipad-frame-corner--tl" />
      <div className="ipad-frame-corner ipad-frame-corner--tr" />
      <div className="ipad-frame-corner ipad-frame-corner--bl" />
      <div className="ipad-frame-corner ipad-frame-corner--br" />
    </div>
  );
}
