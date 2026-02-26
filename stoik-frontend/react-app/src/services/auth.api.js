import { apiRequest } from './apiClient.js';

const getSocialAuthUrl = (provider) => {
  if (provider === 'google') return import.meta.env.VITE_GOOGLE_AUTH_URL;
  if (provider === 'apple') return import.meta.env.VITE_APPLE_AUTH_URL;
  return null;
};

export const startSocialAuth = async (provider) => {
  const normalized = String(provider || '').toLowerCase();
  if (!['google', 'apple'].includes(normalized)) {
    throw new Error('Unsupported social provider');
  }

  const directUrl = getSocialAuthUrl(normalized);
  if (!directUrl) {
    throw new Error(`${normalized} auth is not configured`);
  }

  window.location.href = directUrl;
  return { redirectUrl: directUrl };
};

export const login = async (payload) => {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
};

export const register = async (payload) => {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
};
