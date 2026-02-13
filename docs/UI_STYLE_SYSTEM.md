# Stoik UI Style System

This project now follows a calm, utility-first interface system based on five pillars:

1. Layout and responsiveness
2. Spacing and rhythm
3. Typography discipline
4. Color and material restraint
5. Interaction and motion clarity

## Applied foundations

- Mobile-first layout with fluid containers and no fixed-height shells for core flows.
- Global spacing scale via tokens (`--space-1` to `--space-8`) and consistent section rhythm.
- Typography scale tokens and restrained hierarchy (`--text-xs` to `--text-xl`).
- Neutral-first palette with one primary action color (`--accent`).
- Reduced-motion support and short transitions for meaningful feedback only.
- Stronger accessibility defaults: visible focus rings and larger tap targets.

## Rules for new UI work

- Use tokens from `src/styles/variables.css` instead of hard-coded values.
- Prefer vertical flow and progressive disclosure.
- Keep one primary action per viewport section.
- Avoid decorative motion and high-saturation surfaces.
- Default to sentence case and short line lengths.
- Use subtle borders/shadows; avoid heavy visual separation.
- Design empty, loading, and error states as first-class states.
- If a UI feels busy, remove before adding.

## Components aligned in this pass

- Global styles: `src/styles/global.css`
- Tokens: `src/styles/variables.css`
- Buttons: `src/components/button.css`
- Cards: `src/components/card.css`
- Navigation: `src/components/nav.css`
- Footer: `src/components/footer.css`
- Checkout flow: `src/pages/Checkout.jsx`, `src/pages/checkout.css`
- Essentials list rhythm: `src/pages/essentials.css`
