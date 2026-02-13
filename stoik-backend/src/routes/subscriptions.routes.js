const express = require('express');
const { validate, schemas } = require('../middleware/validation.middleware');
const logger = require('../config/logger');
const { LOG_ACTIONS } = require('../config/logActions');
const { sendError } = require('../utils/http');

const { subscribeUser, activateSubscription, pauseSubscription, resumeSubscription, cancelSubscription, setNextBillingDate, updateDeliveryFrequency, getSubscription, getUserSubscriptions } = require('../domain/subscription/subscription.service.js');

const router = express.Router();

// Create subscription
router.post('/', validate(schemas.subscription), async (req, res) => {
  const requestLogger = logger.addRequestId(req.requestId);
  const { planId, commitmentMonths, cadenceMonths } = req.body;
  const userId = req.user._id || req.user.id;

  try {
    requestLogger.info('Creating subscription', {
      planId,
      commitmentMonths,
      cadenceMonths,
      userId,
      requestedBy: req.user?.id
    });

    const subscription = await subscribeUser({
      userId,
      planId,
      commitmentMonths: commitmentMonths || 0,
      cadenceMonths: cadenceMonths || 1
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
    return sendError(res, {
      status: 500,
      message: 'Failed to create subscription',
      code: 'SUBSCRIPTION_CREATION_FAILED',
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
    return sendError(res, {
      status: 500,
      message: 'Failed to fetch subscriptions',
      code: 'SUBSCRIPTION_LIST_FAILED',
      requestId: req.requestId
    });
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
    return sendError(res, {
      status: 500,
      message: 'Failed to fetch subscription',
      code: 'SUBSCRIPTION_FETCH_FAILED',
      requestId: req.requestId
    });
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
    return sendError(res, {
      status: 400,
      message: err.message || 'Subscription activation failed',
      code: 'SUBSCRIPTION_ACTIVATE_FAILED',
      requestId: req.requestId
    });
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
    return sendError(res, {
      status: 400,
      message: err.message || 'Subscription pause failed',
      code: 'SUBSCRIPTION_PAUSE_FAILED',
      requestId: req.requestId
    });
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
    return sendError(res, {
      status: 400,
      message: err.message || 'Subscription resume failed',
      code: 'SUBSCRIPTION_RESUME_FAILED',
      requestId: req.requestId
    });
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
    return sendError(res, {
      status: 400,
      message: err.message || 'Subscription cancel failed',
      code: 'SUBSCRIPTION_CANCEL_FAILED',
      requestId: req.requestId
    });
  }
});

// Update delivery frequency (cadence)
router.patch('/:id/cadence', validate(schemas.subscriptionCadence), async (req, res) => {
  const requestLogger = logger.addRequestId(req.requestId);

  try {
    const existing = await getSubscription(req.params.id);
    const ownership = assertOwnership(existing, req.user._id || req.user.id);
    if (!ownership.ok) return res.status(ownership.status).json({ error: ownership.error });

    const updated = await updateDeliveryFrequency(req.params.id, req.body.cadenceMonths);
    requestLogger.info(LOG_ACTIONS.SUBSCRIPTION_UPDATED, { subscriptionId: updated._id });

    res.json(updated);
  } catch (err) {
    return sendError(res, {
      status: 400,
      message: err.message || 'Subscription cadence update failed',
      code: 'SUBSCRIPTION_CADENCE_FAILED',
      requestId: req.requestId
    });
  }
});

// Update next charge date
router.patch('/:id/next-charge', validate(schemas.subscriptionNextCharge), async (req, res) => {
  const requestLogger = logger.addRequestId(req.requestId);

  try {
    const existing = await getSubscription(req.params.id);
    const ownership = assertOwnership(existing, req.user._id || req.user.id);
    if (!ownership.ok) return res.status(ownership.status).json({ error: ownership.error });

    const updated = await setNextBillingDate(req.params.id, req.body.nextBillingDate);
    requestLogger.info(LOG_ACTIONS.SUBSCRIPTION_UPDATED, { subscriptionId: updated._id });

    res.json(updated);
  } catch (err) {
    return sendError(res, {
      status: 400,
      message: err.message || 'Next charge date update failed',
      code: 'SUBSCRIPTION_NEXT_CHARGE_FAILED',
      requestId: req.requestId
    });
  }
});

module.exports = router;
