import { API_BASE_URL } from './config.js';

export const apiRequest = async (path, options = {}) => {
  const token = localStorage.getItem('stoik_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || 'Request failed');
  }

  return res.json();
};
