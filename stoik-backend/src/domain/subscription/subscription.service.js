const { SUBSCRIPTION_STATUS } = require('../../config/constants.js');
const {
  createSubscription,
  getSubscriptionById,
  updateSubscriptionStatus,
  updateNextBillingDate,
  getSubscriptionsByUserId
} = require('./subscription.model.js');

const { assertValidSubscriptionTransition } = require('./subscription.rules.js');

const subscribeUser = async function({
  userId,
  planId,
  startDate = new Date(),
  commitmentMonths = 0
}) {
  const status = SUBSCRIPTION_STATUS.INACTIVE;
  const nextBillingDate = new Date(startDate);
  nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

  const commitmentEndDate = commitmentMonths > 0
    ? new Date(startDate.getFullYear(), startDate.getMonth() + commitmentMonths, startDate.getDate())
    : null;

  const priceLocked = commitmentMonths > 0;

  const subscription = await createSubscription({
    userId,
    planId,
    status,
    startDate,
    nextBillingDate,
    commitmentEndDate,
    priceLocked
  });

  return subscription;
};

const activateSubscription = async function(subscriptionId) {
  const subscription = await getSubscriptionById(subscriptionId);
  if (!subscription) throw new Error('Subscription not found');

  if (subscription.status !== SUBSCRIPTION_STATUS.INACTIVE) {
    throw new Error(`Cannot activate subscription in ${subscription.status} state`);
  }

  return updateSubscriptionStatus(subscriptionId, SUBSCRIPTION_STATUS.ACTIVE);
};

const changeStatus = async function(subscriptionId, newStatus) {
  const subscription = await getSubscriptionById(subscriptionId);
  if (!subscription) throw new Error('Subscription not found');

  assertValidSubscriptionTransition(subscription.status, newStatus);

  return updateSubscriptionStatus(subscriptionId, newStatus);
};

const pauseSubscription = async function(subscriptionId) {
  return changeStatus(subscriptionId, SUBSCRIPTION_STATUS.PAUSED);
};

const resumeSubscription = async function(subscriptionId) {
  return changeStatus(subscriptionId, SUBSCRIPTION_STATUS.ACTIVE);
};

const cancelSubscription = async function(subscriptionId) {
  return changeStatus(subscriptionId, SUBSCRIPTION_STATUS.CANCELLED);
};

const setNextBillingDate = async function(subscriptionId, nextBillingDate) {
  return updateNextBillingDate(subscriptionId, nextBillingDate);
};

const getSubscription = async function(subscriptionId) {
  return getSubscriptionById(subscriptionId);
};

const getUserSubscriptions = async function(userId) {
  return getSubscriptionsByUserId(userId);
};

module.exports = {
  subscribeUser,
  activateSubscription,
  changeStatus,
  pauseSubscription,
  resumeSubscription,
  cancelSubscription,
  setNextBillingDate,
  getSubscription,
  getUserSubscriptions
};
