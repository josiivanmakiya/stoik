import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);
const PREVIEW_AUTH = import.meta.env.VITE_PREVIEW_AUTH === 'true';
const PREVIEW_USER = {
  id: '000000000000000000000001',
  _id: '000000000000000000000001',
  email: 'preview@stoik.local',
  fullName: 'Preview User',
  role: 'admin',
  status: 'active'
};

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('stoik_user') || 'null');
  } catch (error) {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('stoik_token') || (PREVIEW_AUTH ? 'preview-token' : null));
  const [user, setUser] = useState(() => readStoredUser() || (PREVIEW_AUTH ? PREVIEW_USER : null));

  const login = (payload) => {
    localStorage.setItem('stoik_token', payload.token);
    localStorage.setItem('stoik_user', JSON.stringify(payload.user));
    setToken(payload.token);
    setUser(payload.user);
  };

  const logout = () => {
    localStorage.removeItem('stoik_token');
    localStorage.removeItem('stoik_user');
    setToken(PREVIEW_AUTH ? 'preview-token' : null);
    setUser(PREVIEW_AUTH ? PREVIEW_USER : null);
  };

  const value = useMemo(() => ({ token, user, login, logout }), [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
