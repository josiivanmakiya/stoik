import { apiRequest } from './apiClient.js';

export const getMySubscriptions = async () => {
  return apiRequest('/subscriptions/me');
};

export const createSubscription = async (payload) => {
  return apiRequest('/subscriptions', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
};
