const express = require('express');
const Invoice = require('../db/models/invoice.model.js');
const { validate, schemas } = require('../middleware/validation.middleware');
const { sendError } = require('../utils/http');

const router = express.Router();

// List invoices for current user (with optional filters)
router.get('/', validate(schemas.invoiceQuery, 'query'), async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { reference, status, from, to } = req.query;

    const filter = { user: userId };

    if (status) {
      filter.status = status;
    }

    if (reference) {
      filter.$or = [
        { paystackReference: reference },
        { paystackInvoiceCode: reference }
      ];
    }

    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const invoices = await Invoice.find(filter).sort({ createdAt: -1 });
    return res.json(invoices);
  } catch (err) {
    return sendError(res, {
      status: 500,
      message: 'Failed to fetch invoices',
      code: 'INVOICE_LIST_FAILED',
      requestId: req.requestId
    });
  }
});

module.exports = router;
