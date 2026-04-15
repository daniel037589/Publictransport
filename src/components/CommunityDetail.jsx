import { motion } from 'framer-motion';
import './CommunityDetail.css';

export function CommunityDetail({ community, onBack }) {
  if (!community) return null;

  return (
    <div className="community-detail-overlay">
      <motion.div 
        className="community-detail-card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="detail-header">
          <img 
            src={community.image} 
            alt={community.name} 
            className="detail-header-img" 
          />
          <button className="detail-back-btn" onClick={onBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#2D3320" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <div className="detail-logo-badge">
            <div className={`community-item-logo ${community.logoClass} badge-style`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 9.5L12 3L21 9.5V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9.5Z" stroke="#2D3320" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 21V12H15V21" stroke="#2D3320" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="detail-content">
          <div className="detail-main-info">
            <div className="detail-title-section">
              <h1>{community.name}</h1>
              <div className="detail-location">
                <svg width="12" height="15" viewBox="0 0 10 13" fill="none">
                  <path d="M5 0.5C2.51472 0.5 0.5 2.51472 0.5 5C0.5 8.375 5 12.5 5 12.5C5 12.5 9.5 8.375 9.5 5C9.5 2.51472 7.48528 0.5 5 0.5ZM5 6.75C4.0335 6.75 3.25 5.9665 3.25 5C3.25 4.0335 4.0335 3.25 5 3.25C5.9665 3.25 6.75 4.0335 6.75 5C6.75 5.9665 5.9665 6.75 5 6.75Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{community.location}</span>
              </div>
            </div>
            <button className="detail-status-btn">Joined</button>
          </div>

          <div className="detail-members-stack">
            <div className="detail-avatars">
              {community.members.map((avatar, i) => (
                <div 
                  key={i} 
                  className="detail-avatar" 
                  style={{ backgroundImage: `url(${avatar})`, zIndex: 10 - i }}
                />
              ))}
            </div>
            <span className="detail-members-text">And {community.memberCount} people have joined</span>
          </div>

          <div className="detail-tabs">
            <button className="detail-tab active">Description</button>
            <button className="detail-tab">Members ({community.memberCount})</button>
          </div>

          <div className="detail-description">
            <p>
              A place for everyday riders who just love getting out there. 
              Share your routes, meet new friends, and enjoy the ride together.
            </p>
            <p>
              Whether you're riding to clear your mind, explore new corners of the city, 
              or chase weekly goals, this is your space to stay motivated and connected. 
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
