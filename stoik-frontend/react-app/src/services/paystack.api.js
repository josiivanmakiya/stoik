import { apiRequest } from './apiClient.js';

export const initializePaystackSubscription = async ({ userId, planCode }) => {
  return apiRequest('/paystack/initialize', {
    method: 'POST',
    body: JSON.stringify({ userId, planCode })
  });
};
