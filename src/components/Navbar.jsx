import { HomeIcon, MyTripsIcon, CommunityIcon, ProfileIcon } from './Icons';
import './Navbar.css';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', Icon: HomeIcon },
  { id: 'trips', label: 'My Trips', Icon: MyTripsIcon },
  { id: 'community', label: 'Community', Icon: CommunityIcon },
  { id: 'profile', label: 'Profile', Icon: ProfileIcon },
];

export default function Navbar({ activeTab, onTabChange }) {
  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar__inner">
        {NAV_ITEMS.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`navbar__item${activeTab === id ? ' navbar__item--active' : ''}`}
            onClick={() => onTabChange(id)}
            aria-label={label}
            aria-current={activeTab === id ? 'page' : undefined}
          >
            <Icon />
            <span className="navbar__label">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
