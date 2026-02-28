import { apiRequest } from './apiClient.js';

export const initializePaystackSubscription = async ({ email, planId }) => {
  return apiRequest('/paystack/initialize', {
    method: 'POST',
    body: JSON.stringify({ email, planId })
  });
};
