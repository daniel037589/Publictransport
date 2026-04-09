import { motion, AnimatePresence } from 'framer-motion';
import './RideScreens.css';

export function MyTripsScreen({ riders, onDeleteRide, userProfile }) {
  // Identify trips requested by the user
  const myRequests = riders.filter(r => r.name === userProfile?.name);
  // Identify trips the user is driving for
  const myAcceptedRides = riders.filter(r => r.driverName === userProfile?.name);

  return (
    <motion.div 
      className="ride-screen"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      style={{ padding: '60px 24px calc(var(--navbar-height) + 24px)', overflowY: 'auto', height: '100%' }}
    >
      <header className="ride-header" style={{ marginBottom: 24, padding: 0 }}>
        <h1 className="ride-title">My Trips</h1>
      </header>

      {/* Rides I Am Giving */}
      {myAcceptedRides.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: 'var(--color-brand-blue)' }}>Rides I'm Giving</h2>
          <div className="requests-container" style={{ padding: 0 }}>
            {myAcceptedRides.map(trip => (
              <motion.div 
                key={trip.id}
                className="request-card"
                style={{ border: '2px solid var(--color-brand-blue)' }}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="request-card-header">
                  <div className="request-profile">
                    <div 
                      className="request-avatar" 
                      style={trip.avatarUrl ? { backgroundImage: `url(${trip.avatarUrl})`, backgroundSize: 'cover', color: 'transparent' } : { background: trip.color }}
                    >
                      {trip.avatarUrl ? '' : trip.initial}
                    </div>
                    <div className="request-info">
                      <h3>Pick up {trip.name}</h3>
                      <p>Destination: {trip.destination}</p>
                    </div>
                  </div>
                </div>

                <div className="request-route">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 8L16 12L12 16M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span style={{ color: 'var(--color-brand-blue)', fontWeight: '600' }}>Active Ride Route</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: 'var(--color-text-black)' }}>My Requests</h2>
      {myRequests.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '20px', color: 'var(--color-text-nav)' }}>
          <p>You have no active ride requests pending.</p>
        </div>
      ) : (
        <div className="requests-container" style={{ padding: 0 }}>
          <AnimatePresence>
            {myRequests.map(trip => (
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
                    <div 
                      className="request-avatar" 
                      style={trip.avatarUrl ? { backgroundImage: `url(${trip.avatarUrl})`, backgroundSize: 'cover', color: 'transparent' } : { background: trip.color }}
                    >
                      {trip.avatarUrl ? '' : trip.initial}
                    </div>
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
                  <span style={{ color: trip.status === 'ongoing' ? '#34C759' : 'var(--color-brand-blue)', fontWeight: '600' }}>
                    {trip.status === 'ongoing' ? `Neighbor ${trip.driverName} is arriving!` : 'Waiting for a Neighbor'}
                  </span>
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
