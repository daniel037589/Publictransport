import { createContext, useContext } from 'react';

export const LanguageContext = createContext('en');
export const useLanguage = () => useContext(LanguageContext);

export const translations = {
  // Navbar
  'Home': { nl: 'Home' }, // Home is often Home in Dutch too, but maybe 'Start'
  'My Trips': { nl: 'Mijn ritten' },
  'Community': { nl: 'Community' },
  'Profile': { nl: 'Profiel' },

  // Home Screen
  'Your Community': { nl: 'Jouw Gemeenschap' },
  'Explore': { nl: 'Ontdek' },
  'I need <br /> a ride': { nl: 'Ik heb <br /> een rit nodig' },
  'I’m here <br /> to help': { nl: 'Ik wil <br /> graag helpen' },
  'Get a ride': { nl: 'Meerijden' },
  'Request a pickup from your community': { nl: 'Vraag een rit aan de community' },
  'Give a ride': { nl: 'Rit aanbieden' },
  'Offer a seat in your vehicle': { nl: 'Bied een stoel aan in je auto' },
  'Recent Activity': { nl: 'Recente activiteit' },
  'offered a ride to': { nl: 'heeft een rit aangeboden aan' },

  // Get Ride
  'Where to?': { nl: 'Waarheen?' },
  'Pick up location': { nl: 'Ophaallocatie' },
  'Pick Up Location': { nl: 'Ophaallocatie' },
  'Drop Off': { nl: 'Afzetlocatie' },
  'When do you need a ride?': { nl: 'Wanneer heb je een rit nodig?' },
  'Right now': { nl: 'Nu direct' },
  'Find a neighbour': { nl: 'Zoek een buurtgenoot' },
  'Current Location': { nl: 'Huidige locatie' },
  'Select destination': { nl: 'Kies bestemming' },
  'When do you need to go?': { nl: 'Wanneer wil je vertrekken?' },
  'Any specific needs?': { nl: 'Speciale wensen?' },
  'Vehicle entry help': { nl: 'Hulp bij instappen' },
  'Needs stroller space': { nl: 'Ruimte voor kinderwagen' },
  'Has newborn': { nl: 'Heeft baby' },
  'Needs walker space': { nl: 'Ruimte voor rollator' },
  'Request Ride': { nl: 'Rit Aanvragen' },

  // Give Ride
  'Where are you going?': { nl: 'Waar ga je heen?' },
  'Enter destination': { nl: 'Voer bestemming in' },
  'When are you leaving?': { nl: 'Wanneer vertrek je?' },
  'Find Passengers': { nl: 'Zoek Passagiers' },
  'Offer Ride': { nl: 'Rit Aanbieden' },

  // My Trips
  'Active': { nl: 'Actief' },
  'Scheduled': { nl: 'Gepland' },
  'History': { nl: 'Geschiedenis' },
  'Ride Requested': { nl: 'Rit Aangevraagd' },
  'Approval Needed': { nl: 'Goedkeuring Nodig' },
  'Ride Accepted': { nl: 'Rit Geaccepteerd' },
  'Cancel Ride': { nl: 'Rit Annuleren' },
  'Cancel': { nl: 'Annuleren' },
  'See offer': { nl: 'Bekijk aanbod' },
  'Pickup at': { nl: 'Ophalen om' },
  'Pick up': { nl: 'Ophalen' },
  'Drop-off': { nl: 'Afzetten' },
  'Trips Taken': { nl: 'Ritten Gemaakt' },
  'Rides Given': { nl: 'Ritten Gegeven' },

  // Profile
  'Settings': { nl: 'Instellingen' },
  'Language': { nl: 'Taal' },
  'Start New Test Session': { nl: 'Start Nieuwe Testsessie' },
  'Delete Profile from Database': { nl: 'Verwijder Profiel uit Database' },
  'My Needs': { nl: 'Mijn Wensen' },
  'Vehicle Details': { nl: 'Voertuig Details' },
  'Vehicle Specifications': { nl: 'Voertuig Specificaties' },
  'Edit': { nl: 'Bewerk' },
  'Done': { nl: 'Klaar' },

  // Popup
  'has offered to help you!': { nl: 'heeft aangeboden je te helpen!' },
  'Confirm': { nl: 'Bevestigen' },
  'Reject': { nl: 'Weigeren' },
  'See Profile': { nl: 'Bekijk Profiel' }
};

export const t = (key, lang) => {
  if (lang === 'nl' && translations[key] && translations[key].nl) {
    return translations[key].nl;
  }
  return key;
};
