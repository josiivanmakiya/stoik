import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute() {
  const location = useLocation();
  const auth = useAuth();

  if (!auth?.token) {
    return <Navigate to="/auth" replace state={{ from: location, reason: 'auth' }} />;
  }

  return <Outlet />;
}
