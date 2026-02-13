const express = require('express');
const Consumable = require('../db/models/consumable.model.js');
const { authenticateToken, requireAdmin } = require('../domain/auth/auth.middleware.js');
const { validate, schemas } = require('../middleware/validation.middleware');
const { sendError } = require('../utils/http');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const filter = { isActive: true };

    if (req.query.category) {
      filter.category = req.query.category;
    }

    const consumables = await Consumable.find(filter).sort({ category: 1, name: 1 });
    res.json(consumables);
  } catch (err) {
    return sendError(res, {
      status: 500,
      message: 'Internal server error',
      code: 'INTERNAL_ERROR',
      requestId: req.requestId
    });
  }
});

router.post('/', authenticateToken, requireAdmin, validate(schemas.consumableCreate), async (req, res) => {
  try {
    const {
      consumableId,
      name,
      category,
      description,
      tooltip,
      unitPrice,
      defaultCadenceMonths,
      allowedCadenceMonths,
      tags
    } = req.body;

    if (!consumableId || !name || !category || unitPrice === undefined) {
      return res.status(400).json({ error: 'Missing required fields: consumableId, name, category, unitPrice' });
    }

    const existing = await Consumable.findOne({ consumableId });
    if (existing) {
      return res.status(409).json({ error: 'Consumable already exists' });
    }

    const consumable = await Consumable.create({
      consumableId,
      name,
      category,
      description,
      tooltip,
      unitPrice,
      defaultCadenceMonths,
      allowedCadenceMonths,
      tags
    });

    res.status(201).json(consumable);
  } catch (err) {
    return sendError(res, {
      status: 400,
      message: 'Invalid consumable payload',
      code: 'CONSUMABLE_CREATE_FAILED',
      requestId: req.requestId
    });
  }
});

router.patch('/:consumableId/deactivate', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const consumable = await Consumable.findOneAndUpdate(
      { consumableId: req.params.consumableId },
      { isActive: false },
      { new: true }
    );

    if (!consumable) {
      return res.status(404).json({ error: 'Consumable not found' });
    }

    res.json(consumable);
  } catch (err) {
    return sendError(res, {
      status: 400,
      message: 'Failed to deactivate consumable',
      code: 'CONSUMABLE_DEACTIVATE_FAILED',
      requestId: req.requestId
    });
  }
});

module.exports = router;
