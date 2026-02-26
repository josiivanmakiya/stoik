const express = require('express');
const Bag = require('../db/models/bag.model.js');
const Plan = require('../db/models/plan.model.js');
const logger = require('../config/logger');
const { sendError } = require('../utils/http');
const { getPlanQuantity, isValidColorQuantity } = require('../domain/plans/planRules.js');

const router = express.Router();

const clampCadence = (value) => {
  const parsed = Number(value || 1);
  if (!Number.isFinite(parsed)) return 1;
  return Math.min(6, Math.max(1, Math.round(parsed)));
};

const normalizeItems = async (items = []) => {
  const normalized = [];
  const seen = new Set();

  for (const raw of items) {
    if (!raw || !raw.planId) continue;

    const key = `plan:${raw.planId}`;
    if (seen.has(key)) continue;

    const plan = await Plan.findOne({ planId: raw.planId, isActive: true });
    if (!plan) continue;

    const monthlyQuantity = getPlanQuantity(plan);
    if (!isValidColorQuantity(plan.color, monthlyQuantity)) continue;

    normalized.push({
      type: 'plan',
      itemRef: plan.planId,
      planId: plan.planId,
      name: plan.name,
      color: plan.color,
      unitPrice: plan.monthlyPrice,
      quantity: 1,
      cadenceMonths: clampCadence(raw.cadenceMonths || 1),
      unitsPerMonth: monthlyQuantity
    });

    seen.add(key);
  }

  return normalized;
};

router.get('/', async (req, res) => {
  const requestLogger = logger.addRequestId(req.requestId);
  const userId = req.user._id || req.user.id;

  try {
    const bag = await Bag.findOne({ userId });
    if (!bag) {
      return res.json({ items: [], cadenceMonths: 1, currency: 'NGN' });
    }
    res.json(bag);
  } catch (error) {
    requestLogger.error('Failed to fetch bag', { error: error.message, userId });
    return sendError(res, {
      status: 500,
      message: 'Failed to fetch bag',
      code: 'BAG_FETCH_FAILED',
      requestId: req.requestId
    });
  }
});

router.put('/', async (req, res) => {
  const requestLogger = logger.addRequestId(req.requestId);
  const userId = req.user._id || req.user.id;

  try {
    const items = await normalizeItems(req.body?.items || []);
    const cadenceMonths = clampCadence(req.body?.cadenceMonths);

    const bag = await Bag.findOneAndUpdate(
      { userId },
      { items, cadenceMonths, currency: 'NGN' },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json(bag);
  } catch (error) {
    requestLogger.error('Failed to update bag', { error: error.message, userId });
    return sendError(res, {
      status: 500,
      message: 'Failed to update bag',
      code: 'BAG_UPDATE_FAILED',
      requestId: req.requestId
    });
  }
});

module.exports = router;
