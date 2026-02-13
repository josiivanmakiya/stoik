const express = require('express');
const { getAllPlans, getPlanById, createPlan, updatePlanPrice } = require('../domain/plans/plan.service.js');
const { authenticateToken, requireAdmin } = require('../domain/auth/auth.middleware.js');
const logger = require('../config/logger');
const { LOG_ACTIONS } = require('../config/logActions');
const { sendError } = require('../utils/http');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const plans = await getAllPlans();
    logger.info(LOG_ACTIONS.PLAN_VIEWED, { count: plans.length });
    res.json(plans);
  } catch (err) {
    logger.error(LOG_ACTIONS.PLAN_VIEWED, { error: err.message });
    return sendError(res, {
      status: 500,
      message: 'Failed to fetch plans',
      code: 'PLAN_LIST_FAILED',
      requestId: req.requestId
    });
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
    logger.error(LOG_ACTIONS.PLAN_VIEWED, { error: err.message, planId: req.params.planId });
    return sendError(res, {
      status: 500,
      message: 'Failed to fetch plan',
      code: 'PLAN_FETCH_FAILED',
      requestId: req.requestId
    });
  }
});

router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  const { planId, name, monthlyPrice, unitsPerMonth, description } = req.body;

  if (!planId || !name || monthlyPrice === undefined || monthlyPrice === null) {
    return res.status(400).json({ error: 'Missing required fields: planId, name, monthlyPrice' });
  }

  try {
    const plan = await createPlan({ planId, name, monthlyPrice, unitsPerMonth, description, includedSkus: req.body.includedSkus });
    logger.info(LOG_ACTIONS.PLAN_CREATED, { planId: plan.planId });
    res.status(201).json(plan);
  } catch (err) {
    logger.error(LOG_ACTIONS.PLAN_CREATED, { error: err.message, planId });
    const status = err.message === 'Plan already exists' ? 409 : 400;
    const message = status === 409 ? 'Plan already exists' : 'Invalid plan payload';
    return sendError(res, {
      status,
      message,
      code: status === 409 ? 'PLAN_ALREADY_EXISTS' : 'PLAN_CREATE_FAILED',
      requestId: req.requestId
    });
  }
});

router.patch('/:planId/price', authenticateToken, requireAdmin, async (req, res) => {
  const newPrice = Number(req.body.newPrice);

  if (!Number.isFinite(newPrice) || newPrice <= 0) {
    return res.status(400).json({ error: 'Valid newPrice required' });
  }

  try {
    const plan = await updatePlanPrice(req.params.planId, newPrice);
    logger.info(LOG_ACTIONS.PLAN_UPDATED, { planId: plan.planId, newPrice });
    res.json(plan);
  } catch (err) {
    logger.error(LOG_ACTIONS.PLAN_UPDATED, { error: err.message, planId: req.params.planId, newPrice });
    const status = err.message === 'Plan not found' ? 404 : 400;
    const message = status === 404 ? 'Plan not found' : 'Invalid price update';
    return sendError(res, {
      status,
      message,
      code: status === 404 ? 'PLAN_NOT_FOUND' : 'PLAN_UPDATE_FAILED',
      requestId: req.requestId
    });
  }
});

module.exports = router;
