import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLanguage, t } from '../LanguageContext';
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

export function ProfileScreen({ userProfile, onUpdateProfile, onLogout, onResetDevice, riders = [] }) {
  const lang = useLanguage();
  const [isEditingNeeds, setIsEditingNeeds] = useState(false);
  const [isEditingSpecs, setIsEditingSpecs] = useState(false);
  const fileInputRef = useRef(null);

  const profileName = userProfile.name;
  const profileInitial = profileName.charAt(0).toUpperCase();
  const prefs = userProfile.preferences || [];
  const userLanguages = ALL_LANGUAGES.filter(l => (userProfile.languages || []).includes(l.id));
  const age = userProfile.age;

  // Derive stats
  const tripsTaken = riders?.filter(r => r.name === profileName && r.status === 'completed').length || 0;
  const ridesGiven = riders?.filter(r => r.driverName === profileName).length || 0;

  const ALL_VEHICLE_SPECS = ['Air Conditioning', 'Up to 4 Passengers', 'Space for Baggage', 'Pets Friendly'];
  const vehicleSpecs = userProfile.vehicleSpecs || ALL_VEHICLE_SPECS;

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 300;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Compress heavily
        const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
        onUpdateProfile({ avatarUrl: dataUrl });
      };
    }
  };

  const togglePreference = (prefId) => {
    const isSelected = prefs.includes(prefId);
    const newPrefs = isSelected ? prefs.filter(p => p !== prefId) : [...prefs, prefId];
    onUpdateProfile({ preferences: newPrefs });
  };

  const toggleVehicleSpec = (spec) => {
    const isSelected = vehicleSpecs.includes(spec);
    const newSpecs = isSelected ? vehicleSpecs.filter(s => s !== spec) : [...vehicleSpecs, spec];
    onUpdateProfile({ vehicleSpecs: newSpecs });
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
                  {t('Verified', lang)}
                </div>
              </div>

              <div className="profile-text-info">
                <h2 className="profile-name-text">{profileName}</h2>
                <div className="profile-age-row">
                  {age ? <span>{age} {t('Years Old', lang)}</span> : <span>{t('Age not set', lang)}</span>}
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
              {t('Edit', lang)}
            </button>
          </div>

          <div className="profile-stats-grid">
            <div className="profile-stat-box">
              <div className="stat-number">{tripsTaken}</div>
              <div className="stat-text">{t('Trips Taken', lang)}</div>
            </div>
            <div className="profile-stat-box">
              <div className="stat-number">{ridesGiven}</div>
              <div className="stat-text">{t('Rides Given', lang)}</div>
            </div>
          </div>
        </div>

        {/* My Needs Card */}
        <div className="profile-needs-card">
          <div className="profile-card-header">
            <h3>{t('My Needs', lang)}</h3>
            <button className="profile-edit-btn orange-edit" onClick={() => setIsEditingNeeds(!isEditingNeeds)}>
              {isEditingNeeds ? (
                <>{t('Done', lang)}</>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/></svg>
                  {t('Edit', lang)}
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
                    <span style={{fontSize: '14px'}}>{p.icon}</span> {t(p.label, lang)}
                  </span>
                )
              })}
            </div>
          ) : (
            <div className="profile-pill-wrap">
              {prefs.length === 0 && <span style={{ fontSize: 13, color: '#1a1a1a', opacity: 0.7 }}>{t('No specific needs defined', lang)}</span>}
              {prefs.map(pId => {
                const conf = PREFS_CONFIG.find(c => c.id === pId);
                return conf ? (
                  <span key={pId} className="profile-pill" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{fontSize: '14px'}}>{conf.icon}</span> {t(conf.label, lang)}
                  </span>
                ) : null;
              })}
            </div>
          )}
        </div>

        {/* Vehicle Details Card */}
        <div className="profile-vehicle-card">
          <div className="profile-card-header">
            <h3>{t('Vehicle Details', lang)}</h3>
            <button className="profile-edit-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/></svg>
              {t('Edit', lang)}
            </button>
          </div>
          <div className="vehicle-details-body">
            <div className="vehicle-image-container">
              <img src="/car-profile.png" alt="Vehicle" />
            </div>
            <div className="vehicle-specs-table">
              <div className="spec-row">
                <span className="spec-label">{t('Vehicle', lang)}</span>
                <span className="spec-val">{t('Car', lang)}</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">{t('Brand', lang)}</span>
                <span className="spec-val">Toyota</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">{t('Color', lang)}</span>
                <span className="spec-val">{t('Dark Gray', lang)}</span>
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
            <h3>{t('Vehicle Specifications', lang)}</h3>
            <button className="profile-edit-btn orange-edit" onClick={() => setIsEditingSpecs(!isEditingSpecs)}>
              {isEditingSpecs ? (
                <>{t('Done', lang)}</>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/></svg>
                  {t('Edit', lang)}
                </>
              )}
            </button>
          </div>
          {isEditingSpecs ? (
            <div className="profile-pill-wrap">
              {ALL_VEHICLE_SPECS.map(s => {
                const isActive = vehicleSpecs.includes(s);
                return (
                  <span 
                    key={s} 
                    className="profile-pill" 
                    onClick={() => toggleVehicleSpec(s)}
                    style={{ 
                      cursor: 'pointer',
                      border: isActive ? '2px solid #1a1a1a' : '1px solid #e1e1e3',
                      background: isActive ? '#f0f0f0' : 'white'
                    }}
                  >
                    {t(s, lang)}
                  </span>
                );
              })}
            </div>
          ) : (
            <div className="profile-pill-wrap">
              {vehicleSpecs.length === 0 && <span style={{ fontSize: 13, color: '#1a1a1a', opacity: 0.7 }}>{t('No specifications added', lang)}</span>}
              {vehicleSpecs.map(s => (
                <span key={s} className="profile-pill">{t(s, lang)}</span>
              ))}
            </div>
          )}
        </div>

        <div className="profile-settings-card" style={{ marginBottom: 20 }}>
          <div className="profile-card-header">
            <h3>{t('Settings', lang)}</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
            <span style={{ fontWeight: 500 }}>{t('Language', lang)}</span>
            <button 
              onClick={() => onUpdateProfile({ language: lang === 'nl' ? 'en' : 'nl' })}
              style={{
                background: '#bbcd2f',
                border: 'none',
                borderRadius: '9999px',
                padding: '6px 12px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {lang === 'nl' ? '🇳🇱 NL' : '🇬🇧 EN'}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button 
            onClick={onResetDevice}
            style={{ 
              width: '100%', 
              padding: '16px', 
              background: '#2D3320', 
              color: 'white', 
              border: 'none', 
              borderRadius: '16px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {t('Start New Test Session', lang)}
          </button>
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
            {t('Delete Profile from Database', lang)}
          </button>
        </div>

      </div>
    </motion.div>
  );
}
