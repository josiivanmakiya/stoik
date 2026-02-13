import { Link } from 'react-router-dom';
import './color-collections-nav.css';

const COLORS = [
  { label: 'White', to: '/white', className: 'color-box--white' },
  { label: 'Grey', to: '/grey', className: 'color-box--grey' },
  { label: 'Black', to: '/black', className: 'color-box--black' }
];

export default function ColorCollectionsNav({ className = '' }) {
  return (
    <nav className={`color-nav ${className}`.trim()} aria-label="Color collections">
      {COLORS.map((color) => (
        <Link
          key={color.to}
          to={color.to}
          title={color.label}
          className="color-nav__item"
          aria-label={`${color.label} collection`}
        >
          <span className={`color-box ${color.className}`} />
        </Link>
      ))}
    </nav>
  );
}
