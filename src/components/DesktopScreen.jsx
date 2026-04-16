import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './DesktopScreen.css';

const INITIAL_MEMBERS = [
  { id: 1, name: 'Sara de Jong', age: 35, avatar: 'https://i.pravatar.cc/150?img=47' },
  { id: 2, name: 'Johan G.', age: 42, avatar: 'https://i.pravatar.cc/150?img=12' },
  { id: 3, name: 'Maria S.', age: 28, avatar: 'https://i.pravatar.cc/150?img=25' },
  { id: 4, name: 'Piet de V.', age: 51, avatar: 'https://i.pravatar.cc/150?img=33' },
  { id: 5, name: 'Anke K.', age: 31, avatar: 'https://i.pravatar.cc/150?img=19' },
  { id: 6, name: 'Bram T.', age: 39, avatar: 'https://i.pravatar.cc/150?img=15' },
];

export default function DesktopScreen() {
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [newMember, setNewMember] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);

  // Simulation: Someone joins every 20 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const nextId = members.length + 1;
      const joinedPerson = {
        id: nextId,
        name: `Member ${nextId}`,
        age: 20 + Math.floor(Math.random() * 40),
        avatar: `https://i.pravatar.cc/150?img=${(nextId % 70) + 1}`
      };
      
      setNewMember(joinedPerson);
      setShowOverlay(true);

      // Add to list after a short delay
      setTimeout(() => {
        setMembers(prev => [joinedPerson, ...prev]);
        setShowOverlay(false);
      }, 5000);

    }, 20000);

    return () => clearInterval(interval);
  }, [members]);

  return (
    <div className="desktop-screen">
      {/* Background Content (Blurred when overlay is active) */}
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
            {members.map(member => (
              <motion.div 
                key={member.id}
                layout
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="member-avatar-large"
                style={{ backgroundImage: `url(${member.avatar})` }}
              />
            ))}
          </div>
        </main>
      </div>

      {/* Join Overlay */}
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
                <div className="join-avatar-massive" style={{ backgroundImage: `url(${newMember.avatar})` }} />
                <div className="join-info">
                  <span className="join-name">{newMember.name}</span>
                  <span className="join-age">{newMember.age} Years Old</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
