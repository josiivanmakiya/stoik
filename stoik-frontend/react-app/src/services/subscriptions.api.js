import { USE_MOCK } from './config.js';
import { apiRequest } from './apiClient.js';
import { mockSubscriptions } from './mockApi.js';

export const getMySubscriptions = async () => {
  if (USE_MOCK) return mockSubscriptions();
  return apiRequest('/subscriptions/me');
};

export const createSubscription = async (payload) => {
  if (USE_MOCK) return { id: 'sub_mock', ...payload };
  return apiRequest('/subscriptions', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
};
