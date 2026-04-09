import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import HomePage from './components/HomePage';
import Navbar from './components/Navbar';
import { GetRideScreen } from './components/GetRide';
import { GiveRideScreen } from './components/GiveRide';
import { ProfileScreen } from './components/Profile';
import { MyTripsScreen } from './components/MyTrips';
import './index.css';

const INITIAL_RIDERS = [
  {
    id: 'sarah',
    name: 'Sarah',
    initial: 'S',
    distance: '1 km away',
    timeframe: 'Needs ride now',
    destination: 'Weesp Train Station',
    location: [52.3094, 5.0392],
    destinationLocation: [52.3134, 5.0425],
    color: '#1164fd', // brand blue
    badges: [
      { icon: '👶', text: 'With Stroller', color: 'blue' },
      { icon: '💺', text: '2 Seats Needed', color: 'grey' }
    ]
  },
  {
    id: 'john',
    name: 'John',
    initial: 'J',
    distance: '2.5 km away',
    timeframe: 'Needs ride by 09:00',
    destination: 'Amsterdam Zuidoost',
    location: [52.3021, 5.0487],
    destinationLocation: [52.3121, 5.0087],
    color: '#737373', // grey
    badges: [
      { icon: '🧳', text: 'No extra luggage', color: 'grey' },
      { icon: '💺', text: '1 Seat Needed', color: 'grey' }
    ]
  }
];

// Helper to map UI rider shape to DB shape
const serializeForDb = (rider) => ({
  id: String(rider.id),
  name: rider.name,
  initial: rider.initial,
  distance: rider.distance,
  timeframe: rider.timeframe,
  destination: rider.destination,
  location: rider.location,
  destination_location: rider.destinationLocation,
  color: rider.color,
  badges: rider.badges
});

// Helper to map DB shape back to UI shape
const deserializeFromDb = (row) => ({
  id: row.id,
  name: row.name,
  initial: row.initial,
  distance: row.distance,
  timeframe: row.timeframe,
  destination: row.destination,
  location: row.location,
  destinationLocation: row.destination_location,
  color: row.color,
  badges: row.badges
});

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [riders, setRiders] = useState(INITIAL_RIDERS);

  // Mount Supabase connection securely handling global requests over Postgres
  useEffect(() => {
    // 1. Fetch persistent historical requests on load
    const fetchExistingRides = async () => {
      const { data, error } = await supabase.from('ride_requests').select('*');
      if (error) {
        console.error('Supabase fetch error. Is the table created?', error.message);
      } else if (data) {
        // Merge fetched historic DB riders with our UI mockup default riders
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

    // 2. Subscribe to LIVE incoming database requests (replaces MQTT)
    const channel = supabase
      .channel('public-ride_requests-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'ride_requests' },
        (payload) => {
          console.log("Supabase Realtime Received:", payload);
          if (payload.eventType === 'INSERT') {
            const incomingRider = deserializeFromDb(payload.new);
            setRiders(prev => {
              if (prev.some(r => r.id === incomingRider.id)) return prev;
              return [...prev, incomingRider];
            });
          } else if (payload.eventType === 'DELETE') {
            setRiders(prev => prev.filter(r => String(r.id) !== String(payload.old.id)));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleNavigate = (path) => {
    console.log(`Navigating to: ${path}`);
    setActiveTab(path);
  };

  const handleAddRider = async (newRider) => {
    // Locally optimistically update state instantly for immediate snap feedback
    setRiders(prev => [...prev, newRider]);
    setActiveTab('give-ride'); 

    // Asynchronously insert persistent request to DB, triggering live broadcast to everyone else
    const record = serializeForDb(newRider);
    const { error } = await supabase.from('ride_requests').insert([record]);
    
    if (error) {
      console.error("Failed to push request to Supabase!", error.message);
    }
  };

  const handleDeleteRide = async (rideId) => {
    // Locally optimistically update state instantly for snappy UI
    setRiders(prev => prev.filter(r => String(r.id) !== String(rideId)));

    // Execute deletion from persistent storage
    const { error } = await supabase.from('ride_requests').delete().eq('id', String(rideId));
    if (error) {
      console.error("Failed to delete request from Supabase!", error.message);
    }
  };

  return (
    <div className="app-shell">
      {/* Screens container */}
      <div 
        className={`screen ${activeTab === 'home' ? 'screen--active' : 'screen--hidden-left'}`}
      >
        <HomePage onNavigate={handleNavigate} />
      </div>

      <div 
        className={`screen ${(activeTab === 'get-ride' || activeTab === 'give-ride') ? 'screen--active' : 'screen--hidden-right'}`}
        style={{ zIndex: 100 }}
      >
        {activeTab === 'get-ride' && <GetRideScreen onBack={() => setActiveTab('home')} onRequestRide={handleAddRider} />}
        {activeTab === 'give-ride' && <GiveRideScreen onBack={() => setActiveTab('home')} riders={riders} />}
      </div>

      <div 
        className={`screen ${activeTab === 'trips' ? 'screen--active' : 'screen--hidden-right'}`}
      >
        <MyTripsScreen riders={riders} onDeleteRide={handleDeleteRide} />
      </div>

      <div 
        className={`screen ${activeTab === 'community' ? 'screen--active' : 'screen--hidden-right'}`}
      >
        <div style={{ padding: '80px 20px', textAlign: 'center' }}>
          <h2>Community Page</h2>
          <p>This is a placeholder for the Community screen.</p>
        </div>
      </div>

      <div 
        className={`screen ${activeTab === 'profile' ? 'screen--active' : 'screen--hidden-right'}`}
      >
        <ProfileScreen />
      </div>

      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;
