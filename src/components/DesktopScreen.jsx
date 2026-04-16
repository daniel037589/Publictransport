import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './DesktopScreen.css';

const STANDARD_MEMBER = { id: 'admin', name: 'Johan G.', age: 42, avatarUrl: 'https://i.pravatar.cc/150?img=12' };

export default function DesktopScreen({ supabase }) {
  const [members, setMembers] = useState([STANDARD_MEMBER]);
  const [newMember, setNewMember] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);

  // 1. Fetch existing members
  useEffect(() => {
    const fetchMembers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('id', { ascending: false });
      
      if (!error && data) {
        const dbMembers = data.map(m => m.profile_data);
        setMembers(prev => {
          const merged = [...prev];
          dbMembers.forEach(m => {
            if (!merged.some(p => p.id === m.id)) merged.push(m);
          });
          return merged;
        });
      }
    };
    fetchMembers();
  }, [supabase]);

  // 2. Real-time subscription for new members
  useEffect(() => {
    console.log("Setting up Supabase Realtime subscription for 'profiles' table...");
    
    // Listen for ALL changes (INSERT/UPDATE/UPSERT)
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'profiles' 
        }, 
        (payload) => {
          console.log("Realtime Change Detected:", payload);
          const joinedPerson = payload.new?.profile_data;
          
          if (joinedPerson) {
            setNewMember(joinedPerson);
            setShowOverlay(true);

            // Add to list and close overlay after delay
            setTimeout(() => {
              setMembers(prev => {
                // Prevent duplicates if it was an update
                if (prev.some(p => p.id === joinedPerson.id)) return prev;
                return [joinedPerson, ...prev];
              });
              setShowOverlay(false);
            }, 6000);
          }
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <div className="desktop-screen">
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
            {members.length === 0 && <p style={{ color: '#707072', fontSize: '24px' }}>Waiting for community members...</p>}
            {members.map((member, idx) => (
              <motion.div 
                key={member.id || idx}
                layout
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="member-avatar-large"
                style={{ backgroundImage: `url(${member.avatarUrl || 'https://i.pravatar.cc/150?img=1'})` }}
              />
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
                <div className="join-avatar-massive" style={{ backgroundImage: `url(${newMember.avatarUrl || 'https://i.pravatar.cc/150?img=1'})` }} />
                <div className="join-info">
                  <span className="join-name">{newMember.name}</span>
                  <span className="join-age">{newMember.age || '—'} Years Old</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
