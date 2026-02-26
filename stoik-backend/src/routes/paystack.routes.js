const express = require('express');
const { authenticateToken, requireAdmin } = require('../domain/auth/auth.middleware.js');
const {
  cancelSubscription,
  createPlan,
  initializeSubscription,
  paystackWebhook,
  verifyTransaction
} = require('../controllers/paystack.controller.js');

const router = express.Router();

router.post('/create-plan', authenticateToken, requireAdmin, createPlan);
router.post('/initialize', authenticateToken, initializeSubscription);
router.get('/verify/:reference', authenticateToken, verifyTransaction);
router.post('/cancel', authenticateToken, cancelSubscription);

// Must use raw body for signature verification.
router.post('/webhook', paystackWebhook);

module.exports = router;
