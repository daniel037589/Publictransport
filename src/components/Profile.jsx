import { motion } from 'framer-motion';
import './Profile.css';

const ALL_LANGUAGES = [
  { id: 'nl', label: 'Nederlands', flag: '🇳🇱' },
  { id: 'en', label: 'English', flag: '🇬🇧' },
  { id: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { id: 'fr', label: 'Français', flag: '🇫🇷' },
  { id: 'es', label: 'Español', flag: '🇪🇸' },
  { id: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { id: 'ar', label: 'العربية', flag: '🇸🇦' },
  { id: 'pl', label: 'Polski', flag: '🇵🇱' },
];

function calculateAge(birthdate) {
  if (!birthdate) return null;
  const birth = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export function ProfileScreen({ userProfile, onLogout, riders = [] }) {
  const profileName = userProfile?.name || 'Mahsa';
  const profileInitial = profileName.charAt(0).toUpperCase();
  const prefs = userProfile?.preferences || ['stroller', 'quiet', 'pets'];
  const userLanguages = ALL_LANGUAGES.filter(l => (userProfile?.languages || ['en', 'de']).includes(l.id));
  const age = userProfile?.birthdate ? calculateAge(userProfile.birthdate) : (userProfile?.age || 28);

  // Derive stats
  const tripsTaken = riders?.filter(r => r.name === profileName && r.status === 'completed').length || 21;
  const ridesGiven = riders?.filter(r => r.driverName === profileName).length || 32;

  const prefLabels = {
    'wheelchair': 'Needs Wheelchair Assist',
    'stroller': 'Need Stroller space',
    'pets': 'Pet Friendly',
    'quiet': 'Quiet Ride'
  };

  const vehicleSpecs = ['Air Conditioning', 'Up to 4 Passengers', 'Space for Baggage', 'Pets Friendly'];

  return (
    <motion.div 
      className="profile-screen-new"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="profile-content-new">
        
        {/* Main Info Card */}
        <div className="profile-info-card">
          <div className="profile-info-header">
            <div className="profile-identity">
              <div className="profile-avatar-stack">
                <div 
                  className="profile-avatar-circle"
                  style={userProfile?.avatarUrl ? { backgroundImage: `url(${userProfile.avatarUrl})` } : { backgroundImage: `url(https://i.pravatar.cc/150?img=47)` }}
                >
                  {!userProfile && !userProfile?.avatarUrl ? profileInitial : ''}
                </div>
                <div className="profile-verified-pill">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/></svg>
                  Verified
                </div>
              </div>

              <div className="profile-text-info">
                <h2 className="profile-name-text">{profileName}</h2>
                <div className="profile-age-row">
                  <span>{age} Years Old</span>
                </div>
                <div className="profile-flags">
                  {userLanguages.slice(0, 3).map(lang => (
                    <span key={lang.id} className="flag-emoji">{lang.flag}</span>
                  ))}
                </div>
              </div>
            </div>

            <button className="profile-edit-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/></svg>
              Edit
            </button>
          </div>

          <div className="profile-stats-grid">
            <div className="profile-stat-box">
              <div className="stat-number">{tripsTaken}</div>
              <div className="stat-text">Trips Taken</div>
            </div>
            <div className="profile-stat-box">
              <div className="stat-number">{ridesGiven}</div>
              <div className="stat-text">Rides Given</div>
            </div>
          </div>
        </div>

        {/* My Needs Card */}
        <div className="profile-needs-card">
          <div className="profile-card-header">
            <h3>My Needs</h3>
            <button className="profile-edit-btn orange-edit">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/></svg>
              Edit
            </button>
          </div>
          <div className="profile-pill-wrap">
            {prefs.map(p => (
              <span key={p} className="profile-pill">{prefLabels[p] || p}</span>
            ))}
          </div>
        </div>

        {/* Vehicle Details Card */}
        <div className="profile-vehicle-card">
          <div className="profile-card-header">
            <h3>Vehicle Details</h3>
            <button className="profile-edit-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/></svg>
              Edit
            </button>
          </div>
          <div className="vehicle-details-body">
            <div className="vehicle-image-container">
              <img src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=300" alt="White SUV" />
            </div>
            <div className="vehicle-specs-table">
              <div className="spec-row">
                <span className="spec-label">Vehicle</span>
                <span className="spec-val">Car</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Brand</span>
                <span className="spec-val">Toyota</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Color</span>
                <span className="spec-val">Dark Gray</span>
              </div>
              <div className="spec-row" style={{borderBottom: 'none', paddingBottom: 0}}>
                <span className="spec-label">Model</span>
                <span className="spec-val">Sienna 2025 V1</span>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Specifications */}
        <div className="profile-specs-card">
          <div className="profile-card-header">
            <h3>Vehicle Specifications</h3>
            <button className="profile-edit-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/></svg>
              Edit
            </button>
          </div>
          <div className="profile-pill-wrap">
            {vehicleSpecs.map(s => (
              <span key={s} className="profile-pill">{s}</span>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
}
