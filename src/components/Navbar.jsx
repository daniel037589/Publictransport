import { motion, LayoutGroup } from 'framer-motion';
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
        <LayoutGroup>
          {NAV_ITEMS.map(({ id, label, Icon }) => {
            const isActive = activeTab === id;
            return (
              <motion.button
                key={id}
                layout
                className={`navbar__item${isActive ? ' navbar__item--active' : ''}`}
                onClick={() => onTabChange(id)}
                aria-label={label}
                aria-current={isActive ? 'page' : undefined}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 35,
                  mass: 1
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-pill"
                    className="navbar__pill-bg"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30
                    }}
                  />
                )}
                <Icon />
                <span className="navbar__label">{label}</span>
              </motion.button>
            );
          })}
        </LayoutGroup>
      </div>
    </nav>
  );
}
