import { useState, useEffect, useRef } from 'react';
import './RideScreens.css';

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
      <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" fill="var(--color-brand-blue)" fillOpacity="0.2" stroke="var(--color-brand-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 12L11 14L15 10" stroke="var(--color-brand-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function LocationAutocomplete({ id, name, placeholder, disabled, required }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const fetchLocations = async () => {
      if (query.trim().length < 3) {
        setResults([]);
        return;
      }
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', Weesp, Netherlands')}&limit=5`;
        const resp = await fetch(url);
        const data = await resp.json();
        setResults(data);
      } catch (err) {
        console.error("Autocomplete error", err);
      }
    };

    const debounce = setTimeout(fetchLocations, 400);
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
    <div style={{ position: 'relative' }} ref={wrapperRef}>
      <input 
        className="form-input" 
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
      {isOpen && results.length > 0 && (
        <ul style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, 
          background: 'var(--color-brand-white)',
          border: '1px solid #eaeaea', borderRadius: '12px', zIndex: 1000,
          listStyle: 'none', margin: 0, padding: '8px 0', 
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          maxHeight: '220px', overflowY: 'auto'
        }}>
          {results.map((r, i) => (
            <li 
              key={i} 
              style={{ padding: '12px 16px', borderBottom: i < results.length - 1 ? '1px solid #eaeaea' : 'none', cursor: 'pointer', fontSize: '14px', color: 'var(--color-text-black)', display: 'flex', flexDirection: 'column', gap: '4px' }}
              onClick={() => {
                const displayName = r.display_name.includes('Weesp') ? r.display_name.split(', Weesp')[0] : r.display_name.split(',')[0];
                setQuery(displayName);
                setIsOpen(false);
              }}
            >
              <strong style={{ fontFamily: 'var(--font-family-title)' }}>{r.name || r.display_name.split(',')[0]}</strong>
              <span style={{ fontSize: '12px', color: 'var(--color-text-nav)' }}>{r.display_name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function GetRideScreen({ onBack, onRequestRide, userProfile }) {
  const [isLoading, setIsLoading] = useState(false);

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
      // 1. Convert Text Addresses into Lat/Lng
      const fetchCoords = async (query) => {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', Weesp, Netherlands')}`;
        const resp = await fetch(url);
        const data = await resp.json();
        if (data && data.length > 0) return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        return null;
      };

      let pickupCoords = await fetchCoords(pickupInput);
      let dropoffCoords = await fetchCoords(destinationInput);

      // Fallbacks if Nominatim fails to find the exact street
      if (!pickupCoords) pickupCoords = [52.3082 + (Math.random() - 0.5)*0.015, 5.0416 + (Math.random() - 0.5)*0.015];
      if (!dropoffCoords) dropoffCoords = [52.3082 + (Math.random() - 0.5)*0.015, 5.0416 + (Math.random() - 0.5)*0.015];

      // 2. Fetch Turn-by-Turn OSRM Graph Routing
      let routeGeometry = null;
      const routeUrl = `https://router.project-osrm.org/route/v1/driving/${pickupCoords[1]},${pickupCoords[0]};${dropoffCoords[1]},${dropoffCoords[0]}?overview=full&geometries=geojson`;
      const routeResp = await fetch(routeUrl);
      const routeData = await routeResp.json();

      if (routeData.code === 'Ok' && routeData.routes.length > 0) {
        // GeoJSON uses [lng, lat], Leaflet uses [lat, lng]. Map it properly.
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
        routeGeometry: routeGeometry, // Map arrays natively
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
    <div className="ride-screen">
      <header className="ride-header">
        <button className="btn-back" type="button" onClick={onBack} aria-label="Go back" disabled={isLoading}>
          <BackIcon />
        </button>
        <h1 className="ride-title">Get a Ride</h1>
      </header>
      
      <p className="ride-subtitle">
        Heading somewhere? Connect with neighbors who are already driving your way.
      </p>

      <form className="ride-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="pickup">Pick-up Location</label>
          <LocationAutocomplete id="pickup" name="pickup" placeholder="e.g. Town Hall or your address" disabled={isLoading} required={false} />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="dropoff">Where to?</label>
          <LocationAutocomplete id="dropoff" name="dropoff" placeholder="Destination address" disabled={isLoading} required={true} />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="time">When</label>
          <input className="form-input" id="time" name="time" type="time" defaultValue="08:30" disabled={isLoading} />
        </div>

        <div className="community-notice">
          <CommunityShieldIcon />
          <p><strong>Community Trust:</strong> You match with verified locals and neighbors. It’s about sharing, not just riding.</p>
        </div>

        <button className="btn-primary" type="submit" style={{ marginTop: '32px' }} disabled={isLoading}>
          {isLoading ? 'Calculating Route...' : 'Find a Neighbor'}
        </button>
      </form>
    </div>
  );
}
