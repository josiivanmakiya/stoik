import { USE_MOCK } from './config.js';
import { apiRequest } from './apiClient.js';

export const initializePaystackSubscription = async ({ userId, planCode }) => {
  if (USE_MOCK) {
    return {
      data: {
        authorization_url: '/success?reference=mock_paystack_sub_001'
      }
    };
  }

  return apiRequest('/paystack/initialize', {
    method: 'POST',
    body: JSON.stringify({ userId, planCode })
  });
};
