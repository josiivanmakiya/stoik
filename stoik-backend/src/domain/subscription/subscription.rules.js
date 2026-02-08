const { SUBSCRIPTION_STATUS } = require('../../config/constants.js');

const ALLOWED_TRANSITIONS = {
  [SUBSCRIPTION_STATUS.INACTIVE]: [SUBSCRIPTION_STATUS.ACTIVE, SUBSCRIPTION_STATUS.CANCELLED],
  [SUBSCRIPTION_STATUS.ACTIVE]: [SUBSCRIPTION_STATUS.PAUSED, SUBSCRIPTION_STATUS.CANCELLED, SUBSCRIPTION_STATUS.EXPIRED],
  [SUBSCRIPTION_STATUS.PAUSED]: [SUBSCRIPTION_STATUS.ACTIVE, SUBSCRIPTION_STATUS.CANCELLED, SUBSCRIPTION_STATUS.EXPIRED],
  [SUBSCRIPTION_STATUS.CANCELLED]: [],
  [SUBSCRIPTION_STATUS.EXPIRED]: []
};

const assertValidSubscriptionTransition = (currentStatus, nextStatus) => {
  const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];
  if (!allowed.includes(nextStatus)) {
    throw new Error(`Invalid subscription status transition: ${currentStatus} -> ${nextStatus}`);
  }
};

module.exports = {
  assertValidSubscriptionTransition
};
