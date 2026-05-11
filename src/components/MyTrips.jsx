import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage, t } from '../LanguageContext';
import './MyTrips.css';
import { supabase } from '../supabaseClient';

export function MyTripsScreen({ riders, onDeleteRide, onCancelOffer, userProfile, onViewOffer }) {
  const lang = useLanguage();
  const [activeTab, setActiveTab] = useState('Active');
  const [adminProfiles, setAdminProfiles] = useState([]);

  const isAdmin = userProfile?.name && userProfile.name.toLowerCase() === 'admin';

  useEffect(() => {
    if (isAdmin) {
      const fetchProfiles = async () => {
        const { data } = await supabase.from('profiles').select('name');
        if (data) {
          setAdminProfiles(data.filter(p => !['admin', 'ipad', 'desktop'].includes(p.name?.toLowerCase())));
        }
      };
      fetchProfiles();
    }
  }, [isAdmin]);

  const handleDeleteProfile = async (profileName) => {
    await supabase.from('ride_requests').delete().eq('name', profileName);
    await supabase.from('profiles').delete().eq('name', profileName);
    setAdminProfiles(prev => prev.filter(p => p.name !== profileName));
  };

  // Map existing data to UI categories
  const activeTrips = riders.filter(r => {
    if (r.status === 'completed' || r.status === 'cancelled') return false;
    if (isAdmin) return true;
    return r.name === userProfile?.name || r.driverName === userProfile?.name;
  });

  const scheduledTrips = riders.filter(r => false); // Disable scheduled if we just show everything active
  const historyTrips = []; // Empty for now

  const tabs = ['Active', 'Scheduled', 'History'];

  const getVisibleTrips = () => {
    switch (activeTab) {
      case 'Active': return activeTrips;
      case 'Scheduled': return scheduledTrips;
      case 'History': return historyTrips;
      default: return [];
    }
  };

  const visibleTrips = getVisibleTrips();
  const adminTrips = isAdmin ? visibleTrips : [];
  const myRequests = isAdmin ? [] : visibleTrips.filter(t => t.name === userProfile?.name);
  const ridesIHelp = isAdmin ? [] : visibleTrips.filter(t => t.driverName === userProfile?.name && t.name !== userProfile?.name);

  return (
    <motion.div 
      className="trips-screen"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <header className="trips-header">
        <div className="trips-community">
          <div className="trips-community-icon">
            <img src="/logo.png" alt="Community logo" />
          </div>
          <div className="trips-community-info">
            <span className="trips-community-label">{t('Your Community', lang)}</span>
            <span className="trips-community-name">Ons Kortenhoef</span>
          </div>
        </div>

        <div className="trips-tabs">
          {tabs.map(tab => (
            <button 
              key={tab}
              className={`trips-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {t(tab, lang)}
            </button>
          ))}
        </div>
      </header>

      <div className="trips-content">
        {visibleTrips.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--color-text-nav)', opacity: 0.6 }}>
            <p>No {activeTab.toLowerCase()} trips found.</p>
          </div>
        ) : (
          <>
            {isAdmin && (
              <div className="trips-date-group" style={{ marginBottom: '24px' }}>
                <h2 className="trips-date-header" style={{ marginBottom: '12px' }}>Admin - Community Profiles</h2>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {adminProfiles.length === 0 ? <p style={{opacity: 0.5}}>No community profiles found.</p> : adminProfiles.map(p => (
                    <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'white', borderRadius: '8px', border: '1px solid #e1e1e3' }}>
                      <span style={{ fontWeight: 500 }}>{p.name}</span>
                      <button 
                        onClick={() => handleDeleteProfile(p.name)}
                        style={{ color: '#ff3b30', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isAdmin && adminTrips.length > 0 && (
              <div className="trips-date-group">
                <h2 className="trips-date-header" style={{ marginBottom: '12px' }}>Admin Overview (All Rides)</h2>
                <AnimatePresence>
                  {adminTrips.map(trip => (
                    <TripCard 
                      key={trip.id} 
                      trip={trip} 
                      isDriving={trip.driverName === userProfile?.name}
                      onAction={() => onDeleteRide(trip.id)}
                      onViewOffer={onViewOffer}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}

            {myRequests.length > 0 && (
              <div className="trips-date-group">
                <h2 className="trips-date-header" style={{ marginBottom: '12px' }}>Your Requests</h2>
                <AnimatePresence>
                  {myRequests.map(trip => (
                    <TripCard 
                      key={trip.id} 
                      trip={trip} 
                      isDriving={trip.driverName === userProfile?.name}
                      onAction={() => onDeleteRide(trip.id)}
                      onViewOffer={onViewOffer}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}

            {ridesIHelp.length > 0 && (
              <div className="trips-date-group" style={{ marginTop: '24px' }}>
                <h2 className="trips-date-header" style={{ marginBottom: '12px' }}>Rides you help with</h2>
                <AnimatePresence>
                  {ridesIHelp.map(trip => (
                    <TripCard 
                      key={trip.id} 
                      trip={trip} 
                      isDriving={trip.driverName === userProfile?.name}
                      onAction={() => onCancelOffer(trip.id)}
                      onViewOffer={onViewOffer}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}

import { GiveRideCard } from './GiveRide';

export function TripCard({ trip, isDriving, onAction, onViewOffer }) {
  const isOffered = trip.status === 'offered';
  const isOngoing = trip.status === 'ongoing';
  const isPending = trip.status === 'pending';

  const [fetchedDriverAvatar, setFetchedDriverAvatar] = useState(null);
  const [fetchedRiderAvatar, setFetchedRiderAvatar] = useState(null);

  useEffect(() => {
    if (trip.driverName) {
      supabase.from('profiles').select('profile_data').eq('name', trip.driverName).single().then(({ data }) => {
        if (data && data.profile_data?.avatarUrl) {
          setFetchedDriverAvatar(data.profile_data.avatarUrl);
        }
      });
    }
    if (trip.name && !trip.avatarUrl) {
      supabase.from('profiles').select('profile_data').eq('name', trip.name).single().then(({ data }) => {
        if (data && data.profile_data?.avatarUrl) {
          setFetchedRiderAvatar(data.profile_data.avatarUrl);
        }
      });
    }
  }, [trip.driverName, trip.name, trip.avatarUrl]);

  const finalRiderAvatar = trip.avatarUrl || fetchedRiderAvatar;
  const finalDriverAvatar = fetchedDriverAvatar;

  const topName = isDriving ? trip.name : "You";
  const topNameOngoing = isDriving ? `You with ${trip.name}` : `You with ${trip.driverName}`;

  let borderColor = '#e1e1e3';
  let borderWidth = '1px';
  if (isOffered) {
    borderColor = '#f08a4b';
    borderWidth = '8px';
  } else if (isOngoing) {
    borderColor = '#bbcd2f';
    borderWidth = '8px';
  }

  let statusText = "Ride Requested";
  let statusBg = "white";
  let statusColor = "#1a1a1a";
  let statusBorder = "1px solid #e1e1e3";

  if (isOffered) {
    statusText = "Approval Needed";
    statusBg = "#f08a4b";
    statusBorder = "none";
  } else if (isOngoing) {
    statusText = "Ride Accepted";
    statusBg = "#bbcd2f";
    statusBorder = "none";
  }

  const needsApproval = isOffered && !isDriving;
  
  let dateText = "Fri, 27 Mar";
  let timeText = "14:00";
  if (trip.timeframe) {
     const parts = trip.timeframe.split(' ');
     if (parts.length > 0) {
       const reqDate = new Date(parts[0]);
       if (!isNaN(reqDate.getTime())) {
          dateText = reqDate.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
       }
       if (parts.length > 1) {
          timeText = parts.slice(1).join(' ');
       }
     }
  }

  const needsList = trip.preferences && trip.preferences.length > 0 ? trip.preferences : ['entry'];
  const prefMap = {
    'entry': 'Vehicle entry help',
    'stroller': 'Needs stroller space',
    'newborn': 'Has newborn',
    'walker': 'Needs walker space'
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      style={{
        background: 'white',
        borderRadius: '24px',
        border: `${borderWidth} solid ${borderColor}`,
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '16px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          
          {isOngoing ? (
             <div style={{ display: 'flex', position: 'relative', width: 64, height: 40 }}>
                <img src={finalRiderAvatar || `https://ui-avatars.com/api/?name=${trip.name}&background=random`} style={{ width: 40, height: 40, borderRadius: '50%', position: 'absolute', left: 0, zIndex: 2, border: '2px solid white' }} alt="rider" />
                <img src={finalDriverAvatar || `https://ui-avatars.com/api/?name=${trip.driverName}&background=random`} style={{ width: 40, height: 40, borderRadius: '50%', position: 'absolute', left: 24, zIndex: 1, border: '2px solid white' }} alt="driver" />
             </div>
          ) : (
             <img src={finalRiderAvatar || `https://ui-avatars.com/api/?name=${trip.name}&background=random`} style={{ width: 40, height: 40, borderRadius: '50%' }} alt="user" />
          )}

          <div style={{ display: 'flex', flexDirection: 'column' }}>
             <span style={{ fontWeight: 600, fontSize: '16px', color: '#1a1a1a', lineHeight: '20px' }}>
               {isOngoing ? topNameOngoing : topName}
             </span>
             <span style={{
               background: statusBg,
               border: statusBorder,
               borderRadius: '24px',
               padding: '2px 8px',
               fontSize: '12px',
               fontWeight: 500,
               color: statusColor,
               width: 'fit-content',
               marginTop: '4px'
             }}>
               {statusText}
             </span>
          </div>
        </div>

        <motion.button 
           onClick={onAction}
           whileTap={{ scale: 0.95 }}
           style={{
             border: '1px solid #ff3b30',
             background: 'transparent',
             color: '#ff3b30',
             borderRadius: '9999px',
             padding: '8px 16px',
             fontWeight: 500,
             fontSize: '14px',
             cursor: 'pointer'
           }}
        >
          Cancel Ride
        </motion.button>
      </div>

      <div style={{ height: 1, background: '#e1e1e3', margin: '4px 0' }} />

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {needsList.map((pref, i) => (
           <span key={i} style={{
             border: '1px solid #e1e1e3',
             borderRadius: '9999px',
             padding: '4px 12px',
             fontSize: '12px',
             fontWeight: 500,
             display: 'flex',
             alignItems: 'center',
             gap: '4px'
           }}>
             {prefMap[pref] || pref}
           </span>
        ))}
      </div>

      <div style={{ fontWeight: 500, fontSize: '16px', color: '#1a1a1a', marginTop: '4px' }}>
        {dateText}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', marginTop: '8px' }}>
        <div style={{ position: 'absolute', left: '7px', top: '16px', bottom: '16px', width: '2px', background: '#e1e1e3' }} />
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '4px solid #f08a4b', background: 'white', zIndex: 1, marginTop: '2px' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 600, fontSize: '14px', color: '#1a1a1a' }}>Pickup at {timeText}</span>
            <span style={{ fontSize: '12px', color: '#707072' }}>{trip.pickup || 'Kerklaan 15'}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '4px solid #bbcd2f', background: 'white', zIndex: 1, marginTop: '2px' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 600, fontSize: '14px', color: '#1a1a1a' }}>Drop-off</span>
            <span style={{ fontSize: '12px', color: '#707072' }}>{trip.destination || 'Noordereinde 42'}</span>
          </div>
        </div>
      </div>

      {needsApproval && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '160px',
          background: 'linear-gradient(to top, rgba(240, 138, 75, 1) 0%, rgba(240, 138, 75, 0.8) 40%, rgba(240, 138, 75, 0) 100%)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          paddingBottom: '24px',
          zIndex: 10
        }}>
          <motion.button 
            onClick={(e) => { e.stopPropagation(); onViewOffer && onViewOffer({ ...trip, driverAvatarUrl: finalDriverAvatar }); }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: 'white',
              color: '#1a1a1a',
              border: 'none',
              borderRadius: '9999px',
              padding: '12px 24px',
              fontWeight: 600,
              fontSize: '16px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              width: '200px'
            }}
          >
            See offer
          </motion.button>
        </div>
      )}

    </motion.div>
  );
}
