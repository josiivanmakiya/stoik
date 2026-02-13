const express = require('express');
const {
  cancelSubscription,
  createPlan,
  initializeSubscription,
  paystackWebhook,
  verifyTransaction
} = require('../controllers/paystack.controller.js');

const router = express.Router();

router.post('/create-plan', createPlan);
router.post('/initialize', initializeSubscription);
router.get('/verify/:reference', verifyTransaction);
router.post('/cancel', cancelSubscription);

// Must use raw body for signature verification.
router.post('/webhook', paystackWebhook);

module.exports = router;
