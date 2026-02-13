const { SUBSCRIPTION_STATUS } = require('../../config/constants.js');
const {
  createSubscription,
  getSubscriptionById,
  updateSubscriptionStatus,
  updateNextBillingDate,
  getSubscriptionsByUserId,
  updateSubscriptionCadence
} = require('./subscription.model.js');

const { assertValidSubscriptionTransition } = require('./subscription.rules.js');

const clampCadence = (cadenceMonths) => {
  const parsed = Number(cadenceMonths || 1);
  if (!Number.isFinite(parsed)) return 1;
  return Math.min(6, Math.max(1, Math.round(parsed)));
};

const subscribeUser = async function({
  userId,
  planId,
  startDate = new Date(),
  commitmentMonths = 0,
  cadenceMonths = 1,
  bagSnapshot = []
}) {
  const normalizedCadence = clampCadence(cadenceMonths);
  const status = SUBSCRIPTION_STATUS.INACTIVE;
  const nextBillingDate = new Date(startDate);
  nextBillingDate.setMonth(nextBillingDate.getMonth() + normalizedCadence);

  const commitmentEndDate = commitmentMonths > 0
    ? new Date(startDate.getFullYear(), startDate.getMonth() + commitmentMonths, startDate.getDate())
    : null;

  const priceLocked = commitmentMonths > 0;

  const subscription = await createSubscription({
    userId,
    planId,
    cadenceMonths: normalizedCadence,
    bagSnapshot,
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

const updateDeliveryFrequency = async function(subscriptionId, cadenceMonths) {
  const subscription = await getSubscriptionById(subscriptionId);
  if (!subscription) throw new Error('Subscription not found');

  const normalizedCadence = clampCadence(cadenceMonths);
  const nextBillingDate = new Date();
  nextBillingDate.setMonth(nextBillingDate.getMonth() + normalizedCadence);

  return updateSubscriptionCadence(subscriptionId, normalizedCadence, nextBillingDate);
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
  updateDeliveryFrequency,
  getSubscription,
  getUserSubscriptions
};
