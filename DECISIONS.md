# Weesp Ride-Sharing App — Decision Log & Development Guide

> This document is the single source of truth for every major architectural decision, design rule, and coding convention used in this project. It must be followed by any developer or AI assistant contributing to the codebase. It is updated continuously as the project evolves.

---

## Table of Contents

- [Part 1: Development Rules & Conventions](#part-1-development-rules--conventions)
  - [Design System](#design-system)
  - [CSS Architecture](#css-architecture)
  - [Component Patterns](#component-patterns)
  - [State Management](#state-management)
  - [Data Flow & Serialization](#data-flow--serialization)
  - [File Structure](#file-structure)
  - [Git Workflow](#git-workflow)
- [Part 2: Architectural Decisions](#part-2-architectural-decisions)
- [Part 3: Environment & Deployment](#part-3-environment--deployment)

---

# Part 1: Development Rules & Conventions

## Design System

The entire UI is built on a strict design token system sourced from Figma (file `HivvJKKNj8eIuQd6vd6L4g`, node `346:2719`). The tokens are defined in two places:

- **`src/design-system.json`** — Machine-readable reference of all tokens (colors, typography, spacing, radii, shadows, sizing).
- **`src/index.css`** — CSS custom properties (variables) that implement these tokens at runtime.

### Mandatory Rules

1. **Never use hardcoded colors.** Always reference CSS variables:
   - `var(--color-brand-blue)` → `#1164fd` (primary blue)
   - `var(--color-brand-black)` → `#000000`
   - `var(--color-brand-white)` → `#ffffff`
   - `var(--color-bg-primary)` / `var(--color-bg-gray)` → `#f6f6f6` (background gray)
   - `var(--color-text-blue)` → `#1164fd`
   - `var(--color-text-black)` → `#000000`
   - `var(--color-text-nav)` → `#737373` (muted text, navbar icons)

2. **Never use hardcoded font families.** Always use:
   - `var(--font-family-title)` — Inter, for headings and UI labels
   - `var(--font-family-body)` — Inter, for body and descriptions

3. **Use the font size scale.** Available sizes:
   - `--font-size-xxl`: 48px (hero titles)
   - `--font-size-xl`: 32px (section titles, giant buttons)
   - `--font-size-l`: 24px
   - `--font-size-m`: 20px (brand title, primary buttons)
   - `--font-size-s`: 16px (body text, form inputs)
   - `--font-size-xs`: 14px (secondary text)
   - `--font-size-xxs`: 12px (navbar labels, captions)

4. **Use the font weight tokens:**
   - `var(--font-weight-bold)` → 700
   - `var(--font-weight-semibold)` → 600
   - `var(--font-weight-regular)` → 400

5. **Use the border radius tokens:**
   - `var(--radius-bigbuttons)` → 50px (large action buttons)
   - `var(--radius-navbartop)` → 35px (navbar top-left/top-right)
   - `var(--radius-navitem)` → 32px (pills, nav items, form inputs)
   - `var(--radius-pill)` → 100px (fully rounded pill shapes)

6. **Use the shadow tokens:**
   - `var(--shadow-card)` → `0 2px 8px rgba(0,0,0,0.08)` (cards, resting state)
   - `var(--shadow-elevated)` → `0 4px 20px rgba(0,0,0,0.12)` (hover, elevation)

7. **Use the layout constants:**
   - `var(--navbar-height)` → `74px` — always account for this in bottom padding
   - `var(--mobile-width)` → `402px` — the shell width

### Color Palette Summary

| Token | Hex | Usage |
|---|---|---|
| `--color-brand-blue` | `#1164fd` | Primary actions, links, active states |
| `--color-brand-white` | `#ffffff` | Backgrounds, card surfaces |
| `--color-bg-gray` | `#f6f6f6` | Input backgrounds, secondary surfaces |
| `--color-text-black` | `#000000` | Primary text |
| `--color-text-nav` | `#737373` | Muted text, inactive nav icons |

---

## CSS Architecture

### Rules

1. **Vanilla CSS only.** No Tailwind, no CSS-in-JS, no Sass. All styles use plain CSS files with CSS custom properties.
2. **One CSS file per component group:**
   - `index.css` — global reset, design tokens, app shell, navbar, home screen, animations
   - `RideScreens.css` — shared styles for GetRide, GiveRide, MyTrips (forms, cards, map, bottom sheet, badges)
   - `Profile.css` — profile screen specific styles
   - `Onboarding.css` — onboarding screen specific styles
   - `HomePage.css` — homepage-specific overrides
   - `Navbar.css` — navbar-specific overrides
3. **BEM-ish naming.** Classes use a flat, descriptive pattern: `.ride-screen`, `.request-card`, `.btn-primary`, `.profile-avatar`. Use `--modifier` for variants: `.screen--active`, `.request-badge--blue`.
4. **No inline styles unless dynamic.** Use inline `style={}` only for values that must be computed at runtime (e.g., `background-image: url(${avatar})`, conditional colors based on status). All static layout goes in CSS files.
5. **Animations:** Use CSS `@keyframes` for entry animations (`fadeSlideUp`, `fadeSlideDown`, `fadeScaleIn`, `pulse`). Use Framer Motion (`motion.div`) only for interactive/exit animations (`AnimatePresence`, `whileTap`, layout animations).

### App Shell Pattern

The app renders inside a fixed-size "phone frame" (`.app-shell`):
- **Width:** 402px
- **Height:** 870px
- **Border radius:** 40px
- **Shadow:** Heavy multi-layer shadow to simulate a device

Screens are absolutely positioned inside the shell and transition via `translateX()` with CSS transitions.

---

## Component Patterns

### Rules

1. **One default export per file** (for pages/screens like `HomePage`). Named exports for sub-page components (`GetRideScreen`, `ProfileScreen`).
2. **No external UI libraries** besides:
   - `framer-motion` — for animations
   - `react-leaflet` + `leaflet` — for maps
   - `@supabase/supabase-js` — for database
3. **Icons are inline SVGs** defined in `Icons.jsx` or locally within their component file. No icon library dependencies.
4. **Forms use native HTML** with `<form onSubmit>`, `<input>`, `FormData`. No form libraries.
5. **All screens must pad their bottom** by `calc(var(--navbar-height) + 24px)` to account for the floating navbar overlay.

### Component Inventory

| Component | File | Export | Description |
|---|---|---|---|
| App | `App.jsx` | default | Root shell, state manager, router |
| HomePage | `HomePage.jsx` | default | Landing page with big action buttons |
| Navbar | `Navbar.jsx` | default | Bottom navigation bar |
| GetRideScreen | `GetRide.jsx` | named | Request a ride form with autocomplete + geocoding |
| GiveRideScreen | `GiveRide.jsx` | named | Map view of pending requests + accept flow |
| ProfileScreen | `Profile.jsx` | named | User profile, preferences, logout |
| MyTripsScreen | `MyTrips.jsx` | named | User's requests + accepted drives |
| OnboardingScreen | `Onboarding.jsx` | named | First-time setup wizard |
| LocationAutocomplete | `GetRide.jsx` | internal | Nominatim-powered typeahead (not exported) |
| Icons | `Icons.jsx` | named | SVG icon components |

---

## State Management

### Rules

1. **All global state lives in `App.jsx`.** There is no context provider, no Redux, no Zustand. State is passed down as props.
2. **Key state variables:**
   - `riders` (array) — all ride requests, both local mock data and Supabase data
   - `userProfile` (object | null) — the logged-in user's profile from localStorage
   - `activeTab` (string) — current screen: `'home'`, `'get-ride'`, `'give-ride'`, `'trips'`, `'community'`, `'profile'`
   - `isInitializing` (boolean) — prevents flash of onboarding before localStorage is checked
3. **Optimistic updates.** All mutations (add, delete, update) modify local state instantly, then push to Supabase asynchronously. Supabase Realtime syncs the change to other clients.
4. **Onboarding gating.** If `userProfile` is null after initialization, `App.jsx` renders `<OnboardingScreen>` instead of the main app shell, completely blocking access.

### Data Shape: Rider Object

```javascript
{
  id: 'you-1712678400000',     // Unique string ID
  name: 'Daniel',              // Display name (from onboarding)
  initial: 'D',                // First letter of name
  distance: '0 km away',      // Distance label
  timeframe: 'Needs ride now', // Time urgency label
  destination: 'Muiden',       // Destination text
  location: [52.3082, 5.0416], // [lat, lng] pickup coords
  destinationLocation: [52.3324, 5.0646], // [lat, lng] dropoff coords
  routeGeometry: [[lat,lng], ...],        // OSRM route (nullable)
  color: '#ffc085',            // Marker/avatar background color
  badges: [                    // Preference badges array
    { icon: '📍', text: 'Ready', color: 'blue' }
  ],
  avatarUrl: 'data:image/jpeg;base64,...', // Profile picture (nullable)
  status: 'pending',           // 'pending' | 'ongoing'
  driverName: null             // Name of accepting driver (nullable)
}
```

### Data Shape: User Profile

```javascript
{
  name: 'Daniel',
  birthdate: '2001-03-15',               // ISO date string
  age: 25,                                // Auto-calculated from birthdate
  languages: ['nl', 'en'],               // Array of language IDs
  preferences: ['wheelchair', 'quiet'],   // Array of preference IDs
  avatarUrl: 'data:image/jpeg;base64,...' // Base64 encoded (nullable)
}
```

---

## Data Flow & Serialization

### Frontend ↔ Supabase Mapping

The app uses helper functions `serializeForDb()` and `deserializeFromDb()` in `App.jsx` to translate between camelCase (frontend) and snake_case (database):

| Frontend (JS) | Database (Supabase) |
|---|---|
| `destinationLocation` | `destination_location` |
| `routeGeometry` | `route_geometry` |
| `avatarUrl` | `avatar_url` |
| `driverName` | `driver_name` |

### Supabase Realtime

The app subscribes to `postgres_changes` on `public.ride_requests` with `event: '*'`:
- **INSERT** → adds rider to local state (deduplicates by ID)
- **DELETE** → removes rider from local state
- **UPDATE** → replaces the matching rider in local state (used for ride acceptance/cancellation)

---

## File Structure

```
weesp-app/
├── .env.local                    # Supabase credentials (not committed)
├── DECISIONS.md                  # This file
├── package.json
├── vite.config.js
├── index.html
├── public/
│   └── weesp-logo.svg
└── src/
    ├── App.jsx                   # Root component, state, routing
    ├── index.css                 # Global styles + design tokens
    ├── main.jsx                  # React entry point
    ├── supabaseClient.js         # Supabase singleton
    ├── design-system.json        # Figma design tokens (reference)
    └── components/
        ├── GetRide.jsx           # Request ride + LocationAutocomplete
        ├── GiveRide.jsx          # Map + accept ride
        ├── HomePage.jsx          # Landing screen
        ├── HomePage.css
        ├── Icons.jsx             # SVG icon components
        ├── MyTrips.jsx           # User's rides + drives
        ├── Navbar.jsx            # Bottom navigation
        ├── Navbar.css
        ├── Onboarding.jsx        # First-time setup
        ├── Onboarding.css
        ├── Profile.jsx           # User profile
        ├── Profile.css
        └── RideScreens.css       # Shared ride UI styles
```

---

## Git Workflow

1. **Auto-push on every change.** Each feature or fix is committed and pushed to `main` on `github.com/daniel037589/Publictransport` immediately after a successful build.
2. **Commit messages** are descriptive and imperative: "Implement native OSRM turn-by-turn routing paths", "Fix LocationAutocomplete z-index overlaps".
3. **Always run `npm run build` before committing** to catch compile errors.
4. **Vercel auto-deploys** from the `main` branch. Every push triggers a new production deployment.

---

# Part 2: Architectural Decisions

## Decision 1: Supabase as Backend (replacing MQTT)

**Date:** 2026-04-09  
**Context:** The original prototype used an MQTT broker for real-time ride request messaging. This was transient — messages were lost on reload and there was no persistent storage.  
**Decision:** Replace MQTT with Supabase (PostgreSQL + Realtime). This gives us a persistent database, real-time websocket sync via `postgres_changes`, and a REST API — all from one service.  
**Rationale:** Supabase provides persistence, real-time sync, and a free tier suitable for prototyping, without needing to manage a separate MQTT broker and database.  
**Impact:** All ride requests are now stored permanently and synced across all clients in real-time. The `supabaseClient.js` singleton initialises the connection using environment variables.

---

## Decision 2: Persistent Ride Requests Table

**Date:** 2026-04-09  
**Context:** Ride requests needed to survive page reloads and be visible to all connected users.  
**Decision:** Create a `ride_requests` table in Supabase with columns: `id`, `name`, `initial`, `distance`, `timeframe`, `destination`, `location` (jsonb), `destination_location` (jsonb), `color`, `badges` (jsonb). Later extended with `avatar_url`, `status`, `driver_name`, and `route_geometry`.  
**Rationale:** A single flat table keeps the prototype simple. JSONB columns allow flexible storage of arrays (badges, coordinates) without schema migrations for every UI change.  
**Trade-off:** Row Level Security (RLS) is disabled for the prototype phase to avoid auth complexity. This must be enabled before any public release.

---

## Decision 3: User Onboarding Flow with localStorage

**Date:** 2026-04-09  
**Context:** The app needed a way to identify users without requiring account creation / authentication.  
**Decision:** Implement a mandatory first-time onboarding screen that captures: name, age, language (Dutch/English), preferences (wheelchair, stroller, pets, quiet ride), and an optional profile photo. All data is serialised to `localStorage` under the key `weesp_user_profile`.  
**Rationale:** `localStorage` provides instant, zero-latency identity persistence without requiring a backend auth system. Profile photos are stored as base64 data URLs to avoid needing a file storage service.  
**Trade-off:** Identity is device-bound — clearing browser data loses the profile. A future migration to Supabase Auth + a `profiles` table would solve this.  
**Gating mechanism:** `App.jsx` checks for the stored profile on mount. If missing, it renders `<OnboardingScreen>` instead of the main app shell, completely blocking access to ride features.

---

## Decision 4: My Trips Screen with User-Specific Filtering

**Date:** 2026-04-09  
**Context:** Users needed a way to see and manage their own ride requests separately from the global feed.  
**Decision:** Create a `MyTripsScreen` component that filters the global `riders` array by matching `rider.name === userProfile.name` (for requests made) and `rider.driverName === userProfile.name` (for rides accepted).  
**Rationale:** Filtering client-side from the shared state avoids duplicate API calls. The name-based matching is sufficient for a prototype with a small user base.  
**Trade-off:** Name collisions could cause incorrect filtering. A proper implementation would use unique user IDs.

---

## Decision 5: Profile Screen Wired to Real User Data

**Date:** 2026-04-09  
**Context:** The Profile screen was previously hardcoded with placeholder data ("You", mock stats, static preferences).  
**Decision:** Wire `ProfileScreen` to accept `userProfile` as a prop and dynamically render: the user's real name, their uploaded avatar (as a CSS `background-image`), their selected preferences (rendered from a master list with toggle states), and a "Delete Device Profile" button that clears `localStorage` and forces re-onboarding.  
**Rationale:** The profile should reflect the actual identity the user established during onboarding, not mock data.

---

## Decision 6: Avatar / Profile Picture Support Across All Screens

**Date:** 2026-04-09  
**Context:** Profile pictures uploaded during onboarding were only visible on the Profile screen.  
**Decision:** Thread `avatarUrl` through the entire data pipeline:
- **GetRide.jsx**: Attaches `userProfile.avatarUrl` to the ride request payload.
- **App.jsx serialization**: Maps `avatarUrl` ↔ `avatar_url` for Supabase persistence.
- **GiveRide.jsx**: Renders avatar images in map pins (via Leaflet `divIcon` with `background-image`) and in request cards.
- **MyTrips.jsx**: Shows avatars on both "my requests" and "rides I'm giving" cards.  
**Rationale:** Seeing real faces builds trust in a community ride-sharing context. The base64 data URL approach means no external image hosting is needed.

---

## Decision 7: Ride Acceptance Pipeline

**Date:** 2026-04-09  
**Context:** The "Pick Up" button on the Give Ride screen previously only showed an `alert()`.  
**Decision:** Implement a full acceptance flow:
1. Driver clicks "Pick Up" on a rider's card in `GiveRideScreen`.
2. `onOfferRide(rideId)` is called → `App.jsx` optimistically updates the rider's `status` to `'ongoing'` and sets `driverName` to the current user's name.
3. A Supabase `UPDATE` query persists this change.
4. The Supabase Realtime listener (now handling `INSERT`, `DELETE`, and `UPDATE` events) syncs this across all clients.
5. The app navigates the driver to the My Trips tab.  
**Rationale:** Optimistic updates provide instant feedback. The Supabase UPDATE event ensures all connected clients see the status change in real-time.

---

## Decision 8: Split My Trips View

**Date:** 2026-04-09  
**Context:** After implementing ride acceptance, the My Trips screen needed to distinguish between rides the user requested vs. rides they're driving.  
**Decision:** Split `MyTripsScreen` into two sections:
- **"Rides I'm Giving"** — filtered by `driverName === userProfile.name`, styled with a blue border, showing the passenger's info and an "Active Ride Route" label.
- **"My Requests"** — filtered by `name === userProfile.name`, showing status-aware text: green "Neighbor X is arriving!" for ongoing rides, blue "Waiting for a Neighbor" for pending ones.  
**Rationale:** Clear visual separation prevents confusion about which rides the user is driving vs. riding.

---

## Decision 9: Real Map Routing with OSRM

**Date:** 2026-04-09  
**Context:** Ride routes on the map were rendered as straight lines between random points, which looked unrealistic.  
**Decision:** Integrate the free OSRM (Open Source Routing Machine) API at `router.project-osrm.org` to fetch real driving routes. The API returns GeoJSON geometries which are converted from `[lng, lat]` to `[lat, lng]` for Leaflet compatibility.  
**Rationale:** OSRM is free, requires no API key, and returns dense coordinate arrays that follow actual road networks — making the map look realistic.  
**Implementation:**
- Route geometry is stored in the `routeGeometry` field on each rider object.
- `GiveRide.jsx` checks for `routeGeometry` first (rendering a solid polyline), falling back to a dashed straight line between pickup/destination if unavailable.
- A new `route_geometry` JSONB column was added to the Supabase table.

---

## Decision 10: Geocoding with Nominatim

**Date:** 2026-04-09  
**Context:** Users type text addresses (e.g., "Weesp Station") but the map and routing APIs need GPS coordinates.  
**Decision:** Use OpenStreetMap's Nominatim geocoding service to convert text addresses to `[lat, lon]` coordinates. Queries are scoped to "Weesp, Netherlands" for relevance.  
**Rationale:** Nominatim is free, open-source, and doesn't require API keys. It returns accurate coordinates for Dutch addresses.  
**Fallback:** If geocoding fails, random coordinates near Weesp center are generated as a fallback to prevent the app from breaking.

---

## Decision 11: Live Location Autocomplete Typeahead

**Date:** 2026-04-09  
**Context:** Users had to type complete addresses and hope they matched. There was no feedback during input.  
**Decision:** Build a custom `LocationAutocomplete` React component that:
- Debounces input by 450ms to avoid hammering the API.
- Queries Nominatim with the partial input + ", Weesp, Netherlands".
- Renders a dropdown list with up to 5 results, showing both the place name and full address.
- Shows "Searching streets..." during loading and "No results found in Weesp" for empty results.
- Closes on outside click via a `mousedown` event listener.
- Uses dynamic `z-index` management (`isOpen ? 1000 : 1`) to prevent the dropdown from being hidden behind subsequent form fields.  
**Rationale:** Autocomplete dramatically improves UX by preventing typos and showing users what addresses are actually available in the map data.

---

## Decision 12: Cancel Taken Rides

**Date:** 2026-04-09  
**Context:** Once a driver accepted a ride via "Pick Up", there was no way to undo it.  
**Decision:** Add a `handleCancelOffer(rideId)` function in `App.jsx` that:
1. Reverts the ride's `status` to `'pending'` and clears `driverName` to `null` (optimistic local update).
2. Pushes a Supabase `UPDATE` to persist the change.
3. The ride reappears in the Give Ride map for other drivers to claim.

A red "Cancel Drive" button was added to each card in the "Rides I'm Giving" section of My Trips, wrapped in `AnimatePresence` for smooth exit animations.  
**Rationale:** Users need the ability to back out of commitments. Reverting to `pending` (rather than deleting) preserves the original requester's ride request.

---

## Decision 13: Birthdate Instead of Age + Multi-Select Languages with Flags

**Date:** 2026-04-10  
**Context:** The onboarding form asked for a static `age` number and offered only a single dropdown to pick one language (English or Dutch). Age is a value that changes over time, and many Weesp residents speak multiple languages.

**Decision:**
1. **Birthdate replaces age.** The form now uses `<input type="date">` to capture a birthdate. Age is auto-calculated via `calculateAge()` at submission time and on the Profile screen. Both `birthdate` and the derived `age` are stored in the profile.
2. **Multi-select language chips replace the dropdown.** Eight languages are available (NL, EN, DE, FR, ES, TR, AR, PL), each represented as a toggleable chip with a country flag emoji. Users can select as many as they speak. Stored as an array of language IDs (e.g., `['nl', 'en']`).
3. **Profile screen shows flags.** A new "Languages I Speak" section renders selected languages as styled flag badges with rounded pill styling in `rgba(17, 100, 253, 0.08)` background.
4. **Age shown dynamically.** The profile status line now reads "★ 5.0 • 25 y/o • Weesp Neighbor", with age recalculated from birthdate on every render so it stays accurate.

**Rationale:** Birthdate is immutable and future-proof. Multi-language support reflects the diverse international community in Weesp. Flag badges make language information instantly scannable.

---

# Part 3: Environment & Deployment

## Environment Variables

| Variable | Value |
|---|---|
| `VITE_SUPABASE_URL` | `https://kvavujuefxbcbtxvuxxs.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `sb_publishable_FiNzuftOKBJZ80qm4tDZRw_fIW4CEzF` |

These must be set in:
- `.env.local` for local development
- Vercel project settings for production

## Hosting

- **Platform:** Vercel
- **Repository:** `github.com/daniel037589/Publictransport`
- **Branch:** `main` (auto-deploy on push)
- **Build command:** `npm run build` (Vite)
- **Output directory:** `dist/`

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18+ with Vite |
| Styling | Vanilla CSS with custom properties |
| Animations | Framer Motion + CSS @keyframes |
| Maps | react-leaflet + Leaflet.js |
| Map tiles | CartoDB Voyager (`basemaps.cartocdn.com`) |
| Geocoding | Nominatim (OpenStreetMap) |
| Routing | OSRM (Open Source Routing Machine) |
| Database | Supabase (PostgreSQL + Realtime) |
| Auth | localStorage (prototype-only) |
| Font | Inter (via Google Fonts) |

## Required Supabase Schema

```sql
-- Core table
CREATE TABLE public.ride_requests (
  id text PRIMARY KEY,
  name text,
  initial text,
  distance text,
  timeframe text,
  destination text,
  location jsonb,
  destination_location jsonb,
  color text,
  badges jsonb,
  avatar_url text,
  status text DEFAULT 'pending',
  driver_name text,
  route_geometry jsonb
);

-- Disable RLS for prototype
ALTER TABLE public.ride_requests DISABLE ROW LEVEL SECURITY;
```

## Preference IDs

These string IDs are used in the user profile `preferences` array and mapped to display data throughout the app:

| ID | Emoji | Label |
|---|---|---|
| `wheelchair` | ♿️ | Wheelchair Assist |
| `stroller` | 👶 | Stroller |
| `pets` | 🐾 | Pet Friendly |
| `quiet` | 🤫 | Quiet Ride |

## Language IDs

These string IDs are used in the user profile `languages` array. The same constant is defined in both `Onboarding.jsx` and `Profile.jsx`.

| ID | Flag | Label |
|---|---|---|
| `nl` | 🇳🇱 | Nederlands |
| `en` | 🇬🇧 | English |
| `de` | 🇩🇪 | Deutsch |
| `fr` | 🇫🇷 | Français |
| `es` | 🇪🇸 | Español |
| `tr` | 🇹🇷 | Türkçe |
| `ar` | 🇸🇦 | العربية |
| `pl` | 🇵🇱 | Polski |
