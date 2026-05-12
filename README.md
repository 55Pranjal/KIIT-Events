# KIIT Events

A full-stack event discovery and management platform for KIIT students and societies. Students browse upcoming events, register, and follow society announcements; society organisers and admins manage events, posters, highlights, and member requests from a dedicated dashboard.

## Live Demo

[View Live](https://kiitevents.netlify.app/)

## Screenshots

![Events Page](Screenshots/home.png)

![Event Details](Screenshots/event-details.png)

![Organizer Dashboard](Screenshots/dashboard.png)

![Event Highlights](Screenshots/event-highlights.png)

## Features

- Browse upcoming and past events with filtering and search
- One-click registration with duplicate-prevention
- Society pages with profile, events, and per-society announcements
- Organiser dashboard for creating, editing, and deleting events
- Event highlights showcase with photo galleries (admin)
- Poster uploads backed by Cloudinary with image optimisation
- In-app notifications (registrations, announcements, event changes, society approvals) with pagination and per-row controls
- Society request workflow — students apply, admins approve / reject / revoke
- Admin query/support inbox
- JWT-based authentication via Google OAuth with role-aware UI (student / society / admin)
- Request-body validation via zod, rate limiting, helmet security headers
- Responsive layout down to 320px-wide screens

## Tech Stack

**Frontend**
- React 19 + Vite 7
- Tailwind CSS
- React Router 7
- Axios with cold-start retry interceptor + global 401 handler
- React Toastify, Framer Motion, lucide-react

**Backend**
- Node.js + Express 4
- MongoDB with Mongoose 8
- JWT + Google OAuth (`google-auth-library`)
- zod for request validation
- Multer + Cloudinary for image uploads
- helmet, cors, express-rate-limit

## Project Structure

```
.
├── src/                  # React frontend (Vite)
│   ├── Components/       # All UI components
│   ├── pages/
│   ├── context/          # AuthContext
│   ├── lib/              # axios interceptors, server-wake helpers
│   └── utils/            # date formatting, image optimisation, error parsing
├── server/               # Express API
│   ├── routes/           # Route modules (one per resource)
│   ├── models/           # Mongoose schemas
│   ├── middleware/       # auth, rate limits, validate
│   ├── schemas/          # zod schemas
│   ├── utils/            # eventDate (timezone-safe), email (stubbed)
│   └── index.js
└── Screenshots/
```

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB connection string (Atlas free tier is fine)
- A Cloudinary account (for poster / highlight uploads)
- A Google Cloud OAuth 2.0 Client ID (Web application type) — see [OAuth setup](#oauth-setup)

### 1. Clone and install

```bash
git clone https://github.com/55Pranjal/kiit-events.git
cd kiit-events
npm install
cd server && npm install && cd ..
```

### 2. Frontend env

Copy `.env.example` to `.env.local` at the project root and fill it in:

```bash
cp .env.example .env.local
```

| Var | Purpose |
| --- | --- |
| `VITE_BACKEND_URL` | Base URL of the API, no trailing slash (e.g. `http://localhost:5000`) |
| `VITE_GOOGLE_CLIENT_ID` | Same OAuth Client ID the backend uses |

### 3. Backend env

Copy `server/.env.example` to `server/.env` and fill it in. The example file is the canonical list — quick reference:

| Var | Required | Purpose |
| --- | --- | --- |
| `JWT_SECRET` | ✅ | Random secret for signing JWTs. Generate with `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `MONGO_URI` | ✅ | MongoDB connection string |
| `GOOGLE_CLIENT_ID` | ✅ | Google OAuth Web Client ID |
| `ADMIN_EMAIL_WHITELIST` | ✅ for bootstrap | Comma-separated emails that auto-become admin on first sign-in |
| `ALLOWED_EMAIL_DOMAIN` | optional | Defaults to `kiit.ac.in`. Domain users must sign in with |
| `ALLOWED_ORIGINS` | prod only | Comma-separated frontend origins for CORS |
| `CLOUDINARY_*` | for uploads | `_CLOUD_NAME`, `_API_KEY`, `_API_SECRET` |
| `PORT` | optional | Defaults to 5000 |
| `NODE_ENV` | optional | `production` enables prod CORS behaviour |

### 4. Run

Two terminals:

```bash
# Terminal 1 — frontend
npm run dev          # http://localhost:5173

# Terminal 2 — backend
cd server && npm start   # http://localhost:5000
```

## OAuth setup

The app uses Google Sign-In; there is no password registration. Set up the OAuth client once:

1. In [Google Cloud Console](https://console.cloud.google.com/), create or pick a project.
2. **APIs & Services → Credentials → Create credentials → OAuth client ID**.
3. Application type: **Web application**.
4. Authorised JavaScript origins:
   - `http://localhost:5173` (dev)
   - `https://your-frontend.netlify.app` (prod)
5. Authorised redirect URIs: same list.
6. Copy the **Client ID** into both `VITE_GOOGLE_CLIENT_ID` (frontend) and `GOOGLE_CLIENT_ID` (backend).
7. While the OAuth consent screen is in **Testing** mode, only the test users you've added can sign in (up to ~100). Add the emails of the people you want to grant access to under **OAuth consent screen → Test users**.

## Bootstrap an admin

The app has no UI to promote users — the first admin is bootstrapped via env var:

1. Decide which Google account should be the first admin (must be on the allowed domain).
2. Add that email to `ADMIN_EMAIL_WHITELIST` in `server/.env`. Multiple comma-separated.
3. Restart the backend.
4. Sign in with that Google account. The first sign-in creates the user with `role: "admin"`.
5. From there, admins approve society requests in `/RequestPage`, which promotes other users to `role: "society"`.

If you change the whitelist later, **existing users keep their old role** — the whitelist only takes effect when a brand-new user signs in. To change an existing user's role, edit Mongo directly.

## Roles & access

| Role | How they get it | Can do |
| --- | --- | --- |
| `student` | Default for any allowed-domain Google sign-in | Browse events, register, apply to form a society, contact admins |
| `society` | Admin approves their society request | Everything student does + create/edit/delete their society's events, post announcements, view registrations, edit society profile |
| `admin` | Email in `ADMIN_EMAIL_WHITELIST` at first sign-in | Everything society does + approve/reject/revoke societies, reply to queries, create event highlights, manage any society |

## Scripts

Frontend (root):

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

Backend (`server/`):

| Command | Description |
| --- | --- |
| `npm start` | Start the Express server |

## Deployment

### Frontend (Netlify)

1. Connect the repo, build command `npm run build`, publish directory `dist`.
2. Set env vars in Netlify: `VITE_BACKEND_URL` (your deployed API URL), `VITE_GOOGLE_CLIENT_ID`.
3. `public/_redirects` is already in the repo to route everything to `index.html` for client-side routing.

### Backend (Render / Railway / Fly)

1. Root directory: `server/`. Build: `npm install`. Start: `npm start`.
2. Set all env vars from `server/.env.example`.
3. Add your Netlify URL to `ALLOWED_ORIGINS` (comma-separated if there are several).
4. Add the deployed Netlify URL to your Google OAuth client's authorised origins (see [OAuth setup](#oauth-setup)).

On Render free tier the service spins down after inactivity. The frontend already handles cold starts: an axios interceptor retries 5xx responses with exponential backoff and shows a "server is waking up" overlay.

### Database (MongoDB Atlas)

- Free M0 tier works for low-traffic launches. Whitelist `0.0.0.0/0` in Network Access (or the specific Render egress IPs).
- Atlas free tier does **not** include automated backups. If retention matters, upgrade or schedule a periodic `mongodump`.

## Timezone

Events are stored as plain strings: `date` is `YYYY-MM-DD` and `time` is `HH:MM`, both venue-local (IST for KIIT). The shared helper [`server/utils/eventDate.js`](server/utils/eventDate.js) and its frontend mirror in [`src/utils/formatDate.js`](src/utils/formatDate.js) construct the Date with an explicit `+05:30` offset so client / server comparisons agree regardless of where each runs. If the venue ever moves, update `EVENT_TZ_OFFSET` in both files.

## Troubleshooting

| Symptom | Likely cause |
| --- | --- |
| `Only @kiit.ac.in accounts are allowed` on sign-in | Account isn't on the allowed domain. Add to OAuth test users or set `ALLOWED_EMAIL_DOMAIN`. |
| Google sign-in button doesn't appear | `VITE_GOOGLE_CLIENT_ID` missing or wrong. Check browser console. |
| `CORS rejected origin` in server logs | Add the requesting frontend URL to `ALLOWED_ORIGINS`. |
| 401 on every API call after working fine | JWT expired (7 days). Frontend should auto-redirect to `/Login` — confirm `src/lib/apiInterceptor.js` is imported in `main.jsx`. |
| Cold-start delays on first request | Render free tier behaviour. The retry interceptor + `ServerWakeOverlay` handle this; backend `/api/health` exists for warmup pings. |
| Events disappear from listings as soon as they're created | Server timezone mismatch. See the [Timezone](#timezone) section. |

## Future Improvements

- Calendar export / Google Calendar integration
- Push reminders ahead of events (browser notifications)
- Email notifications (Nodemailer scaffolding is in `server/utils/sendEmail.js`, currently commented)
- Saved / favorited events
- Better analytics for organisers
- Soft-delete and audit trail
