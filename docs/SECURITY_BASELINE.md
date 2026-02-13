# Security Baseline

## Current baseline controls

- `helmet` security headers enabled.
- CORS allowlist enforcement via `CORS_ALLOWED_ORIGINS` / `FRONTEND_URL`.
- Global API rate limiting.
- Strict auth endpoint rate limiting.
- Checkout-specific rate limiting to reduce payment abuse.
- JSON and URL-encoded payload size limits.
- URL-encoded parameter count limits.
- Request timeout boundaries.
- Request IDs and structured logs for traceability.
- Generic auth failures returned to clients (no credential detail leakage).

## Environment variables

- `JWT_SECRET` (required)
- `FRONTEND_URL` (recommended)
- `CORS_ALLOWED_ORIGINS` (comma-separated allowlist)
- `JSON_LIMIT` (default `1mb`)
- `URLENCODED_LIMIT` (default `1mb`)
- `URLENCODED_PARAMETER_LIMIT` (default `100`)
- `REQUEST_TIMEOUT_MS` (default `15000`)
- `RATE_LIMIT_WINDOW_MS` (default `900000`)
- `RATE_LIMIT_MAX` (default `100`)
- `AUTH_RATE_LIMIT_MAX` (default `5`)
- `CHECKOUT_RATE_LIMIT_MAX` (default `20`)

## Required follow-ups

- Add CSRF strategy if cookie-based auth/session is introduced.
- Add webhook signature verification for external payment callbacks.
- Add token rotation/revocation strategy for long-lived sessions.
- Add automated dependency vulnerability checks in CI.
