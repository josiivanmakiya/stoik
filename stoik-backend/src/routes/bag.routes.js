const express = require('express');
const Bag = require('../db/models/bag.model.js');
const Plan = require('../db/models/plan.model.js');
const Consumable = require('../db/models/consumable.model.js');
const logger = require('../config/logger');
const { sendError } = require('../utils/http');

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
    if (!raw) continue;

    const type = raw.type === 'consumable' || raw.consumableId ? 'consumable' : 'plan';

    if (type === 'plan') {
      if (!raw.planId) continue;

      const key = `plan:${raw.planId}`;
      if (seen.has(key)) continue;

      const plan = await Plan.findOne({ planId: raw.planId, isActive: true });
      if (!plan) continue;

      const quantity = Math.max(1, Math.min(99, Number(raw.quantity) || 1));

      normalized.push({
        type: 'plan',
        itemRef: plan.planId,
        planId: plan.planId,
        name: plan.name,
        unitPrice: plan.monthlyPrice,
        quantity,
        cadenceMonths: clampCadence(raw.cadenceMonths || 1),
        unitsPerMonth: plan.unitsPerMonth
      });
      seen.add(key);
      continue;
    }

    if (!raw.consumableId) continue;

    const key = `consumable:${raw.consumableId}`;
    if (seen.has(key)) continue;

    const consumable = await Consumable.findOne({ consumableId: raw.consumableId, isActive: true });
    if (!consumable) continue;

    const quantity = Math.max(1, Math.min(99, Number(raw.quantity) || 1));

    normalized.push({
      type: 'consumable',
      itemRef: consumable.consumableId,
      consumableId: consumable.consumableId,
      name: consumable.name,
      category: consumable.category,
      tooltip: consumable.tooltip,
      unitPrice: consumable.unitPrice,
      quantity,
      cadenceMonths: clampCadence(raw.cadenceMonths || consumable.defaultCadenceMonths || 1),
      unitsPerMonth: Math.max(1, Math.round(quantity / consumable.defaultCadenceMonths) || 1)
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
