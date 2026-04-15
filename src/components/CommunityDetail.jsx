import { motion } from 'framer-motion';
import './CommunityDetail.css';

export function CommunityDetail({ community, onBack }) {
  if (!community) return null;

  return (
    <motion.div 
      className="community-detail"
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="detail-header">
        <img 
          src="https://images.unsplash.com/photo-1590483736622-39da8caf3501?auto=format&fit=crop&q=80&w=1000" 
          alt={community.name} 
          className="detail-header-img" 
        />
        <button className="detail-back-btn" onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#2D3320" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="detail-content">
        <div className="detail-logo-wrap">
          <img src="/logo.png" alt="Logo" style={{ width: '32px', height: '32px' }} />
        </div>

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
          <span className="detail-members-text">And 512+ people have joined</span>
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
            No pressure, no egos — just good rides and good company.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
