# Stoik Frontend (React)

## Structure
- `src/pages/` — route-level pages (one file per page).
- `src/components/` — shared UI components.
- `src/assets/` — SVG and visual assets.
- `src/styles/` — global styles + variables.
- `src/services/` — mock and API helpers.

## Why this layout
It keeps the app readable and scalable:
- Pages are easy to find and edit.
- Shared components are centralized.
- Assets and global styles are separated.

## Conventions
- Pages in `PascalCase.jsx`.
- Page styles in `kebab-case.css`.
- Components in `PascalCase.jsx`.

If you add new pages, export them in `src/pages/index.js` for consistent imports.

## Backend Switch (Next Week)
When the backend is ready:
1. Set `USE_MOCK = false` in `src/services/config.js`.
2. Create `stoik-frontend/react-app/.env` with:
```
VITE_API_URL=http://localhost:3002/v1
```
3. Restart the dev server.
