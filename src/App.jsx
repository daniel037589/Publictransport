import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import HomePage from './components/HomePage';
import Navbar from './components/Navbar';
import { GetRideScreen } from './components/GetRide';
import { GiveRideScreen } from './components/GiveRide';
import { ProfileScreen } from './components/Profile';
import { MyTripsScreen } from './components/MyTrips';
import { OnboardingScreen } from './components/Onboarding';
import { CommunitiesScreen } from './components/Community';
import './index.css';

const INITIAL_RIDERS = [
  // Keeping initial mockup data ...
  {
    id: 'sarah',
    name: 'Sarah',
    initial: 'S',
    distance: '1 km away',
    timeframe: 'Needs ride now',
    destination: 'Weesp Train Station',
    location: [52.3094, 5.0392],
    destinationLocation: [52.3134, 5.0425],
    color: '#1164fd',
    badges: [
      { icon: '👶', text: 'With Stroller', color: 'blue' },
      { icon: '💺', text: '2 Seats Needed', color: 'grey' }
    ]
  }
];

const serializeForDb = (rider) => ({
  id: String(rider.id),
  name: rider.name,
  initial: rider.initial,
  distance: rider.distance,
  timeframe: rider.timeframe,
  destination: rider.destination,
  location: rider.location,
  destination_location: rider.destinationLocation,
  route_geometry: rider.routeGeometry || null,
  color: rider.color,
  badges: rider.badges,
  avatar_url: rider.avatarUrl,
  status: rider.status || 'pending',
  driver_name: rider.driverName || null
});

const deserializeFromDb = (row) => ({
  id: row.id,
  name: row.name,
  initial: row.initial,
  distance: row.distance,
  timeframe: row.timeframe,
  destination: row.destination,
  location: row.location,
  destinationLocation: row.destination_location,
  routeGeometry: row.route_geometry || null,
  color: row.color,
  badges: row.badges,
  avatarUrl: row.avatar_url,
  status: row.status || 'pending',
  driverName: row.driver_name || null
});

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [riders, setRiders] = useState(INITIAL_RIDERS);
  const [userProfile, setUserProfile] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Check if user has executed local boarding flow before
    const stored = localStorage.getItem('weesp_user_profile');
    if (stored) {
      setUserProfile(JSON.parse(stored));
    }
    setIsInitializing(false);

    // Initialize historic Supabase rides
    const fetchExistingRides = async () => {
      const { data, error } = await supabase.from('ride_requests').select('*');
      if (!error && data) {
        const dbRiders = data.map(deserializeFromDb);
        setRiders(prev => {
          const merged = [...prev];
          dbRiders.forEach(dbR => {
            if (!merged.some(p => p.id === dbR.id)) merged.push(dbR);
          });
          return merged;
        });
      }
    };
    
    fetchExistingRides();

    // Supabase Live Websockets
    const channel = supabase
      .channel('public-ride_requests-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'ride_requests' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const incomingRider = deserializeFromDb(payload.new);
            setRiders(prev => {
              if (prev.some(r => r.id === incomingRider.id)) return prev;
              return [...prev, incomingRider];
            });
          } else if (payload.eventType === 'DELETE') {
            setRiders(prev => prev.filter(r => String(r.id) !== String(payload.old.id)));
          } else if (payload.eventType === 'UPDATE') {
            const updatedRider = deserializeFromDb(payload.new);
            setRiders(prev => prev.map(r => r.id === updatedRider.id ? updatedRider : r));
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const handleNavigate = (path) => setActiveTab(path);

  const handleAddRider = async (newRider) => {
    setRiders(prev => [...prev, newRider]);
    setActiveTab('give-ride'); 
    const record = serializeForDb(newRider);
    const { error } = await supabase.from('ride_requests').insert([record]);
    if (error) console.error("Failed to push request to Supabase!", error.message);
  };

  const handleDeleteRide = async (rideId) => {
    setRiders(prev => prev.filter(r => String(r.id) !== String(rideId)));
    const { error } = await supabase.from('ride_requests').delete().eq('id', String(rideId));
    if (error) console.error("Failed to delete request from Supabase!", error.message);
  };

  const handleOfferRide = async (rideId) => {
    // Optimistic local UI update
    setRiders(prev => prev.map(r => r.id === rideId ? { ...r, status: 'ongoing', driverName: userProfile.name } : r));
    setActiveTab('trips');
    
    const { error } = await supabase.from('ride_requests')
      .update({ status: 'ongoing', driver_name: userProfile.name })
      .eq('id', String(rideId));
      
    if (error) console.error("Failed to update request in Supabase!", error.message);
  };

  const handleCancelOffer = async (rideId) => {
    // Reverts an actively driven ride back into the pending global queue
    setRiders(prev => prev.map(r => r.id === rideId ? { ...r, status: 'pending', driverName: null } : r));
    
    const { error } = await supabase.from('ride_requests')
      .update({ status: 'pending', driver_name: null })
      .eq('id', String(rideId));
      
    if (error) console.error("Failed to cancel offer in Supabase!", error.message);
  };

  if (isInitializing) return null;

  // Intercept the entire layout with boarding flow if identity is missing
  if (!userProfile) {
    return <OnboardingScreen onComplete={setUserProfile} />;
  }

  return (
    <div className="app-shell">
      <div className={`screen ${activeTab === 'home' ? 'screen--active' : 'screen--hidden-left'}`}>
        <HomePage onNavigate={handleNavigate} />
      </div>

      <div className={`screen ${(activeTab === 'get-ride' || activeTab === 'give-ride') ? 'screen--active' : 'screen--hidden-right'}`} style={{ zIndex: 100 }}>
        {activeTab === 'get-ride' && <GetRideScreen onBack={() => setActiveTab('home')} onRequestRide={handleAddRider} userProfile={userProfile} />}
        {activeTab === 'give-ride' && <GiveRideScreen onBack={() => setActiveTab('home')} riders={riders} onOfferRide={handleOfferRide} />}
      </div>

      <div className={`screen ${activeTab === 'trips' ? 'screen--active' : 'screen--hidden-right'}`}>
        <MyTripsScreen riders={riders} onDeleteRide={handleDeleteRide} onCancelOffer={handleCancelOffer} userProfile={userProfile} />
      </div>

      <div className={`screen ${activeTab === 'community' ? 'screen--active' : 'screen--hidden-right'}`}>
        <CommunitiesScreen />
      </div>

      <div className={`screen ${activeTab === 'profile' ? 'screen--active' : 'screen--hidden-right'}`}>
        <ProfileScreen userProfile={userProfile} onLogout={() => {
          localStorage.removeItem('weesp_user_profile');
          setUserProfile(null);
        }} />
      </div>

      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;
