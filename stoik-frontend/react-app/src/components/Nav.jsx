import { NavLink, useNavigate } from 'react-router-dom';
import StoikLogo from './StoikLogo.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import './nav.css';

export default function Nav() {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth?.logout();
    navigate('/', { replace: true });
  };

  return (
    <header className="nav">
      <div className="nav__wrap">
        <NavLink to="/" className="nav__logo">
          <StoikLogo size={36} className="nav__logo-mark" />
          <span>stoik</span>
        </NavLink>
        <nav className="nav__links">
          <NavLink to="/essentials">Essentials</NavLink>
          <NavLink to="/bag">Bag</NavLink>
          <NavLink to="/credit">Stoik Credit</NavLink>
          <NavLink to="/dashboard">Account</NavLink>
          <NavLink to="/fit">Fit Profile</NavLink>
        </nav>
        {auth?.token ? (
          <button type="button" className="nav__cta" onClick={handleLogout}>
            Sign out
          </button>
        ) : (
          <NavLink to="/auth" className="nav__cta">
            Sign in
          </NavLink>
        )}
      </div>
    </header>
  );
}
