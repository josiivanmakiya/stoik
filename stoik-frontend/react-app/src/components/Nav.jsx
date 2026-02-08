import { NavLink } from 'react-router-dom';
import StoikLogo from './StoikLogo.jsx';
import './nav.css';

export default function Nav() {
  return (
    <header className="nav">
      <div className="nav__wrap">
        <NavLink to="/" className="nav__logo">
          <StoikLogo size={36} className="nav__logo-mark" />
          <span>stoik</span>
        </NavLink>
        <nav className="nav__links">
          <NavLink to="/essentials">Essentials</NavLink>
          <NavLink to="/plans">Plans</NavLink>
          <NavLink to="/credit">Stoik Credit</NavLink>
          <NavLink to="/dashboard">Account</NavLink>
          <NavLink to="/fit">Fit Profile</NavLink>
        </nav>
        <NavLink to="/auth" className="nav__cta">
          Sign in
        </NavLink>
      </div>
    </header>
  );
}
