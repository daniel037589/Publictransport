import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './MyTrips.css';

export function MyTripsScreen({ riders, onDeleteRide, onCancelOffer, userProfile }) {
  const [activeTab, setActiveTab] = useState('Active');

  // Map existing data to UI categories
  // "Active" = Requested by user + Driver accepted OR User is driving
  const activeTrips = riders.filter(r => 
    (r.name === userProfile?.name && r.status !== 'completed' && r.status !== 'cancelled') || 
    (r.driverName === userProfile?.name && r.status !== 'completed' && r.status !== 'cancelled')
  );

  const scheduledTrips = riders.filter(r => false); // Disable scheduled if we just show everything active
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
  const myRequests = visibleTrips.filter(t => t.name === userProfile?.name);
  const ridesIHelp = visibleTrips.filter(t => t.driverName === userProfile?.name);

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
            <img src="/favicon.svg" alt="Community logo" />
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
          <>
            {myRequests.length > 0 && (
              <div className="trips-date-group">
                <h2 className="trips-date-header" style={{ marginBottom: '12px' }}>Your Requests</h2>
                <AnimatePresence>
                  {myRequests.map(trip => (
                    <TripCard 
                      key={trip.id} 
                      trip={trip} 
                      isDriving={trip.driverName === userProfile?.name}
                      onAction={() => onDeleteRide(trip.id)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}

            {ridesIHelp.length > 0 && (
              <div className="trips-date-group" style={{ marginTop: '24px' }}>
                <h2 className="trips-date-header" style={{ marginBottom: '12px' }}>Rides you help with</h2>
                <AnimatePresence>
                  {ridesIHelp.map(trip => (
                    <TripCard 
                      key={trip.id} 
                      trip={trip} 
                      isDriving={trip.driverName === userProfile?.name}
                      onAction={() => onCancelOffer(trip.id)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}

import { GiveRideCard } from './GiveRide';

export function TripCard({ trip, isDriving, onAction, actionLabel = 'Cancel Ride', actionClassName = 'trip-cancel-btn' }) {
  // Determine title for the trip (Wait securely mapped to driver or requester)
  const title = isDriving ? `Ride for ${trip.name}` : (trip.driverName ? `Ride with ${trip.driverName}` : trip.name || 'Ride Request');

  // We map the correct title into a duplicate object specifically for GiveRideCard
  const formattedTrip = {
    ...trip,
    name: title,
    // Add realistic durations and locations just like GetRide / GiveRide would map
    pickupDuration: trip.timeframe || '10:30 - 11:00',
    pickupAddress: trip.pickup || trip.location || 'Kortenhoef Center',
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      style={{ marginBottom: '16px' }}
    >
      <GiveRideCard 
        rider={formattedTrip} 
        showCancel={true} 
        onCancel={onAction} 
      />
    </motion.div>
  );
}
