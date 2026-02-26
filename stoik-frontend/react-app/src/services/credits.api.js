import { apiRequest } from './apiClient.js';

export const getCreditBalance = async () => {
  return apiRequest('/credits/balance');
};

export const setAutoApplyCreditsPreference = async (enabled) => {
  return apiRequest('/credits/auto-apply', {
    method: 'PATCH',
    body: JSON.stringify({ enabled: Boolean(enabled) })
  });
};
