import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './RideScreens.css';

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
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.90385 8.36538C4.73269 8.36538 4.56538 8.31463 4.42307 8.21954C4.28076 8.12445 4.16984 7.9893 4.10434 7.83117C4.03884 7.67304 4.0217 7.49904 4.05509 7.33117C4.08848 7.1633 4.1709 7.00911 4.29193 6.88808C4.41296 6.76705 4.56715 6.68463 4.73502 6.65124C4.90289 6.61785 5.07689 6.63499 5.23502 6.70049C5.39315 6.76599 5.5283 6.87691 5.62339 7.01922C5.71848 7.16153 5.76923 7.32884 5.76923 7.5C5.76923 7.72951 5.67806 7.94963 5.51577 8.11192C5.35348 8.27421 5.13336 8.36538 4.90385 8.36538ZM10.0962 6.63462C9.925 6.63462 9.75769 6.68537 9.61538 6.78046C9.47306 6.87555 9.36215 7.0107 9.29665 7.16883C9.23115 7.32696 9.21401 7.50096 9.2474 7.66883C9.28079 7.8367 9.36321 7.99089 9.48424 8.11192C9.60526 8.23295 9.75946 8.31537 9.92733 8.34876C10.0952 8.38215 10.2692 8.36501 10.4273 8.29951C10.5855 8.23401 10.7206 8.12309 10.8157 7.98078C10.9108 7.83847 10.9615 7.67116 10.9615 7.5C10.9615 7.27049 10.8704 7.05037 10.7081 6.88808C10.5458 6.72579 10.3257 6.63462 10.0962 6.63462ZM9.2113 9.89639C8.69747 10.2153 8.10475 10.3843 7.5 10.3843C6.89525 10.3843 6.30254 10.2153 5.7887 9.89639C5.65922 9.81473 5.5026 9.78784 5.35329 9.82165C5.20398 9.85546 5.07422 9.9472 4.99255 10.0767C4.91088 10.2062 4.884 10.3628 4.91781 10.5121C4.95162 10.6614 5.04336 10.7912 5.17284 10.8728C5.87102 11.3081 6.67727 11.5388 7.5 11.5388C8.32274 11.5388 9.12899 11.3081 9.82717 10.8728C9.95665 10.7912 10.0484 10.6614 10.0822 10.5121C10.116 10.3628 10.0891 10.2062 10.0075 10.0767C9.92579 9.9472 9.79602 9.85546 9.64672 9.82165C9.49741 9.78784 9.34079 9.81473 9.2113 9.89639ZM15 7.5C15 8.98336 14.5601 10.4334 13.736 11.6668C12.9119 12.9001 11.7406 13.8614 10.3701 14.4291C8.99968 14.9968 7.49168 15.1453 6.03683 14.8559C4.58197 14.5665 3.2456 13.8522 2.1967 12.8033C1.14781 11.7544 0.433503 10.418 0.144114 8.96318C-0.145275 7.50832 0.00324963 6.00032 0.570907 4.62987C1.13856 3.25943 2.09986 2.08809 3.33323 1.26398C4.5666 0.439867 6.01664 0 7.5 0C9.48848 0.00209987 11.3949 0.79295 12.801 2.19902C14.2071 3.60509 14.9979 5.51152 15 7.5ZM13.8462 7.5C13.8441 5.86633 13.213 4.2962 12.0837 3.11566C10.9545 1.93511 9.41394 1.23487 7.78197 1.16034C6.94616 2.3351 6.92308 3.45288 6.92308 3.46154C6.92308 3.61455 6.98386 3.76129 7.09206 3.86948C7.20025 3.97768 7.34699 4.03846 7.5 4.03846C7.65301 4.03846 7.79976 3.97768 7.90795 3.86948C8.01614 3.76129 8.07693 3.61455 8.07693 3.46154C8.07693 3.30853 8.13771 3.16179 8.2459 3.05359C8.3541 2.9454 8.50084 2.88462 8.65385 2.88462C8.80686 2.88462 8.9536 2.9454 9.0618 3.05359C9.16999 3.16179 9.23077 3.30853 9.23077 3.46154C9.23077 3.92057 9.04842 4.3608 8.72384 4.68538C8.39926 5.00996 7.95903 5.19231 7.5 5.19231C7.04097 5.19231 6.60075 5.00996 6.27616 4.68538C5.95158 4.3608 5.76923 3.92057 5.76923 3.46154C5.76923 3.40889 5.77861 2.43029 6.37933 1.25264C5.19113 1.46582 4.08837 2.01347 3.20047 2.83134C2.31257 3.6492 1.67635 4.70335 1.36648 5.87008C1.05661 7.03681 1.08595 8.26771 1.45104 9.41836C1.81613 10.569 2.50183 11.5916 3.42769 12.3663C4.35354 13.1409 5.48113 13.6354 6.67814 13.7918C7.87515 13.9481 9.09192 13.7598 10.1857 13.2489C11.2794 12.7381 12.2048 11.9258 12.8531 10.9075C13.5015 9.88926 13.846 8.70718 13.8462 7.5Z" fill="currentColor"/>
    </svg>
  );
}
function WalkerSpaceIcon() {
  return (
    <svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.9615 0H10.3846C10.0786 0 9.78511 0.121566 9.56872 0.337954C9.35233 0.554342 9.23077 0.847827 9.23077 1.15385V5.19231H3.40385C3.26997 4.54119 2.9157 3.95613 2.40075 3.53577C1.8858 3.1154 1.24166 2.88543 0.576923 2.88462C0.423914 2.88462 0.277171 2.9454 0.168977 3.05359C0.0607828 3.16179 0 3.30853 0 3.46154C0 3.61455 0.0607828 3.76129 0.168977 3.86948C0.277171 3.97768 0.423914 4.03846 0.576923 4.03846C1.03595 4.03846 1.47618 4.22081 1.80076 4.54539C2.12534 4.86997 2.30769 5.3102 2.30769 5.76923C2.30941 7.2988 2.91779 8.76523 3.99936 9.8468C5.08093 10.9284 6.54736 11.5367 8.07692 11.5385H10.9615C12.4916 11.5385 13.9591 10.9306 15.041 9.84869C16.1229 8.76675 16.7308 7.29933 16.7308 5.76923C16.7308 4.23914 16.1229 2.77171 15.041 1.68977C13.9591 0.607828 12.4916 0 10.9615 0ZM15.5394 5.19231H11.4526L14.4714 2.77716C15.056 3.4604 15.4273 4.30011 15.5394 5.19231ZM10.9615 1.15385C11.9088 1.15296 12.8331 1.44544 13.6075 1.99111L10.3846 4.56851V1.15385H10.9615ZM10.9615 10.3846H8.07692C6.95313 10.3833 5.86833 9.9725 5.02547 9.2292C4.18262 8.48589 3.63945 7.46096 3.4976 6.34615H15.5409C15.399 7.46096 14.8558 8.48589 14.013 9.2292C13.1701 9.9725 12.0853 10.3833 10.9615 10.3846ZM6.92308 13.8462C6.92308 14.0744 6.85541 14.2974 6.72862 14.4872C6.60183 14.6769 6.42163 14.8248 6.21079 14.9122C5.99995 14.9995 5.76795 15.0224 5.54413 14.9778C5.3203 14.9333 5.11471 14.8234 4.95334 14.662C4.79197 14.5007 4.68208 14.2951 4.63756 14.0713C4.59303 13.8474 4.61588 13.6154 4.70322 13.4046C4.79055 13.1938 4.93844 13.0136 5.12819 12.8868C5.31794 12.76 5.54102 12.6923 5.76923 12.6923C6.07525 12.6923 6.36873 12.8139 6.58512 13.0303C6.80151 13.2467 6.92308 13.5401 6.92308 13.8462ZM14.4231 13.8462C14.4231 14.0744 14.3554 14.2974 14.2286 14.4872C14.1018 14.6769 13.9216 14.8248 13.7108 14.9122C13.5 14.9995 13.268 15.0224 13.0441 14.9778C12.8203 14.9333 12.6147 14.8234 12.4533 14.662C12.292 14.5007 12.1821 14.2951 12.1376 14.0713C12.093 13.8474 12.1159 13.6154 12.2032 13.4046C12.2905 13.1938 12.4384 13.0136 12.6282 12.8868C12.8179 12.76 13.041 12.6923 13.2692 12.6923C13.5752 12.6923 13.8687 12.8139 14.0851 13.0303C14.3015 13.2467 14.4231 13.5401 14.4231 13.8462Z" fill="currentColor"/>
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

// ── GiveRideCard — Figma 661-4342 ───────────────────────────
export function GiveRideCard({ rider, onClick, showCancel, onCancel }) {
  const name = rider.name || 'Sara de Jong';

  // Robustly derive age: prefer explicit age field, then calculate from birthdate
  const calcAge = (birthdate) => {
    if (!birthdate) return null;
    const today = new Date();
    const bd = new Date(birthdate);
    if (isNaN(bd)) return null;
    let age = today.getFullYear() - bd.getFullYear();
    if (today < new Date(today.getFullYear(), bd.getMonth(), bd.getDate())) age--;
    return age > 0 && age < 120 ? age : null;
  };
  const ageNum = rider.age != null && rider.age !== '' ? Number(rider.age) : calcAge(rider.birthdate);
  const age = ageNum ? `${ageNum} years old` : null;

  // Use current date as mock if missing, or use string directly if not parseable
  let dateStr = new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  if (rider.date) {
    const d = new Date(rider.date);
    if (!isNaN(d.getTime())) {
      dateStr = d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    } else {
      dateStr = rider.date;
    }
  }

  // Calculate real distance + time from route geometry (Haversine sum)
  const calcRouteStats = (geometry) => {
    if (!geometry || geometry.length < 2) return null;
    const toRad = d => d * Math.PI / 180;
    let totalKm = 0;
    for (let i = 0; i < geometry.length - 1; i++) {
      const [lat1, lon1] = geometry[i];
      const [lat2, lon2] = geometry[i + 1];
      const R = 6371;
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2)**2;
      totalKm += R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
    const mins = Math.round(totalKm / 40 * 60); // ~40 km/h average
    return { km: totalKm.toFixed(1), mins };
  };
  const stats = calcRouteStats(rider.routeGeometry);

  const pickupAddress = rider.pickupAddress || rider.pickup || 'Kortenhoef';
  const dropoffAddress = rider.dropoffAddress || rider.destination || 'Destination';
  const pickupDuration = rider.pickupDuration || (stats ? `${stats.mins} min (${stats.km.replace('.', ',')} km)` : rider.distance || '—');
  const dropoffDuration = rider.dropoffDuration || (stats ? `${stats.km.replace('.', ',')} km (${stats.mins} min)` : '—');
  const badges = rider.badges && rider.badges.length > 0 ? rider.badges : [];

  return (
    <div className="gr-card-redesign" onClick={() => onClick && onClick(rider)}>
      
      {/* Top Part */}
      <div className="gr-card-top-row">
        <div className="gr-card-profile" style={{ gap: '8px' }}>
          <div
            className="gr-card-avatar"
            style={rider.avatarUrl
              ? { backgroundImage: `url(${rider.avatarUrl})`, backgroundSize: 'cover', width: '40px', height: '40px', backgroundColor: 'transparent' }
              : { backgroundColor: rider.color || '#F08A4B', width: '40px', height: '40px' }}
          >
            {!rider.avatarUrl && <span style={{ color: 'white', fontWeight: 'bold' }}>{rider.initial || name[0]}</span>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p className="gr-card-name" style={{ fontSize: '16px' }}>{name}</p>
            {age && <p className="gr-card-sub" style={{ fontSize: '14px', color: '#707072' }}>{age}</p>}
          </div>
        </div>

        {showCancel && (
          <button className="gr-btn-cancel-ride" onClick={(e) => { e.stopPropagation(); onCancel && onCancel(rider.id); }}>
            Cancel Ride
          </button>
        )}
      </div>

      <div className="gr-card-divider" />

      {/* Badges */}
      <div className="gr-badges" style={{ gap: '4px' }}>
        {badges.map((b, i) => <NeedBadge key={i} badge={b} />)}
      </div>

      {/* Date + Time */}
      <div className="gr-card-date" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>{dateStr}</span>
        {rider.time && (
          <span style={{ 
            background: '#F08A4B20', 
            color: '#F08A4B', 
            borderRadius: '20px', 
            padding: '2px 10px', 
            fontWeight: 600, 
            fontSize: '13px' 
          }}>
            {rider.time}
          </span>
        )}
      </div>

      {/* Location */}
      <div className="gr-card-location">
        <div className="gr-loc-dashed-line" />
        
        <div className="gr-loc-row">
          <div className="gr-loc-start" />
          <div className="gr-loc-text">
            <p className="gr-loc-title">{pickupAddress}</p>
          </div>
        </div>

          <div className="gr-loc-row">
          <div className="gr-loc-dest">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M5 10C5 10 9 6.5 9 4C9 1.79086 7.20914 0 5 0C2.79086 0 1 1.79086 1 4C1 6.5 5 10 5 10ZM5 5.5C4.17157 5.5 3.5 4.82843 3.5 4C3.5 3.17157 4.17157 2.5 5 2.5C5.82843 2.5 6.5 3.17157 6.5 4C6.5 4.82843 5.82843 5.5 5 5.5Z" fill="#141A34"/>
            </svg>
          </div>
          <div className="gr-loc-text">
            <p className="gr-loc-title">{dropoffAddress}</p>
            {dropoffDuration && dropoffDuration !== '—' && (
              <p className="gr-loc-address">{dropoffDuration}</p>
            )}
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
export function GiveRideScreen({ onBack, riders, onOfferRide, userProfile }) {
  const [selectedRider, setSelectedRider] = useState(null);
  const MAP_CENTER = [52.2331, 5.0760]; // Kortenhoef

  // Lock scroll on the parent screen when popup is open
  useEffect(() => {
    const el = document.querySelector('.ride-screen.redesign');
    if (el) {
      el.style.overflowY = selectedRider ? 'hidden' : 'auto';
    }
  }, [selectedRider]);

  const pendingRiders = riders.filter(r => 
    (r.status === 'pending' || !r.status) && r.name !== userProfile?.name
  );
  const mapBounds = pendingRiders.length > 0
    ? pendingRiders.flatMap(r => [r.location, r.destinationLocation]).filter(Boolean)
    : null;

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
            <MapRecenter bounds={mapBounds} />
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

      {/* ── Rider Detail Bottom Sheet — portalled to document.body ── */}
      {selectedRider && createPortal(
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
                {selectedRider.badges.map((b, i) => <NeedBadge key={i} badge={b} />)}
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
        </div>,
        document.body
      )}
    </div>
  );
}
