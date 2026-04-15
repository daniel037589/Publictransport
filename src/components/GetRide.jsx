import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import './RideScreens.css';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapRecenter({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [30, 30] });
    }
  }, [bounds, map]);
  return null;
}

function BackIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 12H5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CommunityShieldIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" fill="#BBCD2F" fillOpacity="0.2" stroke="#BBCD2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 12L11 14L15 10" stroke="#BBCD2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function LocationAutocomplete({ id, name, placeholder, disabled, required, onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const fetchLocations = async () => {
      if (query.trim().length < 3) {
        setResults([]);
        setIsSearching(false);
        return;
      }
      setIsSearching(true);
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', Weesp, Netherlands')}&limit=5`;
        const resp = await fetch(url, { headers: { 'Accept-Language': 'en-US' } });
        const data = await resp.json();
        setResults(data || []);
      } catch (err) {
        console.error("Autocomplete error", err);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(fetchLocations, 450);
    return () => clearTimeout(debounce);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  return (
    <div style={{ position: 'relative', zIndex: isOpen ? 1000 : 1 }} ref={wrapperRef}>
      <input 
        className="form-input-clean" 
        id={id} 
        name={name} 
        type="text" 
        placeholder={placeholder} 
        required={required} 
        disabled={disabled}
        value={query}
        autoComplete="off"
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
      />
      {isOpen && (query.trim().length >= 3) && (
        <ul className="autocomplete-popup">
          {isSearching && results.length === 0 ? (
             <li style={{ padding: '12px 16px', fontSize: '14px', color: '#8A8A7A' }}>Searching streets...</li>
          ) : results.length === 0 ? (
             <li style={{ padding: '12px 16px', fontSize: '14px', color: '#8A8A7A' }}>No results found</li>
          ) : (
            results.map((r, i) => (
              <li 
                key={i} 
                className="autocomplete-item"
                onClick={() => {
                  const displayName = r.display_name.includes('Weesp') ? r.display_name.split(', Weesp')[0] : r.display_name.split(',')[0];
                  setQuery(displayName);
                  setIsOpen(false);
                  if (onSelect) {
                    onSelect({
                      lat: parseFloat(r.lat),
                      lng: parseFloat(r.lon),
                      name: displayName
                    });
                  }
                }}
              >
                <div className="autocomplete-icon-box">
                  <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
                    <path d="M7 3.85718C6.3707 3.85718 5.75552 4.0457 5.23228 4.39889C4.70903 4.75209 4.30121 5.25409 4.06038 5.84143C3.81956 6.42877 3.75655 7.07506 3.87932 7.69858C4.00209 8.3221 4.30513 8.89483 4.75011 9.34437C5.1951 9.7939 5.76205 10.1 6.37926 10.2241C6.99647 10.3481 7.63623 10.2844 8.21763 10.0411C8.79903 9.79786 9.29596 9.38587 9.64559 8.85728C9.99521 8.32869 10.1818 7.70723 10.1818 7.0715C10.1818 6.21901 9.84659 5.40143 9.24989 4.79863C8.65318 4.19583 7.84387 3.85718 7 3.85718ZM7 9.00009C6.62242 9.00009 6.25331 8.88698 5.93937 8.67506C5.62542 8.46315 5.38072 8.16194 5.23623 7.80954C5.09174 7.45714 5.05393 7.06936 5.12759 6.69525C5.20125 6.32114 5.38308 5.9775 5.65007 5.70778C5.91706 5.43806 6.25723 5.25438 6.62755 5.17997C6.99788 5.10555 7.38174 5.14374 7.73058 5.28971C8.07942 5.43568 8.37758 5.68288 8.58735 6.00003C8.79903 6.31719 8.90909 6.69006 8.90909 7.0715C8.90909 7.58299 8.70796 8.07354 8.34993 8.43522C7.99191 8.7969 7.50632 9.00009 7 9.00009ZM7 0C5.14413 0.00212686 3.36488 0.747841 2.05258 2.07354C0.740279 3.39925 0.00210536 5.19667 0 7.0715C0 9.59474 1.1542 12.2691 3.34091 14.806C4.32347 15.9523 5.42934 16.9846 6.63807 17.8837C6.74507 17.9594 6.87254 18 7.00318 18C7.13382 18 7.2613 17.9594 7.3683 17.8837C8.5748 16.9842 9.67852 15.9519 10.6591 14.806C12.8426 12.2691 14 9.59474 14 7.0715C13.9979 5.19667 13.2597 3.39925 11.9474 2.07354C10.6351 0.747841 8.85587 0.00212686 7 0ZM7 16.5537C5.68511 15.5091 1.27273 11.672 1.27273 7.0715C1.27273 5.53702 1.87613 4.06538 2.95021 2.98034C4.02428 1.8953 5.48103 1.28573 7 1.28573C8.51897 1.28573 9.97572 1.8953 11.0498 2.98034C12.1239 4.06538 12.7273 5.53702 12.7273 7.0715C12.7273 11.6704 8.31489 15.5091 7 16.5537Z" fill="currentColor"/>
                  </svg>
                </div>
                <div className="autocomplete-text">
                  <span className="autocomplete-name">{r.name || r.display_name.split(',')[0]}</span>
                  <span className="autocomplete-address">{r.display_name}</span>
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

export function GetRideScreen({ onBack, onRequestRide, userProfile }) {
  const [isLoading, setIsLoading] = useState(false);
  const [pickup, setPickup] = useState(null);
  const [dropoff, setDropoff] = useState(null);
  const [route, setRoute] = useState(null);

  useEffect(() => {
    const fetchRoute = async () => {
      if (!pickup || !dropoff) return;
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${pickup.lng},${pickup.lat};${dropoff.lng},${dropoff.lat}?overview=full&geometries=geojson`;
        const resp = await fetch(url);
        const data = await resp.json();
        if (data.code === 'Ok' && data.routes.length > 0) {
          setRoute(data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]));
        }
      } catch (err) {
        console.error("Route fetch error", err);
      }
    };
    fetchRoute();
  }, [pickup, dropoff]);

  // Custom Leaflet Icons
  const orangePinIcon = new L.DivIcon({
    className: '',
    html: `
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 2C10.477 2 6 6.477 6 12C6 19.5 16 30 16 30C16 30 26 19.5 26 12C26 6.477 21.523 2 16 2ZM16 16C13.791 16 12 14.209 12 12C12 9.791 13.791 8 16 8C18.209 8 20 9.791 20 12C20 14.209 18.209 16 16 16Z" fill="#F08A4B"/>
        <circle cx="16" cy="12" r="4" fill="white"/>
      </svg>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  const currentLocationIcon = new L.DivIcon({
    className: '',
    html: `<div class="marker-current"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  const center = [52.2331, 5.0760]; // Kortenhoef center
  const mapBounds = pickup && dropoff ? [ [pickup.lat, pickup.lng], [dropoff.lat, dropoff.lng] ] : null;

  const PREF_MAP = {
    'wheelchair': { icon: '♿️', text: 'Wheelchair Assist', color: 'blue' },
    'stroller': { icon: '👶', text: 'Stroller', color: 'blue' },
    'pets': { icon: '🐾', text: 'Pet Friendly', color: 'grey' },
    'quiet': { icon: '🤫', text: 'Quiet Ride', color: 'grey' }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target);
    const pickupInput = formData.get('pickup') || 'Weesp Station';
    const destinationInput = formData.get('dropoff') || 'Somewhere in Weesp';
    
    try {
      const fetchCoords = async (query) => {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', Weesp, Netherlands')}`;
        const resp = await fetch(url);
        const data = await resp.json();
        if (data && data.length > 0) return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        return null;
      };

      let pickupCoords = await fetchCoords(pickupInput);
      let dropoffCoords = await fetchCoords(destinationInput);

      if (!pickupCoords) pickupCoords = [52.3082 + (Math.random() - 0.5)*0.015, 5.0416 + (Math.random() - 0.5)*0.015];
      if (!dropoffCoords) dropoffCoords = [52.3082 + (Math.random() - 0.5)*0.015, 5.0416 + (Math.random() - 0.5)*0.015];

      let routeGeometry = null;
      const routeUrl = `https://router.project-osrm.org/route/v1/driving/${pickupCoords[1]},${pickupCoords[0]};${dropoffCoords[1]},${dropoffCoords[0]}?overview=full&geometries=geojson`;
      const routeResp = await fetch(routeUrl);
      const routeData = await routeResp.json();

      if (routeData.code === 'Ok' && routeData.routes.length > 0) {
        routeGeometry = routeData.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
      }

      const mappedBadges = (userProfile?.preferences || []).map(p => PREF_MAP[p]).filter(Boolean);

      const newRider = {
        id: 'you-' + Date.now(),
        name: userProfile ? userProfile.name : 'You',
        initial: userProfile ? userProfile.name.charAt(0).toUpperCase() : 'Y',
        distance: '0 km away',
        timeframe: 'Needs ride now',
        destination: destinationInput,
        location: pickupCoords,
        destinationLocation: dropoffCoords,
        routeGeometry: routeGeometry,
        color: '#ffc085',
        badges: [
          { icon: '📍', text: 'Ready', color: 'blue' },
          ...mappedBadges
        ],
        avatarUrl: userProfile?.avatarUrl,
        status: 'pending'
      };

      if(onRequestRide) onRequestRide(newRider);
    } catch (err) {
      console.error('Routing failed', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ride-screen redesign">
      <header className="ride-header-new">
        <button className="btn-back-circle" type="button" onClick={onBack} aria-label="Go back" disabled={isLoading}>
          <BackIcon />
        </button>
      </header>

      <div className="ride-redesign-card">
        <div className="card-header">
          <div className="card-title-group">
            <h1 className="card-title">I need a ride</h1>
            <p className="card-subtitle">Connect with a neighbour driver</p>
          </div>
        </div>

        <div className="card-car-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="108" height="90" viewBox="0 0 108 90" fill="none">
            <path d="M39.6 3.6C39.6 2.64522 39.9793 1.72955 40.6544 1.05442C41.3295 0.379284 42.2452 0 43.2 0H64.8C65.7548 0 66.6705 0.379284 67.3456 1.05442C68.0207 1.72955 68.4 2.64522 68.4 3.6C68.4 4.55478 68.0207 5.47045 67.3456 6.14558C66.6705 6.82072 65.7548 7.2 64.8 7.2H43.2C42.2452 7.2 41.3295 6.82072 40.6544 6.14558C39.9793 5.47045 39.6 4.55478 39.6 3.6ZM108 43.2C108 44.1548 107.621 45.0705 106.946 45.7456C106.27 46.4207 105.355 46.8 104.4 46.8H100.8V82.8C100.8 84.7096 100.041 86.5409 98.6912 87.8912C97.3409 89.2414 95.5096 90 93.6 90H82.8C80.8904 90 79.0591 89.2414 77.7088 87.8912C76.3586 86.5409 75.6 84.7096 75.6 82.8V79.2H32.4V82.8C32.4 84.7096 31.6414 86.5409 30.2912 87.8912C28.9409 89.2414 27.1096 90 25.2 90H14.4C12.4904 90 10.6591 89.2414 9.30883 87.8912C7.95857 86.5409 7.2 84.7096 7.2 82.8V46.8H3.6C2.64522 46.8 1.72955 46.4207 1.05442 45.7456C0.379284 45.0705 0 44.1548 0 43.2C0 42.2452 0.379284 41.3295 1.05442 40.6544C1.72955 39.9793 2.64522 39.6 3.6 39.6H8.712L21.0375 18.027C21.6673 16.9252 22.5771 16.0095 23.6747 15.3725C24.7724 14.7356 26.0189 14.4001 27.288 14.4H80.712C81.9811 14.4001 83.2276 14.7356 84.3253 15.3725C85.4229 16.0095 86.3327 16.9252 86.9625 18.027L99.288 39.6H104.4C105.355 39.6 106.27 39.9793 106.946 40.6544C107.621 41.3295 108 42.2452 108 43.2ZM36 57.6C36 56.6452 35.6207 55.7295 34.9456 55.0544C34.2705 54.3793 33.3548 54 32.4 54H21.6C20.6452 54 19.7295 54.3793 19.0544 55.0544C18.3793 55.7295 18 56.6452 18 57.6C18 58.5548 18.3793 59.4705 19.0544 60.1456C19.7295 60.8207 20.6452 61.2 21.6 61.2H32.4C33.3548 61.2 34.2705 60.8207 34.9456 60.1456C35.6207 59.4705 36 58.5548 36 57.6ZM90 57.6C90 56.6452 89.6207 55.7295 88.9456 55.0544C88.2705 54.3793 87.3548 54 86.4 54H75.6C74.6452 54 73.7295 54.3793 73.0544 55.0544C72.3793 55.7295 72 56.6452 72 57.6C72 58.5548 72.3793 59.4705 73.0544 60.1456C73.7295 60.8207 74.6452 61.2 75.6 61.2H86.4C87.3548 61.2 88.2705 60.8207 88.9456 60.1456C89.6207 59.4705 90 58.5548 90 57.6ZM90.9945 39.6L80.712 21.6H27.288L17.0055 39.6H90.9945Z" fill="#2D3320"/>
          </svg>
        </div>

        <div className="card-map-container">
          <MapContainer 
            center={center} 
            zoom={13} 
            style={{ width: '100%', height: '100%' }}
            zoomControl={false}
            attributionControl={false}
          >
            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
            <Marker position={center} icon={currentLocationIcon} />
            {pickup && <Marker position={[pickup.lat, pickup.lng]} icon={orangePinIcon} />}
            {dropoff && <Marker position={[dropoff.lat, dropoff.lng]} icon={orangePinIcon} />}
            {route && <Polyline positions={route} color="#F08A4B" weight={4} opacity={0.8} />}
            <MapRecenter bounds={mapBounds} />
          </MapContainer>
          <div className="map-badge">Kortenhoef Area</div>
        </div>
      </div>

      <form className="ride-form-new" onSubmit={handleSubmit}>
        <div className="form-inputs-row">
          <div className="form-field">
            <label className="form-label-new">Pick up location</label>
            <div className="input-field-new">
              <span className="input-icon-new">
                <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
                  <path d="M7 3.85718C6.3707 3.85718 5.75552 4.0457 5.23228 4.39889C4.70903 4.75209 4.30121 5.25409 4.06038 5.84143C3.81956 6.42877 3.75655 7.07506 3.87932 7.69858C4.00209 8.3221 4.30513 8.89483 4.75011 9.34437C5.1951 9.7939 5.76205 10.1 6.37926 10.2241C6.99647 10.3481 7.63623 10.2844 8.21763 10.0411C8.79903 9.79786 9.29596 9.38587 9.64559 8.85728C9.99521 8.32869 10.1818 7.70723 10.1818 7.0715C10.1818 6.21901 9.84659 5.40143 9.24989 4.79863C8.65318 4.19583 7.84387 3.85718 7 3.85718ZM7 9.00009C6.62242 9.00009 6.25331 8.88698 5.93937 8.67506C5.62542 8.46315 5.38072 8.16194 5.23623 7.80954C5.09174 7.45714 5.05393 7.06936 5.12759 6.69525C5.20125 6.32114 5.38308 5.9775 5.65007 5.70778C5.91706 5.43806 6.25723 5.25438 6.62755 5.17997C6.99788 5.10555 7.38174 5.14374 7.73058 5.28971C8.07942 5.43568 8.37758 5.68288 8.58735 6.00003C8.79903 6.31719 8.90909 6.69006 8.90909 7.0715C8.90909 7.58299 8.70796 8.07354 8.34993 8.43522C7.99191 8.7969 7.50632 9.00009 7 9.00009ZM7 0C5.14413 0.00212686 3.36488 0.747841 2.05258 2.07354C0.740279 3.39925 0.00210536 5.19667 0 7.0715C0 9.59474 1.1542 12.2691 3.34091 14.806C4.32347 15.9523 5.42934 16.9846 6.63807 17.8837C6.74507 17.9594 6.87254 18 7.00318 18C7.13382 18 7.2613 17.9594 7.3683 17.8837C8.5748 16.9842 9.67852 15.9519 10.6591 14.806C12.8426 12.2691 14 9.59474 14 7.0715C13.9979 5.19667 13.2597 3.39925 11.9474 2.07354C10.6351 0.747841 8.85587 0.00212686 7 0ZM7 16.5537C5.68511 15.5091 1.27273 11.672 1.27273 7.0715C1.27273 5.53702 1.87613 4.06538 2.95021 2.98034C4.02428 1.8953 5.48103 1.28573 7 1.28573C8.51897 1.28573 9.97572 1.8953 11.0498 2.98034C12.1239 4.06538 12.7273 5.53702 12.7273 7.0715C12.7273 11.6704 8.31489 15.5091 7 16.5537Z" fill="#707072"/>
                </svg>
              </span>
              <LocationAutocomplete 
                id="pickup" 
                name="pickup" 
                placeholder="Pick Up" 
                disabled={isLoading} 
                onSelect={setPickup}
              />
            </div>
          </div>
          <div className="form-field">
            <label className="form-label-new">Where to?</label>
            <div className="input-field-new highlight">
              <span className="input-icon-new">
                <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
                  <path d="M7 3.85718C6.3707 3.85718 5.75552 4.0457 5.23228 4.39889C4.70903 4.75209 4.30121 5.25409 4.06038 5.84143C3.81956 6.42877 3.75655 7.07506 3.87932 7.69858C4.00209 8.3221 4.30513 8.89483 4.75011 9.34437C5.1951 9.7939 5.76205 10.1 6.37926 10.2241C6.99647 10.3481 7.63623 10.2844 8.21763 10.0411C8.79903 9.79786 9.29596 9.38587 9.64559 8.85728C9.99521 8.32869 10.1818 7.70723 10.1818 7.0715C10.1818 6.21901 9.84659 5.40143 9.24989 4.79863C8.65318 4.19583 7.84387 3.85718 7 3.85718ZM7 9.00009C6.62242 9.00009 6.25331 8.88698 5.93937 8.67506C5.62542 8.46315 5.38072 8.16194 5.23623 7.80954C5.09174 7.45714 5.05393 7.06936 5.12759 6.69525C5.20125 6.32114 5.38308 5.9775 5.65007 5.70778C5.91706 5.43806 6.25723 5.25438 6.62755 5.17997C6.99788 5.10555 7.38174 5.14374 7.73058 5.28971C8.07942 5.43568 8.37758 5.68288 8.58735 6.00003C8.79903 6.31719 8.90909 6.69006 8.90909 7.0715C8.90909 7.58299 8.70796 8.07354 8.34993 8.43522C7.99191 8.7969 7.50632 9.00009 7 9.00009ZM7 0C5.14413 0.00212686 3.36488 0.747841 2.05258 2.07354C0.740279 3.39925 0.00210536 5.19667 0 7.0715C0 9.59474 1.1542 12.2691 3.34091 14.806C4.32347 15.9523 5.42934 16.9846 6.63807 17.8837C6.74507 17.9594 6.87254 18 7.00318 18C7.13382 18 7.2613 17.9594 7.3683 17.8837C8.5748 16.9842 9.67852 15.9519 10.6591 14.806C12.8426 12.2691 14 9.59474 14 7.0715C13.9979 5.19667 13.2597 3.39925 11.9474 2.07354C10.6351 0.747841 8.85587 0.00212686 7 0ZM7 16.5537C5.68511 15.5091 1.27273 11.672 1.27273 7.0715C1.27273 5.53702 1.87613 4.06538 2.95021 2.98034C4.02428 1.8953 5.48103 1.28573 7 1.28573C8.51897 1.28573 9.97572 1.8953 11.0498 2.98034C12.1239 4.06538 12.7273 5.53702 12.7273 7.0715C12.7273 11.6704 8.31489 15.5091 7 16.5537Z" fill="#707072"/>
                </svg>
              </span>
              <LocationAutocomplete 
                id="dropoff" 
                name="dropoff" 
                placeholder="Drop Off" 
                disabled={isLoading} 
                required 
                onSelect={setDropoff}
              />
            </div>
          </div>
        </div>

        <div className="form-field">
          <label className="form-label-new">What time?</label>
          <div className="input-field-new">
            <span className="input-icon-new">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 0C7.21997 0 5.47991 0.527841 3.99987 1.51677C2.51983 2.50571 1.36628 3.91131 0.685088 5.55585C0.00389956 7.20038 -0.17433 9.00998 0.172937 10.7558C0.520203 12.5016 1.37737 14.1053 2.63604 15.364C3.89471 16.6226 5.49836 17.4798 7.24419 17.8271C8.99002 18.1743 10.7996 17.9961 12.4442 17.3149C14.0887 16.6337 15.4943 15.4802 16.4832 14.0001C17.4722 12.5201 18 10.78 18 9C17.9975 6.61382 17.0485 4.3261 15.3612 2.63882C13.6739 0.95154 11.3862 0.00251984 9 0ZM9 16.6154C7.49382 16.6154 6.02146 16.1687 4.76912 15.332C3.51678 14.4952 2.5407 13.3058 1.96431 11.9143C1.38792 10.5228 1.23711 8.99155 1.53095 7.51431C1.82479 6.03707 2.55008 4.68014 3.61511 3.61511C4.68014 2.55008 6.03708 1.82478 7.51431 1.53094C8.99155 1.2371 10.5228 1.38791 11.9143 1.9643C13.3058 2.54069 14.4952 3.51677 15.332 4.76912C16.1688 6.02146 16.6154 7.49382 16.6154 9C16.6131 11.019 15.81 12.9547 14.3824 14.3824C12.9547 15.81 11.019 16.6131 9 16.6154ZM14.5385 9C14.5385 9.18361 14.4655 9.3597 14.3357 9.48953C14.2059 9.61937 14.0298 9.69231 13.8462 9.69231H9C8.81639 9.69231 8.6403 9.61937 8.51047 9.48953C8.38063 9.3597 8.30769 9.18361 8.30769 9V4.15385C8.30769 3.97023 8.38063 3.79414 8.51047 3.66431C8.6403 3.53448 8.81639 3.46154 9 3.46154C9.18361 3.46154 9.3597 3.53448 9.48954 3.66431C9.61937 3.79414 9.69231 3.97023 9.69231 4.15385V8.30769H13.8462C14.0298 8.30769 14.2059 8.38063 14.3357 8.51046C14.4655 8.6403 14.5385 8.81639 14.5385 9Z" fill="#707072"/>
              </svg>
            </span>
            <input 
              className="form-input-clean" 
              id="time" 
              name="time" 
              type="text" 
              placeholder="When do you have to leave?" 
              defaultValue="08:30" 
              disabled={isLoading} 
            />
          </div>
        </div>

        <button className="btn-find-neighbour" style={{ position: 'absolute', bottom: '53px' }} type="submit" disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Find a neighbour'}
        </button>
      </form>
    </div>
  );
}
