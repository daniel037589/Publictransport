import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import './Onboarding.css';

const PREFERENCES = [
  { id: 'wheelchair', label: 'Wheelchair Assist', icon: '♿️' },
  { id: 'stroller', label: 'Stroller Space', icon: '👶' },
  { id: 'pets', label: 'Pet Friendly', icon: '🐾' },
  { id: 'quiet', label: 'Quiet Ride', icon: '🤫' },
];

export function OnboardingScreen({ onComplete }) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    language: 'English',
    preferences: [],
    avatarUrl: null,
  });
  
  const fileInputRef = useRef(null);

  const togglePreference = (prefId) => {
    setFormData(prev => {
      const isSelected = prev.preferences.includes(prefId);
      if (isSelected) {
        return { ...prev, preferences: prev.preferences.filter(p => p !== prefId) };
      } else {
        return { ...prev, preferences: [...prev.preferences, prefId] };
      }
    });
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatarUrl: reader.result }));
      };
      reader.readAsDataURL(file); // Save as base64 string directly into local storage
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert("Please enter your name!");
    
    // Save to device local storage securely
    localStorage.setItem('weesp_user_profile', JSON.stringify(formData));
    onComplete(formData);
  };

  return (
    <motion.div 
      className="onboarding-container"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="onboarding-header">
        <h1 className="onboarding-title">Welcome to Weesp</h1>
        <p className="onboarding-subtitle">Let’s map out your community profile.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="avatar-upload-wrapper">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleAvatarUpload} 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
          />
          <motion.div 
            className="avatar-preview"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fileInputRef.current.click()}
            style={formData.avatarUrl ? { backgroundImage: `url(${formData.avatarUrl})` } : {}}
          >
            {!formData.avatarUrl && (formData.name ? formData.name.charAt(0).toUpperCase() : '+')}
          </motion.div>
          <span style={{ marginTop: 12, fontSize: 14, color: 'var(--color-brand-blue)', cursor: 'pointer' }} onClick={() => fileInputRef.current.click()}>
            Add Photo
          </span>
        </div>

        <div className="onboarding-card">
          <div>
            <label className="form-label" htmlFor="name">Your Name</label>
            <input 
              id="name"
              className="form-input" 
              type="text" 
              placeholder="e.g. Sarah"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label className="form-label" htmlFor="age">Age</label>
              <input 
                id="age"
                className="form-input" 
                type="number" 
                placeholder="25"
                value={formData.age}
                onChange={e => setFormData({...formData, age: e.target.value})}
              />
            </div>
            
            <div style={{ flex: 1 }}>
              <label className="form-label" htmlFor="lang">Language</label>
              <select 
                id="lang"
                className="form-select"
                value={formData.language}
                onChange={e => setFormData({...formData, language: e.target.value})}
              >
                <option value="English">English</option>
                <option value="Dutch">Nederlands</option>
              </select>
            </div>
          </div>
        </div>

        <div className="onboarding-card">
          <label className="form-label" style={{ marginBottom: '16px' }}>Ride Preferences</label>
          <div className="preferences-grid">
            {PREFERENCES.map(pref => (
              <div 
                key={pref.id}
                className={`pref-toggle ${formData.preferences.includes(pref.id) ? 'pref-toggle--active' : ''}`}
                onClick={() => togglePreference(pref.id)}
              >
                <span className="pref-icon">{pref.icon}</span>
                <span>{pref.label}</span>
              </div>
            ))}
          </div>
        </div>

        <motion.button 
          className="btn-primary"
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{ marginTop: '16px' }}
        >
          Join Community
        </motion.button>
      </form>
    </motion.div>
  );
}
