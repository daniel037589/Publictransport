import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './MyTrips.css';

export function MyTripsScreen({ riders, onDeleteRide, onCancelOffer, userProfile }) {
  const [activeTab, setActiveTab] = useState('Active');

  // Map existing data to UI categories
  // "Active" = Requested by user + Driver accepted OR User is driving
  const activeTrips = riders.filter(r => 
    (r.name === userProfile?.name && r.status === 'ongoing') || 
    (r.driverName === userProfile?.name)
  );

  // "Scheduled" = Requested by user + Waiting for driver
  const scheduledTrips = riders.filter(r => 
    r.name === userProfile?.name && r.status !== 'ongoing'
  );

  // "History" = Mock history for design purposes
  const historyTrips = []; // Empty for now

  const tabs = ['Active', 'Scheduled', 'History'];

  const getVisibleTrips = () => {
    switch (activeTab) {
      case 'Active': return activeTrips;
      case 'Scheduled': return scheduledTrips;
      case 'History': return historyTrips;
      default: return [];
    }
  };

  const visibleTrips = getVisibleTrips();

  return (
    <motion.div 
      className="trips-screen"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <header className="trips-header">
        <div className="trips-community">
          <div className="trips-community-icon">
            <img src="/logo.png" alt="Community logo" />
          </div>
          <div className="trips-community-info">
            <span className="trips-community-label">Your Community</span>
            <span className="trips-community-name">Ons Kortenhoef</span>
          </div>
        </div>

        <div className="trips-tabs">
          {tabs.map(tab => (
            <button 
              key={tab}
              className={`trips-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <div className="trips-content">
        {visibleTrips.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--color-text-nav)', opacity: 0.6 }}>
            <p>No {activeTab.toLowerCase()} trips found.</p>
          </div>
        ) : (
          <div className="trips-date-group">
            <h2 className="trips-date-header">Today</h2>
            <AnimatePresence>
              {visibleTrips.map(trip => (
                <TripCard 
                  key={trip.id} 
                  trip={trip} 
                  isDriving={trip.driverName === userProfile?.name}
                  onAction={() => trip.driverName === userProfile?.name ? onCancelOffer(trip.id) : onDeleteRide(trip.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function TripCard({ trip, isDriving, onAction, actionLabel = 'Cancel Ride', actionClassName = 'trip-cancel-btn' }) {
  return (
    <motion.div 
      className="trip-card"
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <div className="trip-card-header">
        <div className="trip-user-info">
          <div 
            className="trip-avatar" 
            style={{ backgroundImage: trip.avatarUrl ? `url(${trip.avatarUrl})` : 'none', backgroundColor: trip.avatarUrl ? 'transparent' : (trip.color || '#F08A4B') }}
          >
            {!trip.avatarUrl && <span style={{ color: 'white', fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>{trip.initial || (trip.name ? trip.name[0] : '?')}</span>}
          </div>
          <div className="trip-user-details">
            <h3>{isDriving ? `Ride for ${trip.name}` : (trip.driverName ? `Ride with ${trip.driverName}` : 'Ride Request')}</h3>
            <p>{trip.timeframe || trip.time || '10:30 - 11:00'}</p>
          </div>
        </div>
        <button className={actionClassName} onClick={onAction}>
          {actionLabel}
        </button>
      </div>

      <div className="trip-details">
        <div className="trip-location">
          <div className="location-dot start"></div>
          <div className="location-line"></div>
          <div className="location-info">
            <p>{trip.pickup || 'School bus stop Kortenhoef'}</p>
          </div>
        </div>
        <div className="trip-location">
          <div className="location-dot end"></div>
          <div className="location-info">
            <p>{trip.destination}</p>
          </div>
        </div>
      </div>

      {trip.badges && trip.badges.length > 0 && (
        <div className="trip-badges">
          {trip.badges.map((badge, idx) => (
            <span key={idx} className="trip-badge">{badge}</span>
          ))}
        </div>
      )}
      {!trip.badges && (
        <div className="trip-badges">
          <span className="trip-badge">Vehicle entry help</span>
          {isDriving && <span className="trip-badge">High seating</span>}
        </div>
      )}
    </motion.div>
  );
}
