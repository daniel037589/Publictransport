import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Circle, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { CommunityDetail } from './CommunityDetail';
import './Community.css';

const KORTENHOEF = [52.2331, 5.0760];

// Community data with absolute distance from Kortenhoef (center)
const COMMUNITIES_DATA = [
  { 
    id: 'ons-kortenhoef',
    name: 'Ons Kortenhoef', 
    location: 'Kortenhoef, NL', 
    pos: [52.2331, 5.0760], 
    dist: 0,
    memberCount: 842,
    status: 'joined',
    logoClass: 'ons',
    image: '/Kortenhoef.jpg',
    members: ['https://i.pravatar.cc/150?u=1', 'https://i.pravatar.cc/150?u=2', 'https://i.pravatar.cc/150?u=3']
  },
  { 
    id: 'nederhorst-berg',
    name: 'Nederhorst Neighbors', 
    location: 'Nederhorst den Berg, NL', 
    pos: [52.2612, 5.0456], 
    dist: 4,
    memberCount: 312,
    status: 'explore',
    logoClass: 'nederhorst',
    image: 'https://images.unsplash.com/photo-1590483736622-39da8caf3501?auto=format&fit=crop&q=80&w=1000',
    members: ['https://i.pravatar.cc/150?u=10', 'https://i.pravatar.cc/150?u=11']
  },
  { 
    id: 'hilversum-neighbors',
    name: 'Hilversum Neighbors', 
    location: 'Hilversum, NL', 
    pos: [52.2232, 5.1764], 
    dist: 7,
    memberCount: '2.4k',
    status: 'explore',
    logoClass: 'hilversum',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=1000',
    members: ['https://i.pravatar.cc/150?u=4', 'https://i.pravatar.cc/150?u=5', 'https://i.pravatar.cc/150?u=6']
  },
  { 
    id: 'kortenhoef-central',
    name: 'Kortenhoef Central', 
    location: 'Kortenhoef, NL', 
    pos: [52.3094, 5.0392], 
    dist: 11,
    memberCount: '1.2k',
    status: 'explore',
    logoClass: 'weesp',
    image: 'https://images.unsplash.com/photo-1554619379-371295327246?auto=format&fit=crop&q=80&w=1000',
    members: ['https://i.pravatar.cc/150?u=7', 'https://i.pravatar.cc/150?u=8', 'https://i.pravatar.cc/150?u=9']
  },
  {
    id: 'loosedrecht-lakes',
    name: 'Loosdrecht Lakes',
    location: 'Loosdrecht, NL',
    pos: [52.2030, 5.1050],
    dist: 5,
    memberCount: 620,
    status: 'explore',
    logoClass: 'loosedrecht',
    members: ['https://i.pravatar.cc/150?u=12', 'https://i.pravatar.cc/150?u=13']
  }
];

