import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { supabase } from '../supabaseClient';
import './RideScreens.css';

export function RideOfferPopup({ offer, onAccept, onReject }) {
  const [driverProfile, setDriverProfile] = useState(null);

  useEffect(() => {
    if (offer?.driverName) {
      const fetchDriver = async () => {
        const { data } = await supabase
          .from('profiles')
          .select('profile_data')
          .eq('name', offer.driverName)
          .single();
        if (data) setDriverProfile(data.profile_data);
      };
      fetchDriver();
    }
  }, [offer]);

  if (!offer) return null;

  const driverName = offer.driverName || 'Someone';
  const driverAvatar = driverProfile?.avatarUrl;
  const message = offer.driverMessage || "Hey there! I could pick you up, would that work?";
  const pickupAddr = offer.pickup || 'Kerklaan 15';
  const dropoffAddr = offer.destination || 'Noordereinde 42';
  const requestedTime = offer.timeframe || '14:00-17:00';
  
  // Use driver's car specs if available, otherwise show a default or empty
  const defaultSpecs = ['Air Conditioning', 'Up to 4 Passengers'];
  const vehicleSpecs = driverProfile?.vehicleSpecs || defaultSpecs;

  const formatTimeframe = (tf) => {
    if (!tf) return { prefix: "Today at", time: "14:00-17:00" };
    
    // e.g. "2026-05-10 11:40"
    const parts = tf.split(' ');
    if (parts.length >= 2) {
      const dateStr = parts[0];
      const timeStr = parts.slice(1).join(' ');
      
      const reqDate = new Date(dateStr);
      if (!isNaN(reqDate.getTime())) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const isToday = reqDate.toDateString() === today.toDateString();
        const isTomorrow = reqDate.toDateString() === tomorrow.toDateString();
        
        let prefix = "Today at";
        if (isTomorrow) {
          prefix = "Tomorrow at";
        } else if (!isToday) {
          prefix = reqDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + " at";
        }
        
        return { prefix, time: timeStr };
      }
    }
    
    return { prefix: "Today at", time: tf };
  };

  const { prefix, time } = formatTimeframe(requestedTime);

  return createPortal(
    <AnimatePresence>
      <div className="gr-overlay" style={{ zIndex: 11000 }}>
        <motion.div 
          className="gr-sheet offer-popup"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          <button className="offer-close-x" onClick={() => onReject(offer.id)}>X</button>

          <div className="offer-header">
            <div className="offer-avatar-box">
              <div 
                className="offer-avatar" 
                style={driverAvatar ? { backgroundImage: `url(${driverAvatar})`, backgroundSize: 'cover' } : { backgroundColor: '#BBCD2F' }}
              >
                {!driverAvatar && <span>{driverName[0]}</span>}
              </div>
              <button className="offer-btn-profile">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                See Profile
              </button>
            </div>
            
            <div className="offer-right-column">
              <div className="offer-title-group">
                <h2 className="offer-driver-name">{driverName}</h2>
                <p className="offer-subtitle">has offered to help you!</p>
              </div>

              <div className="offer-message-bubble">
                <p>{message}</p>
              </div>

              <div className="offer-contacts">
                <div className="offer-contact-avatars">
                   <div className="mini-avatar" style={{ backgroundColor: '#2196F3' }}><img src="https://i.pravatar.cc/150?img=11" alt="contact" /></div>
                   <div className="mini-avatar" style={{ backgroundColor: '#FF9800' }}><img src="https://i.pravatar.cc/150?img=12" alt="contact" /></div>
                   <div className="mini-avatar" style={{ backgroundColor: '#4CAF50' }}><img src="https://i.pravatar.cc/150?img=13" alt="contact" /></div>
                </div>
                <span className="offer-contacts-text">10+ Shared Contacts</span>
              </div>
            </div>
          </div>

          <div className="gr-card-divider" style={{ marginTop: '12px', marginBottom: '12px' }} />

          <div className="gr-badges" style={{ margin: '0', gap: '12px' }}>
            {vehicleSpecs.map(spec => (
              <span key={spec} className="gr-badge-pill">{spec}</span>
            ))}
          </div>

          <div className="offer-time-row" style={{ fontWeight: 500, margin: '20px 0 16px 0' }}>
            {prefix} <strong style={{ fontWeight: 700 }}>{time}</strong>
          </div>

          <div className="gr-route">
            <div className="gr-route-row">
              <div className="gr-dot gr-dot--pickup" />
              <div className="gr-route-text">
                <p className="gr-route-label">3 min (1.2 km)</p>
                <p className="gr-route-address">{pickupAddr}</p>
              </div>
            </div>
            <div className="gr-route-line" />
            <div className="gr-route-row">
              <div className="gr-dot gr-dot--dropoff" />
              <div className="gr-route-text">
                <p className="gr-route-label">15 min (6 km)</p>
                <p className="gr-route-address">{dropoffAddr}</p>
              </div>
            </div>
          </div>

          <div className="gr-actions" style={{ marginTop: '16px', justifyContent: 'center' }}>
            <button className="gr-btn offer-btn--reject" onClick={() => onReject(offer.id)}>
              Reject
            </button>
            <button className="gr-btn offer-btn--confirm" onClick={() => onAccept(offer.id)}>
              Confirm
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
