import './RideScreens.css';

function BackIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 12H5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CommunityShieldIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" fill="var(--color-brand-blue)" fillOpacity="0.2" stroke="var(--color-brand-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 12L11 14L15 10" stroke="var(--color-brand-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function GetRideScreen({ onBack, onRequestRide, userProfile }) {
  const PREF_MAP = {
    'wheelchair': { icon: '♿️', text: 'Wheelchair Assist', color: 'blue' },
    'stroller': { icon: '👶', text: 'Stroller', color: 'blue' },
    'pets': { icon: '🐾', text: 'Pet Friendly', color: 'grey' },
    'quiet': { icon: '🤫', text: 'Quiet Ride', color: 'grey' }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const destination = formData.get('dropoff') || 'Somewhere in Weesp';
    
    // Simulate some logic for a new request
    const newLocation = [52.3082 + (Math.random() - 0.5)*0.015, 5.0416 + (Math.random() - 0.5)*0.015];
    const dropoffLocation = [52.3082 + (Math.random() - 0.5)*0.015, 5.0416 + (Math.random() - 0.5)*0.015];

    const mappedBadges = (userProfile?.preferences || []).map(p => PREF_MAP[p]).filter(Boolean);

    const newRider = {
      id: 'you-' + Date.now(),
      name: userProfile ? userProfile.name : 'You',
      initial: userProfile ? userProfile.name.charAt(0).toUpperCase() : 'Y',
      distance: '0 km away',
      timeframe: 'Needs ride now',
      destination: destination,
      location: newLocation,
      destinationLocation: dropoffLocation,
      color: '#ffc085', // warm orange
      badges: [
        { icon: '📍', text: 'Ready', color: 'blue' },
        ...mappedBadges
      ],
      avatarUrl: userProfile?.avatarUrl,
      status: 'pending'
    };

    if(onRequestRide) onRequestRide(newRider);
  };

  return (
    <div className="ride-screen">
      <header className="ride-header">
        <button className="btn-back" type="button" onClick={onBack} aria-label="Go back">
          <BackIcon />
        </button>
        <h1 className="ride-title">Get a Ride</h1>
      </header>
      
      <p className="ride-subtitle">
        Heading somewhere? Connect with neighbors who are already driving your way.
      </p>

      <form className="ride-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="pickup">Pick-up Location</label>
          <input className="form-input" id="pickup" name="pickup" type="text" placeholder="e.g. Town Hall or your address" />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="dropoff">Where to?</label>
          <input className="form-input" id="dropoff" name="dropoff" type="text" placeholder="Destination address" required />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="time">When</label>
          <input className="form-input" id="time" name="time" type="time" defaultValue="08:30" />
        </div>

        <div className="community-notice">
          <CommunityShieldIcon />
          <p><strong>Community Trust:</strong> You match with verified locals and neighbors. It’s about sharing, not just riding.</p>
        </div>

        <button className="btn-primary" type="submit" style={{ marginTop: '32px' }}>
          Find a Neighbor
        </button>
      </form>
    </div>
  );
}
