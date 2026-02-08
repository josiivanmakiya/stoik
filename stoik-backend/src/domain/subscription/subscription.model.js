const Subscription = require('../../db/models/subscription.model.js');

/**
 * CREATE SUBSCRIPTION
 */
const createSubscription = async function(data) {
  const subscription = new Subscription(data);
  return await subscription.save();
};

/**
 * GET SUBSCRIPTION BY ID
 */
const getSubscriptionById = async function(subscriptionId) {
  return await Subscription.findById(subscriptionId);
};

/**
 * GET SUBSCRIPTIONS BY USER
 */
const getSubscriptionsByUserId = async function(userId) {
  return await Subscription.find({ userId });
};

/**
 * UPDATE SUBSCRIPTION STATUS
 * NOTE: Status transitions are validated in subscription.rules.js
 */
const updateSubscriptionStatus = async function(subscriptionId, newStatus) {
  return await Subscription.findByIdAndUpdate(subscriptionId, { status: newStatus }, { new: true });
};

/**
 * UPDATE NEXT BILLING DATE
 */
const updateNextBillingDate = async function(subscriptionId, nextBillingDate) {
  return await Subscription.findByIdAndUpdate(subscriptionId, { nextBillingDate }, { new: true });
};

module.exports = {
  createSubscription,
  getSubscriptionById,
  getSubscriptionsByUserId,
  updateSubscriptionStatus,
  updateNextBillingDate
};
