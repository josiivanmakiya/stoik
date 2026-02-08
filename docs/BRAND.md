# Stoik Brand System

## Logo Direction
Option A: Three slanted lines (a thicker, calmer version of `| \ /`).

What it communicates:
1. Discipline and order.
2. Function over decoration.
3. Systems and cycles.
4. Quiet masculinity without shouting.

Why it works:
1. Fits white innerwear.
2. Health-first, minimalist.
3. Prints cleanly on fabric.
4. Works in negative space.
5. Survives long-term without rebrand.

## Design Rules
Geometry:
1. Three vertical bars.
2. Slight slant (6–8 degrees).
3. Same height and width.
4. Equal spacing.

Weight:
1. Thick enough to feel confident.
2. Not so thick it feels aggressive.

Colors:
1. `#000000` black.
2. `#8E8E8E` neutral grey.
3. `#FFFFFF` white for dark backgrounds.

Do not use gradients, shadows, outlines, or rounded corners.

## Primary SVG (Inline)
```svg
<svg
  width="64"
  height="64"
  viewBox="0 0 64 64"
  xmlns="http://www.w3.org/2000/svg"
  aria-label="Stoik logo"
>
  <g transform="skewX(-7)">
    <rect x="10" y="8" width="8" height="48" fill="#000000" />
    <rect x="28" y="8" width="8" height="48" fill="#8E8E8E" />
    <rect x="46" y="8" width="8" height="48" fill="#FFFFFF" />
  </g>
</svg>
```

## CSS-Controlled SVG
```svg
<svg class="stoik-logo" viewBox="0 0 64 64">
  <g class="stoik-bars">
    <rect class="bar bar-1" x="10" y="8" width="8" height="48" />
    <rect class="bar bar-2" x="28" y="8" width="8" height="48" />
    <rect class="bar bar-3" x="46" y="8" width="8" height="48" />
  </g>
</svg>
```
```css
.stoik-logo {
  width: 48px;
  height: 48px;
}

.stoik-bars {
  transform: skewX(-7deg);
  transform-origin: center;
}

.bar-1 {
  fill: #000;
}

.bar-2 {
  fill: #8e8e8e;
}

.bar-3 {
  fill: #fff;
}
```

## React Component (Drop-In)
```jsx
export default function StoikLogo({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-label="Stoik logo">
      <g transform="skewX(-7)">
        <rect x="10" y="8" width="8" height="48" fill="#000" />
        <rect x="28" y="8" width="8" height="48" fill="#8E8E8E" />
        <rect x="46" y="8" width="8" height="48" fill="#FFF" />
      </g>
    </svg>
  );
}
```

## Usage Rules
Allowed:
1. App header.
2. Splash screen.
3. Package tag.
4. Email header.
5. Invoice.
6. Subscription confirmation.

Not allowed:
1. Pattern repetition.
2. Animation.
3. Rotation.
4. Gradients.
5. Adding text inside the logo.

The logo should sit quietly and not perform.

