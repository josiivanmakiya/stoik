const express = require('express');
const { sendError } = require('../utils/http');
const {
  getCreditBalance,
  listCreditLedger,
  setAutoApplyCredits
} = require('../domain/credits/credit.service.js');

const router = express.Router();

router.get('/balance', async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const balance = await getCreditBalance(userId);
    res.json(balance);
  } catch (error) {
    return sendError(res, {
      status: 400,
      message: error.message || 'Failed to fetch credit balance',
      code: 'CREDIT_BALANCE_FAILED',
      requestId: req.requestId
    });
  }
});

router.get('/ledger', async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const entries = await listCreditLedger(userId, {
      limit: req.query.limit,
      type: req.query.type
    });
    res.json(entries);
  } catch (error) {
    return sendError(res, {
      status: 400,
      message: error.message || 'Failed to fetch credit ledger',
      code: 'CREDIT_LEDGER_FAILED',
      requestId: req.requestId
    });
  }
});

router.patch('/auto-apply', async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const enabled = req.body?.enabled;
    if (typeof enabled !== 'boolean') {
      return res.status(400).json({ error: 'enabled must be a boolean' });
    }

    const autoApplyCredits = await setAutoApplyCredits(userId, enabled);
    res.json({ autoApplyCredits });
  } catch (error) {
    return sendError(res, {
      status: 400,
      message: error.message || 'Failed to update auto-apply settings',
      code: 'CREDIT_AUTO_APPLY_FAILED',
      requestId: req.requestId
    });
  }
});

module.exports = router;
