import { USE_MOCK } from './config.js';
import { apiRequest } from './apiClient.js';
import { mockAuth } from './mockApi.js';

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
