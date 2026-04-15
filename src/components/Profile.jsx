import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import './Profile.css';

const ALL_LANGUAGES = [
  { id: 'nl', label: 'Nederlands', flag: '🇳🇱' },
  { id: 'en', label: 'English', flag: '🇬🇧' },
  { id: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { id: 'fa', label: 'Farsi فارسی', flag: <span style={{ fontSize: '8px', opacity: 0.8, maxWidth: '100px', display: 'inline-block', textAlign: 'center', lineHeight: '1.2', verticalAlign: 'middle' }}>ببخشید، نتونستم ایموجی درست رو پیدا کنم. با عشق و بهترین آرزوها از طرف دنیل.</span> },
];

const PREFS_CONFIG = [
  { id: 'entry', label: 'Vehicle entry help', icon: <img src="/icons/entry.svg" style={{width: 16, height: 16}} alt="Entry" /> },
  { id: 'stroller', label: 'Needs stroller space', icon: <img src="/icons/stroller.svg" style={{width: 16, height: 16}} alt="Stroller" /> },
  { id: 'newborn', label: 'Has newborn', icon: <img src="/icons/newborn.svg" style={{width: 16, height: 16}} alt="Newborn" /> },
  { id: 'walker', label: 'Needs walker space', icon: <img src="/icons/walker.svg" style={{width: 16, height: 16}} alt="Walker" /> },
];

export function ProfileScreen({ userProfile, onUpdateProfile, onLogout, riders = [] }) {
  const [isEditingNeeds, setIsEditingNeeds] = useState(false);
  const fileInputRef = useRef(null);

  const profileName = userProfile.name;
  const profileInitial = profileName.charAt(0).toUpperCase();
  const prefs = userProfile.preferences || [];
  const userLanguages = ALL_LANGUAGES.filter(l => (userProfile.languages || []).includes(l.id));
  const age = userProfile.age;

  // Derive stats
  const tripsTaken = riders?.filter(r => r.name === profileName && r.status === 'completed').length || 0;
  const ridesGiven = riders?.filter(r => r.driverName === profileName).length || 0;

  const vehicleSpecs = ['Air Conditioning', 'Up to 4 Passengers', 'Space for Baggage', 'Pets Friendly'];

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateProfile({ avatarUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const togglePreference = (prefId) => {
    const isSelected = prefs.includes(prefId);
    const newPrefs = isSelected ? prefs.filter(p => p !== prefId) : [...prefs, prefId];
    onUpdateProfile({ preferences: newPrefs });
  };

  return (
    <motion.div 
      className="profile-screen-new"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleAvatarUpload} 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
      />

      <div className="profile-content-new">
        
        {/* Main Info Card */}
        <div className="profile-info-card">
          <div className="profile-info-header">
            <div className="profile-identity">
              <div className="profile-avatar-stack">
                <div 
                  className="profile-avatar-circle"
                  onClick={() => fileInputRef.current.click()}
                  style={userProfile.avatarUrl ? { backgroundImage: `url(${userProfile.avatarUrl})`, cursor: 'pointer' } : { backgroundColor: '#e0e0e0', cursor: 'pointer' }}
                >
                  {!userProfile.avatarUrl ? profileInitial : ''}
                </div>
                <div className="profile-verified-pill">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/></svg>
                  Verified
                </div>
              </div>

              <div className="profile-text-info">
                <h2 className="profile-name-text">{profileName}</h2>
                <div className="profile-age-row">
                  {age ? <span>{age} Years Old</span> : <span>Age not set</span>}
                </div>
                <div className="profile-flags">
                  {userLanguages.slice(0, 3).map(lang => (
                    <span key={lang.id} className="flag-emoji">{lang.flag}</span>
                  ))}
                </div>
              </div>
            </div>

            <button className="profile-edit-btn" onClick={() => fileInputRef.current.click()}>
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
            <button className="profile-edit-btn orange-edit" onClick={() => setIsEditingNeeds(!isEditingNeeds)}>
              {isEditingNeeds ? (
                <>Done</>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/></svg>
                  Edit
                </>
              )}
            </button>
          </div>
          
          {isEditingNeeds ? (
            <div className="profile-pill-wrap">
              {PREFS_CONFIG.map(p => {
                const isActive = prefs.includes(p.id);
                return (
                  <span 
                    key={p.id} 
                    className="profile-pill" 
                    onClick={() => togglePreference(p.id)}
                    style={{ 
                      cursor: 'pointer',
                      border: isActive ? '2px solid #1a1a1a' : '1px solid #e1e1e3',
                      background: isActive ? '#f0f0f0' : 'white',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span style={{fontSize: '14px'}}>{p.icon}</span> {p.label}
                  </span>
                )
              })}
            </div>
          ) : (
            <div className="profile-pill-wrap">
              {prefs.length === 0 && <span style={{ fontSize: 13, color: '#1a1a1a', opacity: 0.7 }}>No specific needs defined</span>}
              {prefs.map(pId => {
                const conf = PREFS_CONFIG.find(c => c.id === pId);
                return conf ? (
                  <span key={pId} className="profile-pill" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{fontSize: '14px'}}>{conf.icon}</span> {conf.label}
                  </span>
                ) : null;
              })}
            </div>
          )}
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
              <img src="/car-profile.png" alt="Vehicle" />
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
        <div className="profile-specs-card" style={{ marginBottom: 20 }}>
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

        <button 
          onClick={onLogout}
          style={{ 
            width: '100%', 
            padding: '16px', 
            background: 'white', 
            color: '#ff3b30', 
            border: '1px solid #e1e1e3', 
            borderRadius: '16px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Delete Device Profile
        </button>

      </div>
    </motion.div>
  );
}
