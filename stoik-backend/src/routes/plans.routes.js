const express = require('express');
const { getAllPlans, getPlanById, createPlan, updatePlanPrice } = require('../domain/plans/plan.service.js');
const { authenticateToken, requireAdmin } = require('../domain/auth/auth.middleware.js');
const logger = require('../config/logger');
const { LOG_ACTIONS } = require('../config/logActions');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const plans = await getAllPlans();
    logger.info(LOG_ACTIONS.PLAN_VIEWED, { count: plans.length });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:planId', async (req, res) => {
  try {
    const plan = await getPlanById(req.params.planId);
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  const { planId, name, monthlyPrice, unitsPerMonth, description } = req.body;

  if (!planId || !name || !monthlyPrice) {
    return res.status(400).json({ error: 'Missing required fields: planId, name, monthlyPrice' });
  }

  try {
    const plan = await createPlan({ planId, name, monthlyPrice, unitsPerMonth, description, includedSkus: req.body.includedSkus });
    logger.info(LOG_ACTIONS.PLAN_CREATED, { planId: plan.planId });
    res.status(201).json(plan);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch('/:planId/price', authenticateToken, requireAdmin, async (req, res) => {
  const { newPrice } = req.body;

  if (!newPrice || newPrice <= 0) {
    return res.status(400).json({ error: 'Valid newPrice required' });
  }

  try {
    const plan = await updatePlanPrice(req.params.planId, newPrice);
    logger.info(LOG_ACTIONS.PLAN_UPDATED, { planId: plan.planId, newPrice });
    res.json(plan);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
