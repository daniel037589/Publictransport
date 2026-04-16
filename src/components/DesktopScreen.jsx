import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './DesktopScreen.css';

const EMPTY_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23C0C0C2'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

const IGNORED_NAMES = ['ipad', 'desktop', 'admin'];

export default function DesktopScreen({ supabase }) {
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  const isIgnored = (name) => {
    if (!name) return false;
    return IGNORED_NAMES.includes(name.toLowerCase().trim());
  };

  // 1. Fetch ALL existing members from memory (Supabase)
  useEffect(() => {
    const fetchMembers = async () => {
      console.log("Fetching existing community members...");
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) {
        console.error("Initial Fetch Error:", error.message, error.details);
        return;
      }

      if (data) {
        console.log("Fetched raw data:", data);
        const fetchedMembers = data
          .map(m => m.profile_data)
          .filter(m => m && m.name && !isIgnored(m.name))
          .reverse();
        
        console.log("Setting members after filter:", fetchedMembers);
        setMembers(fetchedMembers);
      }
    };
    fetchMembers();
  }, [supabase]);

  // 2. Real-time subscription for new members
  useEffect(() => {
    console.log("Channel: Subscribing to profiles...");
    const channel = supabase
      .channel('member-updates-v2')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'profiles' }, 
        (payload) => {
          console.log("REALTIME PAYLOAD ARRIVED:", payload);
          
          const profile = payload.new ? payload.new.profile_data : null;
          
          if (profile && !isIgnored(profile.name)) {
            console.log("Triggering overlay for:", profile.name);
            setNewMember(profile);
            setShowOverlay(true);

            setMembers(prev => {
              const exists = prev.some(m => m.name === profile.name);
              if (exists) {
                return prev.map(m => m.name === profile.name ? profile : m);
              }
              return [profile, ...prev];
            });

            setTimeout(() => {
              setShowOverlay(false);
            }, 6000);
          } else {
            console.log("Payload ignored or missing profile_data. New:", payload.new);
          }
        }
      )
      .subscribe((status) => {
        console.log("Subscription status updated:", status);
        setConnectionStatus(status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const testAnimation = () => {
    const testUser = { name: "Test User", age: 25, avatarUrl: EMPTY_AVATAR };
    setNewMember(testUser);
    setShowOverlay(true);
    setTimeout(() => setShowOverlay(false), 6000);
  };

  return (
    <div className="desktop-screen">
      <div className={`connection-status ${connectionStatus}`}>
        {connectionStatus === 'SUBSCRIBED' ? '● Live' : '○ Connecting...'}
        <button onClick={testAnimation} className="debug-btn">Test Animation</button>
      </div>

      <div className={`desktop-main-content ${showOverlay ? 'blur' : ''}`}>
        <header className="desktop-header">
          <div className="desktop-logo-group">
            <img src="/logo.png" alt="Ons Kortenhoef" className="desktop-logo-large" />
            <div className="desktop-header-text">
              <span className="desktop-header-label">Your Community</span>
              <h1 className="desktop-header-title">Ons Kortenhoef</h1>
            </div>
          </div>
        </header>

        <main className="desktop-content">
          <div className="member-grid">
            {/* Show a placeholder if the grid is totally empty */}
            {members.length === 0 && (
               <div className="member-avatar-large empty-state" style={{ backgroundImage: `url("${EMPTY_AVATAR}")` }} />
            )}
            
            {members.map((member, idx) => (
              <motion.div 
                key={`${member.name}-${idx}`}
                layout
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="member-card"
              >
                {member.avatarUrl ? (
                  <img src={member.avatarUrl} alt={member.name} className="member-avatar-large" />
                ) : (
                  <div className="member-avatar-large empty-state" style={{ backgroundImage: `url("${EMPTY_AVATAR}")` }} />
                )}
                <span className="member-card-name" style={{ marginTop: '12px', fontSize: '18px', fontWeight: '500', color: '#1a1a1a' }}>{member.name}</span>
              </motion.div>
            ))}
          </div>
        </main>
      </div>

      <AnimatePresence>
        {showOverlay && newMember && (
          <motion.div 
            className="desktop-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="overlay-bg-dim" />
            
            <motion.div 
              className="join-announcement"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
            >
              <h2 className="join-announcement-title">A new community member has joined</h2>
              
              <div className="join-profile-card">
                <div className="join-avatar-massive" style={{ backgroundImage: `url(${newMember.avatarUrl || EMPTY_AVATAR})` }} />
                <div className="join-info">
                  <span className="join-name">{newMember.name}</span>
                  <span className="join-age">{newMember.age ? `${newMember.age} Years Old` : ''}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