// Custom Leaflet Icons
const currentLocationIcon = new L.DivIcon({
  className: '',
  html: `<div class="marker-current"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const communityIcon = new L.DivIcon({
  className: '',
  html: `<div class="marker-community"></div>`,
  iconSize: [44, 44],
  iconAnchor: [22, 22],
});

function MapPinIcon({ size = 10 }) {
  return (
    <svg width={size} height={(size * 13) / 10} viewBox="0 0 10 13" fill="none">
      <path d="M5 0.5C2.51472 0.5 0.5 2.51472 0.5 5C0.5 8.375 5 12.5 5 12.5C5 12.5 9.5 8.375 9.5 5C9.5 2.51472 7.48528 0.5 5 0.5ZM5 6.75C4.0335 6.75 3.25 5.9665 3.25 5C3.25 4.0335 4.0335 3.25 5 3.25C5.9665 3.25 6.75 4.0335 6.75 5C6.75 5.9665 5.9665 6.75 5 6.75Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function CommunitiesScreen() {
  const [range, setRange] = useState(15);
  const [selectedCommunity, setSelectedCommunity] = useState(null);

  // Filter communities based on selected range
  const visibleCommunities = useMemo(() => {
    return COMMUNITIES_DATA.filter(c => c.dist <= range).sort((a, b) => a.dist - b.dist);
  }, [range]);

  return (
    <motion.div 
      className="communities-screen"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <header className="communities-header">
        <div className="communities-header__icon">
          <img src="/logo.png" alt="Ons Kortenhoef logo" draggable={false} />
        </div>
        <div className="communities-header__text">
          <span className="communities-header__label">Your Community</span>
          <h1 className="communities-header__title">Ons Kortenhoef</h1>
        </div>
      </header>

      <div className="communities-content">
        {/* ── Dynamic Range Card ── */}
        <section className="community-range-card">
          <div className="range-map-container">
            <MapContainer
              center={KORTENHOEF}
              zoom={11}
              scrollWheelZoom={false}
              zoomControl={false}
              attributionControl={false}
              dragging={false}
              style={{ width: '100%', height: '100%' }}
            >
              <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
              <Circle 
                center={KORTENHOEF}
                pathOptions={{ 
                  fillColor: '#F08A4B', 
                  color: '#F08A4B', 
                  weight: 1.5, 
                  opacity: 0.25, 
                  fillOpacity: 0.08 
                }}
                radius={range * 1000} 
              />
              {visibleCommunities.map(c => (
                <Marker 
                  key={c.id} 
                  position={c.pos} 
                  icon={c.dist === 0 ? currentLocationIcon : communityIcon} 
                >
                  <Tooltip 
                    permanent 
                    direction="top" 
                    offset={[0, -10]} 
                    className="map-town-label"
                  >
                    {c.name === 'Ons Kortenhoef' ? 'Kortenhoef' : c.name.split(' ')[0]}
                  </Tooltip>
                </Marker>
              ))}
            </MapContainer>
          </div>

          <div className="range-map-fade"></div>

          <div className="range-slider-overlay">
            <div className="range-slider-info">
              <span className="range-slider-label">Coverage Range</span>
              <span className="range-slider-value">{range} km</span>
            </div>
            
            <div className="range-slider-container">
              <input 
                type="range" min="1" max="35" value={range} 
                onChange={(e) => setRange(parseInt(e.target.value))}
                className="range-slider"
              />
            </div>
          </div>
        </section>

        {/* ── Result Summary ── */}
        <div className="communities-summary">
          <h2>Found {visibleCommunities.length} Communities</h2>
          <p>Neighbors within your selected distance</p>
        </div>

        {/* ── Filtered Community List ── */}
        <div className="communities-list">
          <AnimatePresence mode="popLayout">
            {visibleCommunities.map(community => (
              <CommunityItemCard 
                key={community.id} 
                community={community} 
                onClick={() => setSelectedCommunity(community)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {selectedCommunity && (
          <CommunityDetail 
            community={selectedCommunity} 
            onBack={() => setSelectedCommunity(null)} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function CommunityItemCard({ community, onClick }) {
  return (
    <motion.div 
      className="community-item-card"
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="community-item-main">
        <div className="community-item-info">
          <div className={`community-item-logo ${community.logoClass}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 9.5L12 3L21 9.5V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9.5Z" stroke="#2D3320" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 21V12H15V21" stroke="#2D3320" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="community-item-text">
            <h3>{community.name}</h3>
            <div className="community-location-meta">
              <MapPinIcon size={10} />
              <span>{community.location}</span>
            </div>
            <div className="community-dist-badge">
              {community.dist === 0 ? 'Local Community' : `${community.dist} km away`}
            </div>
          </div>
        </div>
        <button className={`community-item-btn ${community.status}`}>
          {community.status === 'joined' ? 'Joined' : 'Explore'}
        </button>
      </div>

      <div className="community-item-footer">
        <div className="community-members">
          <div className="member-avatars">
            {community.members.map((avatar, i) => (
              <div key={i} className="member-avatar" style={{ backgroundImage: `url(${avatar})`, zIndex: 10 - i }} />
            ))}
          </div>
          <span className="member-count">{community.memberCount} members</span>
        </div>
      </div>
    </motion.div>
  );
}
