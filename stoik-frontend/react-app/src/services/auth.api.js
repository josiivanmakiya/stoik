import { USE_MOCK } from './config.js';
import { apiRequest } from './apiClient.js';
import { mockAuth } from './mockApi.js';

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

  if (USE_MOCK) {
    return mockAuth.login({ email: `${normalized}.user@mock.stoik` });
  }

  const directUrl = getSocialAuthUrl(normalized);
  if (!directUrl) {
    throw new Error(`${normalized[0].toUpperCase() + normalized.slice(1)} sign-in is not configured yet.`);
  }

  window.location.href = directUrl;
  return { redirectUrl: directUrl };
};

export const login = async (payload) => {
  if (USE_MOCK) return mockAuth.login(payload);
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
};

export const register = async (payload) => {
  if (USE_MOCK) return mockAuth.register(payload);
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
};