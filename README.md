# Stoik
ESSENTIALS UTILITY

Minimalist subscription platform for consumables.

## Repo Structure
- `stoik-backend/` — Express + MongoDB API.
- `stoik-frontend/` — React frontend app.

## Frontend
- Main app: `stoik-frontend/react-app`
- Run:
```bash
cd stoik-frontend/react-app
npm install
npm run dev
```

## Backend
- Run:
```bash
cd stoik-backend
npm install
npm run dev
```

## Notes
- Frontend API endpoint is configured with `VITE_API_URL`.

## Handoff Notes (Next Developer)
- Frontend is mock-first and already wired for backend APIs.
- Set `VITE_API_URL` in `stoik-frontend/react-app/.env` to your backend URL.
- Key routes are in `stoik-frontend/react-app/src/App.jsx`.
- Backend logs are wired to `stoik-backend/src/config/logActions.js`.
- For dev preview without real auth, set `VITE_PREVIEW_AUTH=true` (frontend) and `AUTH_BYPASS=true` (backend). Never enable auth bypass in production.

## Render Deployment
- This repo includes a Render blueprint at `render.yaml`.
- Services defined:
  - `stoik-backend` (Node web service from `stoik-backend`)
  - `stoik-frontend` (static site from `stoik-frontend/react-app`)

### Required backend env vars
- `MONGODB_URI`
- `JWT_SECRET`
- `FRONTEND_URL`
- `CORS_ALLOWED_ORIGINS`
- `PAYSTACK_SECRET_KEY`
- `PAYSTACK_DEFAULT_PLAN_CODE`
- `PAYSTACK_CALLBACK_URL`
- Copy values from `stoik-backend/render.env.example` into Render env settings.

### Required frontend env vars
- `VITE_API_URL` (example: `https://<backend>.onrender.com/v1`)

### Post-deploy checks
- Backend health: `GET https://<backend>.onrender.com/health`
- Paystack webhook endpoint:
  `https://<backend>.onrender.com/v1/paystack/webhook`
