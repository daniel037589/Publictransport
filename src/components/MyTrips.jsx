import { motion, AnimatePresence } from 'framer-motion';
import './RideScreens.css';

export function MyTripsScreen({ riders, onDeleteRide }) {
  // Identify trips belonging to the current user
  const myTrips = riders.filter(r => r.name === 'You' || String(r.id).startsWith('you-'));

  return (
    <motion.div 
      className="ride-screen"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      style={{ padding: '60px 24px calc(var(--navbar-height) + 24px)', overflowY: 'auto', height: '100%' }}
    >
      <header className="ride-header" style={{ marginBottom: 24, padding: 0 }}>
        <h1 className="ride-title">My Active Auto-Requests</h1>
      </header>

      {myTrips.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '60px', color: 'var(--color-text-nav)' }}>
          <p>You have no active ride requests pending in the network.</p>
        </div>
      ) : (
        <div className="requests-container" style={{ padding: 0 }}>
          <AnimatePresence>
            {myTrips.map(trip => (
              <motion.div 
                key={trip.id}
                className="request-card"
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, height: 0, marginBottom: 0, overflow: 'hidden' }}
                transition={{ duration: 0.3 }}
              >
                <div className="request-card-header">
                  <div className="request-profile">
                    <div className="request-avatar" style={{ background: trip.color }}>{trip.initial}</div>
                    <div className="request-info">
                      <h3>{trip.destination}</h3>
                      <p>{trip.timeframe}</p>
                    </div>
                  </div>
                </div>

                <div className="request-route">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 8L16 12L12 16M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span style={{ color: 'var(--color-brand-blue)', fontWeight: '600' }}>Waiting for a Neighbor</span>
                </div>

                <button 
                  className="btn-secondary" 
                  style={{ marginTop: '16px', color: '#ff3b30', fontWeight: 'bold' }}
                  onClick={() => onDeleteRide(trip.id)}
                >
                  Cancel Request
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
