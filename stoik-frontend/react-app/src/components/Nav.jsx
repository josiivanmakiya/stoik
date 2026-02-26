import { NavLink } from 'react-router-dom';
import StoikLogo from './StoikLogo.jsx';
import './nav.css';

export default function Nav() {
  const linkClass = ({ isActive }) => `nav__link${isActive ? ' is-active' : ''}`;
  const shopLinkClass = ({ isActive }) => `nav__link nav__shop-link${isActive ? ' is-active' : ''}`;

  return (
    <header className="nav">
      <div className="nav__wrap">
        <div className="nav__left">
          <NavLink to="/" className="nav__logo">
            <StoikLogo size={34} className="nav__logo-mark" />
            <span>stoik</span>
          </NavLink>
        </div>

        <nav className="nav__center">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/shop" className={shopLinkClass}>
            <span>Shop</span>
            <span className="nav__shop-swatch" aria-hidden="true" />
          </NavLink>
          <NavLink to="/contact" className={linkClass}>Contact</NavLink>
          <NavLink to="/credit" className={linkClass}>Stoik Credits</NavLink>
          <NavLink to="/billing" className={linkClass}>Billing</NavLink>
          <NavLink to="/bag" className={linkClass}>Bag</NavLink>
        </nav>

        <div className="nav__right">
          <NavLink to="/auth" className="nav__cta nav__cta--ghost">Login</NavLink>
          <NavLink to="/auth" state={{ mode: 'register' }} className="nav__cta nav__cta--solid">Sign up</NavLink>
        </div>
      </div>
    </header>
  );
}
