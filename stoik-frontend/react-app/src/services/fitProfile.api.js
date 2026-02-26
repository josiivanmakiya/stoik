import { apiRequest } from './apiClient.js';

export const saveFitProfile = async (payload) => {
  return apiRequest('/fit/me', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
};

export const getFitProfile = async () => {
  return apiRequest('/fit/me');
};
