const express = require('express');
const { validate, schemas } = require('../middleware/validation.middleware');
const logger = require('../config/logger');
const { LOG_ACTIONS } = require('../config/logActions');

const { subscribeUser, activateSubscription, pauseSubscription, resumeSubscription, cancelSubscription, getSubscription, getUserSubscriptions } = require('../domain/subscription/subscription.service.js');

const router = express.Router();

// Create subscription
router.post('/', validate(schemas.subscription), async (req, res) => {
  const requestLogger = logger.addRequestId(req.requestId);
  const { planId, commitmentMonths } = req.body;
  const userId = req.user._id || req.user.id;

  try {
    requestLogger.info('Creating subscription', { 
      planId, 
      commitmentMonths, 
      userId,
      requestedBy: req.user?.id 
    });

    const subscription = await subscribeUser({ 
      userId, 
      planId, 
      commitmentMonths: commitmentMonths || 0 
    });

    requestLogger.info('Subscription created successfully', { 
      subscriptionId: subscription._id,
      planId,
      userId 
    });
    requestLogger.info(LOG_ACTIONS.SUBSCRIPTION_CREATED, { subscriptionId: subscription._id, planId, userId });

    res.status(201).json(subscription);
  } catch (err) {
    requestLogger.error('Failed to create subscription', { 
      error: err.message,
      planId,
      userId 
    });
    requestLogger.error(LOG_ACTIONS.SUBSCRIPTION_FAILED, { error: err.message, planId, userId });
    res.status(500).json({ 
      error: err.message,
      code: 'SUBSCRIPTION_CREATION_FAILED',
      timestamp: new Date().toISOString(),
      requestId: req.requestId
    });
  }
});

const assertOwnership = (subscription, userId) => {
  if (!subscription) return { ok: false, status: 404, error: 'Subscription not found' };
  if (subscription.userId?.toString() !== userId.toString()) {
    return { ok: false, status: 403, error: 'Not allowed to access this subscription' };
  }
  return { ok: true };
};

// List subscriptions for current user
router.get('/me', async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const userSubs = await getUserSubscriptions(userId);
    res.json(userSubs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get subscription by ID
router.get('/:id', async (req, res) => {
  try {
    const sub = await getSubscription(req.params.id);
    const ownership = assertOwnership(sub, req.user._id || req.user.id);
    if (!ownership.ok) return res.status(ownership.status).json({ error: ownership.error });
    res.json(sub);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Activate subscription
router.patch('/:id/activate', async (req, res) => {
  const requestLogger = logger.addRequestId(req.requestId);
  try {
    const sub = await getSubscription(req.params.id);
    const ownership = assertOwnership(sub, req.user._id || req.user.id);
    if (!ownership.ok) return res.status(ownership.status).json({ error: ownership.error });

    const updated = await activateSubscription(req.params.id);
    requestLogger.info(LOG_ACTIONS.SUBSCRIPTION_ACTIVATED, { subscriptionId: updated._id });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Pause subscription

router.patch('/:id/pause', async (req, res) => {
  const requestLogger = logger.addRequestId(req.requestId);

  try {
    const existing = await getSubscription(req.params.id);
    const ownership = assertOwnership(existing, req.user._id || req.user.id);
    if (!ownership.ok) return res.status(ownership.status).json({ error: ownership.error });

    const sub = await pauseSubscription(req.params.id);
    requestLogger.info(LOG_ACTIONS.SUBSCRIPTION_PAUSED, { subscriptionId: sub._id });

    res.json(sub);

  } catch (err) {

    res.status(400).json({ error: err.message });

  }

});

// Resume subscription

router.patch('/:id/resume', async (req, res) => {
  const requestLogger = logger.addRequestId(req.requestId);

  try {
    const existing = await getSubscription(req.params.id);
    const ownership = assertOwnership(existing, req.user._id || req.user.id);
    if (!ownership.ok) return res.status(ownership.status).json({ error: ownership.error });

    const sub = await resumeSubscription(req.params.id);
    requestLogger.info(LOG_ACTIONS.SUBSCRIPTION_RESUMED, { subscriptionId: sub._id });

    res.json(sub);

  } catch (err) {

    res.status(400).json({ error: err.message });

  }

});

// Cancel subscription

router.patch('/:id/cancel', async (req, res) => {
  const requestLogger = logger.addRequestId(req.requestId);

  try {
    const existing = await getSubscription(req.params.id);
    const ownership = assertOwnership(existing, req.user._id || req.user.id);
    if (!ownership.ok) return res.status(ownership.status).json({ error: ownership.error });

    const sub = await cancelSubscription(req.params.id);
    requestLogger.info(LOG_ACTIONS.SUBSCRIPTION_CANCELLED, { subscriptionId: sub._id });

    res.json(sub);

  } catch (err) {

    res.status(400).json({ error: err.message });

  }

});

module.exports = router;
