export default function StoikLogo({ size = 40, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-label="Stoik logo"
      className={className}
      role="img"
    >
      <g transform="skewX(-7)">
        <rect x="10" y="8" width="8" height="48" fill="#000000" />
        <rect x="28" y="8" width="8" height="48" fill="#8E8E8E" />
        <rect x="46" y="8" width="8" height="48" fill="#FFFFFF" />
      </g>
    </svg>
  );
}
