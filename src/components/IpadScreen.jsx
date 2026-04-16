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
    if (bounds && bounds.length > 0) {
      try {
        map.fitBounds(bounds, { padding: [50, 50] });
      } catch (e) {}
    }
  }, [bounds, map]);
  return null;
}

export default function IpadScreen({ riders = [] }) {
  const ongoingRides = riders.filter(r => r.status === 'ongoing');
  const mapBounds = ongoingRides.length > 0 
    ? ongoingRides.flatMap(r => [r.location, r.destinationLocation]).filter(Boolean)
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

          {/* Realtime Ongoing Rides */}
          {ongoingRides.map(rider => rider.routeGeometry && (
            <Polyline
              key={`route-${rider.id}`}
              positions={rider.routeGeometry}
              pathOptions={{ color: rider.color || '#F08A4B', weight: 5, opacity: 0.6, dashArray: '10, 10' }}
            />
          ))}

          {ongoingRides.map(rider => rider.location && (
            <Marker 
              key={`car-${rider.id}`} 
              position={rider.location} 
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
          ))}

          <MapRecenter bounds={mapBounds} />
        </MapContainer>
      </div>

      <div className="ipad-frame-corner ipad-frame-corner--tl" />
      <div className="ipad-frame-corner ipad-frame-corner--tr" />
      <div className="ipad-frame-corner ipad-frame-corner--bl" />
      <div className="ipad-frame-corner ipad-frame-corner--br" />
    </div>
  );
}
