import { motion } from 'framer-motion';
import { WaveIcon, CarIcon, RouteIcon } from './Icons';
import './HomePage.css';

/**
 * HomePage
 * Figma node: 346:2719 — "Home page"
 * Design tokens from: design-system.json
 */
export default function HomePage({ onNavigate }) {
  return (
    <main className="home-screen" data-node-id="346:2719">
      {/* ── Logo Section ── Figma node: 348:4257 */}
      <section className="home-logo" data-node-id="348:4257" aria-label="Weesp brand">
        <motion.h1 
          className="home-logo__title" data-node-id="348:4008"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          Weesp
        </motion.h1>
        <motion.div 
          className="home-logo__tagline" data-node-id="348:4253"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        >
          {/* House SVG inline — Figma node: 348:4251 */}
          <svg
            width="42"
            height="42"
            viewBox="0 0 42 42"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M5.25 17.5L21 5.25L36.75 17.5V35C36.75 35.9283 36.3813 36.8185 35.7249 37.4749C35.0685 38.1313 34.1783 38.5 33.25 38.5H8.75C7.82174 38.5 6.93152 38.1313 6.27513 37.4749C5.61875 36.8185 5.25 35.9283 5.25 35V17.5Z"
              stroke="#1a1a1a"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15.75 38.5V21H26.25V38.5"
              stroke="#1a1a1a"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="home-logo__tagline-text" data-node-id="348:4250">
            <p>Samen Uit</p>
            <p>&amp; Thuis</p>
          </div>
        </motion.div>
      </section>

      {/* ── Big Buttons ── Figma node: 348:4247 */}
      <section className="big-buttons" data-node-id="348:4247" aria-label="Main actions">

        {/* Ongoing Rides — Figma node: 346:2739 */}
        <motion.button
          className="big-btn big-btn--full big-btn--teal"
          data-node-id="346:2739"
          onClick={() => onNavigate('ongoing')}
          aria-label="View ongoing rides"
          whileHover={{ scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 10 } }}
          whileTap={{ scale: 0.97, transition: { type: "spring", stiffness: 400, damping: 10 } }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.2 } }}
        >
          <div className="big-btn__icon" style={{ width: 55, height: 33 }}>
            <RouteIcon />
          </div>
          <span className="big-btn__label" data-node-id="346:2740">Ongoing Rides</span>
        </motion.button>

        {/* Get Ride — Figma node: 346:2735 */}
        <motion.button
          className="big-btn big-btn--half big-btn--orange"
          data-node-id="346:2735"
          onClick={() => onNavigate('get-ride')}
          aria-label="Get a ride"
          whileHover={{ scale: 1.04, transition: { type: "spring", stiffness: 400, damping: 10 } }}
          whileTap={{ scale: 0.94, transition: { type: "spring", stiffness: 400, damping: 10 } }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.3 } }}
        >
          <div className="big-btn__icon" style={{ width: 33, height: 33 }}>
            <WaveIcon />
          </div>
          <span className="big-btn__label" style={{ width: 74 }} data-node-id="346:2736">Get Ride</span>
        </motion.button>

        {/* Give Ride — Figma node: 346:2737 */}
        <motion.button
          className="big-btn big-btn--half big-btn--purple"
          data-node-id="346:2737"
          onClick={() => onNavigate('give-ride')}
          aria-label="Give a ride"
          whileHover={{ scale: 1.04, transition: { type: "spring", stiffness: 400, damping: 10 } }}
          whileTap={{ scale: 0.94, transition: { type: "spring", stiffness: 400, damping: 10 } }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.4 } }}
        >
          <div className="big-btn__icon" style={{ width: 70, height: 33 }}>
            <CarIcon />
          </div>
          <span className="big-btn__label" style={{ width: 74 }} data-node-id="346:2738">Give Ride</span>
        </motion.button>

      </section>
    </main>
  );
}
