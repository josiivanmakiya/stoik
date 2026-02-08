#+#+#+#+ 1,2 +1,3 @@
# Stoik
ESSENTIALS UTILITY

Minimalist subscription platform for consumables.

## Repo Structure
- `stoik-backend/` — Express + MongoDB API.
- `stoik-frontend/` — React frontend and static reference pages.
- `docs/` — Product, brand, and prompt docs.

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
- Frontend uses mock data by default. Flip `USE_MOCK = false` in
  `stoik-frontend/react-app/src/services/config.js` when backend is ready.

## Handoff Notes (Next Developer)
- Frontend is mock-first and already wired for backend APIs.
- Switch backend on by setting `USE_MOCK = false` and adding `VITE_API_URL` in
  `stoik-frontend/react-app/.env`.
- Key routes are in `stoik-frontend/react-app/src/App.jsx`.
- Backend logs are wired to `stoik-backend/src/config/logActions.js`.
