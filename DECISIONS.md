# Weesp Ride-Sharing App — Decision Log

> This document records every major architectural and implementation decision made during development of the Weesp community ride-sharing prototype. It is updated continuously as the project evolves.

---

## Table of Contents

- [1. Supabase as Backend (replacing MQTT)](#1-supabase-as-backend-replacing-mqtt)
- [2. Persistent Ride Requests Table](#2-persistent-ride-requests-table)
- [3. User Onboarding Flow with localStorage](#3-user-onboarding-flow-with-localstorage)
- [4. My Trips Screen with User-Specific Filtering](#4-my-trips-screen-with-user-specific-filtering)
- [5. Profile Screen Wired to Real User Data](#5-profile-screen-wired-to-real-user-data)
- [6. Avatar / Profile Picture Support Across All Screens](#6-avatar--profile-picture-support-across-all-screens)
- [7. Ride Acceptance Pipeline](#7-ride-acceptance-pipeline)
- [8. Split My Trips View](#8-split-my-trips-view)
- [9. Real Map Routing with OSRM](#9-real-map-routing-with-osrm)
- [10. Geocoding with Nominatim](#10-geocoding-with-nominatim)
- [11. Live Location Autocomplete Typeahead](#11-live-location-autocomplete-typeahead)
- [12. Cancel Taken Rides](#12-cancel-taken-rides)

---

## 1. Supabase as Backend (replacing MQTT)

**Date:** 2026-04-09  
**Context:** The original prototype used an MQTT broker for real-time ride request messaging. This was transient — messages were lost on reload and there was no persistent storage.  
**Decision:** Replace MQTT with Supabase (PostgreSQL + Realtime). This gives us a persistent database, real-time websocket sync via `postgres_changes`, and a REST API — all from one service.  
**Rationale:** Supabase provides persistence, real-time sync, and a free tier suitable for prototyping, without needing to manage a separate MQTT broker and database.  
**Impact:** All ride requests are now stored permanently and synced across all clients in real-time. The `supabaseClient.js` singleton initialises the connection using environment variables.

---

## 2. Persistent Ride Requests Table

**Date:** 2026-04-09  
**Context:** Ride requests needed to survive page reloads and be visible to all connected users.  
**Decision:** Create a `ride_requests` table in Supabase with columns: `id`, `name`, `initial`, `distance`, `timeframe`, `destination`, `location` (jsonb), `destination_location` (jsonb), `color`, `badges` (jsonb). Later extended with `avatar_url`, `status`, `driver_name`, and `route_geometry`.  
**Rationale:** A single flat table keeps the prototype simple. JSONB columns allow flexible storage of arrays (badges, coordinates) without schema migrations for every UI change.  
**Trade-off:** Row Level Security (RLS) is disabled for the prototype phase to avoid auth complexity. This must be enabled before any public release.

---

## 3. User Onboarding Flow with localStorage

**Date:** 2026-04-09  
**Context:** The app needed a way to identify users without requiring account creation / authentication.  
**Decision:** Implement a mandatory first-time onboarding screen that captures: name, age, language (Dutch/English), preferences (wheelchair, stroller, pets, quiet ride), and an optional profile photo. All data is serialised to `localStorage` under the key `weesp_user_profile`.  
**Rationale:** `localStorage` provides instant, zero-latency identity persistence without requiring a backend auth system. Profile photos are stored as base64 data URLs to avoid needing a file storage service.  
**Trade-off:** Identity is device-bound — clearing browser data loses the profile. A future migration to Supabase Auth + a `profiles` table would solve this.  
**Gating mechanism:** `App.jsx` checks for the stored profile on mount. If missing, it renders `<OnboardingScreen>` instead of the main app shell, completely blocking access to ride features.

---

## 4. My Trips Screen with User-Specific Filtering

**Date:** 2026-04-09  
**Context:** Users needed a way to see and manage their own ride requests separately from the global feed.  
**Decision:** Create a `MyTripsScreen` component that filters the global `riders` array by matching `rider.name === userProfile.name` (for requests made) and `rider.driverName === userProfile.name` (for rides accepted).  
**Rationale:** Filtering client-side from the shared state avoids duplicate API calls. The name-based matching is sufficient for a prototype with a small user base.  
**Trade-off:** Name collisions could cause incorrect filtering. A proper implementation would use unique user IDs.

---

## 5. Profile Screen Wired to Real User Data

**Date:** 2026-04-09  
**Context:** The Profile screen was previously hardcoded with placeholder data ("You", mock stats, static preferences).  
**Decision:** Wire `ProfileScreen` to accept `userProfile` as a prop and dynamically render: the user's real name, their uploaded avatar (as a CSS `background-image`), their selected preferences (rendered from a master list with toggle states), and a "Delete Device Profile" button that clears `localStorage` and forces re-onboarding.  
**Rationale:** The profile should reflect the actual identity the user established during onboarding, not mock data.

---

## 6. Avatar / Profile Picture Support Across All Screens

**Date:** 2026-04-09  
**Context:** Profile pictures uploaded during onboarding were only visible on the Profile screen.  
**Decision:** Thread `avatarUrl` through the entire data pipeline:
- **GetRide.jsx**: Attaches `userProfile.avatarUrl` to the ride request payload.
- **App.jsx serialization**: Maps `avatarUrl` ↔ `avatar_url` for Supabase persistence.
- **GiveRide.jsx**: Renders avatar images in map pins (via Leaflet `divIcon` with `background-image`) and in request cards.
- **MyTrips.jsx**: Shows avatars on both "my requests" and "rides I'm giving" cards.  
**Rationale:** Seeing real faces builds trust in a community ride-sharing context. The base64 data URL approach means no external image hosting is needed.

---

## 7. Ride Acceptance Pipeline

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

## 8. Split My Trips View

**Date:** 2026-04-09  
**Context:** After implementing ride acceptance, the My Trips screen needed to distinguish between rides the user requested vs. rides they're driving.  
**Decision:** Split `MyTripsScreen` into two sections:
- **"Rides I'm Giving"** — filtered by `driverName === userProfile.name`, styled with a blue border, showing the passenger's info and an "Active Ride Route" label.
- **"My Requests"** — filtered by `name === userProfile.name`, showing status-aware text: green "Neighbor X is arriving!" for ongoing rides, blue "Waiting for a Neighbor" for pending ones.  
**Rationale:** Clear visual separation prevents confusion about which rides the user is driving vs. riding.

---

## 9. Real Map Routing with OSRM

**Date:** 2026-04-09  
**Context:** Ride routes on the map were rendered as straight lines between random points, which looked unrealistic.  
**Decision:** Integrate the free OSRM (Open Source Routing Machine) API at `router.project-osrm.org` to fetch real driving routes. The API returns GeoJSON geometries which are converted from `[lng, lat]` to `[lat, lng]` for Leaflet compatibility.  
**Rationale:** OSRM is free, requires no API key, and returns dense coordinate arrays that follow actual road networks — making the map look realistic.  
**Implementation:**
- Route geometry is stored in the `routeGeometry` field on each rider object.
- `GiveRide.jsx` checks for `routeGeometry` first (rendering a solid polyline), falling back to a dashed straight line between pickup/destination if unavailable.
- A new `route_geometry` JSONB column was added to the Supabase table.

---

## 10. Geocoding with Nominatim

**Date:** 2026-04-09  
**Context:** Users type text addresses (e.g., "Weesp Station") but the map and routing APIs need GPS coordinates.  
**Decision:** Use OpenStreetMap's Nominatim geocoding service to convert text addresses to `[lat, lon]` coordinates. Queries are scoped to "Weesp, Netherlands" for relevance.  
**Rationale:** Nominatim is free, open-source, and doesn't require API keys. It returns accurate coordinates for Dutch addresses.  
**Fallback:** If geocoding fails, random coordinates near Weesp center are generated as a fallback to prevent the app from breaking.

---

## 11. Live Location Autocomplete Typeahead

**Date:** 2026-04-09  
**Context:** Users had to type complete addresses and hope they matched. There was no feedback during input.  
**Decision:** Build a custom `LocationAutocomplete` React component that:
- Debounces input by 450ms to avoid hammering the API.
- Queries Nominatim with the partial input + ", Weesp, Netherlands".
- Renders a dropdown list with up to 5 results, showing both the place name and full address.
- Shows "Searching streets..." during loading and "No results found in Weesp" for empty results.
- Closes on outside click via a `mousedown` event listener.
- Uses dynamic `z-index` management to prevent the dropdown from being hidden behind subsequent form fields.  
**Rationale:** Autocomplete dramatically improves UX by preventing typos and showing users what addresses are actually available in the map data.

---

## 12. Cancel Taken Rides

**Date:** 2026-04-09  
**Context:** Once a driver accepted a ride via "Pick Up", there was no way to undo it.  
**Decision:** Add a `handleCancelOffer(rideId)` function in `App.jsx` that:
1. Reverts the ride's `status` to `'pending'` and clears `driverName` to `null` (optimistic local update).
2. Pushes a Supabase `UPDATE` to persist the change.
3. The ride reappears in the Give Ride map for other drivers to claim.

A red "Cancel Drive" button was added to each card in the "Rides I'm Giving" section of My Trips, wrapped in `AnimatePresence` for smooth exit animations.  
**Rationale:** Users need the ability to back out of commitments. Reverting to `pending` (rather than deleting) preserves the original requester's ride request.

---

## Environment & Deployment Notes

| Variable | Value |
|---|---|
| `VITE_SUPABASE_URL` | `https://kvavujuefxbcbtxvuxxs.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `sb_publishable_FiNzuftOKBJZ80qm4tDZRw_fIW4CEzF` |
| Hosting | Vercel (auto-deploys from `daniel037589/Publictransport` on GitHub) |
| Database | Supabase PostgreSQL with RLS disabled for prototype |

### Required Supabase Schema

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
