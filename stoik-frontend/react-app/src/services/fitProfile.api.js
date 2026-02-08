import { USE_MOCK } from './config.js';
import { apiRequest } from './apiClient.js';

const mockFitProfile = async (payload) => {
  const { calculateSize } = await import('./mockApi.js');
  return {
    ...payload,
    sizeLabel: calculateSize(payload),
    updatedAt: new Date().toISOString()
  };
};

export const saveFitProfile = async (payload) => {
  if (USE_MOCK) return mockFitProfile(payload);

  return apiRequest('/fit/me', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
};

export const getFitProfile = async () => {
  if (USE_MOCK) return null;

  return apiRequest('/fit/me');
};
