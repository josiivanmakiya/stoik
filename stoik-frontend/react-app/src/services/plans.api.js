import { USE_MOCK } from './config.js';
import { apiRequest } from './apiClient.js';
import { mockPlans } from './mockApi.js';

export const getPlans = async () => {
  if (USE_MOCK) return mockPlans();
  return apiRequest('/plans');
};
