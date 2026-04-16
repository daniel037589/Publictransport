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
import IpadScreen from './components/IpadScreen';
import DesktopScreen from './components/DesktopScreen';
import './index.css';

const INITIAL_RIDERS = [
  // Keeping initial mockup data ...
  {
    id: 'sarah',
    name: 'Sara de Jong',
    age: 35,
    initial: 'S',
    distance: '1 km away',
    timeframe: 'Needs ride now',
    destination: 'Hilversum Train Station',
    location: [52.3094, 5.0392],
    destinationLocation: [52.3134, 5.0425],
    color: '#1164fd',
    avatarUrl: 'https://i.pravatar.cc/150?img=47',
    badges: ['Has newborn', 'Needs walker space']
  }
];

const serializeForDb = (rider) => ({
  id: String(rider.id),
  name: rider.name,
  age: rider.age || null,
  birthdate: rider.birthdate || null,
  initial: rider.initial,
  distance: rider.distance,
  timeframe: rider.timeframe,
  date: rider.date || null,
  time: rider.time || null,
  pickup: rider.pickup || null,
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
  age: row.age || null,
  birthdate: row.birthdate || null,
  initial: row.initial,
  distance: row.distance,
  timeframe: row.timeframe,
  date: row.date || null,
  time: row.time || null,
  pickup: row.pickup || null,
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
    const stored = localStorage.getItem('ons_kortenhoef_profile');
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

  const TAB_ORDER = ['home', 'trips', 'community', 'profile'];
  const [previousTab, setPreviousTab] = useState('home');

  const handleNavigate = (path) => {
    setPreviousTab(activeTab);
    setActiveTab(path);
  };

  // Compute slide direction for a given screen tab
  const slideClass = (tab) => {
    if (tab === activeTab) return 'screen--active';
    const prevIdx = TAB_ORDER.indexOf(previousTab);
    const curIdx = TAB_ORDER.indexOf(activeTab);
    const tabIdx = TAB_ORDER.indexOf(tab);
    // If navigating right (higher index), off-screen tabs to the right slide right, left slide left
    const goingRight = curIdx > prevIdx;
    // A tab that is to the right of the active one hides right; to the left hides left
    return tabIdx > curIdx ? 'screen--hidden-right' : 'screen--hidden-left';
  };

  const handleAddRider = async (newRider) => {
    setRiders(prev => [...prev, newRider]);
    setActiveTab('trips'); 
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

  const isIpadView = userProfile?.name?.toLowerCase() === 'ipad';
  if (isIpadView) return <IpadScreen riders={riders} />;

  const isDesktopView = userProfile?.name?.toLowerCase() === 'desktop';
  if (isDesktopView) return <DesktopScreen />;

  return (
    <div className="app-shell">
      <div className={`screen ${slideClass('home')}`}>
        <HomePage onNavigate={handleNavigate} riders={riders} />
      </div>

      <div className={`screen ${activeTab === 'get-ride' ? 'screen--active' : 'screen--hidden-right'}`} style={{ zIndex: 100 }}>
        {activeTab === 'get-ride' && <GetRideScreen onBack={() => { setPreviousTab('get-ride'); setActiveTab('home'); }} onRequestRide={handleAddRider} userProfile={userProfile} />}
      </div>

      <div className={`screen ${activeTab === 'give-ride' ? 'screen--active' : 'screen--hidden-right'}`} style={{ zIndex: 100 }}>
        {activeTab === 'give-ride' && <GiveRideScreen onBack={() => { setPreviousTab('give-ride'); setActiveTab('home'); }} riders={riders} onOfferRide={handleOfferRide} userProfile={userProfile} />}
      </div>

      <div className={`screen ${slideClass('trips')}`}>
        <MyTripsScreen riders={riders} onDeleteRide={handleDeleteRide} onCancelOffer={handleCancelOffer} userProfile={userProfile} />
      </div>

      <div className={`screen ${slideClass('community')}`}>
        <CommunitiesScreen />
      </div>

      <div className={`screen ${slideClass('profile')}`}>
        <ProfileScreen 
          userProfile={userProfile} 
          riders={riders} 
          onUpdateProfile={(updates) => {
            const newProfile = { ...userProfile, ...updates };
            setUserProfile(newProfile);
            localStorage.setItem('ons_kortenhoef_profile', JSON.stringify(newProfile));
            supabase.from('profiles').upsert({
              name: newProfile.name,
              profile_data: newProfile
            }).then();
          }}
          onLogout={() => {
            localStorage.removeItem('ons_kortenhoef_profile');
            setUserProfile(null);
          }} 
        />
      </div>

      {activeTab !== 'get-ride' && activeTab !== 'give-ride' && <Navbar activeTab={activeTab} onTabChange={setActiveTab} />}
    </div>
  );
}

export default App;
