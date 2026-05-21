# Limeeaux

A full-stack **rideshare demo** built with React and Vite — rider booking, driver dispatch, live tracking, ratings, and an admin console. Data syncs across browser tabs via `localStorage` and `BroadcastChannel` (no backend required for the demo).

**Repo:** [github.com/bourganthony1-cyber/Limeeaux](https://github.com/bourganthony1-cyber/Limeeaux)

**Live demo:** [limeeaux.vercel.app](https://limeeaux.vercel.app)

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Demo accounts (Google sign-in)

| Role   | How to sign in                                      | Lands on    |
|--------|-----------------------------------------------------|-------------|
| Rider  | Login → Rider → Continue with Google                | `/rider`    |
| Driver | Login → Driver → Continue with Google (Marcus W.)   | `/driver`   |
| Admin  | `/login?role=admin` → Continue with Google          | `/admin`    |

**Phone OTP:** any 10-digit number, code **`000000`**.

Admin is hidden from the public role picker; use the URL query above.

## Try the full ride loop

1. **Tab A — Rider:** sign in as Rider, enter pickup/dropoff, tap **Request Ride** → tracking screen.
2. **Tab B — Driver:** sign in as Driver, accept the incoming request → open map, advance status (En route → Arrived → Complete).
3. **Tab A:** rate the trip when the modal appears.
4. **Admin:** suspend a user at `/admin/users` and watch the session drop on their tab.

## Scripts

| Command        | Description              |
|----------------|--------------------------|
| `npm run dev`  | Dev server + HMR         |
| `npm run build`| Production build → `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint                   |

## Firebase (optional)

`src/firebase.js` is ready for real auth/RTDB when you add a `.env` from `.env.example`. The app runs in **demo mode** without Firebase — mock auth and local persistence only.

## Stack

- React 19 + React Router 7
- Vite 8
- Lucide icons
- Firebase SDK (optional wiring)

## Project structure

```
src/
  context/     Auth + local DB (users, rides)
  pages/
    rider/     Book, track, history
    driver/    Dashboard, map, earnings
    admin/     Dashboard, users, rides
  components/  Nav bars, sidebar
```

## License

MIT — use freely for portfolio and learning.
