# Stoik System Principles

This document codifies product, frontend, backend, and security principles for Stoik.

## Meta Principle

Good systems reduce surprise. Great systems eliminate it.

## Frontend Principles (Applied)

- Build with design tokens and reusable components, not page-by-page styling.
- Prefer predictable vertical flow, readable max-widths, and mobile-first priority.
- Prevent invalid actions early with clear disabled states and calm feedback.
- Make loading, empty, error, and success states first-class UI states.
- Keep one dominant action per section; secondary actions must visually yield.
- Keep motion short and causal; avoid decorative interaction effects.
- Enforce consistency in spacing, typography, and component behavior across screens.
- Treat accessibility as structure: focus visibility, keyboard support, contrast, and touch targets.

## Backend Principles (Applied)

- APIs are contracts: explicit boundaries, validation at edges, stable response shapes.
- Favor stateless request handling and idempotent write paths where possible.
- Never trust client input; normalize and verify at service boundaries.
- Use rate limits, timeouts, and size limits by default.
- Keep error responses safe for users, rich in logs for operators.
- Optimize for reversibility: deploys, migrations, and operational rollback paths.
- Document non-obvious behavior and configuration in repo, not tribal knowledge.

## Security Principles (Applied)

- Authentication and authorization are separate concerns.
- Least privilege is default; admin paths are explicit.
- Secrets stay in environment variables and are expected to rotate.
- Input, origin, payload size, and request frequency are all attack surfaces.
- Do not leak internal errors, stack traces, or sensitive identifiers to clients.
- Verify third-party callbacks and webhooks; assume external dependencies fail.
- Treat logging as potentially sensitive: never log credentials or token secrets.

## Non-Negotiable PR Checks

- No new hard-coded colors, spacing, or typography outside token system.
- No endpoint merges without boundary validation and safe error responses.
- No auth-related changes without authorization path review.
- New async flows must define timeout, failure behavior, and user feedback.
- Any schema/data change must include migration and rollback thinking.
