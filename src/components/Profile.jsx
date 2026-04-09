import { motion } from 'framer-motion';
import { WaveIcon, CarIcon } from './Icons';
import './Profile.css';

export function ProfileScreen({ userProfile, onLogout }) {
  const profileName = userProfile?.name || 'You';
  const profileInitial = profileName.charAt(0).toUpperCase();
  const prefs = userProfile?.preferences || [];

  const ALL_PREFS = [
    { id: 'wheelchair', label: 'Needs Wheelchair Assist', icon: '♿️' },
    { id: 'stroller', label: 'Needs Stroller Space', icon: '👶' },
    { id: 'pets', label: 'Pet Friendly', icon: '🐾' },
    { id: 'quiet', label: 'Quiet Ride Preferred', icon: '🤫' },
  ];

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
          <div 
            className="profile-avatar"
            style={userProfile?.avatarUrl ? { backgroundImage: `url(${userProfile.avatarUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', color: 'transparent' } : {}}
          >
            {userProfile?.avatarUrl ? '' : profileInitial}
          </div>
          <div className="profile-verified-badge">✓</div>
        </motion.div>
        
        <motion.div 
          style={{ textAlign: 'center' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="profile-name">{profileName}</h2>
          <p className="profile-status">
            <span style={{ color: 'var(--color-brand-blue)' }}>★ 5.0</span> • Weesp Neighbor
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
          <span className="stat-value">0</span>
          <span className="stat-label">Rides Given</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">0</span>
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
          {ALL_PREFS.map((pref, index) => (
            <div key={pref.id}>
              <div className="profile-row">
                <div className="profile-row-label">
                  <span style={{ fontSize: '20px' }}>{pref.icon}</span> {pref.label}
                </div>
                <div className="toggle-switch" style={!prefs.includes(pref.id) ? { background: 'var(--color-bg-gray)' } : {}}>
                  <div className="toggle-knob" style={!prefs.includes(pref.id) ? { left: '2px', right: 'auto' } : {}}></div>
                </div>
              </div>
              {index < ALL_PREFS.length - 1 && (
                <hr style={{ borderTop: '1px solid var(--color-bg-gray)', borderBottom: 'none', margin: '14px 0' }} />
              )}
            </div>
          ))}
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
              <div style={{ width: 24, height: 24, color: 'var(--color-bg-gray)' }}>
                <CarIcon />
              </div>
              <div>
                <div style={{ color: 'var(--color-text-nav)' }}>No Vehicle Added</div>
              </div>
            </div>
            <div style={{ color: 'var(--color-brand-blue)', fontWeight: 'bold' }}>Add</div>
          </div>
        </div>
      </motion.div>

      <motion.button 
        className="btn-primary" 
        onClick={onLogout}
        style={{ marginTop: '16px', background: 'var(--color-bg-gray)', color: '#ff3b30' }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Delete Device Profile
      </motion.button>
    </motion.div>
  );
}
