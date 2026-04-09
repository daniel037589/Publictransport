import { useState, useEffect } from 'react';
import mqtt from 'mqtt';
import HomePage from './components/HomePage';
import Navbar from './components/Navbar';
import { GetRideScreen } from './components/GetRide';
import { GiveRideScreen } from './components/GiveRide';
import { ProfileScreen } from './components/Profile';
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

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [riders, setRiders] = useState(INITIAL_RIDERS);
  const [mqttClient, setMqttClient] = useState(null);

  // Setup MQTT Client on mount for realtime global requests
  useEffect(() => {
    const client = mqtt.connect('wss://broker.hivemq.com:8443/mqtt');
    
    client.on('connect', () => {
      console.log('Connected to MQTT broker via WebSocket');
      client.subscribe('weesp/rides/requests');
    });

    client.on('message', (topic, message) => {
      if (topic === 'weesp/rides/requests') {
        try {
          const payload = JSON.parse(message.toString());
          console.log("MQTT Received:", payload);
          // Add rider locally if they don't already exist
          setRiders(prev => {
            if (prev.some(r => r.id === payload.id)) return prev;
            return [...prev, payload];
          });
        } catch (err) {
          console.error("Failed to parse MQTT payload", err);
        }
      }
    });

    setMqttClient(client);

    return () => client.end();
  }, []);

  const handleNavigate = (path) => {
    console.log(`Navigating to: ${path}`);
    setActiveTab(path);
  };

  const handleAddRider = (newRider) => {
    // If online, broadcast request over MQTT to everyone
    if (mqttClient && mqttClient.connected) {
      mqttClient.publish('weesp/rides/requests', JSON.stringify(newRider));
    } else {
      // Offline fallback
      setRiders(prev => [...prev, newRider]);
    }
    setActiveTab('give-ride'); // Auto navigate to show it worked!
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
        <div style={{ padding: '80px 20px', textAlign: 'center' }}>
          <h2>My Trips Page</h2>
          <p>This is a placeholder for the My Trips screen.</p>
        </div>
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
