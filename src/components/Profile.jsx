import { motion } from 'framer-motion';
import { WaveIcon, CarIcon } from './Icons';
import './Profile.css';

export function ProfileScreen() {
  return (
    <motion.div 
      className="profile-container"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="profile-header">
        <motion.div 
          className="profile-avatar-wrapper"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
        >
          <div className="profile-avatar">Y</div>
          <div className="profile-verified-badge">✓</div>
        </motion.div>
        
        <motion.div 
          style={{ textAlign: 'center' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="profile-name">You</h2>
          <p className="profile-status">
            <span style={{ color: 'var(--color-brand-blue)' }}>★ 4.9</span> • Weesp Neighbor
          </p>
        </motion.div>
      </div>

      <motion.div 
        className="profile-stats"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="stat-card">
          <span className="stat-value">12</span>
          <span className="stat-label">Rides Given</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">8</span>
          <span className="stat-label">Rides Taken</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="profile-section-title">My Preferences</h3>
        <div className="profile-card">
          <div className="profile-row">
            <div className="profile-row-label">
              <span style={{ fontSize: '20px' }}>👶</span> Needs Stroller Space
            </div>
            <div className="toggle-switch">
              <div className="toggle-knob"></div>
            </div>
          </div>
          <hr style={{ borderTop: '1px solid var(--color-bg-gray)', borderBottom: 'none', margin: '4px 0' }} />
          <div className="profile-row">
            <div className="profile-row-label">
              <span style={{ fontSize: '20px' }}>🎵</span> Quiet Ride Preferred
            </div>
            <div className="toggle-switch" style={{ background: 'var(--color-bg-gray)' }}>
              <div className="toggle-knob" style={{ left: '2px', right: 'auto' }}></div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="profile-section-title">My Vehicle</h3>
        <div className="profile-card">
          <div className="profile-row">
            <div className="profile-row-label">
              <div style={{ width: 24, height: 24, color: 'var(--color-brand-blue)' }}>
                <CarIcon />
              </div>
              <div>
                <div>Volkswagen ID.3</div>
                <div className="profile-row-value">Electric • White</div>
              </div>
            </div>
            <div style={{ color: 'var(--color-brand-blue)', fontWeight: 'bold' }}>Edit</div>
          </div>
          
          <div className="preference-badge-list" style={{ marginTop: '8px' }}>
            <span className="pref-badge pref-badge--active">3 Seats</span>
            <span className="pref-badge">Trunk Space</span>
            <span className="pref-badge">Pet Friendly</span>
          </div>
        </div>
      </motion.div>

      <motion.button 
        className="btn-primary" 
        style={{ marginTop: '16px', background: 'var(--color-bg-gray)', color: '#ff3b30' }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Log Out
      </motion.button>
    </motion.div>
  );
}
