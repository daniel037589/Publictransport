import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import './Onboarding.css';

const PREFERENCES = [
  { id: 'entry', label: 'Vehicle entry help', icon: <img src="/icons/entry.svg" style={{width: 24, height: 24}} alt="Entry" /> },
  { id: 'stroller', label: 'Needs stroller space', icon: <img src="/icons/stroller.svg" style={{width: 24, height: 24}} alt="Stroller" /> },
  { id: 'newborn', label: 'Has newborn', icon: <img src="/icons/newborn.svg" style={{width: 24, height: 24}} alt="Newborn" /> },
  { id: 'walker', label: 'Needs walker space', icon: <img src="/icons/walker.svg" style={{width: 24, height: 24}} alt="Walker" /> },
];

const LANGUAGES = [
  { id: 'nl', label: 'Nederlands', flag: '🇳🇱' },
  { id: 'en', label: 'English', flag: '🇬🇧' },
  { id: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { id: 'fa', label: 'Farsi فارسی', flag: <span style={{ fontSize: '8px', opacity: 0.8, maxWidth: '100px', display: 'inline-block', textAlign: 'center', lineHeight: '1.2' }}>ببخشید، نتونستم ایموجی درست رو پیدا کنم. با عشق و بهترین آرزوها از طرف دنیل.</span> },
];

function calculateAge(birthdate) {
  const birth = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export function OnboardingScreen({ onComplete }) {
  const [formData, setFormData] = useState({
    name: '',
    birthdate: '1990-01-01',
    languages: [],
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

  const toggleLanguage = (langId) => {
    setFormData(prev => {
      const isSelected = prev.languages.includes(langId);
      if (isSelected) {
        return { ...prev, languages: prev.languages.filter(l => l !== langId) };
      } else {
        return { ...prev, languages: [...prev.languages, langId] };
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert("Please enter your name!");
    
    // Check if user exists in the cloud to sync down
    const { data: existing } = await supabase
      .from('profiles')
      .select('profile_data')
      .eq('name', formData.name.trim())
      .single();

    if (existing && existing.profile_data) {
      // Restore profile from cloud across devices!
      localStorage.setItem('weesp_user_profile', JSON.stringify(existing.profile_data));
      onComplete(existing.profile_data);
      return;
    }

    // New profile logic
    const profileData = {
      ...formData,
      name: formData.name.trim(),
      age: formData.birthdate ? calculateAge(formData.birthdate) : null,
    };
    
    localStorage.setItem('weesp_user_profile', JSON.stringify(profileData));
    
    // Persist to Supabase
    await supabase.from('profiles').upsert({
      name: profileData.name,
      profile_data: profileData
    });

    onComplete(profileData);
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
        <h1 className="onboarding-title">Welcome to Uit & thuis</h1>
        <p className="onboarding-subtitle">Let's map out your community profile.</p>
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

          <div>
            <label className="form-label" htmlFor="birthdate">Birthdate</label>
            <input 
              id="birthdate"
              className="form-input" 
              type="date" 
              value={formData.birthdate}
              onChange={e => setFormData({...formData, birthdate: e.target.value})}
            />
            {formData.birthdate && (
              <span style={{ fontSize: '13px', color: 'var(--color-text-nav)', marginTop: '6px', marginLeft: '16px', display: 'block' }}>
                Age: {calculateAge(formData.birthdate)} years old
              </span>
            )}
          </div>
        </div>

        <div className="onboarding-card">
          <label className="form-label" style={{ marginBottom: '16px' }}>I speak...</label>
          <div className="preferences-grid">
            {LANGUAGES.map(lang => (
              <div 
                key={lang.id}
                className={`pref-toggle ${formData.languages.includes(lang.id) ? 'pref-toggle--active' : ''}`}
                onClick={() => toggleLanguage(lang.id)}
              >
                <span className="pref-icon">{lang.flag}</span>
                <span>{lang.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="onboarding-card">
          <label className="form-label" style={{ marginBottom: '16px' }}>Needs</label>
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
